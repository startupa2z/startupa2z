import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Bindings } from "./types.js";
import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contact.js";
import rsvpRoutes from "./routes/rsvp.js";
import eventsRoutes from "./routes/events.js";
import stripeRoutes from "./routes/stripe.js";

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", async (c, next) => {
  const origins = (c.env.CORS_ORIGINS ?? "http://localhost:8080,http://127.0.0.1:8080")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  return cors({
    origin: origins,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "stripe-signature"],
    credentials: true,
  })(c, next);
});

app.get("/health", (c) => c.json({ ok: true, service: "startupa2z-backend" }));

app.route("/api/auth", authRoutes);
app.route("/api/contact", contactRoutes);
app.route("/api/rsvp", rsvpRoutes);
app.route("/api/events", eventsRoutes);
app.route("/api/stripe", stripeRoutes);

export default app;
