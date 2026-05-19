import { Router } from "express";
import { z } from "zod";
import { supabaseAuth } from "../lib/supabase.js";
import { AppError, sendError } from "../lib/errors.js";

const router = Router();

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

router.post("/otp/send", async (req, res) => {
  try {
    const body = sendOtpSchema.parse(req.body);

    if (body.mode === "signup" && (!body.fullName || !body.organization)) {
      throw new AppError(400, "Full name and organization are required for sign up.");
    }

    const { error } = await supabaseAuth.auth.signInWithOtp({
      email: body.email,
      options: {
        shouldCreateUser: body.mode === "signup",
        data:
          body.mode === "signup"
            ? {
                full_name: body.fullName,
                organization: body.organization,
              }
            : undefined,
      },
    });

    if (error) {
      throw new AppError(400, error.message);
    }

    res.json({ ok: true, message: "OTP sent to your email." });
  } catch (err) {
    sendError(res, err);
  }
});

router.post("/otp/verify", async (req, res) => {
  try {
    const body = verifyOtpSchema.parse(req.body);

    const { data, error } = await supabaseAuth.auth.verifyOtp({
      email: body.email,
      token: body.token,
      type: "email",
    });

    if (error) {
      throw new AppError(400, error.message);
    }

    if (!data.session) {
      throw new AppError(400, "Verification succeeded but no session was returned.");
    }

    res.json({
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
    sendError(res, err);
  }
});

router.post("/oauth/linkedin", async (req, res) => {
  try {
    const body = linkedInSchema.parse(req.body ?? {});
    const redirectTo =
      body.redirectTo ?? req.headers.origin ?? "http://localhost:8080";

    const { data, error } = await supabaseAuth.auth.signInWithOAuth({
      provider: "linkedin_oidc",
      options: { redirectTo },
    });

    if (error) {
      throw new AppError(400, error.message);
    }

    if (!data.url) {
      throw new AppError(500, "Could not generate LinkedIn sign-in URL.");
    }

    res.json({ ok: true, url: data.url });
  } catch (err) {
    sendError(res, err);
  }
});

export default router;
