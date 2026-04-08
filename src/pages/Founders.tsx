import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/SectionHeading";
import AnimatedCard from "@/components/AnimatedCard";
import CTABanner from "@/components/CTABanner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Search, Handshake, BookOpen, Calendar, ArrowRight, Rocket } from "lucide-react";

const benefits = [
  { icon: Rocket, title: "Share Your Startup Idea", desc: "Post your concept to our directory and get visibility with investors, mentors, and potential co-founders." },
  { icon: Users, title: "Find Co-Founders & Team", desc: "Match with engineers, designers, marketers, and operators who are ready to build." },
  { icon: Handshake, title: "Connect with Investors", desc: "Access angel investors and VCs actively looking for Bay Area startups at your stage." },
  { icon: Calendar, title: "Attend Founder Events", desc: "Pitch nights, networking sessions, workshops — events designed specifically for founders." },
  { icon: BookOpen, title: "Access Resources", desc: "Fundraising guides, pitch deck templates, legal checklists, and growth playbooks." },
  { icon: Search, title: "Get Mentorship", desc: "Connect with experienced founders and advisors who've been through the journey." },
];

const Founders = () => (
  <PageLayout>
    <section className="section-padding gradient-hero text-center">
      <div className="container-narrow">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full bg-accent/20 text-teal-light">For Founders</span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground tracking-tight mb-6">Build Something<br />Extraordinary</h1>
          <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-8">Everything you need to go from idea to funded startup — co-founders, investors, mentors, and a community that has your back.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-8 h-12 text-base font-semibold">
              <Link to="/contact">Submit Your Startup <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button asChild variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-full px-8 h-12 text-base">
              <Link to="/startups">Browse Directory</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>

    <section className="section-padding">
      <div className="container-narrow">
        <SectionHeading tag="Benefits" title="Everything Founders Need" description="We built this platform for builders. Here's how Startupa2z accelerates your startup journey." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <AnimatedCard key={i} delay={i * 0.1}>
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <b.icon className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-heading font-semibold text-primary mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.desc}</p>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>

    <section className="section-padding bg-muted/50">
      <div className="container-narrow">
        <SectionHeading tag="Success Stories" title="Founders Who Started Here" />
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { name: "Alex & Jordan", company: "FleetCharge", story: "Met at a Startupa2z Founder Friday, launched their EV charging startup, and raised $1.2M in 6 months." },
            { name: "Deepa Patel", company: "HealthSync", story: "Found her CTO through our co-founder matching, went through YC, and now serves 50+ clinics." },
          ].map((s, i) => (
            <AnimatedCard key={i} delay={i * 0.15}>
              <div className="font-heading font-semibold text-primary mb-1">{s.name} — {s.company}</div>
              <p className="text-sm text-muted-foreground">{s.story}</p>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>

    <CTABanner title="Ready to Build Your Startup?" description="Join the founder network and get connected with the resources you need." primaryCTA="Join as Founder" />
  </PageLayout>
);

export default Founders;
