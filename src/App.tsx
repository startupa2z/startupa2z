import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Founders from "./pages/Founders.tsx";
import Investors from "./pages/Investors.tsx";
import Startups from "./pages/Startups.tsx";
import Events from "./pages/Events.tsx";
import EventDetail from "./pages/EventDetail.tsx";
import Community from "./pages/Community.tsx";
import Resources from "./pages/Resources.tsx";
import Contact from "./pages/Contact.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminSubmissions from "./pages/AdminSubmissions.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/founders" element={<Founders />} />
          <Route path="/investors" element={<Investors />} />
          <Route path="/startups" element={<Startups />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug" element={<EventDetail />} />
          <Route path="/community" element={<Community />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/submissions" element={<AdminSubmissions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
