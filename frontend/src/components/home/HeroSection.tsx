import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Camera, ChevronLeft, ChevronRight, Linkedin, Instagram, Facebook, MapPin, Mic2, Plus } from "lucide-react";
import { X as XIcon } from "lucide-react";
import { fetchAllEvents, type EventItem } from "@/data/events";
import heroBg from "@/assets/hero-bg.jpg";
import { fetchHomeStats, type HomeStats } from "@/lib/api";
import SpecialEventBanner from "./SpecialEventBanner";

const socialLinks = [
  { href: "https://luma.com/startupa2z", icon: CalendarDays, label: "Luma" },
  { href: "https://linkedin.com/company/startupa2z", icon: Linkedin, label: "LinkedIn" },
  { href: "https://twitter.com/startupa2z", icon: XIcon, label: "X (Twitter)" },
  { href: "https://instagram.com/startupa2z", icon: Instagram, label: "Instagram" },
  { href: "https://facebook.com/startupa2z", icon: Facebook, label: "Facebook" },
];

const emptyStats: HomeStats = {
  active_members: 0,
  events_hosted: 0,
  page_visits: 0,
  industries: 0,
};

const galleryEvents = [
  {
    date: "September 1, 2026",
    image: "/event-gallery/2026-09-01/event-03-01.jpg",
    href: "/gallery/founder-networking-workshop-2026-09-01",
    alt: "StartupA2Z founders and builders together after the September 1 GTM workshop at Hacker Dojo",
    photoCount: 10,
  },
  {
    date: "August 25, 2026",
    image: "/event-gallery/2026-08-25/event-02-01.jpg",
    href: "/gallery/founders-pitch-mix-2026-08-25",
    alt: "StartupA2Z founders and community members together at Hacker Dojo after the August 25 event",
    photoCount: 12,
  },
  {
    date: "August 12, 2026",
    image: "/event-gallery/2026-08-12/event-01-20.jpg",
    href: "/gallery/startup-a-to-z-hacker-dojo-august-12",
    alt: "StartupA2Z founders and community members together at Hacker Dojo after the August 12 event",
    photoCount: 20,
  },
];

const HeroSection = () => {
  const [nextEvent, setNextEvent] = useState<EventItem | null>(null);
  const [homeStats, setHomeStats] = useState<HomeStats>(emptyStats);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const galleryEvent = galleryEvents[galleryIndex];

  useEffect(() => {
    const fetchNextEvent = async () => {
      const all = await fetchAllEvents();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const upcoming = all
        .filter((event) => {
          const eventDate = new Date(event.date);
          return !Number.isNaN(eventDate.getTime()) && eventDate >= today;
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setNextEvent(upcoming[0] ?? null);
    };

    fetchNextEvent();
    void fetchHomeStats()
      .then((response) => setHomeStats(response.data))
      .catch(() => setHomeStats(emptyStats));
  }, []);

  const stats = [
    { value: homeStats.active_members.toLocaleString(), suffix: "", label: "People in Network" },
    { value: homeStats.events_hosted.toLocaleString(), suffix: "", label: "Events Hosted" },
    { value: homeStats.page_visits.toLocaleString(), suffix: "", label: "Page Visits" },
    { value: "3", suffix: "+", label: "Partners" },
  ];

  return (
    <section
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
      style={{
        paddingTop: "calc(64px + clamp(1rem, 2.5vw, 1.75rem))",
        paddingBottom: "clamp(4rem, 7vw, 6rem)",
      }}
    >
      {/* Background image */}
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 gradient-hero" />

      <SpecialEventBanner />

      <div className="relative z-10 mt-[clamp(2.5rem,5vw,4.5rem)] container-narrow px-[clamp(1.5rem,5vw,3rem)] w-full">
        <div className="grid items-stretch gap-[clamp(2.5rem,4vw,4rem)] lg:grid-cols-[minmax(0,1fr)_minmax(420px,500px)]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex h-full max-w-[720px] flex-col"
          >
            {/* Title */}
            <h1
              className="mb-6 max-w-[650px] font-black leading-[0.98] tracking-[-0.04em] text-white text-[clamp(3rem,5.2vw,4.25rem)]"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.25)" }}
            >
              Startup Community
            </h1>

            {/* Tagline */}
            <div className="mb-6">
              <p className="font-heading italic text-2xl md:text-3xl font-semibold bg-gradient-to-r from-secondary to-[hsl(30,100%,58%)] text-transparent bg-clip-text">
                Bringing Seed to Success Closer
              </p>
            </div>

            {/* Body */}
            <p className="text-[clamp(0.95rem,1.4vw,1.08rem)] text-white/[0.82] max-w-[560px] mb-10 leading-[1.75]">
              <strong className="font-semibold text-white">
                Building a startup is hard, and roughly 90% don&apos;t make it.
                But the odds get better in the room with people who&apos;ve already
                cracked it.
              </strong>{" "}
              StartupA2Z connects you with the fundamentals, the mistakes, and
              the playbooks that actually worked, so your journey to success
              is shorter.
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-nowrap sm:items-center sm:gap-2.5">
              <Link
                to="/events"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-br from-secondary to-[hsl(30,100%,58%)] px-5 py-3 text-[0.82rem] font-semibold text-white shadow-[0_8px_28px_rgba(232,137,26,0.35)] transition-all hover:-translate-y-0.5 hover:opacity-90 active:scale-[0.97]"
              >
                Explore Events <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/apply-to-pitch"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/40 bg-white/10 px-5 py-3 text-[0.82rem] font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-secondary hover:bg-white/15"
              >
                <Mic2 className="h-4 w-4 text-secondary" /> Apply to Pitch
              </Link>
              <Link
                to="/startups?add=1"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/40 bg-white/10 px-5 py-3 text-[0.82rem] font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-secondary hover:bg-white/15"
              >
                <Plus className="h-4 w-4 text-secondary" /> Add Startup/Business
              </Link>
            </div>

            {/* Stats bar */}
            <ul className="mt-[clamp(2.5rem,5vw,4rem)] grid list-none grid-cols-2 gap-x-[clamp(1.5rem,4vw,3.5rem)] gap-y-5 border-t border-white/15 pt-[clamp(1.75rem,3vw,2.25rem)] md:grid-cols-4 lg:mt-auto lg:pt-8">
              {stats.map((stat, i) => (
                <motion.li
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="flex flex-col gap-1"
                >
                  <span className="text-[clamp(1.5rem,2.4vw,2rem)] font-extrabold tracking-[-0.02em] text-white leading-none">
                    {stat.value}
                    {stat.suffix && (
                      <span className="text-secondary font-bold text-[0.85em] ml-px">
                        {stat.suffix}
                      </span>
                    )}
                  </span>
                  <span className="text-[0.72rem] font-medium tracking-[0.08em] uppercase text-white/60">
                    {stat.label}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.25 }}
            className="mx-auto flex h-full w-full max-w-[500px] flex-col lg:mx-0"
          >
            {nextEvent && (
              <div
                className="group mb-4 grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl border-2 border-secondary bg-white p-4 shadow-[0_20px_55px_rgba(232,137,26,0.34)] ring-4 ring-secondary/15 backdrop-blur-[20px] transition-transform hover:-translate-y-1 sm:p-5"
              >
                <div className="min-w-0">
                  <div className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-primary">
                    Next Event
                  </div>
                  <h3 className="mt-1 line-clamp-2 text-[0.96rem] font-bold leading-snug tracking-[-0.01em] text-foreground">
                    {nextEvent.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[0.72rem] text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-secondary" />
                      {nextEvent.date} · {nextEvent.time.split(" - ")[0]}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-secondary" />
                      {nextEvent.venue}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <a
                    href={nextEvent.registrationUrl || `/events/${nextEvent.slug}`}
                    target={nextEvent.registrationUrl ? "_blank" : undefined}
                    rel={nextEvent.registrationUrl ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-secondary px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-md transition-colors hover:bg-primary"
                  >
                    {nextEvent.slug === "founder-networking-workshop-2026-09-01" ? "Waitlist" : "RSVP"}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link
                    to="/events"
                    className="inline-flex items-center justify-center rounded-full border border-primary/25 bg-primary/5 px-3 py-2 text-[0.66rem] font-bold uppercase tracking-[0.06em] text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    Explore Events
                  </Link>
                </div>
              </div>
            )}

            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-white/20 bg-black/20 shadow-[0_24px_70px_rgba(0,0,0,0.32)] lg:min-h-[390px] lg:flex-1 lg:aspect-auto">
              <Link
                key={galleryEvent.href}
                to={galleryEvent.href}
                aria-label={`Open gallery for ${galleryEvent.date}`}
                className="group absolute inset-0 block focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary"
              >
                <motion.img
                  key={galleryEvent.image}
                  src={galleryEvent.image}
                  alt={galleryEvent.alt}
                  initial={{ opacity: 0.45, scale: 1.015 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.28 }}
                  className="h-full w-full object-cover object-[center_55%] transition-transform duration-700 group-hover:scale-[1.025]"
                  width={1800}
                  height={1380}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/5 to-black/70" />
                <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-5 pr-28 sm:p-6 sm:pr-32">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                    <Camera className="h-3.5 w-3.5 text-secondary" /> From our gallery
                  </span>
                </div>
                <div className="absolute bottom-5 left-5 text-white sm:bottom-6 sm:left-6">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-secondary">Event gallery</p>
                  <p className="mt-1 font-heading text-xl font-bold sm:text-2xl">{galleryEvent.date}</p>
                  <p className="mt-1 text-xs text-white/70">{galleryEvent.photoCount} photos · Open gallery</p>
                </div>
                <span className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white shadow-lg transition-transform group-hover:translate-x-1 sm:bottom-6 sm:right-6">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>

              <div className="absolute right-5 top-5 z-10 flex items-center gap-2 sm:right-6 sm:top-6">
                <button
                  type="button"
                  onClick={() => setGalleryIndex((index) => Math.min(index + 1, galleryEvents.length - 1))}
                  disabled={galleryIndex === galleryEvents.length - 1}
                  aria-label={galleryIndex === galleryEvents.length - 1 ? "No older gallery" : `Previous gallery: ${galleryEvents[galleryIndex + 1].date}`}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur-md transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setGalleryIndex((index) => Math.max(index - 1, 0))}
                  disabled={galleryIndex === 0}
                  aria-label={galleryIndex === 0 ? "No newer gallery" : `Next gallery: ${galleryEvents[galleryIndex - 1].date}`}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur-md transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      </div>

      {/* Floating social icons — fixed left edge */}
      <div className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-px h-16 bg-foreground/15" />
          {socialLinks.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-8 h-8 rounded-full bg-background/80 hover:bg-secondary/10 backdrop-blur-sm border border-secondary/40 hover:border-secondary flex items-center justify-center text-secondary hover:text-secondary transition-all hover:-translate-y-0.5 shadow-sm"
            >
              <Icon className="w-3.5 h-3.5" />
            </a>
          ))}
          <div className="w-px h-16 bg-foreground/15" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
