import { Hono } from "hono";
import Stripe from "stripe";
import { z } from "zod";
import type { Bindings } from "../types.js";
import { createSupabaseAdmin, createSupabasePublic } from "../lib/supabase.js";
import { AppError, sendError } from "../lib/errors.js";

const router = new Hono<{ Bindings: Bindings }>();

function getStripe(env: Bindings): Stripe {
  if (!env.STRIPE_SECRET_KEY) throw new AppError(503, "Payment processing is not configured.");
  return new Stripe(env.STRIPE_SECRET_KEY);
}

const PACKAGES: Record<string, { name: string; amount: number; description: string }> = {
  session_sponsor: {
    name: "Session Sponsor",
    amount: 200000,
    description: "5-minute live spotlight, logo on event materials, pre-event announcement, and permanent website listing.",
  },
};

const checkoutSchema = z.object({
  packageId: z.string().trim().min(1),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  customerEmail: z.string().email().optional(),
});

router.post("/create-checkout-session", async (c) => {
  try {
    const body = checkoutSchema.parse(await c.req.json());
    const pkg = PACKAGES[body.packageId];
    if (!pkg) throw new AppError(400, `Unknown package: ${body.packageId}`);

    const stripe = getStripe(c.env);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: `StartupA2Z — ${pkg.name}`, description: pkg.description },
          unit_amount: pkg.amount,
        },
        quantity: 1,
      }],
      customer_email: body.customerEmail,
      success_url: body.successUrl,
      cancel_url: body.cancelUrl,
      metadata: { packageId: body.packageId, packageName: pkg.name },
    });

    return c.json({ ok: true, url: session.url });
  } catch (err) {
    return sendError(c, err);
  }
});

router.post("/webhook", async (c) => {
  const sig = c.req.header("stripe-signature");
  const webhookSecret = c.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return c.json({ error: "Missing signature or webhook secret." }, 400);
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe(c.env);
    const body = await c.req.text();
    event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return c.json({ error: "Invalid webhook signature." }, 400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const db = createSupabaseAdmin(c.env) ?? createSupabasePublic(c.env);
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
    if (error) console.error("Failed to save sponsor payment:", error.message);
    else console.log("Sponsor payment recorded:", session.id);
  }

  return c.json({ received: true });
});

export default router;
