import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import SectionHeading from "@/components/SectionHeading";
import AnimatedCard from "@/components/AnimatedCard";
import CTABanner from "@/components/CTABanner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  TrendingUp,
  Calendar,
  BarChart3,
  Shield,
  Users,
} from "lucide-react";

const benefits = [
  {
    icon: Search,
    title: "Discover Startups Early",
    desc: "Access a curated pipeline of pre-seed to Series A startups across the Bay Area.",
  },
  {
    icon: BarChart3,
    title: "Browse by Stage & Sector",
    desc: "Filter startups by industry, funding stage, traction metrics, and team size.",
  },
  {
    icon: Calendar,
    title: "Attend Demo Days",
    desc: "Exclusive pitch events and demo nights featuring our top community startups.",
  },
  {
    icon: Users,
    title: "Direct Founder Access",
    desc: "Skip the cold outreach — connect directly with founders through our platform.",
  },
  {
    icon: Shield,
    title: "Vetted Community",
    desc: "Every startup in our directory goes through a quality check before listing.",
  },
  {
    icon: TrendingUp,
    title: "Track Portfolio",
    desc: "Follow startups you're interested in and get updates on their progress.",
  },
];

const Investors = () => (
  <PageLayout>
    <SEO
      title={`Investors — StartupA2Z`}
      description={`Discover promising Bay Area startups, connect with exceptional founders, and source high-quality deal flow through Startupa2z.`}
      canonical={`https://startupa2z.org/investors`}
      ogImage={`https://startupa2z.org/assets/og-investors.jpg`}
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "StartupA2Z",
        url: "https://startupa2z.org",
      }}
    />
    <section
      className="section-padding gradient-hero-solid text-center"
      style={{ paddingTop: "calc(64px + clamp(3rem, 6vw, 5rem))" }}
    >
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full bg-white/10 text-secondary">
            For Investors
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
            Find Your Next
            <br />
            Portfolio Company
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8">
            Discover promising Bay Area startups, connect with exceptional
            founders, and invest in the future — all in one curated community.
          </p>
          <Button
            asChild
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-8 h-12 text-base font-semibold"
          >
            <Link to="/contact">
              Register as Investor <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>

    <section className="section-padding">
      <div className="container-narrow">
        <SectionHeading
          tag="Why Startupa2z"
          title="A Smarter Way to Source Deals"
          description="Our platform gives investors a front-row seat to the Bay Area's most promising early-stage startups."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <AnimatedCard key={i} delay={i * 0.1}>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <b.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-primary mb-2">
                {b.title}
              </h3>
              <p className="text-sm text-muted-foreground">{b.desc}</p>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>

    <section className="section-padding bg-muted/50">
      <div className="container-narrow text-center">
        <SectionHeading
          tag="Startup Categories"
          title="Explore Investment Opportunities"
          description="Our startup directory spans every major tech vertical."
        />
        <div className="flex flex-wrap justify-center gap-3">
          {[
            "AI / ML",
            "HealthTech",
            "FinTech",
            "CleanTech",
            "SaaS",
            "EdTech",
            "BioTech",
            "DevTools",
            "Consumer",
            "Marketplace",
            "Logistics",
            "Web3",
          ].map((cat) => (
            <span
              key={cat}
              className="px-5 py-2.5 rounded-full bg-card border border-border text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors cursor-default"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </section>

    <CTABanner
      title="Start Sourcing Better Deals"
      description="Join our investor network and get access to curated Bay Area startups."
      primaryCTA="Register Now"
    />
  </PageLayout>
);

export default Investors;
