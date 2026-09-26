import { ArrowRight, CalendarDays, MapPin } from "lucide-react";

const eventUrl = "https://cyberriskalliance.swoogo.com/silicon-valley-2026/12598818";
const bannerEnd = new Date("2026-10-14T00:00:00-07:00");

const CybersecuritySummitBanner = () => {
  if (Date.now() >= bannerEnd.getTime()) return null;

  return (
    <aside aria-label="StartupA2Z partner event: Silicon Valley Cybersecurity Summit" className="relative z-10 w-full">
      <div className="container-narrow px-[clamp(1.5rem,5vw,3rem)]">
        <div className="overflow-hidden rounded-2xl border border-white/20 bg-[hsl(226,73%,10%)] shadow-[0_20px_55px_rgba(0,0,0,0.32)] md:flex md:items-stretch">
          <a
            href={eventUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View the Silicon Valley Cybersecurity Summit partner event"
            className="hidden shrink-0 bg-[#00182d] md:block md:w-[260px] lg:w-[330px]"
          >
            <img
              src="/partner-banners/startupa2z-cybersecurity-summit-2026.png"
              alt="StartupA2Z proud partner graphic for the Silicon Valley Cybersecurity Summit"
              width={1200}
              height={628}
              className="h-full w-full object-contain"
            />
          </a>

          <div className="flex min-w-0 flex-1 flex-col gap-3 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <div className="min-w-0">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-secondary">
                StartupA2Z proud partner
              </p>
              <h2 className="mt-1 font-heading text-xl font-extrabold leading-tight text-white sm:text-2xl">
                Silicon Valley Cybersecurity Summit
              </h2>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/80">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-secondary" aria-hidden="true" />
                  October 13, 2026
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-secondary" aria-hidden="true" />
                  Santa Clara Marriott
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Complimentary admission with code <strong className="font-semibold text-white">CSS26-STARTUPA2Z</strong> for eligible active cybersecurity, IT, and information security practitioners. All registrations are reviewed.
              </p>
            </div>

            <a
              href={eventUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-full bg-secondary px-4 py-2.5 text-xs font-bold text-white shadow-[0_8px_24px_rgba(232,137,26,0.3)] transition-all hover:-translate-y-0.5 hover:bg-[hsl(30,100%,58%)] lg:self-center"
            >
              View event &amp; register <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default CybersecuritySummitBanner;
