import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  Cable,
  CreditCard,
  FileText,
  Inbox,
  LayoutDashboard,
  Megaphone,
  MessageSquareText,
  Settings,
  Share2,
  UserRoundSearch,
  Users,
  Globe2,
  ChevronDown,
  Rows3,
} from "lucide-react";
import type { JourneyStep } from "./campaign-demo";

export type AdminSection =
  | "overview"
  | "submissions"
  | "members"
  | "all-users"
  | "founders"
  | "startups"
  | "event-management"
  | "rsvps"
  | "payments"
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

const COMMUNITY_IDS: AdminSection[] = ["startups", "members", "all-users", "founders", "submissions"];

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
      { id: "all-users", label: "All Users", icon: UserRoundSearch },
      { id: "founders", label: "Speakers", icon: UserRoundSearch },
      { id: "submissions", label: "Enquiries", icon: Inbox, count: counts.submissions },
    ],
  },
  { label: "Content", items: [{ id: "posts", label: "Posts", icon: FileText }, { id: "social", label: "Social media", icon: Share2 }] },
  {
    label: "System",
    items: [
      { id: "payments", label: "Payments", icon: CreditCard },
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
  journeyStep,
  onJourneyStepChange,
}: {
  active: AdminSection;
  onChange: (section: AdminSection) => void;
  counts: { submissions: number; events: number; rsvps: number };
  journeyStep: JourneyStep;
  onJourneyStepChange: (step: JourneyStep) => void;
}) => {
  const navigation = groups(counts);
  const eventLifecycleActive = active === "event-management" || active === "announcements";
  const [communityOpen, setCommunityOpen] = useState(() => COMMUNITY_IDS.includes(active));
  const [eventLifecycleOpen, setEventLifecycleOpen] = useState(() => eventLifecycleActive);
  const journey = [
    { step: 1 as const, label: "All events", help: "See every event.", section: "event-management" as const, icon: Rows3 },
    { step: 2 as const, label: "Create event", help: "Create the event and complete its details.", section: "event-management" as const, icon: CalendarDays },
    { step: 3 as const, label: "Publish event", help: "Make the event public before campaigning.", section: "event-management" as const, icon: Globe2 },
    { step: 4 as const, label: "Campaign and messages", help: "Create and review the three message drafts.", section: "announcements" as const, icon: Megaphone },
    { step: 5 as const, label: "Review and approval", help: "Approve the local schedule after review.", section: "announcements" as const, icon: CheckCircle2 },
  ];
  const chooseJourneyStep = (step: JourneyStep, section: AdminSection) => {
    onJourneyStepChange(step);
    onChange(section);
  };

  useEffect(() => {
    if (COMMUNITY_IDS.includes(active)) setCommunityOpen(true);
    if (active === "event-management" || active === "announcements") setEventLifecycleOpen(true);
  }, [active]);

  return (
    <>
      <aside className="hidden lg:flex w-64 shrink-0 border-r bg-card/70 backdrop-blur-xl px-3 py-5 flex-col gap-5 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <nav className="space-y-5" aria-label="Admin navigation">
          <div>
            {navigation[0].items.map((item) => {
              const Icon = item.icon;
              const selected = active === item.id;
              return <button key={item.id} type="button" onClick={() => onChange(item.id)} className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${selected ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="h-4 w-4 shrink-0" /><span className="flex-1 text-left">Overview</span></button>;
            })}
          </div>

          <div>
            <button type="button" onClick={() => setCommunityOpen((open) => !open)} aria-expanded={communityOpen} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${COMMUNITY_IDS.includes(active) ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              <Users className="h-4 w-4 shrink-0" /><span className="flex-1 text-left">Community</span><span className="text-[10px] font-normal text-muted-foreground">{navigation[1].items.length}</span><ChevronDown className={`h-4 w-4 transition-transform ${communityOpen ? "rotate-180" : ""}`} />
            </button>
            {communityOpen && <div className="ml-3 mt-1 space-y-1 border-l pl-2">
              {navigation[1].items.map((item) => {
                const Icon = item.icon;
                const selected = active === item.id;
                return <button key={item.id} type="button" onClick={() => onChange(item.id)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${selected ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="h-4 w-4 shrink-0" /><span className="flex-1 text-left">{item.label}</span>{typeof item.count === "number" && item.count > 0 && <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] ${selected ? "bg-primary-foreground/20" : "bg-muted"}`}>{item.count}</span>}</button>;
              })}
            </div>}
          </div>

          <div>
            <button type="button" onClick={() => setEventLifecycleOpen((open) => !open)} aria-expanded={eventLifecycleOpen} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${eventLifecycleActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              <CalendarDays className="h-4 w-4 shrink-0" /><span className="flex-1 text-left">Event Lifecycle</span><span className="text-[10px] font-normal text-muted-foreground">Step {journeyStep}</span><ChevronDown className={`h-4 w-4 transition-transform ${eventLifecycleOpen ? "rotate-180" : ""}`} />
            </button>
            {eventLifecycleOpen && <div className="ml-3 mt-1 space-y-1 border-l pl-2">
              {journey.map((item) => {
                const Icon = item.icon;
                const selected = journeyStep === item.step && (active === "event-management" || active === "announcements");
                return (
                  <button key={item.step} type="button" onClick={() => chooseJourneyStep(item.step, item.section)} className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${selected ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                    <span className="flex items-center gap-3"><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${selected ? "bg-primary-foreground/20" : "bg-muted"}`}>{item.step}</span><Icon className="h-4 w-4 shrink-0" /><span className="flex-1 text-sm font-medium">{item.label}</span></span>
                  </button>
                );
              })}
            </div>}
          </div>
          {navigation.slice(2).map((group) => (
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
        <p className="mb-1 mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Event lifecycle</p>
        <div className="grid grid-cols-5 gap-1" aria-label="Event lifecycle steps">
          {journey.map((item) => <button key={item.step} type="button" onClick={() => chooseJourneyStep(item.step, item.section)} className={`rounded-md border px-1 py-2 text-[10px] font-medium ${journeyStep === item.step ? "border-primary bg-primary text-primary-foreground" : "bg-background text-muted-foreground"}`}>Step {item.step}<span className="mt-0.5 block truncate">{item.label}</span></button>)}
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
