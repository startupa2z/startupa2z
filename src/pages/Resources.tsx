import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/SectionHeading";
import AnimatedCard from "@/components/AnimatedCard";
import CTABanner from "@/components/CTABanner";
import { motion } from "framer-motion";
import { FileText, DollarSign, Briefcase, Scale, BarChart3, Presentation, ArrowRight } from "lucide-react";

const categories = [
  { icon: Presentation, title: "Pitch Deck Resources", items: ["Pitch Deck Template", "Storytelling Framework", "Investor Q&A Prep Guide", "Demo Day Playbook"] },
  { icon: DollarSign, title: "Fundraising Guides", items: ["Pre-Seed Fundraising 101", "How to Find Angel Investors", "Term Sheet Breakdown", "SAFE vs. Convertible Notes"] },
  { icon: Briefcase, title: "Founder Playbooks", items: ["Idea Validation Checklist", "MVP Launch Guide", "Co-Founder Agreement Template", "First 100 Customers Strategy"] },
  { icon: BarChart3, title: "Growth & Marketing", items: ["Startup Growth Metrics", "Content Marketing for Startups", "Community-Led Growth Guide", "PLG Fundamentals"] },
  { icon: Scale, title: "Legal & Compliance", items: ["Incorporation Guide (Delaware vs. CA)", "IP Protection Basics", "Privacy Policy Template", "Employee Equity Guide"] },
  { icon: FileText, title: "Product & Engineering", items: ["Technical Architecture for MVPs", "Hiring Your First Engineer", "Product Roadmap Templates", "API Design Best Practices"] },
];

const Resources = () => (
  <PageLayout>
    <section className="section-padding gradient-hero-solid text-center" style={{ paddingTop: "calc(64px + clamp(3rem, 6vw, 5rem))" }}>
      <div className="container-narrow">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full bg-white/10 text-secondary">Resources</span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">Startup Resource Hub</h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto">Curated guides, templates, and playbooks to help you build, fundraise, and scale your startup.</p>
        </motion.div>
      </div>
    </section>

    <section className="section-padding">
      <div className="container-narrow">
        <SectionHeading tag="Library" title="Explore by Category" description="Practical, actionable resources curated by experienced founders and operators." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <AnimatedCard key={i} delay={i * 0.1}>
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <cat.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-primary mb-3">{cat.title}</h3>
              <ul className="space-y-2">
                {cat.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer group">
                    <ArrowRight className="w-3 h-3 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </li>
                ))}
              </ul>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>

    <CTABanner title="Have a Resource to Share?" description="We welcome contributions from experienced founders and operators. Help the community grow." primaryCTA="Contribute" />
  </PageLayout>
);

export default Resources;
