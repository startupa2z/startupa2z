import { Router, raw } from "express";
import Stripe from "stripe";
import { z } from "zod";
import { config } from "../config.js";
import { supabaseAdmin, supabasePublic } from "../lib/supabase.js";
import { AppError, sendError } from "../lib/errors.js";

const router = Router();

function getStripe(): Stripe {
  if (!config.stripeSecretKey) {
    throw new AppError(503, "Payment processing is not configured.");
  }
  return new Stripe(config.stripeSecretKey);
}

const PACKAGES: Record<string, { name: string; amount: number; description: string }> = {
  session_sponsor: {
    name: "Session Sponsor",
    amount: 200000, // $2,000 in cents
    description:
      "5-minute live spotlight, logo on event materials, pre-event announcement, and permanent website listing.",
  },
};

const checkoutSchema = z.object({
  packageId: z.string().trim().min(1),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  customerEmail: z.string().email().optional(),
});

// POST /api/stripe/create-checkout-session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const body = checkoutSchema.parse(req.body);
    const pkg = PACKAGES[body.packageId];
    if (!pkg) throw new AppError(400, `Unknown package: ${body.packageId}`);

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `StartupA2Z — ${pkg.name}`,
              description: pkg.description,
            },
            unit_amount: pkg.amount,
          },
          quantity: 1,
        },
      ],
      customer_email: body.customerEmail,
      success_url: body.successUrl,
      cancel_url: body.cancelUrl,
      metadata: { packageId: body.packageId, packageName: pkg.name },
    });

    res.json({ ok: true, url: session.url });
  } catch (err) {
    sendError(res, err);
  }
});

// POST /api/stripe/webhook  (raw body parsed here, before global json middleware)
router.post("/webhook", raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  if (!sig || !config.stripeWebhookSecret) {
    res.status(400).json({ error: "Missing signature or webhook secret." });
    return;
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      req.body as Buffer,
      sig,
      config.stripeWebhookSecret,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    res.status(400).json({ error: "Invalid webhook signature." });
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const db = supabaseAdmin ?? supabasePublic;
    const { error } = await db.from("sponsor_payments").insert({
      stripe_session_id: session.id,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_details?.email ?? null,
      customer_name: session.customer_details?.name ?? null,
      package_id: session.metadata?.packageId ?? null,
      package_name: session.metadata?.packageName ?? null,
    });
    if (error) {
      console.error("Failed to save sponsor payment:", error.message);
    } else {
      console.log("Sponsor payment recorded:", session.id);
    }
  }

  res.json({ received: true });
});

export default router;
