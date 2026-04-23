import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const featuredStartups = [
  {
    name: "GreenFleet",
    pitch: "Electric fleet management for last-mile delivery",
    stage: "Seed",
    tags: ["CleanTech", "Logistics"],
  },
];

const resources = [
  { type: "Playbook", title: "Writing Your First Pitch Deck", time: "8 min read" },
  { type: "Article", title: "How to Find a Technical Co-Founder", time: "6 min read" },
  { type: "Framework", title: "The Lean Canvas, Explained Simply", time: "5 min read" },
];

const StartupsSection = () => (
  <section className="section-padding bg-surface-2">
    <div className="container-narrow px-[clamp(1.5rem,5vw,3rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-[clamp(2rem,4vw,3rem)]"
      >
        <span className="label-overline-muted mb-4 block">The Startup Directory</span>
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold tracking-[-0.025em] leading-[1.1] text-primary flex-1">
            Built for builders.
          </h2>
          <Link
            to="/startups"
            className="hidden md:inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-primary hover:gap-2.5 transition-all"
          >
            Explore all startups <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
        {/* Featured large card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-foreground rounded-2xl p-[clamp(1.75rem,3vw,2.5rem)] flex flex-col justify-between min-h-[380px] text-white hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300"
        >
          <div>
            <span className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-white/40">
              Featured Startup
            </span>
            <h3 className="text-[clamp(1.2rem,2.5vw,1.65rem)] font-extrabold tracking-[-0.025em] leading-[1.2] mt-4 mb-4">
              {featuredStartups[0].name}: {featuredStartups[0].pitch}
            </h3>
            <p className="text-white/55 text-[0.9rem] leading-[1.65]">
              Discover innovative ideas from Bay Area founders ready to change the world.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            <span className="text-xs px-3 py-1 rounded-full bg-white/15 text-white font-medium">
              {featuredStartups[0].stage}
            </span>
            {featuredStartups[0].tags.map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/70"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Resource stack */}
        <div className="flex flex-col gap-4">
          {resources.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-surface-1 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300"
            >
              <span className="label-overline text-secondary">{r.type}</span>
              <h4 className="font-bold text-foreground mt-2 mb-2 text-[1rem] tracking-[-0.015em]">
                {r.title}
              </h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{r.time}</span>
                <span>·</span>
                <Link
                  to="/resources"
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:gap-2 transition-all"
                >
                  Read <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default StartupsSection;
