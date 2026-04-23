import { motion } from "framer-motion";

const cities = [
  "San Francisco",
  "Oakland",
  "Palo Alto",
  "San Jose",
  "Berkeley",
  "Mountain View",
  "Menlo Park",
  "Fremont",
];

const BayAreaSection = () => (
  <section className="section-padding bg-background">
    <div className="container-narrow px-[clamp(1.5rem,5vw,3rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-[clamp(2rem,4vw,3rem)]"
      >
        <span className="label-overline-muted mb-4 block">Bay Area</span>
        <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold tracking-[-0.025em] leading-[1.1] text-primary">
          Rooted in the World's Startup Capital
        </h2>
        <p className="mt-5 text-[clamp(0.95rem,1.5vw,1.075rem)] text-muted-foreground max-w-2xl mx-auto leading-[1.75]">
          From San Francisco to San Jose, we connect entrepreneurs across the
          entire Bay Area ecosystem.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cities.map((city, i) => (
          <motion.div
            key={city}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="py-5 px-4 rounded-2xl bg-surface-1 text-sm font-medium text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-default text-center"
          >
            {city}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BayAreaSection;
