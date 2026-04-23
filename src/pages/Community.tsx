import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/SectionHeading";
import AnimatedCard from "@/components/AnimatedCard";
import CTABanner from "@/components/CTABanner";
import { motion } from "framer-motion";
import { Users, MessageSquare, Award, BookOpen, Rocket, Heart } from "lucide-react";
import communityImg from "@/assets/community.jpg";

const groups = [
  { title: "Founder Circles", desc: "Small groups of 6-8 founders meeting biweekly to share challenges, wins, and accountability.", icon: Rocket },
  { title: "Investor Network", desc: "Angel investors and VCs discussing deal flow, trends, and co-investment opportunities.", icon: Award },
  { title: "Tech Builders", desc: "Engineers and designers collaborating on side projects and sharing technical insights.", icon: MessageSquare },
  { title: "First-Time Founders", desc: "A supportive space for aspiring entrepreneurs taking their first steps.", icon: Heart },
];

const spotlights = [
  { name: "Anita Rawat", role: "Founder, CloudKitchen.io", story: "Joined Startupa2z as a solo founder, found two co-founders through Founder Circles, and launched within 90 days." },
  { name: "Tom Becker", role: "CTO turned Founder", story: "The Tech Builders group gave me the push I needed to go from employee to entrepreneur. Shipped my MVP in 6 weeks." },
  { name: "Lisa Tran", role: "Angel Investor", story: "I've made my best investments through connections made at Startupa2z events. The community's signal-to-noise ratio is unmatched." },
];

const Community = () => (
  <PageLayout>
    <section className="section-padding gradient-hero-solid text-center" style={{ paddingTop: "calc(64px + clamp(3rem, 6vw, 5rem))" }}>
      <div className="container-narrow">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full bg-white/10 text-secondary">Community</span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">Your Startup Tribe<br />Awaits</h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto">Join a curated community of founders, investors, and builders who believe in the power of collaboration.</p>
        </motion.div>
      </div>
    </section>

    <section className="section-padding">
      <div className="container-narrow">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading tag="Benefits" title="Why Join Our Community" center={false} />
            <div className="space-y-4">
              {[
                { icon: Users, text: "Access to a vetted network of 2,500+ startup enthusiasts" },
                { icon: BookOpen, text: "Exclusive resources, guides, and playbooks" },
                { icon: MessageSquare, text: "Peer learning through structured founder circles" },
                { icon: Award, text: "Recognition through community spotlights and features" },
              ].map((b, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <b.icon className="w-4 h-4 text-accent" />
                  </div>
                  <p className="text-muted-foreground">{b.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <img src={communityImg} alt="Community networking" className="rounded-2xl shadow-xl" loading="lazy" width={1280} height={720} />
        </div>
      </div>
    </section>

    <section className="section-padding bg-muted/50">
      <div className="container-narrow">
        <SectionHeading tag="Groups" title="Startup Circles & Groups" description="Find your niche within the community through focused groups." />
        <div className="grid sm:grid-cols-2 gap-6">
          {groups.map((g, i) => (
            <AnimatedCard key={i} delay={i * 0.1}>
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <g.icon className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="font-heading font-semibold text-primary mb-2">{g.title}</h3>
              <p className="text-sm text-muted-foreground">{g.desc}</p>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>

    <section className="section-padding">
      <div className="container-narrow">
        <SectionHeading tag="Spotlights" title="Community Stories" description="Real stories from real members who found their path through Startupa2z." />
        <div className="grid md:grid-cols-3 gap-6">
          {spotlights.map((s, i) => (
            <AnimatedCard key={i} delay={i * 0.1}>
              <p className="text-sm text-muted-foreground mb-4 italic">"{s.story}"</p>
              <div className="font-heading font-semibold text-primary text-sm">{s.name}</div>
              <div className="text-xs text-muted-foreground">{s.role}</div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>

    <CTABanner title="Be Part of Something Bigger" description="Join 2,500+ startup enthusiasts in the Bay Area's most active founder community." primaryCTA="Join the Community" />
  </PageLayout>
);

export default Community;
