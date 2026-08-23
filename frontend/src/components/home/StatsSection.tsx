import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchHomeStats, type HomeStats } from "@/lib/api";

const emptyStats: HomeStats = {
  active_members: 0,
  events_hosted: 0,
  page_visits: 0,
  industries: 0,
};

const StatsSection = () => {
  const [data, setData] = useState<HomeStats>(emptyStats);

  useEffect(() => {
    void fetchHomeStats()
      .then((response) => setData(response.data))
      .catch(() => setData(emptyStats));
  }, []);

  const stats = [
    { value: data.active_members.toLocaleString(), label: "Active Members" },
    { value: data.events_hosted.toLocaleString(), label: "Events Hosted" },
    { value: data.page_visits.toLocaleString(), label: "Page Visits" },
    { value: "3+", label: "Partners" },
  ];

  return (
  <section className="section-padding-sm bg-surface-2">
    <div className="container-narrow px-[clamp(1.5rem,5vw,3rem)]">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="text-[clamp(2.5rem,5vw,4rem)] font-black tracking-[-0.03em] text-primary leading-none mb-1">
              {stat.value}
            </div>
            <div className="text-[0.72rem] font-semibold tracking-[0.1em] uppercase text-muted-foreground">
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
        className="pt-8 mt-4 col-span-full"
      >
        <blockquote className="text-[clamp(1rem,2vw,1.2rem)] italic text-foreground leading-[1.65] max-w-[620px]">
          "The highest-signal startup community in the Bay Area. Every meetup
          I've attended has changed how I think about building."
        </blockquote>
        <cite className="block mt-3 text-[0.82rem] not-italic text-muted-foreground font-semibold">
          — Priya S., Founder @ Launchpad AI
        </cite>
      </motion.div>
    </div>
  </section>
  );
};

export default StatsSection;
