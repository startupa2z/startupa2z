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
  <section className="section-padding bg-surface-2">
    <div className="container-narrow px-[clamp(1.5rem,5vw,3rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-[clamp(2rem,4vw,3rem)]"
      >
        <span className="label-overline-muted mb-4 block">How It Works</span>
        <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold tracking-[-0.025em] leading-[1.1] text-primary">
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
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="bg-card rounded-2xl p-[clamp(1.5rem,3vw,2rem)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-5">
              <step.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="label-overline text-secondary mb-2">
              Step {i + 1}
            </div>
            <h3 className="font-bold text-foreground mb-2 text-[1.15rem] tracking-[-0.015em]">
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
