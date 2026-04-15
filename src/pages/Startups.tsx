import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Plus, Grid3X3, Cpu, Banknote, Heart, Leaf } from "lucide-react";

const allStartups = [
  { name: "Lumina AI", pitch: "Generative video orchestration for architectural visualization.", stage: "Series A", location: "San Francisco", category: "Deep Tech", tags: ["ML", "Design"], color: "hsl(var(--accent))" },
  { name: "ChordPay", pitch: "Instant royalty distributions for independent digital creators.", stage: "Seed", location: "London, UK", category: "Fintech", tags: ["Payments", "Web3"], color: "hsl(var(--secondary))" },
  { name: "BioSettle", pitch: "Decentralized patient enrollment for rare disease clinical trials.", stage: "Pre-Seed", location: "Berlin", category: "Healthtech", tags: ["Pharma", "Compliance"], color: "hsl(var(--accent))" },
  { name: "Forge Robotics", pitch: "Modular pick-and-place robots for dark-store fulfillment.", stage: "Growth", location: "Boston", category: "Deep Tech", tags: ["Hardware", "AI"], color: "hsl(var(--navy))" },
  { name: "StreamFlow", pitch: "No-code data pipelines for enterprise cloud synchronization.", stage: "Series B", location: "Tel Aviv", category: "SaaS", tags: ["Enterprise", "Cloud"], color: "hsl(var(--secondary))" },
  { name: "GreenFleet", pitch: "Electric fleet management for last-mile delivery networks.", stage: "Seed", location: "San Francisco", category: "Greentech", tags: ["Logistics", "EV"], color: "hsl(var(--accent))" },
  { name: "MedBridge AI", pitch: "AI-powered clinical trial matching platform for hospitals.", stage: "Pre-Seed", location: "New York", category: "Healthtech", tags: ["AI", "Healthcare"], color: "hsl(var(--navy))" },
  { name: "PayNova", pitch: "Instant cross-border payments for freelancers worldwide.", stage: "Seed", location: "Singapore", category: "Fintech", tags: ["Payments", "Gig Economy"], color: "hsl(var(--secondary))" },
];

const categoryItems = [
  { label: "All Startups", icon: Grid3X3, value: "All" },
  { label: "SaaS", icon: Cpu, value: "SaaS" },
  { label: "Fintech", icon: Banknote, value: "Fintech" },
  { label: "Healthtech", icon: Heart, value: "Healthtech" },
  { label: "Greentech", icon: Leaf, value: "Greentech" },
  { label: "Deep Tech", icon: Cpu, value: "Deep Tech" },
];

const stages = ["All Stages", "Pre-Seed", "Seed", "Series A", "Series B", "Growth"];
const locations = ["Global", "San Francisco", "New York", "London, UK", "Berlin", "Boston", "Tel Aviv", "Singapore"];

const Startups = () => {
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("All Stages");
  const [location, setLocation] = useState("Global");
  const [category, setCategory] = useState("All");

  const filtered = allStartups.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.pitch.toLowerCase().includes(search.toLowerCase());
    const matchStage = stage === "All Stages" || s.stage === stage;
    const matchCat = category === "All" || s.category === category;
    const matchLoc = location === "Global" || s.location === location;
    return matchSearch && matchStage && matchCat && matchLoc;
  });

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="section-padding gradient-hero-solid text-center" style={{ paddingTop: "calc(64px + clamp(3rem, 6vw, 5rem))" }}>
        <div className="container-narrow">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full bg-white/10 text-secondary">Discovery Directory</span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">Explore the Next<br />Generation of Startups</h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8">Browse our curated directory of Bay Area startups — filter by stage, sector, and location to find the companies shaping tomorrow.</p>
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-8 h-12 text-base font-semibold">
              Submit Your Startup <Plus className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="section-padding pb-0">
        <div className="container-narrow">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-56 shrink-0">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Categories</h3>
              <nav className="space-y-1 mb-8">
                {categoryItems.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setCategory(item.value)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      category === item.value
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Want to list CTA */}
              <div className="bg-muted/50 rounded-xl p-5 border border-border">
                <h4 className="font-heading font-semibold text-foreground mb-1">Want to list?</h4>
                <p className="text-xs text-muted-foreground mb-4">Join 2,400+ vetted founders in the network.</p>
                <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full text-sm font-semibold">
                  Submit Startup
                </Button>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">

              {/* Search & filters bar */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or pitch..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-11 h-12 rounded-xl bg-muted/50 border-border text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={stage} onValueChange={setStage}>
                    <SelectTrigger className="h-12 rounded-xl min-w-[130px] bg-card border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="h-12 rounded-xl min-w-[120px] bg-card border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((l) => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    className="h-12 px-6 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold"
                    onClick={() => { setStage("All Stages"); setLocation("Global"); setSearch(""); setCategory("All"); }}
                  >
                    {stage !== "All Stages" || location !== "Global" || search || category !== "All" ? "Reset" : "Apply"}
                  </Button>
                </div>
              </div>

              {/* Startup cards grid */}
              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-heading font-semibold text-foreground mb-2">No startups found</h3>
                  <p className="text-muted-foreground text-sm">Try adjusting your filters or search terms.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-12">
                  {filtered.map((s, i) => (
                    <motion.div
                      key={s.name}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.04 }}
                      className="bg-card rounded-xl border border-border p-5 hover:shadow-lg hover:border-border/80 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-heading font-bold"
                          style={{ backgroundColor: s.color, color: "white" }}
                        >
                          {s.name[0]}
                        </div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                          {s.category}
                        </span>
                      </div>
                      <h3 className="font-heading font-semibold text-foreground text-lg mb-1 group-hover:text-secondary transition-colors">
                        {s.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{s.pitch}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <span className="font-medium text-foreground/70">⌂</span> {s.stage}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {s.location}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {s.tags.map((t) => (
                          <span key={t} className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground bg-background">
                            {t}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}

                  {/* CTA card */}
                  <div className="bg-card rounded-xl border-2 border-dashed border-border p-5 flex flex-col items-center justify-center text-center min-h-[260px]">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Plus className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-1">Your Startup Here?</h3>
                    <p className="text-xs text-muted-foreground mb-4 max-w-[200px]">
                      Join our editorialized directory of the next generation of giants.
                    </p>
                    <Button variant="outline" className="rounded-full text-sm font-semibold">
                      Apply to List
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Startups;
