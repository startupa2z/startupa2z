import { Link } from "react-router-dom";
import {
  BarChart3,
  Building2,
  CalendarDays,
  Cable,
  FileText,
  Inbox,
  LayoutDashboard,
  Megaphone,
  MessageSquareText,
  Settings,
  Share2,
  UserRoundSearch,
  Users,
} from "lucide-react";

export type AdminSection =
  | "overview"
  | "submissions"
  | "members"
  | "founders"
  | "startups"
  | "event-management"
  | "rsvps"
  | "announcements"
  | "posts"
  | "social"
  | "connectors"
  | "analytics"
  | "settings";

type NavItem = {
  id: AdminSection;
  label: string;
  icon: typeof LayoutDashboard;
  count?: number;
};

const groups = (
  counts: { submissions: number; events: number; rsvps: number },
): { label: string; items: NavItem[] }[] => [
  {
    label: "Workspace",
    items: [{ id: "overview", label: "Overview", icon: LayoutDashboard }],
  },
  {
    label: "Community",
    items: [
      { id: "startups", label: "Businesses", icon: Building2 },
      { id: "members", label: "Members", icon: Users },
      { id: "founders", label: "Speakers", icon: UserRoundSearch },
      { id: "submissions", label: "Enquiries", icon: Inbox, count: counts.submissions },
    ],
  },
  {
    label: "Events",
    items: [
      { id: "event-management", label: "Event management", icon: CalendarDays, count: counts.events },
    ],
  },
  {
    label: "Campaign",
    items: [
      { id: "announcements", label: "Announcements", icon: Megaphone },
      { id: "posts", label: "Posts", icon: FileText },
      { id: "social", label: "Social media", icon: Share2 },
    ],
  },
  {
    label: "System",
    items: [
      { id: "connectors", label: "Connectors", icon: Cable },
      { id: "analytics", label: "Analytics", icon: BarChart3 },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
];

const AdminSidebar = ({
  active,
  onChange,
  counts,
}: {
  active: AdminSection;
  onChange: (section: AdminSection) => void;
  counts: { submissions: number; events: number; rsvps: number };
}) => {
  const navigation = groups(counts);

  return (
    <>
      <aside className="hidden lg:flex w-64 shrink-0 border-r bg-card/70 backdrop-blur-xl px-3 py-5 flex-col gap-5 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <nav className="space-y-5" aria-label="Admin navigation">
          {navigation.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const selected = active === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onChange(item.id)}
                      className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        selected
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {typeof item.count === "number" && item.count > 0 && (
                        <span className={`text-[10px] min-w-5 h-5 px-1 rounded-full inline-flex items-center justify-center ${selected ? "bg-primary-foreground/20" : "bg-muted"}`}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="mt-auto rounded-xl border bg-background/60 p-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <MessageSquareText className="h-4 w-4 text-primary" /> Admin template
          </div>
          <p className="mt-1 text-xs text-muted-foreground">New sections are visual placeholders until approved.</p>
          <Link to="/" className="mt-3 inline-flex text-xs font-medium text-primary hover:underline">View website →</Link>
        </div>
      </aside>

      <div className="lg:hidden border-b bg-card/80 p-3">
        <label htmlFor="admin-mobile-nav" className="sr-only">Admin section</label>
        <select
          id="admin-mobile-nav"
          value={active}
          onChange={(event) => onChange(event.target.value as AdminSection)}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          {navigation.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.items.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </optgroup>
          ))}
        </select>
      </div>
    </>
  );
};

export default AdminSidebar;
