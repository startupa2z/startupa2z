import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Rocket, TrendingUp, Target, Users } from "lucide-react";

const audiences = [
  {
    icon: Rocket,
    title: "Founders",
    description:
      "Share ideas, find co-founders, connect with investors, and access resources to build.",
    link: "/founders",
  },
  {
    icon: TrendingUp,
    title: "Investors",
    description:
      "Discover early-stage startups, attend pitch events, and connect with promising founders.",
    link: "/investors",
  },
  {
    icon: Target,
    title: "Mentors",
    description:
      "Guide the next generation of entrepreneurs with your experience and expertise.",
    link: "/community",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Join startup circles, attend meetups, and be part of the Bay Area ecosystem.",
    link: "/community",
  },
];

const AudienceSection = () => (
  <section className="section-padding bg-background">
    <div className="container-narrow px-[clamp(1.5rem,5vw,3rem)]">
      <div className="flex items-end justify-between gap-4 mb-[clamp(2rem,4vw,3rem)]">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold tracking-[-0.025em] leading-[1.1] text-primary flex-1"
        >
          Founders in the room.
        </motion.h2>
        <Link
          to="/community"
          className="hidden md:inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-primary hover:gap-2.5 transition-all"
        >
          Meet everyone <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {audiences.map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <Link
              to={a.link}
              className="block bg-surface-1 rounded-2xl p-[clamp(1.5rem,3vw,2rem)] min-h-[220px] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-5">
                <a.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-foreground mb-2 text-[1.15rem] tracking-[-0.015em]">
                {a.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {a.description}
              </p>
              <span className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-primary group-hover:gap-2.5 transition-all">
                Learn more <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AudienceSection;
