import { createClient } from "@supabase/supabase-js";
import { config } from "../config.js";

/** Public auth operations (OTP, OAuth URL generation). */
export const supabaseAuth = createClient(
  config.supabaseUrl,
  config.supabaseAnonKey,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

/** Server-side DB writes with service role (bypasses RLS). */
export const supabaseAdmin = createClient(
  config.supabaseUrl,
  config.supabaseServiceRoleKey,
  { auth: { autoRefreshToken: false, persistSession: false } },
);
