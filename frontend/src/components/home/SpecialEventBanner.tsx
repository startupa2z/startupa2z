import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, MapPin, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { getEventBySlug, type EventItem } from "@/data/events";

type FeaturedSlide = {
  event: EventItem;
  eyebrow: string;
  speakerLine: string;
  imageAlt: string;
  bannerImageUrl?: string;
  icon: typeof Users;
};

const featuredSlides: FeaturedSlide[] = [
  {
    event: getEventBySlug("founders-pitch-mix-2026-09-15")!,
    eyebrow: "September 15 at Hacker Dojo",
    speakerLine: "Masterclass with Vivek Somani",
    imageAlt: "StartupA2Z Seed to Series C founder finance masterclass with Vivek Somani",
    icon: Users,
  },
  {
    event: getEventBySlug("founders-pitch-mix-2026-09-22")!,
    eyebrow: "September 22 at Hacker Dojo",
    speakerLine: "The Wiz Story with Daniel Slayton",
    imageAlt: "StartupA2Z special session for founders: The Wiz Story with Daniel Slayton",
    bannerImageUrl: "/event-covers/startupa2z-daniel-slayton-wiz-story-september-22-2026-banner-v2.png?v=20260910",
    icon: ShieldCheck,
  },
].filter((slide) => Boolean(slide.event));

const SpecialEventBanner = () => {
  const availableSlides = featuredSlides.filter((slide) => {
    const eventEnd = slide.event.endDateIso ? new Date(slide.event.endDateIso).getTime() : null;
    return !eventEnd || Date.now() <= eventEnd;
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (activeIndex >= availableSlides.length) setActiveIndex(0);
  }, [activeIndex, availableSlides.length]);

  useEffect(() => {
    if (paused || availableSlides.length < 2) return;
    const timer = window.setInterval(
      () => setActiveIndex((current) => (current + 1) % availableSlides.length),
      7000,
    );
    return () => window.clearInterval(timer);
  }, [availableSlides.length, paused]);

  if (availableSlides.length === 0) return null;

  const activeSlide = availableSlides[activeIndex] ?? availableSlides[0];
  const { event, eyebrow, speakerLine, imageAlt, bannerImageUrl, icon: EyebrowIcon } = activeSlide;
  const showControls = availableSlides.length > 1;
  const selectRelativeSlide = (offset: number) => {
    setActiveIndex((current) => (current + offset + availableSlides.length) % availableSlides.length);
  };

  return (
    <aside
      aria-label="Featured StartupA2Z events"
      className="relative z-10 w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="container-narrow px-[clamp(1.5rem,5vw,3rem)]">
        <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-[hsl(226,73%,10%)] shadow-[0_20px_55px_rgba(0,0,0,0.32)]">
          <div key={event.slug} className="animate-in fade-in duration-500">
            <div className="grid min-h-[132px] md:grid-cols-[minmax(260px,0.85fr)_minmax(0,1.35fr)]">
              <Link
                to={`/events/${event.slug}`}
                aria-label={`View ${event.title}`}
                className="group relative hidden aspect-[2.2/1] overflow-hidden border-r border-white/10 bg-[hsl(226,73%,10%)] md:block"
              >
                <img
                  src={bannerImageUrl || event.imageUrl || ""}
                  alt={imageAlt}
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.015]"
                  width={1600}
                  height={900}
                />
                <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-[hsl(226,73%,10%)]" />
              </Link>

              <div className="flex flex-col gap-4 p-5 pb-11 sm:p-6 sm:pb-11 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-secondary">
                    <EyebrowIcon className="h-3.5 w-3.5" />
                    {eyebrow}
                  </div>
                  <h2 className="mt-1 font-heading text-xl font-extrabold leading-tight text-white sm:text-2xl">
                    {event.title}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-sm font-medium text-white/75">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-secondary" />
                      {event.date.replace(", 2026", "")} | {event.time.replace(" PM - ", "-")}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-secondary" />
                      Hacker Dojo | Mountain View
                    </span>
                    <span className="font-bold text-secondary">{speakerLine}</span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <Link
                    to={`/events/${event.slug}`}
                    className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-white/20"
                  >
                    View event
                  </Link>
                  <a
                    href={event.registrationUrl || `/events/${event.slug}`}
                    target={event.registrationUrl ? "_blank" : undefined}
                    rel={event.registrationUrl ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-secondary px-4 py-2.5 text-xs font-bold text-white shadow-[0_8px_24px_rgba(232,137,26,0.3)] transition-all hover:-translate-y-0.5 hover:bg-[hsl(30,100%,58%)]"
                  >
                    Register free <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {showControls && (
            <div className="absolute inset-x-0 bottom-1.5 flex items-center justify-center gap-1" aria-label="Choose featured event">
              <button type="button" onClick={() => selectRelativeSlide(-1)} className="flex h-8 w-8 items-center justify-center rounded-full text-white/65 transition hover:bg-white/10 hover:text-white" aria-label="Show previous featured event">
                <ChevronLeft className="h-4 w-4" />
              </button>
              {availableSlides.map((slide, index) => (
                <button
                  type="button"
                  key={slide.event.slug}
                  onClick={() => setActiveIndex(index)}
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  aria-label={`Show ${slide.event.title}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                >
                  <span className={`h-2 rounded-full transition-all ${index === activeIndex ? "w-5 bg-secondary" : "w-2 bg-white/45 hover:bg-white/70"}`} />
                </button>
              ))}
              <button type="button" onClick={() => selectRelativeSlide(1)} className="flex h-8 w-8 items-center justify-center rounded-full text-white/65 transition hover:bg-white/10 hover:text-white" aria-label="Show next featured event">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SpecialEventBanner;
