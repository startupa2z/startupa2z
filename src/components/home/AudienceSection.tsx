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
    color: "bg-blue-600",
  },
  {
    icon: TrendingUp,
    title: "Investors",
    description:
      "Discover early-stage startups, attend pitch events, and connect with promising founders.",
    link: "/investors",
    color: "bg-purple-600",
  },
  {
    icon: Target,
    title: "Mentors",
    description:
      "Guide the next generation of entrepreneurs with your experience and expertise.",
    link: "/community",
    color: "bg-teal-600",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Join startup circles, attend meetups, and be part of the Bay Area ecosystem.",
    link: "/community",
    color: "bg-rose-600",
  },
];

const AudienceSection = () => (
  <section className="py-24 md:py-32 px-4 bg-background">
    <div className="container-narrow">
      <div className="flex items-end justify-between mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">
            Founders in the room.
          </h2>
        </motion.div>
        <Link
          to="/community"
          className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:text-secondary transition-colors"
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
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link
              to={a.link}
              className="block bg-muted rounded-xl p-6 min-h-[220px] hover:shadow-md transition-shadow group"
            >
              <div
                className={`w-12 h-12 rounded-full ${a.color} flex items-center justify-center mb-5`}
              >
                <a.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-heading font-bold text-foreground mb-2">
                {a.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {a.description}
              </p>
              <span className="text-xs font-bold tracking-[0.1em] uppercase text-primary group-hover:text-secondary transition-colors">
                Learn more →
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AudienceSection;
