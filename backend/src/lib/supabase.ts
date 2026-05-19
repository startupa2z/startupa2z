import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";
import { config } from "../config.js";

const clientOptions = {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: {
    transport: WebSocket as any,
  },
};

/** Anon key — auth, and public reads/writes allowed by RLS. */
export const supabaseAuth = createClient(
  config.supabaseUrl,
  config.supabaseAnonKey,
  clientOptions,
);

/** Same client used for events, contact, RSVP (public RLS policies). */
export const supabasePublic = supabaseAuth;

/** Service role — only when configured (bypasses RLS for admin tooling). */
export const supabaseAdmin = config.supabaseServiceRoleKey
  ? createClient(
      config.supabaseUrl,
      config.supabaseServiceRoleKey,
      clientOptions,
    )
  : null;
