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
  <section className="section-padding bg-primary">
    <div className="container-narrow px-[clamp(1.5rem,5vw,3rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-[clamp(2rem,4vw,3rem)]"
      >
        <span className="label-overline-white mb-4 block">Testimonials</span>
        <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold tracking-[-0.025em] leading-[1.1] text-white">
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
            transition={{ delay: i * 0.08 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-[clamp(1.5rem,3vw,2rem)]"
          >
            <p className="text-white/80 text-[0.875rem] leading-relaxed mb-6 italic">
              "{t.quote}"
            </p>
            <div>
              <div className="font-semibold text-white text-sm">{t.name}</div>
              <div className="text-[0.78rem] text-white/50">{t.role}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
