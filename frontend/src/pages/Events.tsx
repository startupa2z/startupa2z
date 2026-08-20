import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import SectionHeading from "@/components/SectionHeading";
import AnimatedCard from "@/components/AnimatedCard";
import CTABanner from "@/components/CTABanner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Clock,
  Tag,
  List,
  Grid3X3,
  ArrowRight,
} from "lucide-react";
import eventsImg from "@/assets/events.jpg";
import { fetchAllEvents, seedEvents, type EventItem } from "@/data/events";

const eventFaqs = [
  {
    question: "Where can I find founder networking events near me?",
    answer:
      "Founders in the San Francisco Bay Area can use StartupA2Z.org to find in-person founder networking events, startup workshops, and pitch sessions. Each listing shows the confirmed city, venue, date, agenda, and official registration link.",
  },
  {
    question: "Where can I find startup events in the Bay Area?",
    answer:
      "StartupA2Z.org lists upcoming Bay Area startup events for founders, builders, investors, mentors, and aspiring entrepreneurs. Each event page includes the date, venue, agenda, and registration link.",
  },
  {
    question: "What startup events are happening in Silicon Valley?",
    answer:
      "StartupA2Z.org publishes upcoming Silicon Valley startup events including founder meetups, practical workshops, pitch sessions, and tech networking events in Mountain View and nearby Bay Area cities.",
  },
  {
    question: "Are StartupA2Z.org founder events free?",
    answer:
      "Many StartupA2Z.org founder meetups and networking events are free. Check the individual event page for current pricing, capacity, and registration details.",
  },
  {
    question: "Where are StartupA2Z.org events held?",
    answer:
      "StartupA2Z.org hosts in-person startup events across the San Francisco Bay Area and Silicon Valley. Current event pages show the confirmed city and venue, including programs at Hacker Dojo in Mountain View.",
  },
  {
    question: "Can founders pitch their startups at an event?",
    answer:
      "Selected events include organized founder pitches and short audience pitch opportunities. Review the agenda and registration instructions on the event page before attending.",
  },
];

const Events = () => {
  const [view, setView] = useState<"list" | "grid">("grid");
  const [events, setEvents] = useState<EventItem[]>(seedEvents);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const schedule = searchParams.get("view") === "past" ? "past" : "upcoming";

  useEffect(() => {
    let active = true;
    fetchAllEvents().then((list) => {
      if (active) setEvents(list);
    });
    return () => {
      active = false;
    };
  }, []);

  const openRSVP = (e: React.MouseEvent, event: EventItem) => {
    e.preventDefault();
    e.stopPropagation();
    if (event.registrationUrl) {
      window.location.assign(event.registrationUrl);
      return;
    }
    navigate(`/events/${event.slug}?rsvp=1`);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isPast = (event: EventItem) => {
    const eventDate = new Date(`${event.date} 23:59:59`);
    return !Number.isNaN(eventDate.getTime()) && eventDate < today;
  };
  const visibleEvents = events
    .filter((event) => schedule === "past" ? isPast(event) : !isPast(event))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const featured =
    visibleEvents.find((e) => e.featured) ??
    visibleEvents.find((e) => e.slug === "bay-area-startup-summit") ??
    visibleEvents[0];

  return (
    <PageLayout>
      <SEO
        title={`Startup & Founder Networking Events in the Bay Area | StartupA2Z`}
        description={`Find Bay Area startup networking events, Silicon Valley founder meetups, entrepreneur workshops, pitch events, and Mountain View startup events.`}
        canonical={`https://startupa2z.org/events`}
        ogImage={`https://startupa2z.org/assets/og-events.jpg`}
        jsonLd={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": "https://startupa2z.org/events#page",
              name: "Bay Area and Silicon Valley Startup and Founder Events",
              description:
                "Upcoming startup events, founder meetups, pitch events, workshops, and networking opportunities across the Bay Area and Silicon Valley.",
              url: "https://startupa2z.org/events",
            },
            {
              "@type": "ItemList",
              name: "Upcoming StartupA2Z.org Events",
              itemListElement: events.map((event, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: event.title,
                url: `https://startupa2z.org/events/${event.slug}`,
              })),
            },
            {
              "@type": "FAQPage",
              mainEntity: eventFaqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            },
          ],
        }}
      />
      <section
        className="section-padding gradient-hero-solid text-center"
        style={{ paddingTop: "calc(64px + clamp(3rem, 6vw, 5rem))" }}
      >
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full bg-white/10 text-secondary">
              Events
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
              Bay Area Startup Networking and Founder Events
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Discover Silicon Valley founder meetups, Mountain View startup
              events, entrepreneur workshops, pitch sessions, and high-value
              tech networking across the Bay Area.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Event */}
      {schedule === "upcoming" && featured && <section className="section-padding">
        <div className="container-narrow">
          <SectionHeading
            tag="Featured Event"
            title={featured.title}
            description="Don't miss the biggest startup community event of the season."
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden glass-card"
          >
            <div className="grid md:grid-cols-2">
              <Link
                to={`/events/${featured.slug}`}
                className="flex min-h-64 items-center bg-[#5b392e] md:min-h-full"
              >
                <img
                  src={featured.imageUrl || eventsImg}
                  alt={`${featured.title} event`}
                  className="h-auto w-full object-contain transition-opacity duration-300 hover:opacity-95"
                  loading="lazy"
                  width={1280}
                  height={720}
                />
              </Link>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <span className="text-xs font-semibold tracking-widest uppercase text-secondary mb-2">
                  {featured.date}
                </span>
                <Link
                  to={`/events/${featured.slug}`}
                  className="hover:underline underline-offset-4 decoration-secondary"
                >
                  <h3 className="font-heading text-2xl font-bold text-primary mb-3">
                    {featured.title}
                  </h3>
                </Link>
                <p className="text-muted-foreground mb-4">
                  {featured.longDesc}
                </p>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> {featured.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {featured.venue}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={(e) => openRSVP(e, featured)}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-8"
                  >
                    RSVP Now
                  </Button>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link to={`/events/${featured.slug}`}>
                      View details <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>}

      {/* All Events */}
      <section className="section-padding bg-muted/50">
        <div className="container-narrow">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <SectionHeading tag="Schedule" title={schedule === "past" ? "Past Events" : "Upcoming Events"} center={false} />
              <div className="mt-4 inline-flex rounded-full border border-border bg-card p-1">
                <Link to="/events?view=upcoming" className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${schedule === "upcoming" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary"}`}>Upcoming</Link>
                <Link to="/events?view=past" className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${schedule === "past" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary"}`}>Past</Link>
              </div>
            </div>
            <div className="flex gap-1 bg-card rounded-lg p-1 border border-border">
              <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-md ${view === "grid" ? "bg-muted" : ""}`}
                aria-label="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-md ${view === "list" ? "bg-muted" : ""}`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            className={
              view === "grid"
                ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {visibleEvents.map((e, i) => (
              <Link
                key={e.slug}
                to={`/events/${e.slug}`}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-2xl"
              >
                <AnimatedCard
                  delay={i * 0.08}
                  className={`h-full overflow-hidden p-0 transition-all group-hover:-translate-y-1 group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.09)] ${view === "list" ? "flex flex-col md:flex-row md:items-stretch" : ""}`}
                >
                  <div
                    className={
                      view === "list" ? "md:w-56 md:flex-shrink-0" : ""
                    }
                  >
                    <img
                      src={e.imageUrl || eventsImg}
                      alt={`${e.title} cover`}
                      loading="lazy"
                      className={`w-full object-cover ${view === "list" ? "h-40 md:h-full" : "h-44"}`}
                    />
                  </div>
                  <div
                    className={`flex-1 p-5 ${view === "list" ? "md:flex md:items-center md:justify-between md:gap-4" : ""}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-medium text-secondary">
                          {e.date}
                        </span>
                        {e.featured && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-medium">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="font-heading font-semibold text-primary mb-1 group-hover:text-secondary transition-colors">
                        {e.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {e.desc}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {e.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {e.venue}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" /> {e.type}
                        </span>
                      </div>
                    </div>
                    {schedule === "past" ? (
                      <span className="mt-4 inline-flex w-fit items-center rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground md:mt-0">
                        View summary
                      </span>
                    ) : (
                      <Button
                        onClick={(ev) => openRSVP(ev, e)}
                        size="sm"
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full mt-4 md:mt-0 w-fit"
                      >
                        RSVP
                      </Button>
                    )}
                  </div>
                </AnimatedCard>
              </Link>
            ))}
            {visibleEvents.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
                No {schedule} events to show yet.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-padding bg-background" aria-label="Bay Area event guide">
        <div className="container-narrow">
          <SectionHeading
            tag="Bay Area Event Guide"
            title="Find the Right Founder and Startup Event"
            description="StartupA2Z.org brings founders and entrepreneurs together through practical learning, startup workshops, direct feedback, and meaningful networking across the Bay Area and Silicon Valley."
          />
          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading text-xl font-bold text-primary">Founder Networking Events in the Bay Area</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Meet founders, operators, mentors, investors, and startup builders through intentional Bay Area networking events designed for useful conversations—not business-card collecting.
              </p>
            </article>
            <article className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading text-xl font-bold text-primary">Startup Pitch Events</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Watch early-stage founders present their companies, learn how startup pitches improve, and join selected audience pitch opportunities with direct community feedback.
              </p>
            </article>
            <article className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading text-xl font-bold text-primary">Silicon Valley Founder Meetups</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Explore startup meetups, entrepreneur events, and tech networking for people across Mountain View, San Jose, San Francisco, and the wider Silicon Valley ecosystem.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/50" aria-label="Startup events frequently asked questions">
        <div className="container-narrow max-w-4xl">
          <SectionHeading
            tag="Frequently Asked Questions"
            title="Bay Area Startup Events FAQ"
            description="Quick answers for founders and builders looking for startup events, pitch nights, and networking opportunities."
          />
          <div className="grid gap-4">
            {eventFaqs.map((faq) => (
              <article key={faq.question} className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-heading text-lg font-bold text-primary">{faq.question}</h2>
                <p className="mt-2 leading-7 text-muted-foreground">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title="Want to Host an Event?"
        description="Partner with Startupa2z to host meetups, workshops, or pitch nights for the Bay Area community."
        primaryCTA="Get in Touch"
      />
    </PageLayout>
  );
};

export default Events;
