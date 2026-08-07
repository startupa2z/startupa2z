export const FOUNDER_STATUS_OPTIONS = [
  { value: "founder", label: "Founder" },
  { value: "co_founder", label: "Co-founder" },
  { value: "aspiring_founder", label: "Aspiring founder" },
  { value: "not_founder", label: "Not a founder" },
] as const;

export function safeMemberReturnTo(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("://") || value.length > 500) {
    return "/welcome";
  }
  if (value.split("?")[0] === "/complete-profile") return "/welcome";
  return value;
}

export function profileCompletionUrl(returnTo: string): string {
  return `/complete-profile?returnTo=${encodeURIComponent(safeMemberReturnTo(returnTo))}`;
}
