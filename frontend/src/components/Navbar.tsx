import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AuthDialog from "./AuthDialog";
import WhatsAppDialog from "./WhatsAppDialog";
import WhatsAppIcon from "./WhatsAppIcon";
import { isMemberAuthenticated } from "@/lib/auth";
import type { AuthDialogMode } from "@/lib/auth-ui";

type NavItem = {
  to?: string;
  label: string;
  children?: { to: string; label: string }[];
};

const navItems: NavItem[] = [
  { to: "/", label: "Home" },
  {
    to: "/events",
    label: "Events",
    children: [
      { to: "/events?view=upcoming", label: "Bay Area Startup Events" },
      { to: "/events?view=past", label: "Past Founder Events" },
    ],
  },
  {
    to: "/startups",
    label: "Community",
    children: [
      { to: "/startups", label: "Startup Directory" },
      { to: "/founders", label: "Founder Directory" },
      { to: "/investors", label: "Investor Network" },
    ],
  },
  {
    to: "/resources",
    label: "Resources",
    children: [
      { to: "/gallery", label: "Gallery" },
      { to: "/resources#founder-playbooks", label: "Founder's Playbook" },
      { to: "/resources#pitch-deck-resources", label: "Pitch Deck Resources" },
    ],
  },
  {
    to: "/about",
    label: "About",
    children: [
      { to: "/about", label: "About Us" },
      { to: "/contact", label: "Contact" },
    ],
  },
  { to: "/sponsorship", label: "Sponsor" },
];

const joinButtonClass =
  "inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-br from-secondary to-[hsl(30,100%,58%)] text-white text-[0.85rem] font-semibold tracking-tight hover:opacity-85 hover:-translate-y-px active:scale-[0.97] transition-all";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authRedirect, setAuthRedirect] = useState("/welcome");
  const [authMode, setAuthMode] = useState<AuthDialogMode>("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [signedIn, setSignedIn] = useState(() => isMemberAuthenticated());
  const location = useLocation();

  useEffect(() => {
    const updateAuth = () => setSignedIn(isMemberAuthenticated());
    window.addEventListener("startupa2z-auth-change", updateAuth);
    window.addEventListener("storage", updateAuth);
    return () => {
      window.removeEventListener("startupa2z-auth-change", updateAuth);
      window.removeEventListener("storage", updateAuth);
    };
  }, []);

  useEffect(() => {
    const openRequestedAuth = (event: Event) => {
      const customEvent = event as CustomEvent<{ redirectTo?: string; mode?: AuthDialogMode; email?: string }>;
      setOpen(false);
      setAuthMode(customEvent.detail?.mode || "signin");
      setAuthRedirect(customEvent.detail?.redirectTo || "/welcome");
      setAuthEmail(customEvent.detail?.email || "");
      setAuthOpen(true);
    };
    window.addEventListener("startupa2z-open-auth", openRequestedAuth);
    return () => window.removeEventListener("startupa2z-open-auth", openRequestedAuth);
  }, []);

  const openAuth = () => {
    setOpen(false);
    setAuthMode("signin");
    setAuthRedirect("/welcome");
    setAuthEmail("");
    setAuthOpen(true);
  };

  const isActive = (item: NavItem) =>
    Boolean(
      (item.to && location.pathname === item.to) ||
        item.children?.some((child) => location.pathname === child.to.split("?")[0]),
    );

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 px-2 sm:px-[clamp(1.5rem,4vw,3rem)] flex items-center gap-1 sm:gap-4 bg-white/95 backdrop-blur-[20px] backdrop-saturate-[180%] shadow-[0_1px_0_rgba(0,0,0,0.06)]">
        <Link to="/" className="inline-flex shrink-0 items-center hover:-translate-y-px transition-transform">
          <img src="/logo-transparent.webp" alt="StartupA2Z.org logo" width={864} height={159} className="h-6 sm:h-8 md:h-9 w-auto select-none" />
        </Link>

        <div className="hidden lg:flex flex-1 items-center justify-end gap-5 min-w-0">
          {navItems.map((item) => (
            <div key={item.label} className="relative group py-5">
              {item.to ? (
                <Link
                  to={item.to}
                  className={`inline-flex items-center gap-1 text-sm font-medium transition-colors ${isActive(item) ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {item.label}
                  {item.children && <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />}
                </Link>
              ) : (
                <button type="button" className={`inline-flex items-center gap-1 text-sm font-medium transition-colors ${isActive(item) ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                  {item.label}<ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                </button>
              )}
              {item.children && (
                <div className="invisible absolute left-1/2 top-[54px] w-52 -translate-x-1/2 translate-y-2 rounded-xl border border-border bg-white p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  {item.children.map((child) => (
                    <Link key={child.to} to={child.to} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary">
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-0.5 sm:gap-2 shrink-0 ml-auto lg:ml-0">
          <WhatsAppDialog>
            <button
              type="button"
              aria-label="Open WhatsApp community"
              title="WhatsApp community"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#25D366] bg-white text-[#128C4A] transition-all hover:-translate-y-px hover:bg-[#25D366]/10 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 lg:inline-flex"
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" />
            </button>
          </WhatsAppDialog>
          <WhatsAppDialog>
            <button
              type="button"
              aria-label="Open WhatsApp community"
              title="WhatsApp community"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#25D366] bg-white text-[#128C4A] transition-colors hover:bg-[#25D366]/10 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 lg:hidden"
            >
              <WhatsAppIcon className="h-4 w-4" />
            </button>
          </WhatsAppDialog>
          {signedIn ? (
            <Link to="/welcome" className={`hidden lg:inline-flex ${joinButtonClass}`}>My Account</Link>
          ) : (
            <AuthDialog open={authOpen} onOpenChange={setAuthOpen} redirectTo={authRedirect} initialMode={authMode} initialEmail={authEmail}>
              <button type="button" onClick={openAuth} className={`hidden lg:inline-flex ${joinButtonClass}`}>Sign In</button>
            </AuthDialog>
          )}

          {signedIn ? (
            <Link to="/welcome" className={`lg:hidden px-3 py-2 text-sm ${joinButtonClass}`}>My Account</Link>
          ) : (
            <button type="button" onClick={openAuth} className={`lg:hidden px-3 py-2 text-sm ${joinButtonClass}`}>Sign In</button>
          )}
          <button type="button" className="lg:hidden p-2" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[999] overflow-y-auto bg-background/97 backdrop-blur-[24px] px-8 py-20">
            <button onClick={() => setOpen(false)} className="absolute top-5 right-[clamp(1.5rem,5vw,3rem)] text-muted-foreground p-2" aria-label="Close menu"><X className="w-6 h-6" /></button>
            <div className="mx-auto flex max-w-sm flex-col gap-7">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.to ? (
                    <Link to={item.to} onClick={() => setOpen(false)} className={`text-xl font-extrabold tracking-tight ${isActive(item) ? "text-primary" : "text-foreground"}`}>{item.label}</Link>
                  ) : (
                    <div className="text-xl font-extrabold tracking-tight text-foreground">{item.label}</div>
                  )}
                  {item.children && (
                    <div className="mt-3 flex flex-col gap-2 border-l border-border pl-4">
                      {item.children.map((child) => (
                        <Link key={child.to} to={child.to} onClick={() => setOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary">{child.label}</Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {signedIn ? (
                <Link to="/welcome" onClick={() => setOpen(false)} className={`w-fit px-6 py-3 text-base ${joinButtonClass}`}>My Account</Link>
              ) : (
                <button type="button" onClick={openAuth} className={`w-fit px-6 py-3 text-base ${joinButtonClass}`}>Sign In</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
