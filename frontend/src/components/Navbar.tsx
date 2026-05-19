import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AuthDialog from "./AuthDialog";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/founders", label: "Founders" },
  { to: "/investors", label: "Investors" },
  { to: "/startups", label: "Startups" },
  { to: "/events", label: "Events" },
  { to: "/community", label: "Community" },
  { to: "/resources", label: "Resources" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
  { to: "/sponsorship", label: "Sponsorship" },
];

const signInButtonClass =
  "inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-br from-secondary to-[hsl(30,100%,58%)] text-white text-[0.85rem] font-semibold tracking-tight hover:opacity-85 hover:-translate-y-px active:scale-[0.97] transition-all";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const location = useLocation();

  const openAuth = () => {
    setOpen(false);
    setAuthOpen(true);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 px-[clamp(1.5rem,5vw,3rem)] flex items-center gap-4 bg-white/95 backdrop-blur-[20px] backdrop-saturate-[180%] shadow-[0_1px_0_rgba(0,0,0,0.06)]">
        <Link
          to="/"
          className="inline-flex shrink-0 items-center hover:-translate-y-px transition-transform"
        >
          <img
            src="/logo-transparent.webp"
            alt="StartupA2Z logo"
            width={864}
            height={159}
            className="h-8 md:h-9 w-auto select-none"
          />
        </Link>

        <div className="hidden lg:flex flex-1 items-center justify-end gap-7 min-w-0">
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

        <div className="flex items-center gap-2 shrink-0 ml-auto lg:ml-0">
          <AuthDialog open={authOpen} onOpenChange={setAuthOpen}>
            <button type="button" className={`hidden lg:inline-flex ${signInButtonClass}`}>
              Sign In
            </button>
          </AuthDialog>

          <button
            type="button"
            onClick={openAuth}
            className={`lg:hidden px-4 py-2 text-sm ${signInButtonClass}`}
          >
            Sign In
          </button>

          <button
            type="button"
            className="lg:hidden p-2"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

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
                  location.pathname === link.to
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={openAuth}
              className={`mt-4 px-6 py-3 text-base ${signInButtonClass}`}
            >
              Sign In
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
