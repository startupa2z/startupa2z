import stripe
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from config import settings
from database import get_pool

router = APIRouter()

PACKAGES = {
    "session_sponsor": {
        "name": "Session Sponsor",
        "amount": 200000,
        "description": (
            "5-minute live spotlight, logo on event materials, "
            "pre-event announcement, and permanent website listing."
        ),
    },
}


def _require_stripe() -> None:
    if not settings.stripe_secret_key:
        raise HTTPException(503, "Payment processing is not configured.")
    stripe.api_key = settings.stripe_secret_key


class CheckoutRequest(BaseModel):
    packageId: str
    successUrl: str
    cancelUrl: str
    customerEmail: str | None = None


@router.post("/create-checkout-session")
async def create_checkout_session(body: CheckoutRequest):
    pkg = PACKAGES.get(body.packageId)
    if not pkg:
        raise HTTPException(400, f"Unknown package: {body.packageId}")

    _require_stripe()
    session = stripe.checkout.Session.create(
        mode="payment",
        payment_method_types=["card"],
        line_items=[{
            "price_data": {
                "currency": "usd",
                "product_data": {
                    "name": f"StartupA2Z — {pkg['name']}",
                    "description": pkg["description"],
                },
                "unit_amount": pkg["amount"],
            },
            "quantity": 1,
        }],
        customer_email=body.customerEmail,
        success_url=body.successUrl,
        cancel_url=body.cancelUrl,
        metadata={"packageId": body.packageId, "packageName": pkg["name"]},
    )
    return {"ok": True, "url": session.url}


@router.post("/webhook")
async def stripe_webhook(request: Request):
    sig = request.headers.get("stripe-signature")
    if not sig or not settings.stripe_webhook_secret:
        raise HTTPException(400, "Missing signature or webhook secret.")

    _require_stripe()
    payload = await request.body()
    try:
        event = stripe.Webhook.construct_event(payload, sig, settings.stripe_webhook_secret)
    except stripe.error.SignatureVerificationError:
        raise HTTPException(400, "Invalid webhook signature.")

    if event["type"] == "checkout.session.completed":
        s = event["data"]["object"]
        pool = await get_pool()
        try:
            await pool.execute(
                """INSERT INTO sponsor_payments
                     (stripe_session_id, payment_status, amount_total, currency,
                      customer_email, customer_name, package_id, package_name)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)""",
                s["id"], s.get("payment_status"), s.get("amount_total"), s.get("currency"),
                s.get("customer_details", {}).get("email"),
                s.get("customer_details", {}).get("name"),
                s.get("metadata", {}).get("packageId"),
                s.get("metadata", {}).get("packageName"),
            )
        except Exception as e:
            print(f"Failed to save sponsor payment: {e}")

    return {"received": True}
