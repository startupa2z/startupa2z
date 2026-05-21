import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import SectionHeading from "@/components/SectionHeading";
import AnimatedCard from "@/components/AnimatedCard";
import CTABanner from "@/components/CTABanner";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Handshake, Users, Check, Sparkles, ArrowRight, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { createCheckoutSession } from "@/lib/api";

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
    name: "Session Sponsor",
    price: "$2,000",
    badge: null,
    featured: false,
    packageId: "session_sponsor",
    perks: [
      "5-minute live spotlight at one session",
      "Logo on event materials for that session",
      "Featured in pre-event announcement (email + social)",
      "Post-event recap mention",
      "Listed as Session Sponsor on the event page",
      "Permanent logo placement on the Startupa2z website (sponsors section)",
    ],
  },
  {
    name: "Community Partner",
    price: "Custom",
    badge: "Most Popular",
    featured: true,
    packageId: null,
    perks: [
      "5-minute live spotlight at 3 sessions",
      "Permanent logo placement on the Startupa2z website (sponsors section)",
      "Listed on the /sponsorship page as a Community Partner",
      "Dedicated post on Startupa2z social media (LinkedIn, etc.)",
      "Introductions to relevant founders and members on request",
      "Co-branded content opportunity (one blog post or community spotlight)",
      "Recognition at every session during the partnership period",
    ],
  },
];

function PaymentBanner({ status }: { status: "success" | "cancelled" }) {
  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-medium"
      >
        <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-600" />
        Payment confirmed! We'll be in touch shortly to get your sponsorship set up.
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium"
    >
      <XCircle className="w-5 h-5 flex-shrink-0 text-amber-500" />
      Payment was not completed. You can try again whenever you're ready.
    </motion.div>
  );
}

const Sponsorship = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loadingPackageId, setLoadingPackageId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const paymentStatus = searchParams.get("payment") as "success" | "cancelled" | null;

  useEffect(() => {
    if (paymentStatus) {
      const t = setTimeout(() => {
        setSearchParams({}, { replace: true });
      }, 8000);
      return () => clearTimeout(t);
    }
  }, [paymentStatus, setSearchParams]);

  async function handlePurchase(packageId: string) {
    setLoadingPackageId(packageId);
    setCheckoutError(null);
    try {
      const { url } = await createCheckoutSession({ packageId });
      if (url) window.location.href = url;
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoadingPackageId(null);
    }
  }

  return (
    <PageLayout>
      <SEO
        title={`Sponsorship — StartupA2Z`}
        description={`Reach Bay Area founders, investors, and builders through curated events, workshops, and community programming.`}
        canonical={`https://startupa2z.org/sponsorship`}
        ogImage={`https://startupa2z.org/assets/og-sponsorship.jpg`}
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

            <AnimatePresence>
              {paymentStatus && (
                <div className="mt-6 max-w-3xl mx-auto">
                  <PaymentBanner status={paymentStatus} />
                </div>
              )}
            </AnimatePresence>

            {checkoutError && (
              <div className="mt-4 max-w-3xl mx-auto px-5 py-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {checkoutError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 max-w-3xl mx-auto">
              {packages.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative rounded-2xl flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl h-full ${
                    p.featured
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-white border border-border shadow-sm"
                  }`}
                >
                  {p.badge && (
                    <div className="flex items-center gap-1.5 px-6 pt-5">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full bg-white/20 text-white">
                        <Sparkles className="w-3 h-3" />
                        {p.badge}
                      </span>
                    </div>
                  )}

                  <div className={`px-6 ${p.badge ? "pt-3" : "pt-6"} pb-4`}>
                    <h4 className={`text-lg font-semibold font-heading ${p.featured ? "text-white" : "text-primary"}`}>
                      {p.name}
                    </h4>
                    <div className={`mt-1 text-3xl font-bold tracking-tight ${p.featured ? "text-white" : "text-foreground"}`}>
                      {p.price}
                    </div>
                  </div>

                  <div className={`mx-6 h-px ${p.featured ? "bg-white/20" : "bg-border"}`} />

                  <ul className="px-6 pt-4 pb-6 space-y-3 flex-1">
                    {p.perks.map((perk, pi) => (
                      <li key={pi} className="flex items-start gap-2.5 text-sm">
                        <span className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                          p.featured ? "bg-white/20" : "bg-accent/10"
                        }`}>
                          <Check className={`w-2.5 h-2.5 ${p.featured ? "text-white" : "text-accent"}`} />
                        </span>
                        <span className={p.featured ? "text-white/90" : "text-muted-foreground"}>
                          {perk}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="px-6 pb-6">
                    {p.packageId ? (
                      <button
                        onClick={() => handlePurchase(p.packageId!)}
                        disabled={loadingPackageId === p.packageId}
                        className={`group w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed ${
                          p.featured
                            ? "bg-white text-primary hover:bg-white/90"
                            : "bg-primary text-white hover:bg-primary/90"
                        }`}
                      >
                        {loadingPackageId === p.packageId ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Redirecting…
                          </>
                        ) : (
                          <>
                            Purchase
                            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                          </>
                        )}
                      </button>
                    ) : (
                      <Link
                        to="/contact"
                        className={`group w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                          p.featured
                            ? "bg-white text-primary hover:bg-white/90"
                            : "bg-primary text-white hover:bg-primary/90"
                        }`}
                      >
                        Contact Us
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </Link>
                    )}
                  </div>
                </motion.div>
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
};

export default Sponsorship;
