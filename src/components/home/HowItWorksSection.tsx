import { motion } from "framer-motion";
import { Users, Lightbulb, Handshake, Rocket } from "lucide-react";

const steps = [
  {
    icon: Users,
    title: "Join the Community",
    description:
      "Create your profile as a founder, investor, mentor, or community member.",
  },
  {
    icon: Lightbulb,
    title: "Share & Discover",
    description:
      "Post your startup idea or explore promising ventures in the directory.",
  },
  {
    icon: Handshake,
    title: "Connect & Collaborate",
    description:
      "Find co-founders, advisors, investors, and team members who align with your vision.",
  },
  {
    icon: Rocket,
    title: "Build & Launch",
    description:
      "Access resources, attend events, and turn your idea into a funded startup.",
  },
];

const HowItWorksSection = () => (
  <section className="py-24 md:py-32 px-4 bg-muted">
    <div className="container-narrow">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-secondary mb-4 block">
          How It Works
        </span>
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary">
          Get Started in Four Simple Steps
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-background rounded-xl p-6"
          >
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-5">
              <step.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="text-xs font-bold tracking-[0.15em] uppercase text-secondary mb-2">
              Step {i + 1}
            </div>
            <h3 className="font-heading font-semibold text-foreground mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
