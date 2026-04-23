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
  <section className="section-padding bg-card">
    <div className="container-narrow px-[clamp(1.5rem,5vw,3rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-[clamp(2rem,4vw,3rem)]"
      >
        <span className="label-overline-muted mb-4 block">Why Startupa2z</span>
        <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold tracking-[-0.025em] leading-[1.1] text-primary">
          The Bay Area's Most Trusted
          <br />
          Startup Community
        </h2>
        <p className="mt-5 text-[clamp(0.95rem,1.5vw,1.075rem)] text-muted-foreground max-w-2xl leading-[1.75]">
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
