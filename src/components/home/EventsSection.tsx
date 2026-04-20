import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { EventItem } from "@/data/events";
import { Loader2 } from "lucide-react";

const EventsSection = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (!error && data) {
        const mappedEvents: EventItem[] = data.map((r) => ({
          slug: r.slug,
          title: r.title,
          date: r.date,
          time: r.time,
          venue: r.venue,
          address: r.address ?? "",
          type: r.type,
          desc: r.description ?? "",
          longDesc: r.long_description ?? "",
          agenda: Array.isArray(r.agenda) ? r.agenda : [],
          speakers: Array.isArray(r.speakers) ? r.speakers : [],
          spots: r.spots,
          capacity: r.capacity,
          price: r.price,
          featured: r.featured,
          imageUrl: r.image_url ?? null,
        }));
        setEvents(mappedEvents);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  // Fallback to seed events if loading or no database events
  const fallbackEvents: EventItem[] = [
    {
      slug: "founder-friday-ai-edition",
      title: "Founder Friday: AI Edition",
      date: "April 18, 2026",
      time: "6:00 PM - 9:00 PM",
      venue: "SOMA, San Francisco",
      address: "475 Brannan St, San Francisco, CA 94107",
      type: "Networking",
      desc: "A networking session for AI founders in the Bay Area. Real conversations, no fluff, no pitches — just builders meeting builders.",
      longDesc: "",
      agenda: [],
      speakers: [],
      spots: 47,
      capacity: 120,
      price: "Free",
      featured: true,
      imageUrl: null,
    },
    {
      slug: "pitch-night-cleantech-startups",
      title: "Pitch Night: CleanTech",
      date: "April 25, 2026",
      time: "7:00 PM - 9:30 PM",
      venue: "Oakland Innovation Hub",
      address: "1111 Broadway, Oakland, CA 94607",
      type: "Pitch Event",
      desc: "Five CleanTech startups pitch to a panel of investors and operators. Honest feedback, real connections, potential funding.",
      longDesc: "",
      agenda: [],
      speakers: [],
      spots: 62,
      capacity: 150,
      price: "$15",
      featured: false,
      imageUrl: null,
    },
    {
      slug: "startup-coffee-chat",
      title: "Startup Coffee Chat",
      date: "May 2, 2026",
      time: "9:00 AM - 11:00 AM",
      venue: "Palo Alto",
      address: "Coupa Café, 538 Ramona St, Palo Alto, CA 94301",
      type: "Casual Meetup",
      desc: "A casual morning meetup for founders at all stages. Share what you're working on and find collaborators over great coffee.",
      longDesc: "",
      agenda: [],
      speakers: [],
      spots: 55,
      capacity: 80,
      price: "Free",
      featured: false,
      imageUrl: null,
    },
  ];

  const displayEvents = events.length > 0 ? events : fallbackEvents;

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
            Upcoming Events
          </motion.h2>
          <Link
            to="/events"
            className="hidden md:inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-primary hover:gap-2.5 transition-all"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {displayEvents.map((event, i) => (
              <motion.div
                key={event.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`rounded-2xl p-[clamp(1.5rem,3vw,2rem)] flex flex-col gap-1.5 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.09)] transition-all duration-300 ${
                  event.featured
                    ? "bg-card shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
                    : "bg-surface-1"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="label-overline">{event.venue}</span>
                  {event.featured && (
                    <span className="text-[0.58rem] font-bold tracking-[0.08em] uppercase px-2.5 py-1 rounded-full bg-primary/8 text-primary">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-[0.8rem] text-muted-foreground">
                  {event.date} · {event.time.split(" - ")[0]}
                </p>
                <h3 className="text-[clamp(1.05rem,2vw,1.3rem)] font-bold tracking-[-0.02em] text-foreground leading-snug mt-1">
                  {event.title}
                </h3>
                <p className="text-[0.875rem] text-muted-foreground leading-relaxed">
                  {event.desc}
                </p>
                <div className="flex items-center justify-between mt-auto pt-5">
                  <span className="text-[0.75rem] font-semibold text-primary">
                    {event.spots} spots left
                  </span>
                  <Link
                    to={`/events/${event.slug}`}
                    className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-primary hover:gap-2.5 transition-all"
                  >
                    RSVP <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="md:hidden text-center mt-8">
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-primary"
          >
            View all events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
