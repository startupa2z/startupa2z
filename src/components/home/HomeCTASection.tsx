import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HomeCTASection = () => (
  <section className="py-24 md:py-32 px-4 bg-primary">
    <div className="container-narrow">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
            Don't just read
            <br />
            about startups.
            <br />
            Build one.
          </h2>
          <p className="text-sm tracking-[0.15em] uppercase text-primary-foreground/50 mt-6">
            Next meetup in 15 days · San Francisco
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-4 md:justify-end"
        >
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary-foreground/60 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 rounded-full px-8 h-13 text-base font-semibold"
          >
            <Link to="/contact">
              Join Free <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full px-8 h-13 text-base font-semibold"
          >
            <Link to="/events">Explore Meetups</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  </section>
);

export default HomeCTASection;
