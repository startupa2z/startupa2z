import { fetchEventsFromApi, fetchEventBySlugFromApi } from "@/lib/api";

const recurringPitchMixCover =
  "/event-covers/startupa2z-founders-pitch-mix-every-wednesday.png";

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
  speakers: { name: string; role: string }[];
  spots: number;
  capacity: number;
  price: string;
  featured: boolean;
  imageUrl?: string | null;
  startDateIso?: string | null;
  endDateIso?: string | null;
  registrationUrl?: string | null;
};

// Public fallback event. A database record with the same slug overrides it.
export const seedEvents: EventItem[] = [
  {
    slug: "founders-pitch-mix-2026-08-19",
    title: "Bay Area Founder Networking Event & Startup Workshop",
    date: "August 19, 2026",
    time: "5:00 PM - 8:00 PM",
    venue: "Hacker Dojo, Mountain View",
    address: "855 Maude Ave, Mountain View, CA 94043",
    type: "Founder Networking",
    desc:
      "A free Bay Area founder networking event and practical startup workshop at Hacker Dojo in Mountain View on August 19, 2026.",
    longDesc:
      "Join StartupA2Z for a free Bay Area founder networking event at Hacker Dojo in Mountain View. Founders, entrepreneurs, builders, investors, operators, and startup ecosystem partners will work through practical go-to-market fundamentals, exchange direct feedback, and build useful Silicon Valley connections. Raj Badarinath—a four-time-exit CMO and Founder and CEO of Hivekind.ai—will facilitate Product's Done. Where's Revenue?, a hands-on workshop covering ideal customers, buyer-readiness signals, differentiation, category, budget, positioning, and consistent value communication.",
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
    featured: true,
    imageUrl: recurringPitchMixCover,
    startDateIso: "2026-08-19T17:00:00-07:00",
    endDateIso: "2026-08-19T20:00:00-07:00",
    registrationUrl:
      "https://luma.com/txup8dqa?utm_source=startupa2z&utm_medium=website&utm_campaign=founder_networking_aug19",
  },
  {
    slug: "startup-a-to-z-hacker-dojo-august-12",
    title: "Bay Area Founders Pitch & Startup Networking",
    date: "August 12, 2026",
    time: "5:00 PM - 8:00 PM",
    venue: "Hacker Dojo, Mountain View",
    address: "855 Maude Ave, Mountain View, CA 94043",
    type: "Founder Meetup",
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
type DbSpeaker = { name: string; role: string };

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
}): EventItem => {
  // Locally seeded public copy is the discovery source of truth. The database
  // still supplies operational values and all content for non-seeded events.
  const seedEvent = seedEvents.find((event) => event.slug === r.slug);
  const isRecurringPitchMix = r.slug.startsWith("founders-pitch-mix-2026-");
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
    imageUrl: isRecurringPitchMix
      ? recurringPitchMixCover
      : r.image_url || seedEvent?.imageUrl || null,
    startDateIso: seedEvent?.startDateIso ?? null,
    endDateIso: seedEvent?.endDateIso ?? null,
    registrationUrl: r.registration_url || seedEvent?.registrationUrl || null,
  };
};

function mergeWithSeed(dbEvents: EventItem[]): EventItem[] {
  const dbSlugs = new Set(dbEvents.map((e) => e.slug));
  return [...dbEvents, ...seedEvents.filter((e) => !dbSlugs.has(e.slug))];
}

export const fetchAllEvents = async (): Promise<EventItem[]> => {
  try {
    const { data } = await fetchEventsFromApi();
    return mergeWithSeed((data ?? []).map(mapRow));
  } catch {
    return seedEvents;
  }
};

export const fetchEventBySlug = async (slug: string): Promise<EventItem | undefined> => {
  try {
    const { data } = await fetchEventBySlugFromApi(slug);
    if (data) return mapRow(data);
  } catch {
    // fall through to seed
  }
  return seedEvents.find((e) => e.slug === slug);
};

export const getEventBySlug = (slug: string) => seedEvents.find((e) => e.slug === slug);
