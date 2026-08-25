import os
import sys
import unittest
from unittest.mock import AsyncMock, patch

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from fastapi import HTTPException

from routers import stripe_router


class StripeRouterTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.settings_patch = patch.multiple(
            stripe_router.settings,
            stripe_secret_key="sk_test_example",
            frontend_url="http://localhost:8081",
        )
        self.settings_patch.start()

    def tearDown(self):
        self.settings_patch.stop()

    async def test_checkout_uses_server_price_and_server_redirects(self):
        session = {
            "id": "cs_test_123",
            "url": "https://checkout.stripe.test/session",
            "payment_intent": None,
            "customer": None,
            "payment_status": "unpaid",
            "amount_total": 200000,
            "currency": "usd",
            "customer_details": None,
            "customer_email": "sponsor@example.com",
            "metadata": {"packageId": "session_sponsor", "packageName": "Session Sponsor"},
            "livemode": False,
        }
        pool = type("Pool", (), {"execute": AsyncMock()})()

        with patch.object(stripe_router.stripe.checkout.Session, "create", return_value=session) as create, \
             patch.object(stripe_router, "get_pool", new=AsyncMock(return_value=pool)):
            result = await stripe_router.create_checkout_session(
                stripe_router.CheckoutRequest(
                    packageId="session_sponsor",
                    customerEmail="sponsor@example.com",
                )
            )

        self.assertEqual(result["url"], session["url"])
        kwargs = create.call_args.kwargs
        self.assertEqual(kwargs["line_items"][0]["price_data"]["unit_amount"], 200000)
        self.assertEqual(kwargs["line_items"][0]["price_data"]["currency"], "usd")
        self.assertEqual(
            kwargs["success_url"],
            "http://localhost:8081/sponsorship?payment=success&session_id={CHECKOUT_SESSION_ID}",
        )
        self.assertEqual(kwargs["cancel_url"], "http://localhost:8081/sponsorship?payment=cancelled")
        pool.execute.assert_awaited_once()

    async def test_unknown_package_is_rejected_before_calling_stripe(self):
        with patch.object(stripe_router.stripe.checkout.Session, "create") as create:
            with self.assertRaises(HTTPException) as context:
                await stripe_router.create_checkout_session(
                    stripe_router.CheckoutRequest(packageId="not_a_package")
                )
        self.assertEqual(context.exception.status_code, 400)
        create.assert_not_called()

    async def test_invalid_session_id_is_rejected_before_calling_stripe(self):
        with patch.object(stripe_router.stripe.checkout.Session, "retrieve") as retrieve:
            with self.assertRaises(HTTPException) as context:
                await stripe_router.get_checkout_session("not-a-stripe-session")
        self.assertEqual(context.exception.status_code, 400)
        retrieve.assert_not_called()

    def test_session_values_extract_only_payment_record_fields(self):
        values = stripe_router._session_values({
            "id": "cs_test_123",
            "payment_intent": "pi_123",
            "customer": "cus_123",
            "payment_status": "paid",
            "amount_total": 200000,
            "currency": "usd",
            "customer_details": {"email": "sponsor@example.com", "name": "Test Sponsor"},
            "metadata": {"packageId": "session_sponsor", "packageName": "Session Sponsor"},
            "livemode": False,
        })
        self.assertEqual(values["payment_status"], "paid")
        self.assertEqual(values["customer_email"], "sponsor@example.com")
        self.assertEqual(values["package_id"], "session_sponsor")
        self.assertFalse(values["livemode"])

    def test_as_dict_supports_current_stripe_sdk_objects(self):
        class StripeLikeObject:
            def to_dict(self):
                return {"id": "cs_test_123"}

        self.assertEqual(stripe_router._as_dict(StripeLikeObject()), {"id": "cs_test_123"})


if __name__ == "__main__":
    unittest.main()
