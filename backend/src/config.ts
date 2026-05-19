import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load repo root .env, then backend/.env (overrides)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Allow sharing Vite env names from the root .env
process.env.SUPABASE_URL ??= process.env.VITE_SUPABASE_URL;
process.env.SUPABASE_ANON_KEY ??= process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 3001),
  nodeEnv: process.env.NODE_ENV ?? "development",
  supabaseUrl: required("SUPABASE_URL"),
  supabaseAnonKey: required("SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: required("SUPABASE_SERVICE_ROLE_KEY"),
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:8080")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
};
