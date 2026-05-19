import { Router } from "express";
import { z } from "zod";
import { supabaseAdmin } from "../lib/supabase.js";
import { AppError, sendError } from "../lib/errors.js";

const router = Router();

const rsvpSchema = z.object({
  event_id: z.string().uuid().optional().nullable(),
  event_slug: z.string().trim().min(1).max(200),
  event_title: z.string().trim().min(1).max(300),
  first_name: z.string().trim().min(1).max(100),
  last_name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(20).optional().nullable(),
  company: z.string().trim().max(100).optional().nullable(),
  role: z.string().trim().min(1).max(50),
  notes: z.string().trim().max(500).optional().nullable(),
});

router.post("/", async (req, res) => {
  try {
    const body = rsvpSchema.parse(req.body);

    const { error } = await supabaseAdmin.from("event_rsvps").insert({
      event_id: body.event_id ?? null,
      event_slug: body.event_slug,
      event_title: body.event_title,
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      phone: body.phone ?? null,
      company: body.company ?? null,
      role: body.role,
      notes: body.notes ?? null,
    });

    if (error) {
      if (error.code === "23505") {
        throw new AppError(
          409,
          "You've already RSVP'd to this event with this email address.",
        );
      }
      throw new AppError(400, error.message);
    }

    res.status(201).json({ ok: true, message: "RSVP confirmed." });
  } catch (err) {
    sendError(res, err);
  }
});

export default router;
