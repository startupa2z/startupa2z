const API_BASE = import.meta.env.VITE_API_URL ?? "";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return {} as T;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(
      "Cannot reach API. Run `npm run dev` from the repo root (starts frontend + backend).",
      0,
    );
  }

  const data = await parseJson<T & { error?: string }>(res);

  if (!res.ok) {
    const message =
      (data as { error?: string }).error ??
      (res.status === 500 && !API_BASE
        ? "API error — ensure the backend is running (`npm run dev:backend`)."
        : res.statusText);
    throw new ApiError(message, res.status);
  }

  return data;
}

// ——— Auth ———

export type OtpMode = "signin" | "signup";

export function sendOtp(payload: {
  email: string;
  mode: OtpMode;
  fullName?: string;
  organization?: string;
}) {
  return apiRequest<{ ok: boolean; message: string }>("/api/auth/otp/send", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type AuthSessionPayload = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
};

export function verifyOtp(payload: { email: string; token: string }) {
  return apiRequest<{
    ok: boolean;
    session: AuthSessionPayload;
    user: unknown;
  }>("/api/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getLinkedInOAuthUrl(redirectTo?: string) {
  return apiRequest<{ ok: boolean; url: string }>("/api/auth/oauth/linkedin", {
    method: "POST",
    body: JSON.stringify({ redirectTo }),
  });
}

// ——— Contact ———

export type ContactPayload = {
  first_name: string;
  last_name: string;
  email: string;
  linkedin_url?: string | null;
  role?: string | null;
  inquiry_type: string;
  message?: string | null;
};

export function submitContact(payload: ContactPayload) {
  return apiRequest<{ ok: boolean; message: string }>("/api/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ——— RSVP ———

export type RsvpPayload = {
  event_id?: string | null;
  event_slug: string;
  event_title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  role: string;
  notes?: string | null;
};

export function submitRsvp(payload: RsvpPayload) {
  return apiRequest<{ ok: boolean; message: string }>("/api/rsvp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ——— Events ———

export type DbEventRow = {
  id: string;
  slug: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string | null;
  type: string;
  description: string | null;
  long_description: string | null;
  agenda: unknown;
  speakers: unknown;
  spots: number;
  capacity: number;
  price: string;
  featured: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export function fetchEventsFromApi() {
  return apiRequest<{ ok: boolean; data: DbEventRow[] }>("/api/events");
}

export function fetchEventBySlugFromApi(slug: string) {
  return apiRequest<{ ok: boolean; data: DbEventRow | null }>(
    `/api/events/${encodeURIComponent(slug)}`,
  );
}
