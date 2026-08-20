import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import SectionHeading from "@/components/SectionHeading";
import AnimatedCard from "@/components/AnimatedCard";
import CTABanner from "@/components/CTABanner";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  FileText,
  DollarSign,
  Briefcase,
  Scale,
  BarChart3,
  Presentation,
} from "lucide-react";

const categories = [
  {
    icon: Presentation,
    title: "Pitch Deck Resources",
    id: "pitch-deck-resources",
    items: [
      "Pitch Deck Template",
      "Storytelling Framework",
      "Investor Q&A Prep Guide",
      "Demo Day Playbook",
    ],
  },
  {
    icon: DollarSign,
    title: "Fundraising Guides",
    id: "fundraising-guides",
    items: [
      "Pre-Seed Fundraising 101",
      "How to Find Angel Investors",
      "Term Sheet Breakdown",
      "SAFE vs. Convertible Notes",
    ],
  },
  {
    icon: Briefcase,
    title: "Founder Playbooks",
    id: "founder-playbooks",
    items: [
      "Idea Validation Checklist",
      "MVP Launch Guide",
      "Co-Founder Agreement Template",
      "First 100 Customers Strategy",
    ],
  },
  {
    icon: BarChart3,
    title: "Growth & Marketing",
    id: "growth-marketing",
    items: [
      "Startup Growth Metrics",
      "Content Marketing for Startups",
      "Community-Led Growth Guide",
      "PLG Fundamentals",
    ],
  },
  {
    icon: Scale,
    title: "Legal & Compliance",
    id: "legal-compliance",
    items: [
      "Incorporation Guide (Delaware vs. CA)",
      "IP Protection Basics",
      "Privacy Policy Template",
      "Employee Equity Guide",
    ],
  },
  {
    icon: FileText,
    title: "Product & Engineering",
    id: "product-engineering",
    items: [
      "Technical Architecture for MVPs",
      "Hiring Your First Engineer",
      "Product Roadmap Templates",
      "API Design Best Practices",
    ],
  },
];

const Resources = () => (
  <PageLayout>
    <SEO
      title={`Startup Resources — StartupA2Z.org`}
      description={`Curated guides, templates, and playbooks to help founders build, fundraise, and scale their startups.`}
      canonical={`https://startupa2z.org/resources`}
      ogImage={`https://startupa2z.org/assets/og-resources.jpg`}
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "StartupA2Z.org Resource Hub",
        url: "https://startupa2z.org/resources",
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
            Resources
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
            Startup Resource Hub
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto">
            Curated guides, templates, and playbooks to help you build,
            fundraise, and scale your startup.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="bg-background pt-[clamp(3rem,6vw,5rem)]">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid overflow-hidden rounded-3xl border-2 border-primary/15 bg-card shadow-[0_16px_50px_rgba(27,75,57,0.11)] lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="p-7 md:p-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/8 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              <BookOpen className="h-4 w-4" /> New resource
            </span>
            <h2 className="mt-5 font-heading text-3xl font-bold leading-tight text-primary md:text-4xl">
              Past Events Summary: the founder journeys behind the pitch
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
              Revisit how founders started, the struggles that tested them,
              what helped them move forward, and the lessons shared in the room.
            </p>
            <Link
              to="/resources/event-summaries"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 font-bold text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Explore past event summaries <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex min-h-64 items-center justify-center border-t border-primary/10 bg-[#f8f0e3] p-5 lg:border-l lg:border-t-0">
            <img
              src="https://images.lumacdn.com/event-social/uj/b1008796-76dc-4efd-96b4-b3e35890b79f.png"
              alt="StartupA2Z August 12 founder event"
              className="max-h-80 w-full object-contain"
            />
          </div>
        </motion.div>
      </div>
    </section>

    <section className="section-padding">
      <div className="container-narrow">
        <SectionHeading
          tag="Library"
          title="Explore by Category"
          description="Practical, actionable resources curated by experienced founders and operators."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <div key={cat.id} id={cat.id} className="scroll-mt-24">
              <AnimatedCard delay={i * 0.1} className="h-full">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <cat.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-primary mb-3">
                {cat.title}
              </h3>
              <ul className="space-y-2">
                {cat.items.map((item) => (
                  <li
                    key={item}
                    className="text-sm text-muted-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              </AnimatedCard>
            </div>
          ))}
        </div>
      </div>
    </section>

    <CTABanner
      title="Have a Resource to Share?"
      description="We welcome contributions from experienced founders and operators. Help the community grow."
      primaryCTA="Contribute"
    />
  </PageLayout>
);

export default Resources;
