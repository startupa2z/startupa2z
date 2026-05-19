import type { Response } from "express";
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

export function sendError(res: Response, err: unknown) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }
  if (err instanceof ZodError) {
    const message = err.errors[0]?.message ?? "Validation failed";
    res.status(400).json({ error: message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
