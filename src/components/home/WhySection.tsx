import { motion } from "framer-motion";
import { Star } from "lucide-react";
import communityImg from "@/assets/community.jpg";

const points = [
  {
    title: "Curated Community",
    desc: "Every member is vetted and connected based on relevance — no noise, only signal.",
  },
  {
    title: "Real Outcomes",
    desc: "From co-founder matching to funded rounds, our community drives measurable results.",
  },
  {
    title: "Bay Area Native",
    desc: "Rooted in San Francisco, Oakland, and Silicon Valley — built by locals, for locals.",
  },
];

const WhySection = () => (
  <section className="py-24 md:py-32 px-4 bg-background">
    <div className="container-narrow">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-secondary mb-4 block">
          Why Startupa2z
        </span>
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">
          The Bay Area's Most Trusted
          <br />
          Startup Community
        </h2>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          We bring together founders, investors, mentors, and operators in a
          curated ecosystem designed for meaningful connections and real outcomes.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <img
            src={communityImg}
            alt="Startupa2z community networking event"
            className="rounded-2xl"
            loading="lazy"
            width={1280}
            height={720}
          />
        </motion.div>

        <div className="space-y-8">
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
                <Star className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-1">
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
