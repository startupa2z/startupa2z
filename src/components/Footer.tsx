import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container-narrow px-4 py-16">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 font-heading font-bold text-xl mb-4">
            <span className="bg-secondary inline-flex items-center justify-center w-8 h-8 rounded-lg text-secondary-foreground text-sm font-bold">A</span>
            Startupa2z
          </div>
          <p className="text-primary-foreground/60 text-sm leading-relaxed">
            Where founders begin. Bay Area's most intentional startup ecosystem.
          </p>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-xs tracking-[0.15em] uppercase text-primary-foreground/50 mb-5">Platform</h4>
          <div className="flex flex-col gap-3">
            {[
              { to: "/founders", label: "For Founders" },
              { to: "/investors", label: "For Investors" },
              { to: "/startups", label: "Startup Directory" },
              { to: "/events", label: "Events & Meetups" },
              { to: "/resources", label: "Resources" },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-xs tracking-[0.15em] uppercase text-primary-foreground/50 mb-5">Community</h4>
          <div className="flex flex-col gap-3">
            {[
              { to: "/community", label: "Join Community" },
              { to: "/about", label: "About Us" },
              { to: "/contact", label: "Contact" },
              { to: "#", label: "Privacy Policy" },
              { to: "#", label: "Terms of Service" },
            ].map((l, i) => (
              <Link key={i} to={l.to} className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-xs tracking-[0.15em] uppercase text-primary-foreground/50 mb-5">Stay in the Loop</h4>
          <p className="text-sm text-primary-foreground/50 mb-4">Event announcements and founder resources. No fluff, ever.</p>
          <div className="flex gap-2">
            <Input placeholder="your@email.com" className="bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 rounded-full text-sm h-10" />
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full w-10 h-10 p-0 shrink-0">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/40">
        <span>© {new Date().getFullYear()} StartupA2Z.org</span>
        <div className="flex gap-6">
          <Link to="#" className="hover:text-primary-foreground transition-colors">Privacy</Link>
          <Link to="#" className="hover:text-primary-foreground transition-colors">Terms</Link>
          <Link to="/contact" className="hover:text-primary-foreground transition-colors">Contact</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
