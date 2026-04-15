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
  {
    name: "MedBridge AI",
    pitch: "AI-powered clinical trial matching platform",
    stage: "Pre-Seed",
    tags: ["HealthTech", "AI"],
  },
  {
    name: "Stackbase",
    pitch: "No-code data infrastructure for SMBs",
    stage: "Series A",
    tags: ["DevTools", "SaaS"],
  },
  {
    name: "CultureSync",
    pitch: "Remote team culture analytics platform",
    stage: "Seed",
    tags: ["HR Tech", "Remote"],
  },
];

const resources = [
  { type: "Playbook", title: "Writing Your First Pitch Deck", time: "8 min read" },
  { type: "Article", title: "How to Find a Technical Co-Founder", time: "6 min read" },
  { type: "Framework", title: "The Lean Canvas, Explained Simply", time: "5 min read" },
];

const StartupsSection = () => (
  <section className="py-24 md:py-32 px-4 bg-muted">
    <div className="container-narrow">
      {/* Founder's Library style heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14"
      >
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-secondary mb-4 block">
          The Startup Directory
        </span>
        <div className="flex items-end justify-between">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">
            Built for builders.
          </h2>
          <Link
            to="/startups"
            className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:text-secondary transition-colors"
          >
            Explore all startups <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Featured large card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 bg-primary rounded-2xl p-8 flex flex-col justify-between min-h-[380px]"
        >
          <div>
            <span className="text-xs font-bold tracking-[0.15em] uppercase text-primary-foreground/60">
              Featured Startup
            </span>
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground mt-4 mb-4 leading-snug">
              {featuredStartups[0].name}: {featuredStartups[0].pitch}
            </h3>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              Discover innovative ideas from Bay Area founders ready to change the world.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            <span className="text-xs px-3 py-1 rounded-full bg-primary-foreground/15 text-primary-foreground font-medium">
              {featuredStartups[0].stage}
            </span>
            {featuredStartups[0].tags.map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1 rounded-full bg-primary-foreground/10 text-primary-foreground/70"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Smaller resource/startup cards */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {resources.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-background rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <span className="text-xs font-bold tracking-[0.15em] uppercase text-secondary">
                {r.type}
              </span>
              <h4 className="font-heading font-bold text-foreground mt-2 mb-2 text-lg">
                {r.title}
              </h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{r.time}</span>
                <span>·</span>
                <Link
                  to="/resources"
                  className="font-medium text-primary hover:text-secondary transition-colors"
                >
                  Read →
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
