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
  <section className="py-24 md:py-32 px-4 bg-background">
    <div className="container-narrow">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-secondary mb-4 block">
          Bay Area
        </span>
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary">
          Rooted in the World's Startup Capital
        </h2>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
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
            className="py-5 px-4 rounded-xl bg-muted text-sm font-medium text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-default text-center"
          >
            {city}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BayAreaSection;
