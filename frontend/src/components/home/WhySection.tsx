import { motion } from "framer-motion";
import { ArrowUpRight, Handshake, Route, UsersRound } from "lucide-react";

const points = [
  {
    icon: Route,
    title: "Start wherever you are",
    desc: "Idea, first product, early customers, or the next stage of growth — your path starts with the challenge in front of you.",
  },
  {
    icon: Handshake,
    title: "Move forward together",
    desc: "Meet founders, operators, mentors, and investors who can share context, make introductions, and help remove the next obstacle.",
  },
  {
    icon: ArrowUpRight,
    title: "Turn conversations into progress",
    desc: "Use practical sessions, founder pitches, direct feedback, and ongoing relationships to move from learning to action.",
  },
  {
    icon: UsersRound,
    title: "Help the next founder forward",
    desc: "Share what you learn, open a door, or make an introduction — your experience can become someone else’s next step.",
  },
];

const WhySection = () => (
  <section className="section-padding bg-card">
    <div className="container-narrow px-[clamp(1.5rem,5vw,3rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-[clamp(1.75rem,3vw,2.5rem)]"
      >
        <span className="label-overline-muted mb-4 block">The StartupA2Z idea</span>
        <h2 className="text-[clamp(1.9rem,3.2vw,3.15rem)] font-extrabold tracking-[-0.03em] leading-[1.1] text-primary lg:whitespace-nowrap">
          From A to Z, founders don&apos;t build alone.
        </h2>
        <p className="mt-5 text-[clamp(0.95rem,1.5vw,1.075rem)] text-muted-foreground max-w-5xl leading-[1.75]">
          A to Z is the bridge between where you are and what comes next.
          Founders reach back, pull one another forward, and share what they know
          along the way.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-8 lg:gap-10 items-center">
        <motion.figure
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-[380px] justify-self-center overflow-hidden rounded-[2rem] border border-border/70 bg-gradient-to-br from-[#fbf8f2] to-white p-3 shadow-[0_24px_70px_rgba(31,71,55,0.12)]"
        >
          <img
            src="/presentation-assets/community-vision-a-to-z.png"
            alt="StartupA2Z community members helping one another move from A to Z"
            className="aspect-square w-full rounded-[1.4rem] object-contain"
            loading="lazy"
            width={1254}
            height={1254}
          />
          <figcaption className="flex items-center justify-between gap-4 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-primary/65">
            <span>Every founder has a next step</span>
            <span className="text-secondary">A → Z</span>
          </figcaption>
        </motion.figure>

        <div className="space-y-6">
          {points.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1 text-[1.15rem] tracking-[-0.015em]">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default WhySection;
