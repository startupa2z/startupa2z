import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { getEventBySlug } from "@/data/events";

const featuredWorkshop = getEventBySlug("founder-networking-workshop-2026-09-01");

const SpecialEventBanner = () => {
  if (!featuredWorkshop) return null;

  const eventEnd = featuredWorkshop.endDateIso
    ? new Date(featuredWorkshop.endDateIso).getTime()
    : null;
  if (eventEnd && Date.now() > eventEnd) return null;

  return (
    <aside
      aria-label="Featured September 1 founder workshop"
      className="relative z-10 w-full"
    >
      <div className="container-narrow px-[clamp(1.5rem,5vw,3rem)]">
        <div className="overflow-hidden rounded-2xl border border-white/20 bg-[hsl(226,73%,10%)] shadow-[0_20px_55px_rgba(0,0,0,0.32)]">
          <div className="grid min-h-[132px] md:grid-cols-[minmax(260px,0.85fr)_minmax(0,1.35fr)]">
          <Link
            to={`/events/${featuredWorkshop.slug}`}
            aria-label={`View ${featuredWorkshop.title}`}
            className="group relative hidden aspect-[2.2/1] overflow-hidden border-r border-white/10 md:block"
          >
            <img
              src={featuredWorkshop.imageUrl || ""}
              alt="StartupA2Z founder networking and GTM workshop"
              className="absolute inset-0 h-full w-full bg-[hsl(226,73%,10%)] object-contain transition-transform duration-500 group-hover:scale-[1.015]"
              width={1680}
              height={945}
            />
          </Link>

            <div className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-secondary">
                <Users className="h-3.5 w-3.5" />
                Tomorrow at Hacker Dojo
              </div>
              <h2 className="mt-1.5 font-heading text-xl font-extrabold leading-tight text-white sm:text-2xl">
                Founder Networking &amp; GTM Workshop
              </h2>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-medium text-white/75 sm:text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-secondary" />
                  September 1 | 5:00-8:00 PM
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-secondary" />
                  Hacker Dojo | Mountain View
                </span>
                <span className="font-bold text-secondary">93 registered | 47 on the waitlist</span>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <Link
                to={`/events/${featuredWorkshop.slug}`}
                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-white/20"
              >
                View event
              </Link>
              <a
                href={featuredWorkshop.registrationUrl || `/events/${featuredWorkshop.slug}`}
                target={featuredWorkshop.registrationUrl ? "_blank" : undefined}
                rel={featuredWorkshop.registrationUrl ? "noopener noreferrer" : undefined}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-secondary px-4 py-2.5 text-xs font-bold text-white shadow-[0_8px_24px_rgba(232,137,26,0.3)] transition-all hover:-translate-y-0.5 hover:bg-[hsl(30,100%,58%)]"
              >
                Join waitlist <ArrowRight className="h-4 w-4" />
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
