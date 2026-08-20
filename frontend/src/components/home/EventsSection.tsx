import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import { fetchAllEvents, type EventItem } from "@/data/events";
import { Loader2 } from "lucide-react";

const EventsSection = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const all = await fetchAllEvents();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const upcoming = all
        .filter((event) => {
          const eventDate = new Date(event.date);
          return !Number.isNaN(eventDate.getTime()) && eventDate >= today;
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setEvents(upcoming.slice(0, 3));
      setLoading(false);
    };

    fetchEvents();
  }, []);

  return (
    <section className="section-padding bg-background">
      <div className="container-narrow px-[clamp(1.5rem,5vw,3rem)]">
        <div className="flex items-end justify-between gap-4 mb-[clamp(2rem,4vw,3rem)]">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold tracking-[-0.025em] leading-[1.1] text-primary flex-1"
          >
            Upcoming Bay Area Startup Events
          </motion.h2>
          <Link
            to="/events"
            className="hidden md:inline-flex shrink-0 items-center gap-2 rounded-full border border-primary/30 bg-card px-5 py-2.5 text-sm font-semibold text-primary shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Browse events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <motion.article
                key={event.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group overflow-hidden rounded-2xl border-2 border-primary/15 bg-card shadow-[0_8px_28px_rgba(27,75,57,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_48px_rgba(27,75,57,0.14)]"
              >
                <Link
                  to={`/events/${event.slug}`}
                  className="block aspect-[16/9] overflow-hidden border-b border-primary/10 bg-[#f8f0e3]"
                  aria-label={`${event.title} details`}
                >
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={`${event.title} cover`}
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-primary/50">
                      <CalendarDays className="h-10 w-10" />
                    </div>
                  )}
                </Link>

                <div className="flex h-full flex-col p-[clamp(1.25rem,2.5vw,1.75rem)]">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[0.72rem] font-bold text-primary-foreground">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {event.date}
                    </span>
                    <span className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-primary/70">
                      {event.type}
                    </span>
                  </div>

                  <h3 className="text-[clamp(1.1rem,2vw,1.35rem)] font-bold leading-snug tracking-[-0.02em] text-foreground">
                    <Link to={`/events/${event.slug}`} className="hover:text-primary">
                      {event.title}
                    </Link>
                  </h3>

                  <div className="mt-4 space-y-2 border-t border-border pt-4 text-[0.84rem] text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 shrink-0 text-secondary" />
                      {event.time}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-secondary" />
                      {event.venue}
                    </p>
                  </div>

                  <div className="mt-auto pt-5">
                    <Link
                      to={`/events/${event.slug}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 text-[0.9rem] font-bold text-secondary-foreground shadow-sm transition-all hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      View event & RSVP <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        <div className="md:hidden text-center mt-8">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card px-5 py-2.5 text-sm font-semibold text-primary shadow-sm transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Browse events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
