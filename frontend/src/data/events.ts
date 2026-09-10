import { fetchEventsFromApi, fetchEventBySlugFromApi } from "@/lib/api";

const recurringPitchMixCover =
  "/event-covers/startupa2z-founders-pitch-mix-every-tuesday-safe.png?v=20260827";

// Defense in depth for known cancellations while older API/database versions
// are still being upgraded to lifecycle_status.
const hiddenEventSlugs = new Set(["founders-pitch-mix-2026-09-08"]);

export type EventItem = {
  id?: string;
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
  speakers: {
    name: string;
    role: string;
    bio?: string;
    imageUrl?: string;
    linkedinUrl?: string;
    websiteUrl?: string;
    xUrl?: string;
  }[];
  spots: number;
  capacity: number;
  price: string;
  featured: boolean;
  imageUrl?: string | null;
  startDateIso?: string | null;
  endDateIso?: string | null;
  registrationUrl?: string | null;
  lifecycleStatus?: "draft" | "published" | "cancelled" | "completed";
};

const pitchMixLongDescription = (date: string) =>
  `Join StartupA2Z for Founders Pitch & Mix, a free Bay Area startup event at Hacker Dojo in Mountain View on ${date}. Founders, aspiring entrepreneurs, builders, operators, investors, mentors, and startup ecosystem partners can build useful connections, learn practical startup fundamentals, watch founder showcases, and hear short audience pitches with direct feedback. The program combines structured learning with founder-to-founder networking for people building and supporting early-stage companies across Silicon Valley.`;

const pitchMixAgenda = [
  { time: "5:00 PM", item: "Networking" },
  { time: "5:30 PM", item: "Welcome and introduction by Satish" },
  { time: "5:40 PM", item: "Part 1: Startup Fundamentals" },
  { time: "6:00 PM", item: "Part 2: Founder Pitches" },
  { time: "6:30 PM", item: "Part 3: Audience Pitches" },
  { time: "7:00 PM", item: "Closing remarks by Satish" },
  { time: "7:15 PM", item: "Post-session networking" },
];

const pitchMixEvents: EventItem[] = [
  ["founders-pitch-mix-2026-08-25", "August 25, 2026", "2026-08-25", "mm8nnyc1"],
  ["founders-pitch-mix-2026-09-22", "September 22, 2026", "2026-09-22", "c7ebjedo"],
  ["founders-pitch-mix-2026-09-29", "September 29, 2026", "2026-09-29", "lxlrmvle"],
].map(([slug, date, isoDate, lumaSlug]) => ({
    slug,
    title: "Bay Area Founders Pitch & Startup Networking",
    date,
    time: "5:00 PM - 8:00 PM",
    venue: "Hacker Dojo, Mountain View",
    address: "855 Maude Ave, Mountain View, CA 94043",
    type: "Founder Event",
    desc: `A free Bay Area founder pitch and startup networking event at Hacker Dojo on ${date}.`,
    longDesc: pitchMixLongDescription(date),
    agenda: pitchMixAgenda,
    speakers: [{ name: "Satish Govindappa", role: "Host, StartupA2Z" }],
    spots: 0,
    capacity: 0,
    price: "Free",
    featured: false,
    imageUrl: recurringPitchMixCover,
    startDateIso: `${isoDate}T17:00:00-07:00`,
    endDateIso: `${isoDate}T20:00:00-07:00`,
    registrationUrl: `https://luma.com/${lumaSlug}?utm_source=startupa2z&utm_medium=website&utm_campaign=founders_pitch_mix`,
    lifecycleStatus: "published",
  }));

const september15Masterclass: EventItem = {
  slug: "founders-pitch-mix-2026-09-15",
  title: "What Raises Your Seed Round Will Sink Your Series C",
  date: "September 15, 2026",
  time: "5:00 PM - 8:00 PM",
  venue: "Hacker Dojo, Mountain View",
  address: "855 Maude Ave, Mountain View, CA 94043",
  type: "Founder Finance Masterclass",
  desc:
    "A founder masterclass on how business lifecycle economics and valuation expectations change from Seed through Series C and public-market readiness.",
  longDesc:
    "A Masterclass on Business Lifecycle Economics & Valuation Realities. The playbook that secures your Seed round can actively derail your Series C, later growth rounds, and eventual public-market readiness. Join StartupA2Z and investor Vivek Somani for a practical deep dive into how investor expectations evolve from TAM and narrative to unit economics, capital allocation, cash flow, Rule of 40, operating leverage, ROIC, and public-market valuation realities.",
  agenda: [
    { time: "5:00 PM", item: "Networking" },
    { time: "5:30 PM", item: "Welcome and introduction by Satish" },
    { time: "5:40 PM", item: "Masterclass with Vivek Somani" },
    { time: "7:20 PM", item: "Closing remarks" },
    { time: "7:30 PM", item: "Networking" },
  ],
  speakers: [
    {
      name: "Vivek Somani",
      role: "Investor and former customer-focused technology leader",
      bio: "Vivek brings an investor's perspective to startup economics, capital efficiency, and valuation. He also shares practical investing education through OptionGig and hosts a Bay Area community for DIY investors.",
      imageUrl: "/speakers/vivek-somani-linkedin.jpg",
      linkedinUrl: "https://www.linkedin.com/in/meetviveksomani/",
      websiteUrl: "https://optiongig.com/",
      xUrl: "https://x.com/VivekChirps",
    },
    { name: "Satish Govindappa", role: "Host, StartupA2Z" },
  ],
  spots: 0,
  capacity: 0,
  price: "Free",
  featured: true,
  imageUrl: "/event-covers/startupa2z-vivek-seed-to-series-c-luma-social-v2.png?v=20260909",
  startDateIso: "2026-09-15T17:00:00-07:00",
  endDateIso: "2026-09-15T20:00:00-07:00",
  registrationUrl:
    "https://luma.com/hmvkxmas?utm_source=startupa2z&utm_medium=website&utm_campaign=seed_to_series_c_masterclass",
  lifecycleStatus: "published",
};

// Public fallbacks mirror Luma. The database supplies the live event set.
export const seedEvents: EventItem[] = [
  september15Masterclass,
  ...pitchMixEvents,
  {
    slug: "founder-networking-workshop-2026-09-01",
    title: "Bay Area Founder Networking & Startup Workshop | Mountain View",
    date: "September 1, 2026",
    time: "5:00 PM - 8:00 PM",
    venue: "Hacker Dojo, Mountain View",
    address: "855 Maude Ave, Mountain View, CA 94043",
    type: "Founder Workshop",
    desc:
      "A free Bay Area founder networking event and practical startup workshop at Hacker Dojo in Mountain View on September 1, 2026.",
    longDesc:
      "Join StartupA2Z for a free Bay Area founder networking event at Hacker Dojo in Mountain View on September 1, 2026, from 5:00 PM to 8:00 PM. Designed for founders, aspiring entrepreneurs, builders, operators, investors, mentors, and GTM leaders, the event includes founder networking and Product's Done. Where's Revenue?, a hands-on go-to-market workshop led by Raj Badarinath, a four-time-exit CMO and Founder & CEO of Hivekind.ai.",
    agenda: [
      { time: "5:00 PM", item: "Arrival and founder networking" },
      { time: "5:30 PM", item: "Welcome and introduction by Satish Govindappa" },
      { time: "5:40 PM", item: "Product's Done. Where's Revenue? — hands-on GTM workshop" },
      { time: "7:15 PM", item: "Closing remarks and key takeaways" },
      { time: "7:25 PM", item: "Post-session networking" },
    ],
    speakers: [
      { name: "Satish Govindappa", role: "Host, StartupA2Z" },
      { name: "Raj Badarinath", role: "Workshop facilitator; Founder & CEO, Hivekind.ai" },
    ],
    spots: 0,
    capacity: 0,
    price: "Free",
    featured: false,
    imageUrl: recurringPitchMixCover,
    startDateIso: "2026-09-01T17:00:00-07:00",
    endDateIso: "2026-09-01T20:00:00-07:00",
    registrationUrl:
      "https://luma.com/txup8dqa?utm_source=startupa2z&utm_medium=website&utm_campaign=founder_networking_sep1",
  },
  {
    slug: "startup-a-to-z-hacker-dojo-august-12",
    title: "Bay Area Founders Pitch & Startup Networking",
    date: "August 12, 2026",
    time: "5:00 PM - 8:00 PM",
    venue: "Hacker Dojo, Mountain View",
    address: "855 Maude Ave, Mountain View, CA 94043",
    type: "Founder Event",
    desc: "A free Bay Area founder pitch and startup networking event at Hacker Dojo in Mountain View on August 12, 2026.",
    longDesc:
      "Startup A to Z brings founders, operators, investors, mentors, and aspiring entrepreneurs together for practical learning and meaningful connections. The first session opens with a fast-paced Startup Basics from A to Z talk, followed by two organized founder pitches, two audience pitches, direct feedback, and networking. Founder speakers will be announced soon.",
    agenda: [
      { time: "5:00 PM", item: "Arrival, registration, and networking" },
      { time: "5:30 PM", item: "Welcome + Startup Basics from A to Z with Satz" },
      { time: "5:55 PM", item: "Founder pitch 1 + feedback" },
      { time: "6:10 PM", item: "Founder pitch 2 + feedback" },
      { time: "6:25 PM", item: "Audience pitch 1 + feedback" },
      { time: "6:35 PM", item: "Audience pitch 2 + feedback" },
      { time: "6:45 PM", item: "Key lessons and community announcements" },
      { time: "6:55 PM", item: "Closing remarks" },
      { time: "7:00 PM", item: "Post-session networking" },
    ],
    speakers: [{ name: "Satz", role: "Host, Startup A to Z" }],
    spots: 24,
    capacity: 30,
    price: "Free",
    featured: true,
    imageUrl: "https://images.lumacdn.com/event-social/uj/b1008796-76dc-4efd-96b4-b3e35890b79f.png",
    startDateIso: "2026-08-12T17:00:00-07:00",
    endDateIso: "2026-08-12T20:00:00-07:00",
    registrationUrl: "https://luma.com/m0eu7bw9?utm_source=startupa2z&utm_medium=website&utm_campaign=founders_pitch_mix_aug12",
  },
];

// Backward-compat export — components that import `events` still work.
export const events = seedEvents;

type DbAgendaItem = { time: string; item: string };
type DbSpeaker = EventItem["speakers"][number];

const mapRow = (r: {
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
  image_url?: string | null;
  registration_url?: string | null;
  lifecycle_status?: "draft" | "published" | "cancelled" | "completed";
}): EventItem => {
  // Seeded copy mirrors Luma for prerendering and API-outage fallback. The
  // database supplies the live event set and operational values.
  const seedEvent = seedEvents.find((event) => event.slug === r.slug);
  const isRecurringPitchMix = r.slug.startsWith("founders-pitch-mix-2026-");
  const usesCurrentEventCover =
    isRecurringPitchMix || r.slug === "founder-networking-workshop-2026-09-01";
  return {
    id: r.id,
    slug: r.slug,
    title: seedEvent?.title ?? r.title,
    date: r.date,
    time: r.time,
    venue: r.venue,
    address: r.address ?? "",
    type: r.type,
    desc: seedEvent?.desc ?? r.description ?? "",
    longDesc: seedEvent?.longDesc ?? r.long_description ?? "",
    agenda: Array.isArray(r.agenda) ? (r.agenda as DbAgendaItem[]) : [],
    speakers: Array.isArray(r.speakers) ? (r.speakers as DbSpeaker[]) : [],
    spots: r.spots,
    capacity: r.capacity,
    price: r.price,
    featured: r.featured,
    imageUrl: seedEvent?.imageUrl || (usesCurrentEventCover ? recurringPitchMixCover : r.image_url || null),
    startDateIso: seedEvent?.startDateIso ?? null,
    endDateIso: seedEvent?.endDateIso ?? null,
    registrationUrl: r.registration_url || seedEvent?.registrationUrl || null,
    lifecycleStatus: r.lifecycle_status ?? seedEvent?.lifecycleStatus ?? "published",
  };
};

export const fetchAllEvents = async (): Promise<EventItem[]> => {
  try {
    const { data } = await fetchEventsFromApi();
    const dbEvents = (data ?? [])
      .map(mapRow)
      .filter(
        (event) =>
          !hiddenEventSlugs.has(event.slug) &&
          event.lifecycleStatus !== "cancelled" &&
          event.lifecycleStatus !== "draft",
      );
    return dbEvents.length > 0 ? dbEvents : seedEvents;
  } catch {
    return seedEvents;
  }
};

export const fetchEventBySlug = async (slug: string): Promise<EventItem | undefined> => {
  if (hiddenEventSlugs.has(slug)) return undefined;

  try {
    const { data } = await fetchEventBySlugFromApi(slug);
    if (data) {
      const event = mapRow(data);
      if (event.lifecycleStatus === "cancelled" || event.lifecycleStatus === "draft") return undefined;
      return event;
    }
  } catch {
    // fall through to seed
  }
  return seedEvents.find((e) => e.slug === slug);
};

export const getEventBySlug = (slug: string) =>
  hiddenEventSlugs.has(slug) ? undefined : seedEvents.find((e) => e.slug === slug);
