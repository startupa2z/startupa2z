const TOKEN_KEY = "startupa2z_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem(TOKEN_KEY);
}

export function getTokenPayload(): { sub?: string; email?: string; roles?: string[]; exp?: number } {
  const token = getToken();
  if (!token) return {};
  try {
    const [, payload] = token.split(".");
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return {};
  }
}
