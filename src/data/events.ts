import { supabase } from "@/integrations/supabase/client";

export type EventItem = {
  slug: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  type: string;
  desc: string;
  longDesc: string;
  agenda: { time: string; item: string }[];
  speakers: { name: string; role: string }[];
  spots: number;
  capacity: number;
  price: string;
  featured: boolean;
};

// Seed / fallback events kept for design continuity
export const seedEvents: EventItem[] = [
  {
    slug: "founder-friday-ai-edition",
    title: "Founder Friday: AI Edition",
    date: "April 18, 2026",
    time: "6:00 PM - 9:00 PM",
    venue: "SOMA, San Francisco",
    address: "475 Brannan St, San Francisco, CA 94107",
    type: "Networking",
    desc: "Connect with AI founders, demo products, and discuss the future of artificial intelligence in the Bay Area.",
    longDesc:
      "Founder Friday is our flagship monthly networking event bringing together the most ambitious AI founders in the Bay Area. This edition focuses on AI startups across foundation models, agents, and applied verticals. Expect lightning demos from 5 stealth-stage startups, structured intros, and unstructured time to build real relationships with peers who get what you're going through.",
    agenda: [
      { time: "6:00 PM", item: "Doors open & welcome drinks" },
      { time: "6:45 PM", item: "Founder lightning demos (5 startups)" },
      { time: "7:30 PM", item: "Structured networking rounds" },
      { time: "8:15 PM", item: "Open networking & founder roundtables" },
      { time: "9:00 PM", item: "Wrap-up" },
    ],
    speakers: [
      { name: "Priya Shah", role: "Founder, Lumen AI" },
      { name: "Marcus Chen", role: "Partner, South Park Ventures" },
    ],
    spots: 47,
    capacity: 120,
    price: "Free",
    featured: true,
  },
  {
    slug: "pitch-night-cleantech-startups",
    title: "Pitch Night: CleanTech Startups",
    date: "April 25, 2026",
    time: "7:00 PM - 9:30 PM",
    venue: "Oakland Innovation Hub",
    address: "1111 Broadway, Oakland, CA 94607",
    type: "Pitch Event",
    desc: "Watch 8 CleanTech startups pitch to a panel of investors. Audience voting and networking to follow.",
    longDesc:
      "Eight pre-selected CleanTech startups pitch live to a panel of climate-focused investors and operators. Each founder gets 5 minutes to pitch and 3 minutes of Q&A. The audience votes on the most promising company, who walks away with a $10K founder grant and warm intros to the panel.",
    agenda: [
      { time: "7:00 PM", item: "Check-in & networking" },
      { time: "7:30 PM", item: "Opening remarks" },
      { time: "7:40 PM", item: "Eight startup pitches (8 min each)" },
      { time: "9:00 PM", item: "Audience voting & winner announcement" },
      { time: "9:15 PM", item: "Networking with founders & panelists" },
    ],
    speakers: [
      { name: "Aisha Patel", role: "Principal, Climate Capital" },
      { name: "Diego Ramirez", role: "Founder, GridFlow" },
    ],
    spots: 62,
    capacity: 150,
    price: "$15",
    featured: false,
  },
  {
    slug: "startup-coffee-chat",
    title: "Startup Coffee Chat",
    date: "May 2, 2026",
    time: "9:00 AM - 11:00 AM",
    venue: "Palo Alto",
    address: "Coupa Café, 538 Ramona St, Palo Alto, CA 94301",
    type: "Casual Meetup",
    desc: "An informal morning session for founders to share progress, challenges, and advice over coffee.",
    longDesc:
      "A no-pressure, no-pitch morning meetup for founders at every stage. Grab a coffee, find a table, and connect with peers who understand the journey. Great for early-stage founders looking for honest feedback and accountability partners.",
    agenda: [
      { time: "9:00 AM", item: "Coffee & casual mingling" },
      { time: "9:30 AM", item: "Quick founder intros (optional)" },
      { time: "10:00 AM", item: "Open coffee chats" },
      { time: "11:00 AM", item: "Wrap-up" },
    ],
    speakers: [],
    spots: 55,
    capacity: 80,
    price: "Free",
    featured: false,
  },
  {
    slug: "investor-office-hours",
    title: "Investor Office Hours",
    date: "May 8, 2026",
    time: "2:00 PM - 5:00 PM",
    venue: "Financial District, SF",
    address: "555 California St, San Francisco, CA 94104",
    type: "Mentorship",
    desc: "30-minute 1-on-1 sessions with angel investors and VCs. Apply to present your startup.",
    longDesc:
      "Book a 30-minute private session with one of 8 active angel investors and early-stage VCs. Get honest feedback on your pitch, deck, and go-to-market plan. This is not a fundraising event — it's structured mentorship from people who've seen thousands of decks.",
    agenda: [
      { time: "2:00 PM", item: "Check-in" },
      { time: "2:15 PM", item: "Office hour slot 1" },
      { time: "3:00 PM", item: "Office hour slot 2" },
      { time: "4:00 PM", item: "Office hour slot 3" },
      { time: "5:00 PM", item: "Wrap-up" },
    ],
    speakers: [
      { name: "Lena Wong", role: "Angel Investor" },
      { name: "James O'Connor", role: "Partner, Seed Stage Ventures" },
    ],
    spots: 12,
    capacity: 24,
    price: "Free (application required)",
    featured: false,
  },
  {
    slug: "bay-area-startup-summit",
    title: "Bay Area Startup Summit",
    date: "May 20, 2026",
    time: "10:00 AM - 6:00 PM",
    venue: "Moscone Center, SF",
    address: "747 Howard St, San Francisco, CA 94103",
    type: "Conference",
    desc: "The biggest Startupa2z event of the quarter. Keynotes, panels, pitch competition, and networking.",
    longDesc:
      "Our flagship quarterly summit. Keynotes from industry leaders, three panel discussions on the state of Bay Area tech, a live pitch competition with $50K in prizes, and a curated networking experience for 500+ founders, investors, and operators. The single most important Startupa2z event of the year.",
    agenda: [
      { time: "10:00 AM", item: "Doors open & coffee" },
      { time: "10:30 AM", item: "Opening keynote" },
      { time: "11:30 AM", item: "Panel: The State of Bay Area Tech" },
      { time: "1:00 PM", item: "Lunch & networking" },
      { time: "2:30 PM", item: "Pitch competition (10 finalists)" },
      { time: "4:30 PM", item: "Panel: Building Through the Cycle" },
      { time: "5:30 PM", item: "Awards & closing reception" },
    ],
    speakers: [
      { name: "Sarah Kim", role: "CEO, Notion AI" },
      { name: "Raj Mehta", role: "GP, Foundation Capital" },
      { name: "Elena Vasquez", role: "Founder, Stripe alum" },
    ],
    spots: 184,
    capacity: 500,
    price: "$95",
    featured: true,
  },
  {
    slug: "co-founder-speed-dating",
    title: "Co-Founder Speed Dating",
    date: "June 1, 2026",
    time: "6:30 PM - 8:30 PM",
    venue: "Berkeley",
    address: "SkyDeck, 2150 Shattuck Ave, Berkeley, CA 94704",
    type: "Networking",
    desc: "Meet potential co-founders in structured speed-dating style sessions. Engineers, designers, and business minds.",
    longDesc:
      "A structured event designed to help solo founders find their match. Five-minute rotations with 20+ pre-vetted potential co-founders across engineering, design, and business backgrounds. Followed by open networking and coached follow-ups for promising matches.",
    agenda: [
      { time: "6:30 PM", item: "Check-in & icebreaker" },
      { time: "7:00 PM", item: "Speed-matching rounds (5 min each)" },
      { time: "8:00 PM", item: "Open networking with matches" },
      { time: "8:30 PM", item: "Wrap-up" },
    ],
    speakers: [],
    spots: 28,
    capacity: 60,
    price: "$10",
    featured: false,
  },
];

// Backward-compat export — components that import `events` still work.
export const events = seedEvents;

type DbAgendaItem = { time: string; item: string };
type DbSpeaker = { name: string; role: string };

const mapRow = (r: {
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
}): EventItem => ({
  slug: r.slug,
  title: r.title,
  date: r.date,
  time: r.time,
  venue: r.venue,
  address: r.address ?? "",
  type: r.type,
  desc: r.description ?? "",
  longDesc: r.long_description ?? "",
  agenda: Array.isArray(r.agenda) ? (r.agenda as DbAgendaItem[]) : [],
  speakers: Array.isArray(r.speakers) ? (r.speakers as DbSpeaker[]) : [],
  spots: r.spots,
  capacity: r.capacity,
  price: r.price,
  featured: r.featured,
});

/** Fetch all events: DB-first, then seed (deduped by slug). */
export const fetchAllEvents = async (): Promise<EventItem[]> => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Failed to fetch events", error);
    return seedEvents;
  }
  const dbEvents = (data ?? []).map(mapRow);
  const dbSlugs = new Set(dbEvents.map((e) => e.slug));
  const merged = [...dbEvents, ...seedEvents.filter((e) => !dbSlugs.has(e.slug))];
  return merged;
};

export const fetchEventBySlug = async (slug: string): Promise<EventItem | undefined> => {
  const { data, error } = await supabase.from("events").select("*").eq("slug", slug).maybeSingle();
  if (!error && data) return mapRow(data);
  return seedEvents.find((e) => e.slug === slug);
};

export const getEventBySlug = (slug: string) => seedEvents.find((e) => e.slug === slug);
