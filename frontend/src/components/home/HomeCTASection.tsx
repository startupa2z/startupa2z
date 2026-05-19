import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HomeCTASection = () => (
  <section className="section-padding bg-primary">
    <div className="container-narrow px-[clamp(1.5rem,5vw,3rem)]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 flex-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold tracking-[-0.025em] leading-[1.1] text-white">
            Don't just read
            <br />
            about startups.
            <br />
            Build one.
          </h2>
          <p className="text-[0.72rem] font-semibold tracking-[0.12em] uppercase text-white/45 mt-3">
            Next meetup in 15 days · San Francisco
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-4 shrink-0"
        >
          <Link
            to="/events"
            className="inline-flex items-center px-7 py-3 rounded-full bg-white text-primary text-[0.9rem] font-semibold hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.15)] active:scale-[0.97] transition-all"
          >
            Explore Meetups
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center px-7 py-3 rounded-full text-white text-[0.9rem] font-semibold shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.45)] hover:bg-white/10 transition-all"
          >
            Join Free →
          </Link>
        </motion.div>
      </div>
    </div>
  </section>
);

export default HomeCTASection;
