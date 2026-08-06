import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import SectionHeading from "@/components/SectionHeading";
import AnimatedCard from "@/components/AnimatedCard";
import CTABanner from "@/components/CTABanner";
import { motion } from "framer-motion";
import { Heart, Eye, Zap, Globe, Users, Target } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Community First",
    desc: "Every decision we make centers around creating value for our members.",
  },
  {
    icon: Eye,
    title: "Transparency",
    desc: "Open communication, honest feedback, and clear expectations.",
  },
  {
    icon: Zap,
    title: "Bias to Action",
    desc: "We celebrate builders who ship, iterate, and learn fast.",
  },
  {
    icon: Globe,
    title: "Inclusivity",
    desc: "Great ideas come from everywhere. We welcome all backgrounds and perspectives.",
  },
  {
    icon: Users,
    title: "Collaboration",
    desc: "Competition breeds innovation, but collaboration builds ecosystems.",
  },
  {
    icon: Target,
    title: "Impact",
    desc: "We measure success by the real outcomes our members achieve together.",
  },
];

const About = () => (
  <PageLayout>
    <SEO
      title={`About StartupA2Z | StartupA2Z`}
      description="StartupA2Z brings founders, mentors, and investors together to share knowledge, solve real problems, and help startups grow."
      canonical={`https://startupa2z.org/about`}
      ogImage={`https://startupa2z.org/assets/og-about.jpg`}
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
            About Us
          </span>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-5">
            Helping Founders Build Better
          </h1>
          <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto">
            Learn from others, solve real problems, and grow together.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="section-padding">
      <div className="container-narrow">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-16">
          <div>
            <SectionHeading
              tag="Vision"
              title="Founders helping founders succeed"
              center={false}
              size="compact"
            />
            <p className="text-muted-foreground leading-relaxed">
              Building a startup is hard. Founders should not have to learn
              every lesson alone. Startupa2z brings people together so useful
              experience, advice, and connections reach founders when they need them.
            </p>
          </div>
          <div>
            <SectionHeading
              tag="Mission"
              title="Connect people. Share knowledge. Solve problems."
              center={false}
              size="compact"
            />
            <p className="text-muted-foreground leading-relaxed mb-5">
              Startupa2z connects founders, mentors, and investors to work on
              real startup challenges—not just exchange business cards. We:
            </p>
            <ul className="space-y-3 text-muted-foreground leading-relaxed">
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" /><span>Connect founders with people who have solved similar problems.</span></li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" /><span>Turn recurring startup lessons into practical playbooks.</span></li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" /><span>Build trusted relationships between founders and investors.</span></li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" /><span>Grow a strong Bay Area community for AI and cybersecurity startups.</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section className="section-padding bg-muted/50">
      <div className="container-narrow">
        <SectionHeading
          tag="Our Story"
          title="Why We Started"
          size="compact"
        />
        <div className="max-w-3xl mx-auto space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Startupa2z began after we saw the same problem again and again:
            capable founders were losing months solving challenges that other
            founders had already faced.
          </p>
          <p>
            The knowledge existed, but it was not reaching the right people at
            the right time. Founders needed a trusted place to ask honest
            questions, learn from experience, and find useful connections.
          </p>
          <p>
            We created Startupa2z to make that knowledge easier to access—so
            founders can avoid preventable mistakes and spend more time building.
          </p>
        </div>
      </div>
    </section>

    <section className="section-padding">
      <div className="container-narrow">
        <SectionHeading
          tag="Values"
          title="How We Work"
          description="Simple principles that guide our community."
          size="compact"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <AnimatedCard key={i} delay={i * 0.1}>
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <v.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-primary mb-2">
                {v.title}
              </h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>

    <CTABanner
      title="Join the Community"
      description="Connect with founders, share what you know, and build together."
    />
  </PageLayout>
);

export default About;
