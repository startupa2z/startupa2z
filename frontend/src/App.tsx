import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import MemberProfileGate from "@/components/MemberProfileGate";
import PageViewTracker from "@/components/PageViewTracker";

const Index = lazy(() => import("./pages/Index.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Founders = lazy(() => import("./pages/Founders.tsx"));
const FounderDetail = lazy(() => import("./pages/FounderDetail.tsx"));
const Investors = lazy(() => import("./pages/Investors.tsx"));
const Startups = lazy(() => import("./pages/Startups.tsx"));
const BusinessDetail = lazy(() => import("./pages/BusinessDetail.tsx"));
const Events = lazy(() => import("./pages/Events.tsx"));
const EventDetail = lazy(() => import("./pages/EventDetail.tsx"));
const Resources = lazy(() => import("./pages/Resources.tsx"));
const EventSummaries = lazy(() => import("./pages/EventSummaries.tsx"));
const FounderPlaybookDetail = lazy(() => import("./pages/FounderPlaybookDetail.tsx"));
const FounderPlaybooks = lazy(() => import("./pages/FounderPlaybooks.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Sponsorship = lazy(() => import("./pages/Sponsorship.tsx"));
const Gallery = lazy(() => import("./pages/Gallery.tsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.tsx"));
const AdminSubmissions = lazy(() => import("./pages/AdminSubmissions.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Welcome = lazy(() => import("./pages/Welcome.tsx"));
const CompleteProfile = lazy(() => import("./pages/CompleteProfile.tsx"));
const ApplyToPitch = lazy(() => import("./pages/ApplyToPitch.tsx"));
const PitchApplication = lazy(() => import("./pages/PitchApplication.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageViewTracker />
        <MemberProfileGate>
        <Suspense fallback={<main className="min-h-screen bg-background" aria-label="Loading page" />}>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/founders" element={<Founders />} />
          <Route path="/founders/:slug" element={<FounderDetail />} />
          <Route path="/investors" element={<Investors />} />
          <Route path="/startups" element={<Startups />} />
          <Route path="/startups/:slug" element={<BusinessDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug" element={<EventDetail />} />
          <Route path="/community" element={<Navigate to="/events" replace />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/event-summaries" element={<EventSummaries />} />
          <Route path="/resources/founder-playbooks" element={<FounderPlaybooks />} />
          <Route path="/resources/founder-playbooks/:slug" element={<FounderPlaybookDetail />} />
          <Route path="/sponsorship" element={<Sponsorship />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:eventSlug" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/apply-to-pitch" element={<ApplyToPitch />} />
          <Route path="/pitch-application" element={<PitchApplication />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/submissions" element={<AdminSubmissions />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </MemberProfileGate>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
