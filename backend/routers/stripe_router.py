import asyncio
import logging
import re
import uuid

import stripe
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, EmailStr

from config import settings
from database import get_pool

router = APIRouter()
logger = logging.getLogger(__name__)

PACKAGES = {
    "session_sponsor": {
        "name": "Session Sponsor",
        "amount": 200000,
        "currency": "usd",
        "description": (
            "5-minute live spotlight, logo on event materials, "
            "pre-event announcement, and permanent website listing."
        ),
    },
}

SESSION_ID_PATTERN = re.compile(r"^cs_(?:test|live)_[A-Za-z0-9]+$")


def _require_stripe() -> None:
    if not settings.stripe_secret_key:
        raise HTTPException(503, "Payment processing is not configured.")
    stripe.api_key = settings.stripe_secret_key


def _frontend_url() -> str:
    return settings.frontend_url.rstrip("/")


def _as_dict(value) -> dict:
    if isinstance(value, dict):
        return value
    if hasattr(value, "to_dict"):
        return value.to_dict()
    return dict(value)


def _session_values(session) -> dict:
    data = _as_dict(session)
    customer_details = _as_dict(data.get("customer_details") or {})
    metadata = _as_dict(data.get("metadata") or {})
    return {
        "stripe_session_id": data["id"],
        "stripe_payment_intent_id": data.get("payment_intent"),
        "stripe_customer_id": data.get("customer"),
        "payment_status": data.get("payment_status") or "unpaid",
        "amount_total": data.get("amount_total") or 0,
        "currency": data.get("currency") or "usd",
        "customer_email": customer_details.get("email") or data.get("customer_email"),
        "customer_name": customer_details.get("name"),
        "package_id": metadata.get("packageId"),
        "package_name": metadata.get("packageName"),
        "livemode": bool(data.get("livemode")),
    }


async def _save_checkout_session(connection, session) -> None:
    values = _session_values(session)
    await connection.execute(
        """INSERT INTO sponsor_payments
             (stripe_session_id, stripe_payment_intent_id, stripe_customer_id,
              payment_status, amount_total, currency, customer_email, customer_name,
              package_id, package_name, livemode, paid_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
                   CASE WHEN $4 = 'paid' THEN now() ELSE NULL END)
           ON CONFLICT (stripe_session_id) DO UPDATE SET
             stripe_payment_intent_id = COALESCE(EXCLUDED.stripe_payment_intent_id, sponsor_payments.stripe_payment_intent_id),
             stripe_customer_id = COALESCE(EXCLUDED.stripe_customer_id, sponsor_payments.stripe_customer_id),
             payment_status = EXCLUDED.payment_status,
             amount_total = EXCLUDED.amount_total,
             currency = EXCLUDED.currency,
             customer_email = COALESCE(EXCLUDED.customer_email, sponsor_payments.customer_email),
             customer_name = COALESCE(EXCLUDED.customer_name, sponsor_payments.customer_name),
             package_id = COALESCE(EXCLUDED.package_id, sponsor_payments.package_id),
             package_name = COALESCE(EXCLUDED.package_name, sponsor_payments.package_name),
             livemode = EXCLUDED.livemode,
             paid_at = CASE
               WHEN EXCLUDED.payment_status = 'paid' THEN COALESCE(sponsor_payments.paid_at, now())
               ELSE sponsor_payments.paid_at
             END,
             updated_at = now()""",
        values["stripe_session_id"],
        values["stripe_payment_intent_id"],
        values["stripe_customer_id"],
        values["payment_status"],
        values["amount_total"],
        values["currency"],
        values["customer_email"],
        values["customer_name"],
        values["package_id"],
        values["package_name"],
        values["livemode"],
    )


class CheckoutRequest(BaseModel):
    packageId: str
    customerEmail: EmailStr | None = None


@router.post("/create-checkout-session")
async def create_checkout_session(body: CheckoutRequest):
    pkg = PACKAGES.get(body.packageId)
    if not pkg:
        raise HTTPException(400, f"Unknown package: {body.packageId}")

    _require_stripe()
    order_id = str(uuid.uuid4())
    metadata = {
        "orderId": order_id,
        "packageId": body.packageId,
        "packageName": pkg["name"],
    }
    try:
        session = await asyncio.to_thread(
            stripe.checkout.Session.create,
            mode="payment",
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": pkg["currency"],
                    "product_data": {
                        "name": f"StartupA2Z.org — {pkg['name']}",
                        "description": pkg["description"],
                    },
                    "unit_amount": pkg["amount"],
                },
                "quantity": 1,
            }],
            customer_email=str(body.customerEmail) if body.customerEmail else None,
            success_url=f"{_frontend_url()}/sponsorship?payment=success&session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{_frontend_url()}/sponsorship?payment=cancelled",
            client_reference_id=order_id,
            metadata=metadata,
            payment_intent_data={"metadata": metadata},
        )
    except stripe.StripeError as exc:
        logger.exception("Stripe Checkout Session creation failed")
        raise HTTPException(502, "Stripe could not start checkout. Please try again.") from exc

    pool = await get_pool()
    await _save_checkout_session(pool, session)
    return {"ok": True, "url": _as_dict(session)["url"]}


@router.get("/checkout-session/{session_id}")
async def get_checkout_session(session_id: str):
    if not SESSION_ID_PATTERN.fullmatch(session_id):
        raise HTTPException(400, "Invalid Checkout Session ID.")

    _require_stripe()
    try:
        session = await asyncio.to_thread(stripe.checkout.Session.retrieve, session_id)
    except stripe.InvalidRequestError as exc:
        raise HTTPException(404, "Checkout Session not found.") from exc
    except stripe.StripeError as exc:
        logger.exception("Stripe Checkout Session retrieval failed")
        raise HTTPException(502, "Payment status is temporarily unavailable.") from exc

    values = _session_values(session)
    pkg = PACKAGES.get(values["package_id"])
    if not pkg or values["amount_total"] != pkg["amount"] or values["currency"] != pkg["currency"]:
        logger.error("Checkout Session %s failed package integrity validation", session_id)
        raise HTTPException(409, "Checkout Session does not match this sponsorship package.")

    pool = await get_pool()
    await _save_checkout_session(pool, session)
    return {
        "ok": True,
        "data": {
            "sessionId": values["stripe_session_id"],
            "paymentStatus": values["payment_status"],
            "amountTotal": values["amount_total"],
            "currency": values["currency"],
            "packageName": values["package_name"],
        },
    }


@router.post("/webhook")
async def stripe_webhook(request: Request):
    signature = request.headers.get("stripe-signature")
    if not signature or not settings.stripe_webhook_secret:
        raise HTTPException(400, "Missing signature or webhook secret.")

    _require_stripe()
    payload = await request.body()
    try:
        event = stripe.Webhook.construct_event(payload, signature, settings.stripe_webhook_secret)
    except (ValueError, stripe.SignatureVerificationError) as exc:
        raise HTTPException(400, "Invalid webhook payload or signature.") from exc

    event_data = _as_dict(event)
    event_id = event_data["id"]
    event_type = event_data["type"]
    event_object = _as_dict(event_data["data"]["object"])
    pool = await get_pool()

    async with pool.acquire() as connection:
        async with connection.transaction():
            inserted = await connection.fetchval(
                """INSERT INTO stripe_webhook_events
                     (stripe_event_id, event_type, livemode)
                   VALUES ($1, $2, $3)
                   ON CONFLICT (stripe_event_id) DO NOTHING
                   RETURNING stripe_event_id""",
                event_id,
                event_type,
                bool(event_data.get("livemode")),
            )
            if not inserted:
                return {"received": True, "duplicate": True}

            if event_type in {
                "checkout.session.completed",
                "checkout.session.async_payment_succeeded",
                "checkout.session.expired",
            }:
                await _save_checkout_session(connection, event_object)
            elif event_type == "charge.refunded":
                await connection.execute(
                    """UPDATE sponsor_payments
                          SET payment_status = CASE WHEN $2 >= amount_total THEN 'refunded' ELSE 'partially_refunded' END,
                              amount_refunded = $2,
                              updated_at = now()
                        WHERE stripe_payment_intent_id = $1""",
                    event_object.get("payment_intent"),
                    event_object.get("amount_refunded") or 0,
                )
            elif event_type == "charge.dispute.created":
                await connection.execute(
                    """UPDATE sponsor_payments
                          SET payment_status = 'disputed', updated_at = now()
                        WHERE stripe_payment_intent_id = $1""",
                    event_object.get("payment_intent"),
                )

    return {"received": True}
