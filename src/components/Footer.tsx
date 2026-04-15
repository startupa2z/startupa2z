import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Footer = () => (
  <footer className="bg-dark text-white">
    <div className="container-narrow px-[clamp(1.5rem,5vw,3rem)] pt-[clamp(4rem,7vw,6rem)] pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.4fr] gap-8 lg:gap-12 pb-12">
        {/* Brand */}
        <div>
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4 hover:-translate-y-px transition-transform">
            <svg height="34" width="34" viewBox="0 0 34 34" fill="none">
              <rect width="34" height="34" rx="9" fill="hsl(152,36%,30%)" />
              <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="17" fontWeight="800" fontFamily="Inter, sans-serif">A</text>
            </svg>
            <span className="text-[1.15rem] font-semibold tracking-tight leading-none text-white">
              Startup<span className="text-secondary font-extrabold">a2z</span>
            </span>
          </Link>
          <p className="text-[0.875rem] text-dark-muted leading-[1.65] max-w-[200px]">
            Where founders begin. Bay Area's most intentional startup ecosystem.
          </p>
        </div>

        {/* Platform */}
        <div>
          <h4 className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-dark-muted mb-5">Platform</h4>
          <div className="flex flex-col gap-3">
            {[
              { to: "/founders", label: "For Founders" },
              { to: "/investors", label: "For Investors" },
              { to: "/startups", label: "Startup Directory" },
              { to: "/events", label: "Events & Meetups" },
              { to: "/resources", label: "Resources" },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="text-[0.875rem] text-dark-muted hover:text-white transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>

        {/* Community */}
        <div>
          <h4 className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-dark-muted mb-5">Community</h4>
          <div className="flex flex-col gap-3">
            {[
              { to: "/community", label: "Join Community" },
              { to: "/about", label: "About Us" },
              { to: "/contact", label: "Contact" },
              { to: "#", label: "Privacy Policy" },
              { to: "#", label: "Terms of Service" },
            ].map((l, i) => (
              <Link key={i} to={l.to} className="text-[0.875rem] text-dark-muted hover:text-white transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-dark-muted mb-5">Stay in the Loop</h4>
          <p className="text-[0.875rem] text-dark-muted leading-relaxed mb-4">Event announcements and founder resources. No fluff, ever.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 min-w-0 bg-dark-surface border-none rounded-full px-4 py-2.5 text-[0.85rem] text-white placeholder:text-white/28 outline-none focus:bg-[#3a3c3d] transition-colors"
            />
            <button className="bg-primary text-white border-none rounded-full px-4 py-2.5 text-[0.82rem] font-semibold hover:opacity-85 transition-opacity shrink-0">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-6 gap-4 border-t border-white/10">
        <span className="text-[0.78rem] text-white/20">© {new Date().getFullYear()} StartupA2Z.org</span>
        <div className="flex gap-6">
          <Link to="#" className="text-[0.78rem] text-white/20 hover:text-white/60 transition-colors">Privacy</Link>
          <Link to="#" className="text-[0.78rem] text-white/20 hover:text-white/60 transition-colors">Terms</Link>
          <Link to="/contact" className="text-[0.78rem] text-white/20 hover:text-white/60 transition-colors">Contact</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
