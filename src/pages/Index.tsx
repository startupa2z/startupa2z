import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import EventsSection from "@/components/home/EventsSection";
import WhySection from "@/components/home/WhySection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import AudienceSection from "@/components/home/AudienceSection";
import StartupsSection from "@/components/home/StartupsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import BayAreaSection from "@/components/home/BayAreaSection";
import HomeCTASection from "@/components/home/HomeCTASection";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";

const Index = () => (
  <PageLayout>
    <SEO
      title={`Startup Events in Bay Area | StartupA2Z`}
      description={`Discover startup events, founder meetups, networking sessions, and mentorship opportunities in the Bay Area.`}
      canonical={`https://startupa2z.org/`}
      ogImage={`https://startupa2z.org/assets/og-home.jpg`}
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "StartupA2Z",
        url: "https://startupa2z.org",
        logo: "https://startupa2z.org/assets/logo.png",
      }}
    />
    <HeroSection />
    <EventsSection />
    <StatsSection />
    <WhySection />
    <HowItWorksSection />
    <AudienceSection />
    <StartupsSection />
    <TestimonialsSection />
    <BayAreaSection />
    <HomeCTASection />
  </PageLayout>
);

export default Index;
