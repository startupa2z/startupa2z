import { clearToken, getToken } from "@/lib/auth";

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

function apiErrorMessage(data: { error?: unknown; detail?: unknown }, fallback: string) {
  if (typeof data.error === "string") return data.error;
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.detail)) {
    const messages = data.detail
      .map((item) => {
        if (item && typeof item === "object" && "msg" in item) {
          return String((item as { msg: unknown }).msg);
        }
        return null;
      })
      .filter(Boolean);
    if (messages.length > 0) return messages.join(" ");
  }
  return fallback;
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

  const data = await parseJson<T & { error?: unknown; detail?: unknown }>(res);

  if (!res.ok) {
    const fallback = res.status === 500 && !API_BASE
      ? "API error — ensure the backend is running (`npm run dev:backend`)."
      : res.statusText;
    const message = apiErrorMessage(data, fallback);
    throw new ApiError(message, res.status);
  }

  return data;
}

// ——— Public homepage statistics ———

export type HomeStats = {
  active_members: number;
  events_hosted: number;
  page_visits: number;
  industries: number;
};

export function fetchHomeStats() {
  return apiRequest<{ ok: boolean; data: HomeStats }>("/api/stats/home");
}

export function recordPageView(payload: {
  visit_id: string;
  visitor_id: string;
  path: string;
}) {
  return apiRequest<{ ok: boolean }>("/api/stats/page-view", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ——— Auth ———

export type OtpMode = "signin" | "signup";

export function sendOtp(payload: {
  email: string;
  mode: OtpMode;
}) {
  return apiRequest<{ ok: boolean; message: string }>("/api/auth/otp/send", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type AuthSessionPayload = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
};

export type FounderStatus = "founder" | "co_founder" | "aspiring_founder" | "not_founder";

export type AuthenticatedMember = {
  id: string;
  email: string;
  full_name: string | null;
  company: string | null;
  job_title: string | null;
  founder_status: FounderStatus | null;
  linkedin_connected: boolean;
  profile_complete: boolean;
  created_at: string;
  roles?: string[];
};

export function verifyOtp(payload: { email: string; token: string }) {
  return apiRequest<{
    ok: boolean;
    session: AuthSessionPayload;
    user: AuthenticatedMember;
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

export function exchangeLinkedInCode(code: string) {
  return apiRequest<{
    ok: boolean;
    session: AuthSessionPayload;
    user: AuthenticatedMember;
  }>("/api/auth/oauth/linkedin/exchange", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export type MemberProfile = {
  user: AuthenticatedMember;
  summary: {
    registered_sessions: number;
    attended_sessions: number;
  };
  sessions: {
    event_slug: string;
    event_title: string;
    registered_at: string;
    attended: boolean;
  }[];
};

export function fetchMemberProfile() {
  const token = getToken();
  return apiRequest<MemberProfile & { ok: boolean }>("/api/auth/me", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export function updateMemberProfile(payload: {
  full_name: string;
  company: string;
  job_title: string;
  founder_status: FounderStatus;
}) {
  const token = getToken();
  return apiRequest<{ ok: boolean; user: AuthenticatedMember }>("/api/auth/me", {
    method: "PATCH",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(payload),
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

// ——— Business directory ———

export type BusinessListing = {
  id: string;
  slug?: string;
  name: string;
  pitch: string;
  stage: string;
  location: string;
  category: string;
  tags: string[];
  website_url: string | null;
  logo_url?: string | null;
  journey?: string | null;
  challenges?: string | null;
  challenge_solution?: string | null;
  ask_text?: string | null;
  offer_text?: string | null;
  founded_year?: number | null;
  team_size?: number | null;
  company_status?: string | null;
  channels?: BusinessChannel[];
  founders?: BusinessFounder[];
  media?: BusinessMedia[];
  created_at: string;
};

export type BusinessFounder = {
  id?: string;
  slug?: string;
  name: string;
  role: string;
  linkedin_url?: string | null;
  journey?: string | null;
  photo_url?: string | null;
  directory_visible?: boolean;
  display_order?: number;
};

export type FounderListing = {
  id: string;
  slug: string;
  name: string;
  role: string;
  linkedin_url?: string | null;
  journey?: string | null;
  photo_url?: string | null;
  company: Pick<BusinessListing, "id" | "slug" | "name" | "pitch" | "stage" | "location" | "category" | "tags" | "logo_url" | "ask_text" | "offer_text">;
};

export type BusinessChannel = {
  label: string;
  url: string;
};

export type BusinessMedia = {
  id?: string;
  media_type: "image" | "video";
  url: string;
  caption?: string | null;
  display_order?: number;
};

export type BusinessSubmissionPayload = {
  name: string;
  pitch: string;
  stage: string;
  location: string;
  category: string;
  tags: string[];
  website_url?: string | null;
  logo_url?: string | null;
  journey: string;
  challenges?: string | null;
  challenge_solution?: string | null;
  ask_text?: string | null;
  offer_text?: string | null;
  founded_year?: number | null;
  team_size?: number | null;
  channels?: BusinessChannel[];
  founders: BusinessFounder[];
  media: BusinessMedia[];
  contact_name: string;
  contact_email: string;
  consent_to_publish: boolean;
};

export type AdminBusiness = BusinessListing & {
  contact_name: string | null;
  contact_email: string | null;
  published: boolean;
  status: "pending" | "published" | "hidden";
  updated_at: string;
};

export type AdminMember = {
  id: string;
  email: string;
  full_name: string | null;
  company: string | null;
  job_title: string | null;
  founder_status: FounderStatus | null;
  linkedin_id: string | null;
  registered_sessions: number;
  attended_sessions: number;
  created_at: string;
  updated_at: string;
};

export type AdminMemberUpdatePayload = {
  email?: string;
  full_name?: string | null;
  company?: string | null;
  job_title?: string | null;
  founder_status?: FounderStatus | null;
};

export type AdminMemberSession = {
  id: string;
  event_slug: string;
  event_title: string;
  created_at: string;
  attended: boolean;
};

export type AdminBusinessUpdatePayload = Partial<{
  name: string;
  pitch: string;
  stage: string;
  location: string;
  category: string;
  tags: string[];
  website_url: string | null;
  clear_website_url: boolean;
  logo_url: string | null;
  journey: string;
  challenges: string | null;
  challenge_solution: string | null;
  ask_text: string | null;
  offer_text: string | null;
  founded_year: number | null;
  team_size: number | null;
  company_status: string | null;
  channels: BusinessChannel[];
  contact_name: string;
  contact_email: string;
  published: boolean;
  media: BusinessMedia[];
  founders: BusinessFounder[];
}>;

export function fetchBusinesses() {
  return apiRequest<{ ok: boolean; data: BusinessListing[] }>("/api/businesses");
}

export function fetchBusiness(slug: string) {
  return apiRequest<{ ok: boolean; data: BusinessListing }>(
    `/api/businesses/${encodeURIComponent(slug)}`,
  );
}

export function fetchFounders() {
  return apiRequest<{ ok: boolean; data: FounderListing[] }>("/api/businesses/founders");
}

export function fetchFounder(slug: string) {
  return apiRequest<{ ok: boolean; data: FounderListing }>(
    `/api/businesses/founders/${encodeURIComponent(slug)}`,
  );
}

export async function uploadBusinessImage(file: File) {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch(`${API_BASE}/api/businesses/media/upload`, {
    method: "POST",
    body: form,
  });
  const data = await parseJson<{ ok?: boolean; url?: string; detail?: unknown }>(response);
  if (!response.ok || !data.url) {
    throw new ApiError(apiErrorMessage(data, "Could not upload image."), response.status);
  }
  return { ok: true, url: data.url };
}

export function submitBusiness(payload: BusinessSubmissionPayload) {
  return apiRequest<{ ok: boolean; message: string; data: BusinessListing }>(
    "/api/businesses",
    { method: "POST", body: JSON.stringify(payload) },
  );
}

export function fetchAdminBusinesses() {
  return adminRequest<{ ok: boolean; data: AdminBusiness[] }>("/api/admin/businesses");
}

export function updateAdminBusiness(id: string, payload: AdminBusinessUpdatePayload) {
  return adminRequest<{ ok: boolean; data: AdminBusiness }>(
    `/api/admin/businesses/${encodeURIComponent(id)}`,
    { method: "PUT", body: JSON.stringify(payload) },
  );
}

export function deleteAdminBusiness(id: string) {
  return adminRequest<{ ok: boolean }>(`/api/admin/businesses/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export function fetchAdminMembers() {
  return adminRequest<{ ok: boolean; data: AdminMember[] }>("/api/admin/members");
}

export function fetchAdminMemberSessions(id: string) {
  return adminRequest<{ ok: boolean; data: AdminMemberSession[] }>(
    `/api/admin/members/${encodeURIComponent(id)}/sessions`,
  );
}

export function updateAdminMember(id: string, payload: AdminMemberUpdatePayload) {
  return adminRequest<{ ok: boolean; data: AdminMember }>(
    `/api/admin/members/${encodeURIComponent(id)}`,
    { method: "PUT", body: JSON.stringify(payload) },
  );
}

export function deleteAdminMember(id: string) {
  return adminRequest<{ ok: boolean }>(`/api/admin/members/${encodeURIComponent(id)}`, {
    method: "DELETE",
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
  pitch_interest: boolean;
  whatsapp_opt_in: boolean;
  notes?: string | null;
};

export function submitRsvp(payload: RsvpPayload) {
  return apiRequest<{ ok: boolean; message: string }>("/api/rsvp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function submitMemberRsvp(payload: {
  event_id?: string | null;
  event_slug: string;
  event_title: string;
}) {
  const token = getToken();
  return apiRequest<{ ok: boolean; message: string }>("/api/rsvp/member", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
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

// ——— Stripe ———

export function createCheckoutSession(payload: {
  packageId: string;
  customerEmail?: string;
}) {
  const origin = window.location.origin;
  return apiRequest<{ ok: boolean; url: string }>(
    "/api/stripe/create-checkout-session",
    {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        successUrl: `${origin}/sponsorship?payment=success`,
        cancelUrl: `${origin}/sponsorship?payment=cancelled`,
      }),
    },
  );
}

// ——— Admin (require Bearer token) ——————————————————————————————————————————

async function adminRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  try {
    return await apiRequest<T>(path, {
      ...options,
      headers: {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      clearToken();
      if (window.location.pathname !== "/admin/login") {
        window.location.replace("/admin/login");
      }
    }
    throw error;
  }
}

export function adminPasswordLogin(payload: { username: string; password: string }) {
  return apiRequest<{
    ok: boolean;
    session: { access_token: string; token_type: string; expires_in: number };
  }>("/api/auth/admin/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type AdminSubmission = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  linkedin_url: string | null;
  role: string | null;
  inquiry_type: string;
  message: string | null;
};

export type AdminRSVP = {
  id: string;
  event_id: string | null;
  event_slug: string;
  event_title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  role: string | null;
  pitch_interest: boolean;
  whatsapp_opt_in: boolean;
  attended: boolean;
  notes: string | null;
  created_at: string;
};

export type AdminEvent = {
  id: string;
  slug: string;
  title: string;
  date: string;
  type: string;
  venue: string;
  featured: boolean;
  image_url: string | null;
  created_at: string;
};

export type AdminEventFull = DbEventRow & {
  agenda: { time: string; item: string }[];
  speakers: { name: string; role: string }[];
};

export type EventMutationPayload = {
  title: string;
  date: string;
  time: string;
  venue: string;
  address?: string | null;
  type: string;
  description?: string | null;
  long_description?: string | null;
  spots: number;
  capacity: number;
  price?: string;
  featured: boolean;
  agenda?: { time: string; item: string }[];
  speakers?: { name: string; role: string }[];
  image_url?: string | null;
  remove_image?: boolean;
};

export function fetchAdminSubmissions() {
  return adminRequest<{ ok: boolean; data: AdminSubmission[] }>("/api/admin/submissions");
}

export function fetchAdminRsvps() {
  return adminRequest<{ ok: boolean; data: AdminRSVP[] }>("/api/admin/rsvps");
}

export function deleteAdminRsvp(id: string) {
  return adminRequest<{ ok: boolean }>(`/api/admin/rsvps/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export function updateAdminRsvpAttendance(id: string, attended: boolean) {
  return adminRequest<{ ok: boolean; data: AdminRSVP }>(`/api/admin/rsvps/${encodeURIComponent(id)}/attendance`, {
    method: "PATCH",
    body: JSON.stringify({ attended }),
  });
}

export function fetchAdminEventById(id: string) {
  return adminRequest<{ ok: boolean; data: AdminEventFull }>(`/api/admin/events/${encodeURIComponent(id)}`);
}

export function createAdminEvent(payload: EventMutationPayload) {
  return adminRequest<{ ok: boolean; id: string; slug: string }>("/api/admin/events", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdminEvent(id: string, payload: Partial<EventMutationPayload>) {
  return adminRequest<{ ok: boolean }>(`/api/admin/events/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteAdminEvent(id: string) {
  return adminRequest<{ ok: boolean }>(`/api/admin/events/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export type PublishingChannelName = "website" | "luma" | "eventbrite" | "linkedin" | "x";
export type PublishingChannelStatus = "draft" | "ready" | "scheduled" | "published" | "failed" | "not_connected";
export type ContentItemStatus = "draft" | "in_review" | "approved" | "scheduled" | "published";
export type ContentItemType = "announcement" | "reminder" | "follow_up";

export type EventChannel = {
  id: string;
  event_id: string;
  channel: PublishingChannelName;
  status: PublishingChannelStatus;
  external_url: string | null;
  external_event_id: string | null;
  scheduled_at: string | null;
  published_at: string | null;
  last_error: string | null;
  created_at: string;
  updated_at: string;
};

export type EventContentItem = {
  id: string;
  event_id: string;
  channel: PublishingChannelName;
  content_type: ContentItemType;
  title: string;
  body: string;
  status: ContentItemStatus;
  scheduled_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type EventPublishingWorkspace = {
  event: AdminEventFull;
  channels: EventChannel[];
  content: EventContentItem[];
};

export function fetchEventPublishing(eventId: string) {
  return adminRequest<{ ok: boolean; data: EventPublishingWorkspace }>(
    `/api/admin/events/${encodeURIComponent(eventId)}/publishing`,
  );
}

export function updateEventChannel(eventId: string, payload: {
  channel: PublishingChannelName;
  status: PublishingChannelStatus;
  external_url?: string | null;
  external_event_id?: string | null;
  scheduled_at?: string | null;
  last_error?: string | null;
}) {
  return adminRequest<{ ok: boolean; data: EventChannel }>(
    `/api/admin/events/${encodeURIComponent(eventId)}/channels`,
    { method: "PUT", body: JSON.stringify(payload) },
  );
}

export function generateEventContent(eventId: string, payload: {
  channel: PublishingChannelName;
  content_type: ContentItemType;
}) {
  const params = new URLSearchParams({ event_id: eventId });
  return adminRequest<{ ok: boolean; data: { title: string; body: string } }>(
    `/api/admin/content/generate?${params.toString()}`,
    { method: "POST", body: JSON.stringify(payload) },
  );
}

export function createEventContent(payload: {
  event_id: string;
  channel: PublishingChannelName;
  content_type: ContentItemType;
  title: string;
  body: string;
  status: ContentItemStatus;
  scheduled_at?: string | null;
}) {
  return adminRequest<{ ok: boolean; data: EventContentItem }>("/api/admin/content", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateEventContent(id: string, payload: Partial<{
  channel: PublishingChannelName;
  content_type: ContentItemType;
  title: string;
  body: string;
  status: ContentItemStatus;
  scheduled_at: string | null;
  clear_schedule: boolean;
}>) {
  return adminRequest<{ ok: boolean; data: EventContentItem }>(
    `/api/admin/content/${encodeURIComponent(id)}`,
    { method: "PUT", body: JSON.stringify(payload) },
  );
}

export function deleteEventContent(id: string) {
  return adminRequest<{ ok: boolean }>(`/api/admin/content/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function uploadEventImage(file: File): Promise<string> {
  const token = getToken();
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/api/admin/upload-image`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json().catch(() => ({})) as { ok?: boolean; url?: string; detail?: string };
  if (!res.ok) throw new ApiError(data.detail ?? res.statusText, res.status);
  return data.url!;
}
