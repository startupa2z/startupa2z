import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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
  { value: "2,500+", label: "Active Members" },
  { value: "80+", label: "Events This Year" },
  { value: "150+", label: "Ideas Shared" },
  { value: "45+", label: "Investor Partners" },
];

const HeroSection = () => (
  <section className="relative min-h-[100vh] flex flex-col justify-center overflow-hidden">
    <img
      src={heroBg}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
      width={1920}
      height={1080}
    />
    <div className="absolute inset-0 gradient-hero" />

    <div className="relative z-10 container-narrow px-4 pt-20">
      <div className="grid lg:grid-cols-5 gap-10 items-center">
        {/* Left content */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase mb-8 px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white/90">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              Bay Area's Startup Ecosystem
            </span>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tight text-white leading-[1.08] mb-8">
              Where Founders,{" "}
              <br className="hidden sm:block" />
              Investors & Builders{" "}
              <br className="hidden sm:block" />
              Come Together.
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-xl mb-10 leading-relaxed">
              From A to Z of Startups — connect with co-founders, discover
              investment opportunities, attend meetups, and build the next big
              thing in the Bay Area.
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <Button
                asChild
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-8 h-13 text-base font-semibold shadow-lg"
              >
                <Link to="/events">
                  Explore Meetups <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Link
                to="/contact"
                className="text-base font-medium text-white hover:text-white/80 transition-colors"
              >
                Join the Community
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating event card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="lg:col-span-2 hidden lg:block"
        >
          <div className="bg-white rounded-2xl p-7 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold tracking-[0.15em] uppercase text-primary">
                Next Meetup
              </span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs font-bold tracking-[0.15em] uppercase text-secondary">
                San Francisco
              </span>
            </div>
            <h3 className="font-heading font-bold text-foreground text-lg leading-snug mb-3">
              {nextEvent.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-1">
              {nextEvent.date}
            </p>
            <p className="text-sm text-muted-foreground mb-5">
              {nextEvent.venue}
            </p>
            <p className="text-sm font-semibold text-secondary mb-5">
              {nextEvent.spots} spots remaining
            </p>
            <Button
              asChild
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-6 text-sm font-semibold"
            >
              <Link to="/events">Reserve Your Spot</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>

    {/* Stats bar at bottom of hero */}
    <div className="relative z-10 mt-auto">
      <div className="border-t border-white/15">
        <div className="container-narrow px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              >
                <div className="font-heading text-4xl md:text-5xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-xs tracking-[0.15em] uppercase text-white/50 mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
