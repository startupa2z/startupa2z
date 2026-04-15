import { motion } from "framer-motion";

const stats = [
  { value: "2,500+", label: "Community Members" },
  { value: "80+", label: "Events Hosted" },
  { value: "3", label: "Bay Area Chapters" },
];

const StatsSection = () => (
  <section className="py-24 md:py-32 px-4 bg-muted">
    <div className="container-narrow">
      <div className="grid md:grid-cols-3 gap-12 mb-20">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="font-heading text-6xl md:text-7xl font-bold text-primary">
              {stat.value}
            </div>
            <div className="text-xs tracking-[0.15em] uppercase text-muted-foreground mt-2">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Testimonial quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <blockquote className="text-2xl md:text-3xl font-body italic text-foreground/80 leading-relaxed max-w-3xl">
          "The highest-signal startup community in the Bay Area. Every meetup
          I've attended has changed how I think about building."
        </blockquote>
        <p className="text-sm text-muted-foreground mt-5">
          — Priya S., Founder @ Launchpad AI
        </p>
      </motion.div>
    </div>
  </section>
);

export default StatsSection;
