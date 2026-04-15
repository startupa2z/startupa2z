import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const events = [
  {
    location: "San Francisco",
    featured: true,
    date: "April 18, 2026 · 6:30 PM",
    title: "Founder Friday: AI Edition",
    description:
      "A networking session for AI founders in the Bay Area. Real conversations, no fluff, no pitches — just builders meeting builders.",
    spots: 47,
  },
  {
    location: "Oakland",
    featured: false,
    date: "April 25, 2026 · 6:30 PM",
    title: "Pitch Night: CleanTech",
    description:
      "Five CleanTech startups pitch to a panel of investors and operators. Honest feedback, real connections, potential funding.",
    spots: 62,
  },
  {
    location: "Palo Alto",
    featured: false,
    date: "May 2, 2026 · 7:00 PM",
    title: "Startup Coffee Chat",
    description:
      "A casual morning meetup for founders at all stages. Share what you're working on and find collaborators over great coffee.",
    spots: 55,
  },
];

const EventsSection = () => (
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

      <div className="grid md:grid-cols-3 gap-5">
        {events.map((event, i) => (
          <motion.div
            key={i}
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
              <span className="label-overline">{event.location}</span>
              {event.featured && (
                <span className="text-[0.58rem] font-bold tracking-[0.08em] uppercase px-2.5 py-1 rounded-full bg-primary/8 text-primary">
                  Featured
                </span>
              )}
            </div>
            <p className="text-[0.8rem] text-muted-foreground">{event.date}</p>
            <h3 className="text-[clamp(1.05rem,2vw,1.3rem)] font-bold tracking-[-0.02em] text-foreground leading-snug mt-1">
              {event.title}
            </h3>
            <p className="text-[0.875rem] text-muted-foreground leading-relaxed">
              {event.description}
            </p>
            <div className="flex items-center justify-between mt-auto pt-5">
              <span className="text-[0.75rem] font-semibold text-primary">
                {event.spots} spots left
              </span>
              <Link
                to="/events"
                className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-primary hover:gap-2.5 transition-all"
              >
                RSVP <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

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

export default EventsSection;
