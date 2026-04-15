import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Founder, NovaTech AI",
    quote:
      "Startupa2z connected me with my co-founder and our first angel investor within three months. This community is the real deal.",
  },
  {
    name: "Marcus Rivera",
    role: "Angel Investor",
    quote:
      "I've discovered three portfolio companies through Startupa2z events. The quality of founders here is exceptional.",
  },
  {
    name: "Priya Sharma",
    role: "Product Designer",
    quote:
      "As someone transitioning into startups, the mentorship and networking here gave me the confidence to make the leap.",
  },
];

const TestimonialsSection = () => (
  <section className="py-24 md:py-32 px-4 bg-primary">
    <div className="container-narrow">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14"
      >
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-secondary mb-4 block">
          Testimonials
        </span>
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground">
          What Our Community Says
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-6"
          >
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-6 italic">
              "{t.quote}"
            </p>
            <div>
              <div className="font-heading font-semibold text-primary-foreground text-sm">
                {t.name}
              </div>
              <div className="text-xs text-primary-foreground/50">{t.role}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
