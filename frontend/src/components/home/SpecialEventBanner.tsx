import { ArrowRight, CalendarDays, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { getEventBySlug } from "@/data/events";

const wizSession = getEventBySlug("founders-pitch-mix-2026-09-22");

const SpecialEventBanner = () => {
  if (!wizSession) return null;

  return (
    <aside
      aria-label="Featured Wiz session for founders"
      className="relative z-10 w-full"
    >
      <div className="container-narrow px-[clamp(1.5rem,5vw,3rem)]">
        <div className="overflow-hidden rounded-2xl border border-white/20 bg-[hsl(226,73%,10%)] shadow-[0_20px_55px_rgba(0,0,0,0.32)]">
          <div className="grid min-h-[132px] md:grid-cols-[minmax(260px,0.85fr)_minmax(0,1.35fr)]">
          <Link
            to={`/events/${wizSession.slug}`}
            aria-label={`View ${wizSession.title}`}
            className="group relative hidden aspect-[2.2/1] overflow-hidden border-r border-white/10 md:block"
          >
            <img
              src={wizSession.imageUrl || ""}
              alt="StartupA2Z and Wiz special session for founders"
              className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.015]"
              width={1680}
              height={945}
            />
          </Link>

            <div className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-secondary">
                <Sparkles className="h-3.5 w-3.5" />
                Featured session for founders
              </div>
              <h2 className="mt-1.5 font-heading text-xl font-extrabold leading-tight text-white sm:text-2xl">
                The Wiz Story
                <span className="font-semibold text-white/70"> led by Kevin Cooke</span>
              </h2>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-medium text-white/75 sm:text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-secondary" />
                  September 22 · 5:00–8:00 PM
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-secondary" />
                  Hacker Dojo · Mountain View
                </span>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <Link
                to={`/events/${wizSession.slug}`}
                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-white/20"
              >
                View session
              </Link>
              <a
                href={wizSession.registrationUrl || `/events/${wizSession.slug}`}
                target={wizSession.registrationUrl ? "_blank" : undefined}
                rel={wizSession.registrationUrl ? "noopener noreferrer" : undefined}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-secondary px-4 py-2.5 text-xs font-bold text-white shadow-[0_8px_24px_rgba(232,137,26,0.3)] transition-all hover:-translate-y-0.5 hover:bg-[hsl(30,100%,58%)]"
              >
                Reserve a spot <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SpecialEventBanner;
