import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/SectionHeading";
import AnimatedCard from "@/components/AnimatedCard";
import CTABanner from "@/components/CTABanner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Users, Lightbulb, TrendingUp, Calendar, Rocket, Target, Handshake, Star } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import communityImg from "@/assets/community.jpg";

const stats = [
  { value: "2,500+", label: "Community Members" },
  { value: "150+", label: "Startup Ideas Shared" },
  { value: "80+", label: "Events Hosted" },
  { value: "45+", label: "Investor Connections" },
  { value: "30+", label: "Successful Matches" },
];

const howItWorks = [
  { icon: Users, title: "Join the Community", description: "Create your profile as a founder, investor, mentor, or community member." },
  { icon: Lightbulb, title: "Share & Discover", description: "Post your startup idea or explore promising ventures in the directory." },
  { icon: Handshake, title: "Connect & Collaborate", description: "Find co-founders, advisors, investors, and team members who align with your vision." },
  { icon: Rocket, title: "Build & Launch", description: "Access resources, attend events, and turn your idea into a funded startup." },
];

const audiences = [
  { icon: Rocket, title: "Founders", description: "Share ideas, find co-founders, connect with investors, and access resources to build.", link: "/founders" },
  { icon: TrendingUp, title: "Investors", description: "Discover early-stage startups, attend pitch events, and connect with promising founders.", link: "/investors" },
  { icon: Target, title: "Mentors", description: "Guide the next generation of entrepreneurs with your experience and expertise.", link: "/community" },
  { icon: Users, title: "Community", description: "Join startup circles, attend meetups, and be part of the Bay Area ecosystem.", link: "/community" },
];

const testimonials = [
  { name: "Sarah Chen", role: "Founder, NovaTech AI", quote: "Startupa2z connected me with my co-founder and our first angel investor within three months. This community is the real deal." },
  { name: "Marcus Rivera", role: "Angel Investor", quote: "I've discovered three portfolio companies through Startupa2z events. The quality of founders here is exceptional." },
  { name: "Priya Sharma", role: "Product Designer", quote: "As someone transitioning into startups, the mentorship and networking here gave me the confidence to make the leap." },
];

const featuredStartups = [
  { name: "GreenFleet", pitch: "Electric fleet management for last-mile delivery", stage: "Seed", tags: ["CleanTech", "Logistics"] },
  { name: "MedBridge AI", pitch: "AI-powered clinical trial matching platform", stage: "Pre-Seed", tags: ["HealthTech", "AI"] },
  { name: "Stackbase", pitch: "No-code data infrastructure for SMBs", stage: "Series A", tags: ["DevTools", "SaaS"] },
  { name: "CultureSync", pitch: "Remote team culture analytics platform", stage: "Seed", tags: ["HR Tech", "Remote"] },
];

const Index = () => (
  <PageLayout>
    {/* Hero */}
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/70 to-navy/90" />
      <div className="relative z-10 container-narrow px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-6 px-4 py-1.5 rounded-full bg-accent/20 text-teal-light">
            Bay Area's Startup Ecosystem
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary-foreground leading-tight mb-6">
            Where Founders,<br />Investors & Builders<br />
            <span className="gradient-text-accent">Come Together</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            From A to Z of Startups — connect with co-founders, discover investment opportunities, attend meetups, and build the next big thing in the Bay Area.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-8 h-13 text-base font-semibold shadow-lg">
              <Link to="/contact">Join the Community <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/60 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full px-8 h-13 text-base font-semibold shadow-lg">
              <Link to="/startups">Explore Startups</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Stats */}
    <section className="section-padding bg-card">
      <div className="container-narrow">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="font-heading text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Why Startupa2z */}
    <section className="section-padding">
      <div className="container-narrow">
        <SectionHeading
          tag="Why Startupa2z"
          title="The Bay Area's Most Trusted Startup Community"
          description="We bring together founders, investors, mentors, and operators in a curated ecosystem designed for meaningful connections and real outcomes."
        />
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <img src={communityImg} alt="Startupa2z community networking event" className="rounded-2xl shadow-xl" loading="lazy" width={1280} height={720} />
          </div>
          <div className="space-y-6">
            {[
              { title: "Curated Community", desc: "Every member is vetted and connected based on relevance — no noise, only signal." },
              { title: "Real Outcomes", desc: "From co-founder matching to funded rounds, our community drives measurable results." },
              { title: "Bay Area Native", desc: "Rooted in San Francisco, Oakland, and Silicon Valley — built by locals, for locals." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-primary mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* How It Works */}
    <section className="section-padding bg-muted/50">
      <div className="container-narrow">
        <SectionHeading tag="How It Works" title="Get Started in Four Simple Steps" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorks.map((step, i) => (
            <AnimatedCard key={i} delay={i * 0.1}>
              <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center mb-4">
                <step.icon className="w-6 h-6 text-accent-foreground" />
              </div>
              <div className="text-xs font-bold text-accent mb-2">Step {i + 1}</div>
              <h3 className="font-heading font-semibold text-primary mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>

    {/* Explore by Audience */}
    <section className="section-padding">
      <div className="container-narrow">
        <SectionHeading tag="For Everyone" title="Find Your Place in the Ecosystem" description="Whether you're building, funding, mentoring, or learning — there's a space for you." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((a, i) => (
            <AnimatedCard key={i} delay={i * 0.1} className="group cursor-pointer">
              <Link to={a.link} className="block">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 group-hover:bg-secondary/20 flex items-center justify-center mb-4 transition-colors">
                  <a.icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-heading font-semibold text-primary mb-2">{a.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{a.description}</p>
                <span className="text-sm font-medium text-secondary flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>

    {/* Featured Startups */}
    <section className="section-padding bg-muted/50">
      <div className="container-narrow">
        <SectionHeading tag="Featured" title="Promising Startups in the Community" description="Discover innovative ideas from Bay Area founders ready to change the world." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredStartups.map((s, i) => (
            <AnimatedCard key={i} delay={i * 0.1}>
              <div className="w-10 h-10 rounded-lg gradient-navy flex items-center justify-center text-primary-foreground font-heading font-bold text-sm mb-3">
                {s.name[0]}
              </div>
              <h3 className="font-heading font-semibold text-primary mb-1">{s.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{s.pitch}</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">{s.stage}</span>
                {s.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</span>
                ))}
              </div>
            </AnimatedCard>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button asChild variant="outline" className="rounded-full px-8">
            <Link to="/startups">View All Startups <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>
      </div>
    </section>

    {/* Upcoming Events */}
    <section className="section-padding">
      <div className="container-narrow">
        <SectionHeading tag="Events" title="Upcoming Meetups & Events" description="Network with founders, investors, and operators at Bay Area events." />
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Founder Friday: AI Edition", date: "April 18, 2026", venue: "SOMA, San Francisco", type: "Networking" },
            { title: "Pitch Night: CleanTech", date: "April 25, 2026", venue: "Oakland Hub", type: "Pitch Event" },
            { title: "Startup Coffee Chat", date: "May 2, 2026", venue: "Palo Alto", type: "Casual Meetup" },
          ].map((event, i) => (
            <AnimatedCard key={i} delay={i * 0.1}>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-secondary">{event.date}</span>
              </div>
              <h3 className="font-heading font-semibold text-primary mb-1">{event.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{event.venue}</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">{event.type}</span>
            </AnimatedCard>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button asChild variant="outline" className="rounded-full px-8">
            <Link to="/events">View All Events <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="section-padding gradient-navy">
      <div className="container-narrow">
        <SectionHeading tag="Testimonials" title="What Our Community Says" light />
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-xl p-6"
            >
              <p className="text-primary-foreground/80 text-sm leading-relaxed mb-4">"{t.quote}"</p>
              <div>
                <div className="font-heading font-semibold text-primary-foreground text-sm">{t.name}</div>
                <div className="text-xs text-primary-foreground/50">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Bay Area Ecosystem */}
    <section className="section-padding">
      <div className="container-narrow text-center">
        <SectionHeading
          tag="Bay Area"
          title="Rooted in the World's Startup Capital"
          description="From San Francisco to San Jose, we connect entrepreneurs across the entire Bay Area ecosystem."
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["San Francisco", "Oakland", "Palo Alto", "San Jose", "Berkeley", "Mountain View", "Menlo Park", "Fremont"].map((city, i) => (
            <motion.div
              key={city}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="py-4 px-3 rounded-xl bg-muted/50 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary transition-colors cursor-default"
            >
              {city}
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <CTABanner
      title="Ready to Join the Bay Area's Startup Community?"
      description="Whether you're building, investing, or mentoring — your journey starts here."
      primaryCTA="Join the Community"
      primaryLink="/contact"
      secondaryCTA="Learn More"
      secondaryLink="/about"
    />
  </PageLayout>
);

export default Index;
