import { useCallback, useEffect, useState } from "react";
import { Link, useParams, Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  Users,
  Ticket,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { fetchEventBySlug, type EventItem } from "@/data/events";
import eventsImg from "@/assets/events.jpg";
import { toast } from "@/hooks/use-toast";
import { ApiError, submitMemberRsvp } from "@/lib/api";
import { isMemberAuthenticated } from "@/lib/auth";
import { openAuthDialog } from "@/lib/auth-ui";
import { profileCompletionUrl } from "@/lib/member-profile";
import EventSummaryDetail from "@/pages/EventSummaryDetail";
import { getEventSummaryByEventSlug } from "@/data/eventSummaries";

type EventSearchContent = {
  title: string;
  description: string;
  audienceHeading: string;
  audience: string;
  valueHeading: string;
  value: string;
  faqs: { question: string; answer: string }[];
  related: { slug: string; label: string; description: string };
};

const eventSearchContent: Record<string, EventSearchContent> = {
  "founders-pitch-mix-2026-09-22": {
    title: "Scaling Securely: Cloud & AI Security for Startups | Sep 22",
    description:
      "Join StartupA2Z and Wiz on September 22, 2026, at Hacker Dojo in Mountain View for a practical Cloud and AI security session with Kevin Cooke.",
    audienceHeading: "Who should attend",
    audience:
      "This session is for founders, CTOs, heads of engineering, and technical leaders who need to strengthen cloud and AI security while keeping product and engineering teams moving quickly.",
    valueHeading: "What the session will cover",
    value:
      "Learn how modern cloud architecture changes the security model, how to inject security from code to cloud without slowing delivery, and how early security investment can reduce risk and help startups accelerate enterprise sales.",
    faqs: [
      {
        question: "What Cloud and AI security events are happening in Mountain View in September 2026?",
        answer:
          "StartupA2Z and Wiz are hosting Scaling Securely: Cloud & AI Security for Fast-Moving Startups at Hacker Dojo in Mountain View on September 22, 2026, from 5:00 PM to 8:00 PM.",
      },
      {
        question: "Who should attend the StartupA2Z and Wiz session?",
        answer:
          "The session is designed for startup founders, CTOs, heads of engineering, and technical leaders responsible for building and scaling cloud-based products.",
      },
      {
        question: "What will Kevin Cooke cover?",
        answer:
          "The discussion covers the Wiz story and modern cloud architecture, cloud security without reduced engineering velocity, code-to-cloud security, startup ROI, enterprise sales, and an open founder Q&A.",
      },
      {
        question: "What is the format of the September 22 security session?",
        answer:
          "The core program is a 60-to-90-minute presentation and open discussion, followed by networking with founders and technical leaders.",
      },
    ],
    related: {
      slug: "founders-pitch-mix-2026-09-29",
      label: "September 29: Founders Pitch & Startup Networking",
      description: "Continue the conversation at the next StartupA2Z founder event at Hacker Dojo.",
    },
  },
  "founders-pitch-mix-2026-08-25": {
    title: "Bay Area Founder Pitch & Networking | Aug 25",
    description:
      "Join StartupA2Z on August 25, 2026, at Hacker Dojo in Mountain View for a free Bay Area founder pitch, feedback, and startup networking event.",
    audienceHeading: "Who should attend",
    audience:
      "This Mountain View startup event is for founders, aspiring entrepreneurs, builders, operators, investors, mentors, and ecosystem partners who want practical learning, direct feedback, and useful Silicon Valley connections.",
    valueHeading: "What happens at Founders Pitch & Mix",
    value:
      "The evening combines founder networking, practical startup fundamentals, scheduled founder showcases, short audience pitches, and direct community feedback. It is designed for useful conversations and specific learning—not passive business-card collecting.",
    faqs: [
      {
        question: "What Bay Area founder events are happening on August 25, 2026?",
        answer:
          "StartupA2Z is hosting Founders Pitch & Mix, a free Bay Area founder pitch and startup networking event at Hacker Dojo in Mountain View on August 25, 2026, from 5:00 PM to 8:00 PM.",
      },
      {
        question: "Who should attend the August 25 StartupA2Z event?",
        answer:
          "The event is for founders, aspiring entrepreneurs, builders, operators, investors, mentors, and startup ecosystem partners interested in practical startup learning, feedback, and Bay Area connections.",
      },
      {
        question: "Can founders pitch at Founders Pitch & Mix?",
        answer:
          "The program includes scheduled founder showcases and short audience-pitch segments with direct feedback. Pitch participation is limited by the agenda, so attendees should register in advance and follow the organizer's instructions.",
      },
      {
        question: "Is the August 25 Mountain View startup event free?",
        answer:
          "Yes. The event is free and takes place at Hacker Dojo, 855 Maude Avenue in Mountain View. Advance registration is available through the official Luma event page while space remains available.",
      },
    ],
    related: {
      slug: "founder-networking-workshop-2026-09-01",
      label: "September 1: Founder Networking & GTM Workshop",
      description: "Continue with a hands-on go-to-market workshop for founders at Hacker Dojo.",
    },
  },
  "founder-networking-workshop-2026-09-01": {
    title: "Bay Area Founder Networking & GTM Workshop | Sep 1",
    description:
      "Join StartupA2Z on September 1, 2026, at Hacker Dojo in Mountain View for a free Bay Area founder networking event and hands-on GTM workshop.",
    audienceHeading: "Who should attend",
    audience:
      "This Mountain View startup event is for founders, aspiring entrepreneurs, builders, operators, investors, mentors, and GTM leaders looking for practical learning and useful Silicon Valley connections.",
    valueHeading: "What founders will work on",
    value:
      "Clarify your ideal customer, recognize buyer-readiness signals, sharpen differentiation, define your category and budget competition, and express the same value consistently across your go-to-market motion.",
    faqs: [
      {
        question: "What founder networking events are happening in Mountain View in September 2026?",
        answer:
          "StartupA2Z is hosting a free Bay Area founder networking event and startup workshop at Hacker Dojo in Mountain View on September 1, 2026, from 5:00 PM to 8:00 PM.",
      },
      {
        question: "Who should attend the StartupA2Z founder networking event?",
        answer:
          "The event is designed for startup founders, aspiring entrepreneurs, builders, operators, investors, mentors, and go-to-market leaders who want practical learning and meaningful Bay Area connections.",
      },
      {
        question: "What will founders learn at the September 1 startup workshop?",
        answer:
          "The hands-on workshop covers ideal customer definition, buyer-readiness signals, differentiation, category and budget competition, positioning, and consistent value communication.",
      },
      {
        question: "Is the Mountain View startup event free?",
        answer:
          "Yes. General admission is free, and advance registration is available through the official Luma event page while space remains available.",
      },
    ],
    related: {
      slug: "founders-pitch-mix-2026-08-25",
      label: "August 25: Founders Pitch & Startup Networking",
      description: "Meet Bay Area founders, watch startup pitches, and hear direct community feedback.",
    },
  },
};

const EventDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventItem | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpConfirmed, setRsvpConfirmed] = useState(false);
  const [authVersion, setAuthVersion] = useState(0);

  useEffect(() => {
    let active = true;
    if (!slug) return;
    setLoading(true);
    fetchEventBySlug(slug).then((e) => {
      if (active) {
        setEvent(e);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    const refreshAuth = () => setAuthVersion((version) => version + 1);
    window.addEventListener("startupa2z-auth-change", refreshAuth);
    return () => window.removeEventListener("startupa2z-auth-change", refreshAuth);
  }, []);

  const confirmMemberRsvp = useCallback(async () => {
    if (!event || rsvpSubmitting || rsvpConfirmed) return;
    setRsvpSubmitting(true);
    try {
      await submitMemberRsvp({ event_id: event.id ?? null, event_slug: event.slug, event_title: event.title });
      setRsvpConfirmed(true);
      toast({ title: "RSVP confirmed!", description: `You're registered for ${event.title}.` });
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setRsvpConfirmed(true);
        toast({ title: "Already registered", description: "You are already on the guest list for this event." });
      } else if (error instanceof ApiError && error.status === 428) {
        navigate(profileCompletionUrl(`${location.pathname}?rsvp=1`));
      } else {
        toast({ title: "RSVP failed", description: error instanceof ApiError ? error.message : "Please try again.", variant: "destructive" });
      }
    } finally {
      setRsvpSubmitting(false);
    }
  }, [event, location.pathname, navigate, rsvpConfirmed, rsvpSubmitting]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (!event || params.get("rsvp") !== "1") return;
    if (!isMemberAuthenticated()) {
      openAuthDialog("signin", `${location.pathname}?rsvp=1`);
      return;
    }
    params.delete("rsvp");
    navigate(`${location.pathname}${params.toString() ? `?${params}` : ""}`, { replace: true });
    void confirmMemberRsvp();
  }, [authVersion, confirmMemberRsvp, event, location.pathname, location.search, navigate]);

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-muted-foreground animate-pulse">Loading event…</p>
        </div>
      </PageLayout>
    );
  }
  if (!event) return <Navigate to="/events" replace />;

  const eventSummary = getEventSummaryByEventSlug(event.slug);
  if (eventSummary) return <EventSummaryDetail summarySlug={eventSummary.slug} />;

  const searchContent = eventSearchContent[event.slug];
  const eventCanonical = `https://startupa2z.org/events/${event.slug}`;
  const absoluteImage = event.imageUrl
    ? event.imageUrl.startsWith("http")
      ? event.imageUrl
      : `https://startupa2z.org${event.imageUrl}`
    : "https://startupa2z.org/assets/og-event.jpg";
  const postalAddress = {
    "@type": "PostalAddress",
    streetAddress: "855 Maude Ave",
    addressLocality: "Mountain View",
    addressRegion: "CA",
    postalCode: "94043",
    addressCountry: "US",
  };

  const handleRsvp = () => {
    if (isMemberAuthenticated()) {
      void confirmMemberRsvp();
      return;
    }
    openAuthDialog("signin", `${location.pathname}?rsvp=1`);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: event.title, text: event.desc, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied",
          description: "Event link copied to clipboard.",
        });
      }
    } catch {
      // user cancelled
    }
  };

  return (
    <PageLayout>
      <SEO
        title={
          searchContent
            ? searchContent.title
            : event.slug === "startup-a-to-z-hacker-dojo-august-12"
            ? `${event.title} — Aug 12 | StartupA2Z.org`
            : `${event.title} | ${event.date.replace(", 2026", "")} | StartupA2Z.org`
        }
        description={
          searchContent
            ? searchContent.description
            : event.desc ||
          event.longDesc?.slice(0, 155) ||
          "Startup event in the Bay Area"
        }
        canonical={eventCanonical}
        ogImage={absoluteImage}
        ogType="event"
        jsonLd={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Event",
              "@id": `${eventCanonical}#event`,
              name: event.title,
              startDate: event.startDateIso || event.date,
              endDate: event.endDateIso || undefined,
              eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
              eventStatus: "https://schema.org/EventScheduled",
              description: event.longDesc || event.desc,
              mainEntityOfPage: eventCanonical,
              isAccessibleForFree: event.price.toLowerCase() === "free",
              audience: {
                "@type": "Audience",
                audienceType: "Startup founders, entrepreneurs, builders, operators, investors, and mentors",
              },
              location: {
                "@type": "Place",
                name: event.venue,
                address: event.address.includes("Mountain View") ? postalAddress : event.address,
              },
              image: [absoluteImage],
              url: eventCanonical,
              organizer: {
                "@type": "Organization",
                "@id": "https://startupa2z.org/#org",
                name: "StartupA2Z.org",
                url: "https://startupa2z.org/",
              },
              performer: event.speakers.map((speaker) => ({
                "@type": "Person",
                name: speaker.name,
                description: speaker.role,
              })),
              offers: {
                "@type": "Offer",
                url: event.registrationUrl || eventCanonical,
                price: event.price.toLowerCase() === "free" ? 0 : event.price,
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
              },
            },
            ...(searchContent
              ? [{
                  "@type": "FAQPage",
                  "@id": `${eventCanonical}#faq`,
                  mainEntity: searchContent.faqs.map((faq) => ({
                    "@type": "Question",
                    name: faq.question,
                    acceptedAnswer: { "@type": "Answer", text: faq.answer },
                  })),
                }, {
                  "@type": "BreadcrumbList",
                  "@id": `${eventCanonical}#breadcrumb`,
                  itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home", item: "https://startupa2z.org/" },
                    { "@type": "ListItem", position: 2, name: "Bay Area Startup Events", item: "https://startupa2z.org/events" },
                    { "@type": "ListItem", position: 3, name: event.title, item: eventCanonical },
                  ],
                }]
              : []),
          ],
        }}
      />
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ paddingTop: "calc(64px + clamp(2rem, 5vw, 4rem))" }}
      >
        <div className="absolute inset-0 gradient-hero-solid -z-10" />
        <div className="container-narrow pb-[clamp(3rem,6vw,5rem)]">
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to events
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full bg-white/10 text-secondary">
                {event.type}
              </span>
              {event.featured && (
                <span className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full bg-secondary/20 text-secondary">
                  Featured
                </span>
              )}
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 max-w-3xl">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-white/80 text-sm">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {event.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> {event.time}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {event.venue}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main */}
            <div className="order-2 space-y-10 lg:order-1 lg:col-span-2">
              <motion.img
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                src={event.imageUrl || eventsImg}
                alt={event.title}
                className="mx-auto h-auto w-full max-w-[520px] rounded-2xl object-contain shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
                loading="lazy"
              />

              <div>
                <h2 className="font-heading text-2xl font-bold text-primary mb-4">
                  About this event
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {event.longDesc}
                </p>
              </div>

              {searchContent && (
                <div className="grid gap-6 sm:grid-cols-2">
                  <article className="rounded-2xl border border-border bg-card p-6">
                    <h2 className="font-heading text-xl font-bold text-primary">
                      {searchContent.audienceHeading}
                    </h2>
                    <p className="mt-3 leading-7 text-muted-foreground">
                      {searchContent.audience}
                    </p>
                  </article>
                  <article className="rounded-2xl border border-border bg-card p-6">
                    <h2 className="font-heading text-xl font-bold text-primary">
                      {searchContent.valueHeading}
                    </h2>
                    <p className="mt-3 leading-7 text-muted-foreground">
                      {searchContent.value}
                    </p>
                  </article>
                </div>
              )}

              {event.agenda.length > 0 && (
                <div>
                  <h2 className="font-heading text-2xl font-bold text-primary mb-4">
                    Agenda
                  </h2>
                  <ul className="space-y-3">
                    {event.agenda.map((a, i) => (
                      <li
                        key={i}
                        className="flex gap-4 p-4 rounded-xl bg-muted/40 border border-border"
                      >
                        <span className="font-semibold text-secondary min-w-[80px]">
                          {a.time}
                        </span>
                        <span className="text-foreground">{a.item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {event.speakers.length > 0 && (
                <div>
                  <h2 className="font-heading text-2xl font-bold text-primary mb-4">
                    Speakers & hosts
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {event.speakers.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-bold">
                          {s.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="font-semibold text-primary">
                            {s.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {s.role}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchContent && (
                <section aria-label="Founder networking event frequently asked questions">
                  <h2 className="font-heading text-2xl font-bold text-primary mb-4">
                    Bay Area Founder Event FAQ
                  </h2>
                  <div className="space-y-4">
                    {searchContent.faqs.map((faq) => (
                      <article key={faq.question} className="rounded-xl border border-border bg-card p-5">
                        <h3 className="font-heading text-lg font-bold text-primary">{faq.question}</h3>
                        <p className="mt-2 leading-7 text-muted-foreground">{faq.answer}</p>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {searchContent && (
                <section className="rounded-2xl border border-secondary/30 bg-secondary/5 p-6" aria-label="Related Bay Area founder event">
                  <p className="text-xs font-semibold uppercase tracking-widest text-secondary">Related Bay Area event</p>
                  <h2 className="mt-2 font-heading text-xl font-bold text-primary">
                    <Link className="hover:underline" to={`/events/${searchContent.related.slug}`}>
                      {searchContent.related.label}
                    </Link>
                  </h2>
                  <p className="mt-2 leading-7 text-muted-foreground">{searchContent.related.description}</p>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="order-1 lg:order-2 lg:col-span-1">
              <div className="sticky top-24 flex flex-col rounded-2xl border border-border bg-card p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                <div className="order-2 mt-6 space-y-4 lg:order-1 lg:mb-6 lg:mt-0">
                  <div className="flex items-start gap-3">
                    <Ticket className="w-5 h-5 text-secondary mt-0.5" />
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        Price
                      </div>
                      <div className="font-semibold text-primary">
                        {event.price}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-secondary mt-0.5" />
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        Availability
                      </div>
                      {event.spots > 0 ? (
                        <div className="font-semibold text-primary">
                          {event.spots} spots left
                        </div>
                      ) : (
                        <div className="font-semibold text-primary">
                          Open registration
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-secondary mt-0.5" />
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        Location
                      </div>
                      <div className="font-semibold text-primary">
                        {event.venue}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {event.address}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Tag className="w-5 h-5 text-secondary mt-0.5" />
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        Category
                      </div>
                      <div className="font-semibold text-primary">
                        {event.type}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="order-1 lg:order-2">
                  {event.registrationUrl ? (
                    <Button asChild className="w-full rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                      <a href={event.registrationUrl} target="_blank" rel="noreferrer">
                        Register on Luma
                      </a>
                    </Button>
                  ) : (
                    <Button
                      onClick={handleRsvp}
                      disabled={rsvpSubmitting || rsvpConfirmed}
                      className="w-full rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    >
                      {rsvpConfirmed ? "RSVP Confirmed" : rsvpSubmitting ? "Confirming…" : "RSVP Now"}
                    </Button>
                  )}
                </div>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="order-3 mt-2 w-full rounded-full"
                >
                  <Share2 className="w-4 h-4 mr-2" /> Share event
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>

    </PageLayout>
  );
};

export default EventDetail;
