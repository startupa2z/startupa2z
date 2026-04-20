import { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import RSVPDialog from "@/components/RSVPDialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Tag, Users, Ticket, ArrowLeft, Share2 } from "lucide-react";
import { fetchEventBySlug, type EventItem } from "@/data/events";
import eventsImg from "@/assets/events.jpg";
import { toast } from "@/hooks/use-toast";

const EventDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<EventItem | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [rsvpOpen, setRsvpOpen] = useState(false);

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

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: event.title, text: event.desc, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copied", description: "Event link copied to clipboard." });
      }
    } catch {
      // user cancelled
    }
  };

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ paddingTop: "calc(64px + clamp(2rem, 5vw, 4rem))" }}>
        <div className="absolute inset-0 gradient-hero-solid -z-10" />
        <div className="container-narrow pb-[clamp(3rem,6vw,5rem)]">
          <Link to="/events" className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to events
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {event.date}</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {event.time}</span>
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {event.venue}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main */}
            <div className="lg:col-span-2 space-y-10">
              <motion.img
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                src={event.imageUrl || eventsImg}
                alt={event.title}
                className="w-full h-72 md:h-96 object-cover rounded-2xl"
                loading="lazy"
              />

              <div>
                <h2 className="font-heading text-2xl font-bold text-primary mb-4">About this event</h2>
                <p className="text-muted-foreground leading-relaxed text-base">{event.longDesc}</p>
              </div>

              {event.agenda.length > 0 && (
                <div>
                  <h2 className="font-heading text-2xl font-bold text-primary mb-4">Agenda</h2>
                  <ul className="space-y-3">
                    {event.agenda.map((a, i) => (
                      <li key={i} className="flex gap-4 p-4 rounded-xl bg-muted/40 border border-border">
                        <span className="font-semibold text-secondary min-w-[80px]">{a.time}</span>
                        <span className="text-foreground">{a.item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {event.speakers.length > 0 && (
                <div>
                  <h2 className="font-heading text-2xl font-bold text-primary mb-4">Speakers & hosts</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {event.speakers.map((s, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-bold">
                          {s.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <div className="font-semibold text-primary">{s.name}</div>
                          <div className="text-sm text-muted-foreground">{s.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Ticket className="w-5 h-5 text-secondary mt-0.5" />
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Price</div>
                      <div className="font-semibold text-primary">{event.price}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-secondary mt-0.5" />
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Availability</div>
                      {event.spots <= 0 ? (
                        <div className="font-semibold text-destructive">Sold out</div>
                      ) : (
                        <div className="font-semibold text-primary">{event.spots} spots left</div>
                      )}
                      <div className="text-xs text-muted-foreground">of {event.capacity} total</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-secondary mt-0.5" />
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Location</div>
                      <div className="font-semibold text-primary">{event.venue}</div>
                      <div className="text-xs text-muted-foreground">{event.address}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Tag className="w-5 h-5 text-secondary mt-0.5" />
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Category</div>
                      <div className="font-semibold text-primary">{event.type}</div>
                    </div>
                  </div>
                </div>

                {event.spots <= 0 ? (
                  <Button disabled className="w-full rounded-full mb-2 bg-muted text-muted-foreground hover:bg-muted">
                    Sold out
                  </Button>
                ) : (
                  <Button onClick={() => setRsvpOpen(true)} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full mb-2">
                    RSVP Now
                  </Button>
                )}
                <Button onClick={handleShare} variant="outline" className="w-full rounded-full">
                  <Share2 className="w-4 h-4 mr-2" /> Share event
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <RSVPDialog open={rsvpOpen} onOpenChange={setRsvpOpen} event={event} />
    </PageLayout>
  );
};

export default EventDetail;
