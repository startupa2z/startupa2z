import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedCard = ({ children, className = "", delay = 0 }: AnimatedCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className={`glass-card p-6 md:p-8 hover:shadow-lg transition-shadow ${className}`}
  >
    {children}
  </motion.div>
);

export default AnimatedCard;
