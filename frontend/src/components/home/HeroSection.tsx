import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Camera, Linkedin, Instagram, Facebook, MapPin } from "lucide-react";
import { X as XIcon } from "lucide-react";
import { fetchAllEvents, type EventItem } from "@/data/events";
import heroBg from "@/assets/hero-bg.jpg";
import { openAuthDialog } from "@/lib/auth-ui";
import { fetchHomeStats, type HomeStats } from "@/lib/api";

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

const featuredGallery = {
  image: "/event-gallery/2026-08-12/event-01-20.jpg",
  href: "/gallery/startup-a-to-z-hacker-dojo-august-12",
  alt: "StartupA2Z founders and community members together at Hacker Dojo",
};

const HeroSection = () => {
  const [nextEvent, setNextEvent] = useState<EventItem | null>(null);
  const [homeStats, setHomeStats] = useState<HomeStats>(emptyStats);

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
    { value: homeStats.active_members.toLocaleString(), suffix: "", label: "Active Members" },
    { value: homeStats.events_hosted.toLocaleString(), suffix: "", label: "Events Hosted" },
    { value: homeStats.page_visits.toLocaleString(), suffix: "", label: "Page Visits" },
    { value: homeStats.industries.toLocaleString(), suffix: "+", label: "Industries" },
  ];

  return (
    <section
      className="relative min-h-[100svh] flex items-center overflow-hidden"
      style={{
        paddingTop: "calc(64px + clamp(3rem, 6vw, 5rem))",
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

      <div className="relative z-10 container-narrow px-[clamp(1.5rem,5vw,3rem)] w-full">
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
              Silicon Valley
              <br />
              Starts Here.
            </h1>

            {/* Tagline */}
            <div className="mb-6">
              <p className="font-heading italic text-2xl md:text-3xl font-semibold bg-gradient-to-r from-secondary to-[hsl(30,100%,58%)] text-transparent bg-clip-text">
                From Seed to Success
              </p>
            </div>

            {/* Body */}
            <p className="text-[clamp(0.95rem,1.4vw,1.08rem)] text-white/[0.82] max-w-[560px] mb-10 leading-[1.75]">
              Building a startup is hard. Founders should not have to learn
              every lesson alone. Startupa2z brings people together so useful
              experience, advice, and connections reach founders when they
              need them.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-br from-secondary to-[hsl(30,100%,58%)] text-white text-[0.9rem] font-semibold hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.97] transition-all shadow-[0_8px_28px_rgba(232,137,26,0.35)]"
              >
                Explore Meetups <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => openAuthDialog("signup")}
                className="text-[0.9rem] font-semibold text-white hover:text-secondary/90 transition-colors"
              >
                Join the Community
              </button>
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
            <Link
              to={featuredGallery.href}
              className="group relative block aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-white/20 bg-black/20 shadow-[0_24px_70px_rgba(0,0,0,0.32)] lg:min-h-[390px] lg:flex-1 lg:aspect-auto"
            >
              <img
                src={featuredGallery.image}
                alt={featuredGallery.alt}
                className="h-full w-full object-cover object-[center_64%] transition-transform duration-700 group-hover:scale-[1.025]"
                width={1800}
                height={1380}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/10 to-black/5" />
              <div className="absolute inset-x-0 top-0 p-5 sm:p-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                  <Camera className="h-3.5 w-3.5 text-secondary" /> From our gallery
                </span>
                <p className="mt-3 max-w-[260px] font-heading text-xl font-bold leading-tight text-white sm:text-2xl">
                  Founders in the room.
                </p>
              </div>
              <span className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white shadow-lg transition-transform group-hover:translate-x-1 sm:bottom-6 sm:right-6">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            {nextEvent && (
              <Link
                to={`/events/${nextEvent.slug}`}
                className="group mt-4 grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl border border-white/40 bg-white/[0.96] p-4 shadow-[0_16px_45px_rgba(0,0,0,0.24)] backdrop-blur-[20px] transition-transform hover:-translate-y-0.5 sm:p-5"
              >
                <div className="min-w-0">
                  <div className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-primary">
                    Next Meetup
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
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors group-hover:bg-secondary">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            )}
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
