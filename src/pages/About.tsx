import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/SectionHeading";
import AnimatedCard from "@/components/AnimatedCard";
import CTABanner from "@/components/CTABanner";
import { motion } from "framer-motion";
import { Heart, Eye, Zap, Globe, Users, Target } from "lucide-react";

const values = [
  { icon: Heart, title: "Community First", desc: "Every decision we make centers around creating value for our members." },
  { icon: Eye, title: "Transparency", desc: "Open communication, honest feedback, and clear expectations." },
  { icon: Zap, title: "Bias to Action", desc: "We celebrate builders who ship, iterate, and learn fast." },
  { icon: Globe, title: "Inclusivity", desc: "Great ideas come from everywhere. We welcome all backgrounds and perspectives." },
  { icon: Users, title: "Collaboration", desc: "Competition breeds innovation, but collaboration builds ecosystems." },
  { icon: Target, title: "Impact", desc: "We measure success by the real outcomes our members achieve together." },
];

const About = () => (
  <PageLayout>
    <section className="section-padding gradient-hero-solid text-center" style={{ paddingTop: "calc(64px + clamp(3rem, 6vw, 5rem))" }}>
      <div className="container-narrow">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full bg-white/10 text-secondary">About Us</span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">From A to Z of Startups</h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">Building the most connected startup ecosystem in the Bay Area — one founder, one investor, one idea at a time.</p>
        </motion.div>
      </div>
    </section>

    <section className="section-padding">
      <div className="container-narrow">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <SectionHeading tag="Mission" title="Empower Every Startup Journey" center={false} />
            <p className="text-muted-foreground leading-relaxed">
              Startupa2z exists to democratize access to the Bay Area startup ecosystem. We believe that every founder deserves meaningful connections, every investor deserves quality deal flow, and every community member deserves a seat at the table. Our mission is to be the bridge between ambition and achievement.
            </p>
          </div>
          <div>
            <SectionHeading tag="Vision" title="The Go-To Startup Community" center={false} />
            <p className="text-muted-foreground leading-relaxed">
              We envision a Bay Area where starting a company isn't about who you know — it's about what you're building. A world where the best ideas find the right people, capital flows to genuine innovation, and community is the ultimate competitive advantage.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className="section-padding bg-muted/50">
      <div className="container-narrow">
        <SectionHeading tag="Our Story" title="Built by Founders, for Founders" />
        <div className="max-w-3xl mx-auto space-y-6 text-muted-foreground leading-relaxed">
          <p>Startupa2z was born from a simple observation: the Bay Area has the densest concentration of entrepreneurial talent on the planet, yet many founders still struggle to find the right co-founder, the right advisor, or the right investor.</p>
          <p>We started as a small monthly meetup in SOMA, San Francisco — just a handful of founders sharing ideas over coffee. The energy was electric. Within months, investors started showing up. Then mentors. Then engineers looking for their next startup adventure.</p>
          <p>Today, Startupa2z is a thriving ecosystem platform that connects thousands of startup enthusiasts across the Bay Area. From A to Z — from the first spark of an idea to a funded, scaling company — we're here for every step of the journey.</p>
        </div>
      </div>
    </section>

    <section className="section-padding">
      <div className="container-narrow">
        <SectionHeading tag="Values" title="What We Stand For" description="The principles that guide everything we do at Startupa2z." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <AnimatedCard key={i} delay={i * 0.1}>
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <v.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-primary mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>

    <CTABanner title="Join Our Growing Community" description="Be part of something bigger. Connect, build, and grow with the Bay Area's best." />
  </PageLayout>
);

export default About;
