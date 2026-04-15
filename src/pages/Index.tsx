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

const Index = () => (
  <PageLayout>
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
