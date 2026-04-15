import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import JoinSheet from "@/components/JoinSheet";
import logo from "@/assets/logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/founders", label: "Founders" },
  { to: "/investors", label: "Investors" },
  { to: "/startups", label: "Startups" },
  { to: "/events", label: "Events" },
  { to: "/community", label: "Community" },
  { to: "/resources", label: "Resources" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 px-[clamp(1.5rem,5vw,3rem)] flex items-center justify-between gap-8 bg-white/95 backdrop-blur-[20px] backdrop-saturate-[180%] shadow-[0_1px_0_rgba(0,0,0,0.06)]">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center hover:-translate-y-px transition-transform">
          <img src={logo} alt="StartupA2Z logo" width={200} height={56} className="h-14 w-auto" />
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-7 ml-auto">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium relative transition-colors after:content-[''] after:absolute after:bottom-[-3px] after:left-0 after:h-[1.5px] after:bg-primary after:transition-[width] after:duration-200 ${
                location.pathname === link.to
                  ? "text-foreground after:w-full"
                  : "text-muted-foreground hover:text-foreground after:w-0 hover:after:w-full"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => setJoinOpen(true)}
          className="hidden lg:inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-br from-secondary to-[hsl(30,100%,58%)] text-white text-[0.85rem] font-semibold tracking-tight hover:opacity-85 hover:-translate-y-px active:scale-[0.97] transition-all"
        >
          Join Now
        </button>

        {/* Mobile toggle */}
        <button className="lg:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-background/97 backdrop-blur-[24px] flex flex-col items-center justify-center gap-5"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-5 right-[clamp(1.5rem,5vw,3rem)] text-muted-foreground text-2xl p-2"
            >
              <X className="w-6 h-6" />
            </button>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`text-2xl font-extrabold tracking-tight transition-colors ${
                  location.pathname === link.to ? "text-primary" : "text-foreground hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => { setOpen(false); setJoinOpen(true); }}
              className="mt-4 inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-br from-secondary to-[hsl(30,100%,58%)] text-white text-base font-semibold"
            >
              Join Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <JoinSheet open={joinOpen} onOpenChange={setJoinOpen} />
    </>
  );
};

export default Navbar;
