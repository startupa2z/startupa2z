import express from "express";
import cors from "cors";
import { config } from "./config.js";
import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contact.js";
import rsvpRoutes from "./routes/rsvp.js";
import eventsRoutes from "./routes/events.js";

const app = express();

app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "startupa2z-backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/rsvp", rsvpRoutes);
app.use("/api/events", eventsRoutes);

app.listen(config.port, () => {
  console.log(`API server running on http://localhost:${config.port}`);
});
