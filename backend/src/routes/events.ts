import { Router } from "express";
import { supabasePublic } from "../lib/supabase.js";
import { AppError, sendError } from "../lib/errors.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const { data, error } = await supabasePublic
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new AppError(500, error.message);
    }

    res.json({ ok: true, data: data ?? [] });
  } catch (err) {
    sendError(res, err);
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    if (!slug) {
      throw new AppError(400, "Event slug is required.");
    }

    const { data, error } = await supabasePublic
      .from("events")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw new AppError(500, error.message);
    }

    res.json({ ok: true, data: data ?? null });
  } catch (err) {
    sendError(res, err);
  }
});

export default router;
