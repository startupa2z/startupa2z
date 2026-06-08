import { createClient } from "@supabase/supabase-js";
import type { Bindings } from "../types.js";

const clientOptions = {
  auth: { autoRefreshToken: false, persistSession: false },
};

export function createSupabasePublic(env: Bindings) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, clientOptions);
}

export function createSupabaseAdmin(env: Bindings) {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, clientOptions);
}
