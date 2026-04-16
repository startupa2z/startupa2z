import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/SectionHeading";
import AnimatedCard from "@/components/AnimatedCard";
import CTABanner from "@/components/CTABanner";
import RSVPDialog from "@/components/RSVPDialog";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Tag, List, Grid3X3 } from "lucide-react";
import eventsImg from "@/assets/events.jpg";

type EventItem = { title: string; date: string; time: string; venue: string; type: string; desc: string; featured: boolean };

const events = [
  { title: "Founder Friday: AI Edition", date: "April 18, 2026", time: "6:00 PM - 9:00 PM", venue: "SOMA, San Francisco", type: "Networking", desc: "Connect with AI founders, demo products, and discuss the future of artificial intelligence in the Bay Area.", featured: true },
  { title: "Pitch Night: CleanTech Startups", date: "April 25, 2026", time: "7:00 PM - 9:30 PM", venue: "Oakland Innovation Hub", type: "Pitch Event", desc: "Watch 8 CleanTech startups pitch to a panel of investors. Audience voting and networking to follow.", featured: false },
  { title: "Startup Coffee Chat", date: "May 2, 2026", time: "9:00 AM - 11:00 AM", venue: "Palo Alto", type: "Casual Meetup", desc: "An informal morning session for founders to share progress, challenges, and advice over coffee.", featured: false },
  { title: "Investor Office Hours", date: "May 8, 2026", time: "2:00 PM - 5:00 PM", venue: "Financial District, SF", type: "Mentorship", desc: "30-minute 1-on-1 sessions with angel investors and VCs. Apply to present your startup.", featured: false },
  { title: "Bay Area Startup Summit", date: "May 20, 2026", time: "10:00 AM - 6:00 PM", venue: "Moscone Center, SF", type: "Conference", desc: "The biggest Startupa2z event of the quarter. Keynotes, panels, pitch competition, and networking.", featured: true },
  { title: "Co-Founder Speed Dating", date: "June 1, 2026", time: "6:30 PM - 8:30 PM", venue: "Berkeley", type: "Networking", desc: "Meet potential co-founders in structured speed-dating style sessions. Engineers, designers, and business minds.", featured: false },
];

const Events = () => {
  const [view, setView] = useState<"list" | "grid">("grid");
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const openRSVP = (event: EventItem) => {
    setSelectedEvent(event);
    setRsvpOpen(true);
  };


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
          <SectionHeading tag="Featured Event" title="Bay Area Startup Summit" description="Don't miss the biggest startup community event of the season." />
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl overflow-hidden glass-card">
            <div className="grid md:grid-cols-2">
              <img src={eventsImg} alt="Startup Summit event" className="w-full h-64 md:h-full object-cover" loading="lazy" width={1280} height={720} />
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <span className="text-xs font-semibold tracking-widest uppercase text-secondary mb-2">May 20, 2026</span>
                <h3 className="font-heading text-2xl font-bold text-primary mb-3">Bay Area Startup Summit</h3>
                <p className="text-muted-foreground mb-4">Keynotes from industry leaders, live pitch competition, investor panels, and an incredible networking experience. 500+ attendees expected.</p>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> 10:00 AM - 6:00 PM</div>
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Moscone Center, San Francisco</div>
                </div>
                <Button onClick={() => openRSVP(events[4])} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full w-fit px-8">RSVP Now</Button>
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
              <button onClick={() => setView("grid")} className={`p-2 rounded-md ${view === "grid" ? "bg-muted" : ""}`}><Grid3X3 className="w-4 h-4" /></button>
              <button onClick={() => setView("list")} className={`p-2 rounded-md ${view === "list" ? "bg-muted" : ""}`}><List className="w-4 h-4" /></button>
            </div>
          </div>

          <div className={view === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
            {events.map((e, i) => (
              <AnimatedCard key={i} delay={i * 0.08} className={view === "list" ? "flex flex-col md:flex-row md:items-center md:justify-between gap-4" : ""}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-medium text-secondary">{e.date}</span>
                    {e.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-medium">Featured</span>}
                  </div>
                  <h3 className="font-heading font-semibold text-primary mb-1">{e.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{e.desc}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {e.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {e.venue}</span>
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {e.type}</span>
                  </div>
                </div>
                <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full mt-4 md:mt-0 w-fit">RSVP</Button>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      <CTABanner title="Want to Host an Event?" description="Partner with Startupa2z to host meetups, workshops, or pitch nights for the Bay Area community." primaryCTA="Get in Touch" />
    </PageLayout>
  );
};

export default Events;
