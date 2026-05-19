import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CTABannerProps {
  title: string;
  description: string;
  primaryCTA?: string;
  primaryLink?: string;
  secondaryCTA?: string;
  secondaryLink?: string;
}

const CTABanner = ({ title, description, primaryCTA = "Join Now", primaryLink = "/contact", secondaryCTA, secondaryLink }: CTABannerProps) => (
  <section className="section-padding">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="container-narrow gradient-navy rounded-3xl p-10 md:p-16 text-center"
    >
      <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">{title}</h2>
      <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto mb-8">{description}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-8 h-12 text-base font-semibold">
          <Link to={primaryLink}>{primaryCTA} <ArrowRight className="ml-2 w-4 h-4" /></Link>
        </Button>
        {secondaryCTA && secondaryLink && (
          <Button asChild variant="outline" className="border-primary-foreground/60 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full px-8 h-12 text-base font-semibold">
            <Link to={secondaryLink}>{secondaryCTA}</Link>
          </Button>
        )}
      </div>
    </motion.div>
  </section>
);

export default CTABanner;
