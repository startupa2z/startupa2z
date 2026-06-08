import { Hono } from "hono";
import { z } from "zod";
import type { Bindings } from "../types.js";
import { createSupabasePublic } from "../lib/supabase.js";
import { AppError, sendError } from "../lib/errors.js";

const router = new Hono<{ Bindings: Bindings }>();

const sendOtpSchema = z.object({
  email: z.string().trim().email().max(255),
  mode: z.enum(["signin", "signup"]),
  fullName: z.string().trim().max(100).optional(),
  organization: z.string().trim().max(100).optional(),
});

const verifyOtpSchema = z.object({
  email: z.string().trim().email().max(255),
  token: z.string().trim().min(6).max(10),
});

const linkedInSchema = z.object({
  redirectTo: z.string().url().optional(),
});

router.post("/otp/send", async (c) => {
  try {
    const body = sendOtpSchema.parse(await c.req.json());
    if (body.mode === "signup" && (!body.fullName || !body.organization)) {
      throw new AppError(400, "Full name and organization are required for sign up.");
    }
    const supabase = createSupabasePublic(c.env);
    const { error } = await supabase.auth.signInWithOtp({
      email: body.email,
      options: {
        shouldCreateUser: body.mode === "signup",
        data: body.mode === "signup"
          ? { full_name: body.fullName, organization: body.organization }
          : undefined,
      },
    });
    if (error) throw new AppError(400, error.message);
    return c.json({ ok: true, message: "OTP sent to your email." });
  } catch (err) {
    return sendError(c, err);
  }
});

router.post("/otp/verify", async (c) => {
  try {
    const body = verifyOtpSchema.parse(await c.req.json());
    const supabase = createSupabasePublic(c.env);
    const { data, error } = await supabase.auth.verifyOtp({
      email: body.email,
      token: body.token,
      type: "email",
    });
    if (error) throw new AppError(400, error.message);
    if (!data.session) throw new AppError(400, "Verification succeeded but no session was returned.");
    return c.json({
      ok: true,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: data.session.expires_in,
        expires_at: data.session.expires_at,
        token_type: data.session.token_type,
      },
      user: data.user,
    });
  } catch (err) {
    return sendError(c, err);
  }
});

router.post("/oauth/linkedin", async (c) => {
  try {
    const body = linkedInSchema.parse(await c.req.json().catch(() => ({})));
    const origin = c.req.header("origin") ?? "http://localhost:8080";
    const redirectTo = body.redirectTo ?? origin;
    const supabase = createSupabasePublic(c.env);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "linkedin_oidc",
      options: { redirectTo },
    });
    if (error) throw new AppError(400, error.message);
    if (!data.url) throw new AppError(500, "Could not generate LinkedIn sign-in URL.");
    return c.json({ ok: true, url: data.url });
  } catch (err) {
    return sendError(c, err);
  }
});

export default router;
