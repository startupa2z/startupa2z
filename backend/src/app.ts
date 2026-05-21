import express from "express";
import cors from "cors";
import { config } from "./config.js";
import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contact.js";
import rsvpRoutes from "./routes/rsvp.js";
import eventsRoutes from "./routes/events.js";
import stripeRoutes from "./routes/stripe.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: config.corsOrigins,
      credentials: true,
    }),
  );

  // Stripe webhook needs raw body for signature verification — must be before json middleware
  app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));

  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "startupa2z-backend" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/contact", contactRoutes);
  app.use("/api/rsvp", rsvpRoutes);
  app.use("/api/events", eventsRoutes);
  app.use("/api/stripe", stripeRoutes);

  return app;
}
