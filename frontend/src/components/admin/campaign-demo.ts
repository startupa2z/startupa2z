import type { AdminEvent } from "@/lib/api";

export type EventStage = "draft_event" | "published" | "campaign_draft" | "scheduled";
export type SimpleStatus = "Draft" | "Scheduled" | "Sent";
export type JourneyStep = 1 | 2 | 3 | 4 | 5;

export type DemoEvent = {
  id: string;
  slug: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  stage: EventStage;
  note: string;
};

export type CampaignMessage = {
  id: "announcement" | "reminder" | "final-reminder";
  name: string;
  timing: string;
  subject: string;
  body: string;
  status: SimpleStatus;
};

export const stageInfo: Record<EventStage, { label: string; next: string; progress: number; tone: string }> = {
  draft_event: { label: "Event draft", next: "Complete event details", progress: 25, tone: "border-slate-300 bg-slate-50 text-slate-700" },
  published: { label: "Event published", next: "Start campaign draft", progress: 50, tone: "border-emerald-300 bg-emerald-50 text-emerald-700" },
  campaign_draft: { label: "Campaign draft", next: "Review three messages", progress: 75, tone: "border-amber-300 bg-amber-50 text-amber-700" },
  scheduled: { label: "Campaign scheduled", next: "View campaign", progress: 100, tone: "border-blue-300 bg-blue-50 text-blue-700" },
};

export const makeDemoEvents = (base?: AdminEvent): DemoEvent[] => [
  {
    id: "demo-draft",
    slug: "founder-office-hours-demo",
    title: "Founder Office Hours",
    date: "September 10, 2026",
    time: "5:30 PM – 7:00 PM",
    venue: "Venue needed",
    stage: "draft_event",
    note: "Add the venue and final description before publishing.",
  },
  {
    id: "demo-draft-2",
    slug: "startup-legal-clinic-demo",
    title: "Startup Legal Clinic",
    date: "September 15, 2026",
    time: "4:00 PM – 6:00 PM",
    venue: "Room to be confirmed",
    stage: "draft_event",
    note: "Confirm the room, capacity, and registration details.",
  },
  {
    id: "demo-published",
    slug: base?.slug ?? "bay-area-founder-night-demo",
    title: base?.title ?? "Bay Area Founder Night",
    date: base?.date ?? "September 18, 2026",
    time: base?.time ?? "5:00 PM – 8:00 PM",
    venue: base?.venue ?? "Hacker Dojo, Mountain View",
    stage: "published",
    note: "The event is public. The announcement campaign has not been started.",
  },
  {
    id: "demo-published-2",
    slug: "saas-founder-roundtable-demo",
    title: "SaaS Founder Roundtable",
    date: "September 20, 2026",
    time: "3:00 PM – 5:00 PM",
    venue: "StartupA2Z Community Room",
    stage: "published",
    note: "The event is public and ready for a campaign draft.",
  },
  {
    id: "demo-campaign-draft",
    slug: "ai-compliance-workshop-demo",
    title: "AI Compliance Workshop",
    date: "September 24, 2026",
    time: "4:00 PM – 6:00 PM",
    venue: "StartupA2Z Community Room",
    stage: "campaign_draft",
    note: "Announcement and two reminder drafts are ready for review.",
  },
  {
    id: "demo-campaign-draft-2",
    slug: "fundraising-office-hours-demo",
    title: "Fundraising Office Hours",
    date: "September 28, 2026",
    time: "5:30 PM – 7:00 PM",
    venue: "Online",
    stage: "campaign_draft",
    note: "Review the three messages before approving the schedule.",
  },
  {
    id: "demo-scheduled",
    slug: "startup-showcase-demo",
    title: "Startup Showcase & Networking",
    date: "October 2, 2026",
    time: "5:00 PM – 8:00 PM",
    venue: "Hacker Dojo, Mountain View",
    stage: "scheduled",
    note: "The campaign schedule is approved in this local demo.",
  },
  {
    id: "demo-scheduled-2",
    slug: "women-founders-breakfast-demo",
    title: "Women Founders Breakfast",
    date: "October 8, 2026",
    time: "8:30 AM – 10:00 AM",
    venue: "Palo Alto, California",
    stage: "scheduled",
    note: "The three-message schedule is visible as a local preview.",
  },
];

export const buildMessages = (event: DemoEvent): CampaignMessage[] => {
  const scheduled = event.stage === "scheduled";
  const eventLine = `${event.date} · ${event.time} · ${event.venue}`;
  return [
    {
      id: "announcement",
      name: "Announcement",
      timing: "At publish",
      subject: `You're invited: ${event.title}`,
      body: `Hi {{first_name}},\n\nJoin us for ${event.title}.\n\n${eventLine}\n\nEvent details and RSVP: https://startupa2z.org/events/${event.slug}`,
      status: scheduled ? "Scheduled" : "Draft",
    },
    {
      id: "reminder",
      name: "Reminder",
      timing: "One day before",
      subject: `Tomorrow: ${event.title}`,
      body: `Hi {{first_name}},\n\nA quick reminder that ${event.title} is tomorrow.\n\n${eventLine}`,
      status: scheduled ? "Scheduled" : "Draft",
    },
    {
      id: "final-reminder",
      name: "Final reminder",
      timing: "Two hours before",
      subject: `Starting soon: ${event.title}`,
      body: `Hi {{first_name}},\n\n${event.title} starts in about two hours.\n\n${eventLine}`,
      status: scheduled ? "Scheduled" : "Draft",
    },
  ];
};
