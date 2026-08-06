import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Facebook, Instagram, Linkedin, X as XIcon } from "lucide-react";
import { openAuthDialog } from "@/lib/auth-ui";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleJoin = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    openAuthDialog("signup", "/welcome", email.trim());
  };

  return (
    <footer className="bg-dark text-white">
      <div className="container-narrow px-[clamp(1.5rem,5vw,3rem)] pt-[clamp(4rem,7vw,6rem)] pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.4fr] gap-8 lg:gap-12 pb-12">
          <div>
            <Link to="/" className="inline-flex items-center mb-4 hover:-translate-y-px transition-transform bg-white rounded-xl px-3 py-2">
              <img src="/logo-transparent.webp" alt="StartupA2Z logo" width={2347} height={432} className="h-9 w-auto select-none" />
            </Link>
            <p className="text-[0.875rem] text-dark-muted leading-[1.65] max-w-[200px]">Where founders begin. Bay Area&apos;s most intentional startup ecosystem.</p>
          </div>

          <div>
            <h4 className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-dark-muted mb-5">Platform</h4>
            <div className="flex flex-col gap-3">
              {[
                { to: "/founders", label: "For Founders" },
                { to: "/investors", label: "For Investors" },
                { to: "/startups", label: "Startup Directory" },
                { to: "/events", label: "Bay Area Startup Events" },
                { to: "/resources", label: "Resources" },
              ].map((link) => <Link key={link.to} to={link.to} className="text-[0.875rem] text-dark-muted hover:text-white transition-colors">{link.label}</Link>)}
            </div>
          </div>

          <div>
            <h4 className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-dark-muted mb-5">Community</h4>
            <div className="flex flex-col gap-3">
              {[
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" },
                { to: "/sponsorship", label: "Sponsorship" },
              ].map((link) => <Link key={link.to} to={link.to} className="text-[0.875rem] text-dark-muted hover:text-white transition-colors">{link.label}</Link>)}
            </div>
          </div>

          <div>
            <h4 className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-dark-muted mb-5">Stay in the Loop</h4>
            <p className="text-[0.875rem] text-dark-muted leading-relaxed mb-4">Join the community for event announcements and founder resources.</p>
            <form className="flex gap-2" onSubmit={handleJoin}>
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input id="footer-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="your@email.com" className="flex-1 min-w-0 bg-dark-surface border-none rounded-full px-4 py-2.5 text-[0.85rem] text-white placeholder:text-white/28 outline-none focus:bg-[#3a3c3d] transition-colors" />
              <button type="submit" aria-label="Join with email" className="bg-primary text-white border-none rounded-full px-4 py-2.5 text-[0.82rem] font-semibold hover:opacity-85 transition-opacity shrink-0"><ArrowRight className="w-4 h-4" /></button>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-6 gap-4 border-t border-white/10">
          <span className="text-[0.78rem] text-white/20">© {new Date().getFullYear()} StartupA2Z.org</span>
          <Link to="/contact" className="text-[0.78rem] text-white/20 hover:text-white/60 transition-colors">Contact</Link>
          <div className="flex items-center gap-4">
            {[
              { href: "https://linkedin.com/company/startupa2z", label: "LinkedIn", icon: Linkedin },
              { href: "https://twitter.com/startupa2z", label: "X (Twitter)", icon: XIcon },
              { href: "https://instagram.com/startupa2z", label: "Instagram", icon: Instagram },
              { href: "https://facebook.com/startupa2z", label: "Facebook", icon: Facebook },
            ].map(({ href, label, icon: Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/60 transition-colors" aria-label={label}><Icon className="w-5 h-5" /></a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
