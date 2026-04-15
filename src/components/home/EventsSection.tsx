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
  <section className="py-24 md:py-32 px-4 bg-background">
    <div className="container-narrow">
      <div className="flex items-end justify-between mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight"
        >
          Upcoming Events
        </motion.h2>
        <Link
          to="/events"
          className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:text-secondary transition-colors"
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
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-muted rounded-xl p-6 flex flex-col justify-between min-h-[320px] hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold tracking-[0.15em] uppercase text-primary">
                  {event.location}
                </span>
                {event.featured && (
                  <span className="text-xs font-medium tracking-wide uppercase px-2.5 py-0.5 rounded-full border border-border text-muted-foreground">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {event.date}
              </p>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3 leading-snug">
                {event.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            </div>
            <div className="flex items-center justify-between mt-6">
              <span className="text-sm font-semibold text-secondary">
                {event.spots} spots left
              </span>
              <Link
                to="/events"
                className="text-sm font-medium text-primary hover:text-secondary transition-colors flex items-center gap-1"
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
          className="text-sm font-medium text-primary hover:text-secondary transition-colors"
        >
          View all events →
        </Link>
      </div>
    </div>
  </section>
);

export default EventsSection;
