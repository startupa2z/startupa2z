import { Hono } from "hono";
import type { Bindings } from "../types.js";
import { createSupabasePublic } from "../lib/supabase.js";
import { AppError, sendError } from "../lib/errors.js";

const router = new Hono<{ Bindings: Bindings }>();

router.get("/", async (c) => {
  try {
    const supabase = createSupabasePublic(c.env);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new AppError(500, error.message);
    return c.json({ ok: true, data: data ?? [] });
  } catch (err) {
    return sendError(c, err);
  }
});

router.get("/:slug", async (c) => {
  try {
    const slug = c.req.param("slug");
    if (!slug) throw new AppError(400, "Event slug is required.");
    const supabase = createSupabasePublic(c.env);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw new AppError(500, error.message);
    return c.json({ ok: true, data: data ?? null });
  } catch (err) {
    return sendError(c, err);
  }
});

export default router;
