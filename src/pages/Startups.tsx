import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/SectionHeading";
import AnimatedCard from "@/components/AnimatedCard";
import CTABanner from "@/components/CTABanner";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Users, ExternalLink } from "lucide-react";

const allStartups = [
  { name: "GreenFleet", pitch: "Electric fleet management for last-mile delivery", stage: "Seed", category: "CleanTech", founders: 2, tags: ["Logistics", "EV"] },
  { name: "MedBridge AI", pitch: "AI-powered clinical trial matching platform", stage: "Pre-Seed", category: "HealthTech", founders: 3, tags: ["AI", "Healthcare"] },
  { name: "Stackbase", pitch: "No-code data infrastructure for SMBs", stage: "Series A", category: "SaaS", founders: 2, tags: ["DevTools", "No-Code"] },
  { name: "CultureSync", pitch: "Remote team culture analytics platform", stage: "Seed", category: "HR Tech", founders: 2, tags: ["Remote", "Analytics"] },
  { name: "PayNova", pitch: "Instant cross-border payments for freelancers", stage: "Pre-Seed", category: "FinTech", founders: 2, tags: ["Payments", "Gig Economy"] },
  { name: "LearnLoop", pitch: "Adaptive AI tutoring for K-12 students", stage: "Seed", category: "EdTech", founders: 3, tags: ["AI", "Education"] },
  { name: "BioTrace", pitch: "Rapid pathogen detection for food supply chains", stage: "Series A", category: "BioTech", founders: 4, tags: ["Food Safety", "Science"] },
  { name: "CloudHive", pitch: "Multi-cloud cost optimization platform", stage: "Seed", category: "DevTools", founders: 2, tags: ["Cloud", "Infra"] },
  { name: "EcoNest", pitch: "Sustainable smart home automation system", stage: "Pre-Seed", category: "CleanTech", founders: 2, tags: ["IoT", "Sustainability"] },
  { name: "VoxAI", pitch: "Voice-first AI assistant for healthcare providers", stage: "Seed", category: "HealthTech", founders: 3, tags: ["AI", "Voice"] },
  { name: "SupplyX", pitch: "Real-time supply chain visibility for manufacturers", stage: "Series A", category: "Logistics", founders: 3, tags: ["Supply Chain", "B2B"] },
  { name: "Artisan AI", pitch: "AI-powered design tool for brand teams", stage: "Pre-Seed", category: "SaaS", founders: 2, tags: ["AI", "Design"] },
];

const stages = ["All", "Pre-Seed", "Seed", "Series A"];
const categories = ["All", "SaaS", "HealthTech", "CleanTech", "FinTech", "EdTech", "BioTech", "DevTools", "HR Tech", "Logistics"];

const Startups = () => {
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("All");
  const [category, setCategory] = useState("All");

  const filtered = allStartups.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.pitch.toLowerCase().includes(search.toLowerCase());
    const matchStage = stage === "All" || s.stage === stage;
    const matchCat = category === "All" || s.category === category;
    return matchSearch && matchStage && matchCat;
  });

  return (
    <PageLayout>
      <section className="section-padding gradient-hero text-center">
        <div className="container-narrow">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full bg-accent/20 text-teal-light">Directory</span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground tracking-tight mb-6">Startup Directory</h1>
            <p className="text-lg text-primary-foreground/70 max-w-xl mx-auto">Explore innovative startups from Bay Area founders. Filter by stage, industry, and more.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow">
          {/* Search & Filters */}
          <div className="mb-10 space-y-4">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search startups..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-full h-12"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground self-center mr-1" />
              {stages.map((s) => (
                <Button
                  key={s}
                  variant={stage === s ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full text-xs ${stage === s ? "bg-primary text-primary-foreground" : ""}`}
                  onClick={() => setStage(s)}
                >
                  {s}
                </Button>
              ))}
              <span className="w-px h-6 bg-border self-center mx-1" />
              {categories.map((c) => (
                <Button
                  key={c}
                  variant={category === c ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full text-xs ${category === c ? "bg-primary text-primary-foreground" : ""}`}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-heading font-semibold text-primary mb-2">No startups found</h3>
              <p className="text-muted-foreground text-sm">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((s, i) => (
                <AnimatedCard key={s.name} delay={i * 0.05} className="group cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg gradient-navy flex items-center justify-center text-primary-foreground font-heading font-bold text-sm">
                      {s.name[0]}
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
                  </div>
                  <h3 className="font-heading font-semibold text-primary mb-1">{s.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{s.pitch}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{s.founders} founders</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">{s.stage}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-medium">{s.category}</span>
                    {s.tags.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</span>
                    ))}
                  </div>
                </AnimatedCard>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABanner title="Want to List Your Startup?" description="Submit your startup to our directory and get discovered by investors and collaborators." primaryCTA="Submit Startup" />
    </PageLayout>
  );
};

export default Startups;
