import type { AdminSection } from "@/components/admin/AdminSidebar";

const labels: Record<AdminSection, string> = {
  overview: "Overview",
  submissions: "Enquiries",
  members: "Members",
  founders: "Speakers",
  startups: "Businesses",
  "event-management": "Event management",
  rsvps: "Registrations",
  announcements: "Announcements",
  posts: "Posts",
  social: "Social media",
  connectors: "Connectors",
  analytics: "Analytics",
  settings: "Settings",
};

export const adminSectionLabel = (section: AdminSection) => labels[section];
