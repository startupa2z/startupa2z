import { Router } from "express";
import { z } from "zod";
import { supabasePublic } from "../lib/supabase.js";
import { AppError, sendError } from "../lib/errors.js";

const router = Router();

const contactSchema = z.object({
  first_name: z.string().trim().min(1).max(100),
  last_name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  linkedin_url: z
    .union([z.string().trim().url().max(500), z.literal(""), z.null()])
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
  role: z.string().trim().max(50).optional().nullable(),
  inquiry_type: z.string().trim().min(1).max(50),
  message: z.string().trim().max(2000).optional().nullable(),
});

router.post("/", async (req, res) => {
  try {
    const body = contactSchema.parse(req.body);

    const { error } = await supabasePublic.from("contact_submissions").insert({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      linkedin_url: body.linkedin_url ?? null,
      role: body.role ?? null,
      inquiry_type: body.inquiry_type,
      message: body.message ?? null,
    });

    if (error) {
      throw new AppError(400, error.message);
    }

    res.status(201).json({ ok: true, message: "Message sent successfully." });
  } catch (err) {
    sendError(res, err);
  }
});

export default router;
