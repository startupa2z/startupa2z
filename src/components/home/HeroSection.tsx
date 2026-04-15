import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const nextEvent = {
  title: "Building Your Network: From Zero to 100 Connections",
  date: "April 24, 2026 · 6:30 PM",
  venue: "WeWork SOMA, 415 Mission St",
  spots: 47,
};

const stats = [
  { value: "2,400", suffix: "+", label: "Active Members" },
  { value: "48", suffix: "", label: "Events This Year" },
  { value: "120K", suffix: "+", label: "Page Visits" },
  { value: "35", suffix: "+", label: "Industry Partners" },
];

const HeroSection = () => (
  <section
    className="relative min-h-[100svh] flex items-center overflow-hidden"
    style={{
      paddingTop: "calc(64px + clamp(3rem, 6vw, 5rem))",
      paddingBottom: "clamp(4rem, 7vw, 6rem)",
    }}
  >
    {/* Background image */}
    <img
      src={heroBg}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
      width={1920}
      height={1080}
    />
    {/* Gradient overlay */}
    <div className="absolute inset-0 gradient-hero" />

    <div className="relative z-10 container-narrow px-[clamp(1.5rem,5vw,3rem)] w-full">
      <div className="grid lg:grid-cols-[1fr_340px] gap-[clamp(3rem,5vw,5rem)] items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-[720px]"
      >
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-[720px]"
      >
        {/* Label pill */}
        <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold tracking-[0.15em] uppercase text-secondary bg-secondary/[0.12] px-3 py-1.5 rounded-full border border-secondary/30 backdrop-blur-sm mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
          Silicon Valley
        </span>

        {/* Title */}
        <h1
          className="text-[clamp(2.75rem,7vw,6.5rem)] font-black tracking-[-0.03em] leading-[1.0] text-white mb-6"
          style={{ textShadow: "0 2px 20px rgba(0,0,0,0.25)" }}
        >
          Silicon Valley
          <br />
          Starts Here.
        </h1>

        {/* Body */}
        <p className="text-[clamp(0.95rem,1.4vw,1.08rem)] text-white/[0.82] max-w-[560px] mb-10 leading-[1.75]">
          Where the next generation of founders learn, connect, and build. Join
          the most intentional startup community in the Valley — unfiltered
          conversations, real practitioners, and the people who'll build
          tomorrow alongside you.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-br from-secondary to-[hsl(30,100%,58%)] text-white text-[0.9rem] font-semibold hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.97] transition-all shadow-[0_8px_28px_rgba(232,137,26,0.35)]"
          >
            Explore Meetups <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/contact"
            className="text-[0.9rem] font-semibold text-white hover:text-secondary/90 transition-colors"
          >
            Join the Community
          </Link>
        </div>

        {/* Stats bar */}
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-x-[clamp(1.5rem,4vw,3.5rem)] gap-y-5 mt-[clamp(2.5rem,5vw,4rem)] pt-[clamp(1.75rem,3vw,2.25rem)] border-t border-white/15 list-none">
          {stats.map((stat, i) => (
            <motion.li
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="flex flex-col gap-1"
            >
              <span className="text-[clamp(1.5rem,2.4vw,2rem)] font-extrabold tracking-[-0.02em] text-white leading-none">
                {stat.value}
                {stat.suffix && (
                  <span className="text-secondary font-bold text-[0.85em] ml-px">
                    {stat.suffix}
                  </span>
                )}
              </span>
              <span className="text-[0.72rem] font-medium tracking-[0.08em] uppercase text-white/60">
                {stat.label}
              </span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

        {/* Floating event card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="hidden lg:block self-start mt-6"
        >
          <div className="bg-white/[0.96] backdrop-blur-[20px] backdrop-saturate-[1.8] p-[clamp(1.5rem,3vw,2rem)] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25),0_4px_12px_rgba(0,0,0,0.12)] border border-white/40">
            <div className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-primary mb-3">
              Next Meetup
            </div>
            <h3 className="text-[1.1rem] font-bold tracking-[-0.02em] text-foreground leading-snug mb-2">
              {nextEvent.title}
            </h3>
            <div className="text-[0.82rem] text-muted-foreground leading-relaxed mb-1">
              {nextEvent.date}
            </div>
            <div className="text-[0.82rem] text-muted-foreground mb-6">
              {nextEvent.venue}
            </div>
            <div className="text-[0.75rem] font-semibold text-primary mb-4">
              {nextEvent.spots} spots remaining
            </div>
            <Link
              to="/events"
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-br from-secondary to-[hsl(30,100%,58%)] text-white text-[0.85rem] font-semibold hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.97] transition-all"
            >
              Reserve Your Spot
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default HeroSection;
