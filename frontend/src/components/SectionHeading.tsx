import { motion } from "framer-motion";

interface SectionHeadingProps {
  tag?: string;
  title: string;
  description?: string;
  center?: boolean;
  light?: boolean;
}

const SectionHeading = ({ tag, title, description, center = true, light = false }: SectionHeadingProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.5 }}
    className={`mb-12 md:mb-16 ${center ? "text-center" : ""}`}
  >
    {tag && (
      <span className={`inline-block text-xs font-semibold tracking-widest uppercase mb-3 px-3 py-1 rounded-full ${light ? "bg-primary-foreground/10 text-primary-foreground/80" : "bg-accent/10 text-accent"}`}>
        {tag}
      </span>
    )}
    <h2 className={`font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance ${light ? "text-primary-foreground" : "text-primary"}`}>
      {title}
    </h2>
    {description && (
      <p className={`mt-4 text-lg max-w-2xl leading-relaxed ${center ? "mx-auto" : ""} ${light ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
        {description}
      </p>
    )}
  </motion.div>
);

export default SectionHeading;
