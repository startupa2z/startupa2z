import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => (
  <footer className="gradient-navy text-primary-foreground">
    <div className="container-narrow px-4 py-16">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 font-heading font-bold text-xl mb-4">
            <span className="gradient-warm inline-flex items-center justify-center w-8 h-8 rounded-lg text-secondary-foreground text-sm font-bold">A</span>
            Startupa2z
          </div>
          <p className="text-primary-foreground/70 text-sm leading-relaxed">
            The Bay Area's premier startup community platform. From A to Z of Startups — connect, build, fund, and grow together.
          </p>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-4">Platform</h4>
          <div className="flex flex-col gap-2">
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
          <h4 className="font-heading font-semibold mb-4">Community</h4>
          <div className="flex flex-col gap-2">
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
          <h4 className="font-heading font-semibold mb-4">Stay Updated</h4>
          <p className="text-sm text-primary-foreground/60 mb-3">Get the latest from Bay Area's startup ecosystem.</p>
          <div className="flex gap-2">
            <Input placeholder="Your email" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 rounded-full text-sm" />
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-5 text-sm shrink-0">Subscribe</Button>
          </div>
          <div className="flex gap-3 mt-5">
            {["X", "Li", "Ig", "Yt"].map((icon) => (
              <span key={icon} className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center text-xs font-bold text-primary-foreground/60 hover:bg-primary-foreground/20 cursor-pointer transition-colors">
                {icon}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 mt-12 pt-6 text-center text-sm text-primary-foreground/40">
        © {new Date().getFullYear()} Startupa2z.org. All rights reserved. Built for the Bay Area startup ecosystem.
      </div>
    </div>
  </footer>
);

export default Footer;
