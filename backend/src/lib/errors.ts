import type { Context } from "hono";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function sendError(c: Context, err: unknown): Response {
  if (err instanceof AppError) {
    return c.json({ error: err.message }, err.statusCode as any);
  }
  if (err instanceof ZodError) {
    const message = err.errors[0]?.message ?? "Validation failed";
    return c.json({ error: message }, 400);
  }
  console.error(err);
  return c.json({ error: "Internal server error" }, 500);
}
