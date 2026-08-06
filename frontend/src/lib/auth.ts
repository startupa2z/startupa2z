const TOKEN_KEY = "startupa2z_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event("startupa2z-auth-change"));
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("startupa2z-auth-change"));
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem(TOKEN_KEY);
}

export function getTokenPayload(): { sub?: string; email?: string; roles?: string[]; exp?: number; dev_admin?: boolean } {
  const token = getToken();
  if (!token) return {};
  try {
    const [, payload] = token.split(".");
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return {};
  }
}

export function isMemberAuthenticated(): boolean {
  const payload = getTokenPayload();
  return isAuthenticated() && payload.dev_admin !== true && payload.sub !== "local-admin";
}
