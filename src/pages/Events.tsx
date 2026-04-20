import { useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/SectionHeading";
import AnimatedCard from "@/components/AnimatedCard";
import CTABanner from "@/components/CTABanner";
import RSVPDialog from "@/components/RSVPDialog";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Tag, List, Grid3X3, ArrowRight } from "lucide-react";
import eventsImg from "@/assets/events.jpg";
import { events, type EventItem } from "@/data/events";

const Events = () => {
  const [view, setView] = useState<"list" | "grid">("grid");
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const openRSVP = (e: React.MouseEvent, event: EventItem) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedEvent(event);
    setRsvpOpen(true);
  };

  const featured = events.find((e) => e.slug === "bay-area-startup-summit") ?? events[0];

  return (
    <PageLayout>
      <section className="section-padding gradient-hero-solid text-center" style={{ paddingTop: "calc(64px + clamp(3rem, 6vw, 5rem))" }}>
        <div className="container-narrow">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full bg-white/10 text-secondary">Events</span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">Meetups & Events</h1>
            <p className="text-lg text-white/70 max-w-xl mx-auto">Network, learn, and pitch at Bay Area startup events designed for founders, investors, and builders.</p>
          </motion.div>
        </div>
      </section>

      {/* Featured Event */}
      <section className="section-padding">
        <div className="container-narrow">
          <SectionHeading tag="Featured Event" title={featured.title} description="Don't miss the biggest startup community event of the season." />
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl overflow-hidden glass-card">
            <div className="grid md:grid-cols-2">
              <Link to={`/events/${featured.slug}`} className="block">
                <img src={eventsImg} alt={`${featured.title} event`} className="w-full h-64 md:h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" width={1280} height={720} />
              </Link>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <span className="text-xs font-semibold tracking-widest uppercase text-secondary mb-2">{featured.date}</span>
                <Link to={`/events/${featured.slug}`} className="hover:underline underline-offset-4 decoration-secondary">
                  <h3 className="font-heading text-2xl font-bold text-primary mb-3">{featured.title}</h3>
                </Link>
                <p className="text-muted-foreground mb-4">{featured.longDesc}</p>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {featured.time}</div>
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {featured.venue}</div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={(e) => openRSVP(e, featured)} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-8">RSVP Now</Button>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link to={`/events/${featured.slug}`}>View details <ArrowRight className="w-4 h-4 ml-1" /></Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* All Events */}
      <section className="section-padding bg-muted/50">
        <div className="container-narrow">
          <div className="flex items-center justify-between mb-10">
            <SectionHeading tag="Schedule" title="Upcoming Events" center={false} />
            <div className="flex gap-1 bg-card rounded-lg p-1 border border-border">
              <button onClick={() => setView("grid")} className={`p-2 rounded-md ${view === "grid" ? "bg-muted" : ""}`} aria-label="Grid view"><Grid3X3 className="w-4 h-4" /></button>
              <button onClick={() => setView("list")} className={`p-2 rounded-md ${view === "list" ? "bg-muted" : ""}`} aria-label="List view"><List className="w-4 h-4" /></button>
            </div>
          </div>

          <div className={view === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
            {events.map((e, i) => (
              <Link key={e.slug} to={`/events/${e.slug}`} className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-2xl">
                <AnimatedCard delay={i * 0.08} className={`h-full transition-all group-hover:-translate-y-1 group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.09)] ${view === "list" ? "flex flex-col md:flex-row md:items-center md:justify-between gap-4" : ""}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-medium text-secondary">{e.date}</span>
                      {e.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-medium">Featured</span>}
                    </div>
                    <h3 className="font-heading font-semibold text-primary mb-1 group-hover:text-secondary transition-colors">{e.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{e.desc}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {e.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {e.venue}</span>
                      <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {e.type}</span>
                    </div>
                  </div>
                  <Button onClick={(ev) => openRSVP(ev, e)} size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full mt-4 md:mt-0 w-fit">RSVP</Button>
                </AnimatedCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABanner title="Want to Host an Event?" description="Partner with Startupa2z to host meetups, workshops, or pitch nights for the Bay Area community." primaryCTA="Get in Touch" />
      <RSVPDialog open={rsvpOpen} onOpenChange={setRsvpOpen} event={selectedEvent} />
    </PageLayout>
  );
};

export default Events;
