import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/SectionHeading";
import AnimatedCard from "@/components/AnimatedCard";
import CTABanner from "@/components/CTABanner";
import { motion } from "framer-motion";
import { DollarSign, Handshake, Users } from "lucide-react";

const benefits = [
  {
    icon: DollarSign,
    title: "Brand Visibility",
    desc: "Get in front of thousands of founders, investors, and operators across the Bay Area.",
  },
  {
    icon: Handshake,
    title: "Meaningful Connections",
    desc: "Connect with founders and ecosystem partners for recruiting, pilot programs, and deal flow.",
  },
  {
    icon: Users,
    title: "Community Goodwill",
    desc: "Support local founders and position your organization as a leader in the startup ecosystem.",
  },
];

const packages = [
  {
    name: "Supporter",
    price: "$1,000",
    perks: ["Logo on event page", "Social mention"],
  },
  {
    name: "Partner",
    price: "$3,500",
    perks: ["Booth/table at flagship event", "Logo across site and emails"],
  },
  {
    name: "Title Sponsor",
    price: "$8,000",
    perks: ["Title placement on event materials", "Dedicated speaking slot"],
  },
];

const Sponsorship = () => (
  <PageLayout>
    <section
      className="section-padding gradient-hero-solid text-center"
      style={{ paddingTop: "calc(64px + clamp(3rem, 6vw, 5rem))" }}
    >
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full bg-white/10 text-secondary">
            Sponsorship
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
            Partner with Startupa2z
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Reach Bay Area founders, investors, and builders through curated
            events, workshops and community programming.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="section-padding">
      <div className="container-narrow">
        <SectionHeading
          tag="Why Sponsor"
          title="Create Impactful Connections"
          description="Sponsorship with Startupa2z is designed to deliver brand reach, qualified leads, and community impact."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {benefits.map((b, i) => (
            <AnimatedCard key={i} delay={i * 0.08}>
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

        <div className="mt-12">
          <SectionHeading
            tag="Packages"
            title="Sponsorship Packages"
            description="Flexible options to suit startups, growth-stage companies, and enterprise partners."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {packages.map((p, i) => (
              <div key={i} className="rounded-lg p-6 bg-white shadow-sm">
                <div className="flex items-baseline justify-between mb-4">
                  <h4 className="text-lg font-semibold">{p.name}</h4>
                  <div className="text-xl font-bold text-primary">
                    {p.price}
                  </div>
                </div>
                <ul className="text-sm text-muted-foreground mb-4 space-y-2">
                  {p.perks.map((perk, pi) => (
                    <li key={pi}>• {perk}</li>
                  ))}
                </ul>
                <a
                  href="mailto:partnerships@startupa2z.com?subject=Sponsorship%20Inquiry"
                  className="inline-flex items-center px-4 py-2 rounded-full bg-primary text-white font-semibold"
                >
                  Contact Us
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <CTABanner
      title="Interested in sponsoring an upcoming event?"
      description="Let's design a package that meets your goals — brand exposure, recruiting, lead generation, or community support."
    />
  </PageLayout>
);

export default Sponsorship;
