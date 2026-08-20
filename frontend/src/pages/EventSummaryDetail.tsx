import { useEffect } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Lightbulb,
  Linkedin,
  MapPin,
  Users,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import { getEventSummary } from "@/data/eventSummaries";

type EventSummaryDetailProps = {
  summarySlug?: string;
};

const EventSummaryDetail = ({ summarySlug }: EventSummaryDetailProps) => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const summary = getEventSummary(summarySlug || slug || "");

  useEffect(() => {
    if (!summary || !location.hash) return;

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, summary]);

  if (!summary) return <Navigate to="/resources/event-summaries" replace />;

  return (
    <PageLayout>
      <SEO
        title={`${summary.title} | StartupA2Z.org`}
        description={summary.summary}
        canonical={`https://startupa2z.org/events/${summary.eventSlug}`}
        ogImage={summary.coverImage}
        noindex={summary.status === "draft"}
      />

      <section
        className="gradient-hero-solid text-white"
        style={{ paddingTop: "calc(64px + clamp(2rem, 5vw, 4rem))" }}
      >
        <div className="container-narrow pb-[clamp(3rem,6vw,5rem)]">
          <Link
            to="/events?view=past"
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Past events
          </Link>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-secondary">
              Completed event
            </span>
            {summary.status === "draft" && (
              <span className="rounded-full bg-amber-300 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-amber-950">
                Local draft
              </span>
            )}
          </div>
          <h1 className="mt-5 max-w-5xl font-heading text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            {summary.title}
          </h1>
          <div className="mt-7 flex flex-col gap-3 text-white/75 sm:flex-row sm:flex-wrap sm:gap-6">
            <span className="inline-flex items-center gap-2"><CalendarDays className="h-5 w-5 text-secondary" />{summary.date}</span>
            <span className="inline-flex items-center gap-2"><MapPin className="h-5 w-5 text-secondary" />{summary.venue}</span>
          </div>
        </div>
      </section>

      <main className="section-padding bg-background">
        <div className="container-narrow grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-12">
            <a
              href="#founder-journeys"
              aria-label="Jump to the founder journey"
              className="group relative block overflow-hidden rounded-3xl border border-border bg-[#f8f0e3] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
            >
              <img
                src={summary.coverImage}
                alt={summary.eventTitle}
                className="aspect-[16/9] h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.015]"
              />
              <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-primary/90 px-4 py-2 text-sm font-bold text-primary-foreground shadow-lg backdrop-blur-sm transition-colors group-hover:bg-secondary group-hover:text-secondary-foreground">
                Founder journey <ArrowRight className="h-4 w-4" />
              </span>
            </a>

            <section id="event-overview" className="scroll-mt-24">
              <p className="label-overline mb-3">What happened</p>
              <h2 className="font-heading text-3xl font-bold text-primary">The event at a glance</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">{summary.summary}</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {summary.program.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-card p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                    <span className="font-medium text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="founder-journeys" className="scroll-mt-24">
              <p className="label-overline mb-3">The StartupA2Z difference</p>
              <h2 className="font-heading text-3xl font-bold text-primary">Founder journey</h2>
              <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
                These stories are drawn from the founder presentations and the event posts published afterward. They capture the problem each team brought into the room, the approach they demonstrated, and the lesson another founder can apply.
              </p>
              <div className="mt-8 space-y-8">
                {summary.founderStories.map((story, index) => (
                  <article
                    key={story.company}
                    id={`founder-${story.anchor}`}
                    className="overflow-hidden rounded-3xl border-2 border-primary/15 bg-card shadow-[0_14px_40px_rgba(27,75,57,0.08)]"
                  >
                    <div className="grid border-b border-primary/10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-stretch">
                      <div className="flex flex-col justify-center p-6 sm:p-7 md:p-8">
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-secondary">
                          Founder story {String(index + 1).padStart(2, "0")} · {story.company}
                        </p>
                        <h3 className="mt-3 font-heading text-2xl font-bold leading-tight text-primary">
                          {story.headline}
                        </h3>
                        <p className="mt-2 font-semibold text-foreground">{story.founders}</p>
                      </div>
                      <figure className="border-t border-primary/10 bg-[#f8f0e3] p-4 sm:p-5 lg:border-l lg:border-t-0">
                        <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/70 shadow-[0_10px_28px_rgba(27,75,57,0.14)]">
                          <img
                            src={story.image}
                            alt={story.imageAlt}
                            className={`h-full w-full object-cover ${story.anchor === "keyframe-ai" ? "scale-[1.35] object-[center_74%]" : ""}`}
                          />
                        </div>
                        <figcaption className="mt-3 text-xs leading-5 text-muted-foreground">
                          {story.imageAlt}
                        </figcaption>
                      </figure>
                    </div>
                    <div className="p-6 sm:p-7 md:p-8">
                      <dl className="grid gap-3 text-sm leading-6 md:grid-cols-2">
                          <div className="rounded-2xl bg-surface-1 px-4 py-3.5">
                            <dt className="font-bold text-foreground">The problem</dt>
                            <dd className="mt-1 text-muted-foreground">{story.challenge}</dd>
                          </div>
                          <div className="rounded-2xl bg-surface-1 px-4 py-3.5">
                            <dt className="font-bold text-foreground">What they demonstrated</dt>
                            <dd className="mt-1 text-muted-foreground">{story.approach}</dd>
                          </div>
                          <div className="rounded-2xl border border-secondary/20 bg-secondary/5 px-4 py-3.5 md:col-span-2">
                            <dt className="font-bold text-foreground">Founder takeaway</dt>
                            <dd className="mt-1 text-muted-foreground">{story.lesson}</dd>
                          </div>
                      </dl>
                      <div className="mt-6 flex flex-wrap gap-3">
                          {story.directoryPath ? (
                            <Link
                              to={story.directoryPath}
                              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
                            >
                              Explore startup profile <Building2 className="h-4 w-4" />
                            </Link>
                          ) : (
                            <a
                              href={story.website}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
                            >
                              Visit {story.company} <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          {story.founderProfiles.map((founder) =>
                            founder.internal ? (
                              <Link
                                key={founder.name}
                                to={founder.url}
                                className="inline-flex items-center gap-2 rounded-xl border border-[#0A66C2]/30 px-4 py-2.5 text-sm font-bold text-[#0A66C2] hover:border-[#0A66C2]"
                              >
                                {founder.name} <Users className="h-4 w-4" />
                              </Link>
                            ) : (
                              <a
                                key={founder.name}
                                href={founder.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl border border-[#0A66C2]/30 px-4 py-2.5 text-sm font-bold text-[#0A66C2] hover:border-[#0A66C2]"
                              >
                                {founder.name} <Linkedin className="h-4 w-4" />
                              </a>
                            ),
                          )}
                          <a
                            href={story.sourcePost}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-primary/25 px-4 py-2.5 text-sm font-bold text-primary hover:border-primary"
                          >
                            View source post <ExternalLink className="h-4 w-4" />
                          </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section id="founder-lessons" className="scroll-mt-24 rounded-3xl bg-primary p-7 text-primary-foreground md:p-9">
              <div className="flex items-start gap-4">
                <Lightbulb className="mt-1 h-7 w-7 shrink-0 text-secondary" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">Key lessons</p>
                  <h2 className="mt-2 font-heading text-3xl font-bold">What founders should remember</h2>
                  <ul className="mt-6 space-y-3">
                    {summary.keyLessons.map((lesson) => (
                      <li key={lesson} className="flex items-start gap-3 leading-7 text-primary-foreground/80">
                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-secondary" />
                        <span>{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <nav aria-label="Event summary sections" className="rounded-3xl border-2 border-primary/15 bg-card p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">Explore this event</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Jump to a section or open a founder profile.</p>
              <div className="mt-5 grid gap-2">
                <a href="#event-overview" className="inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-secondary hover:text-secondary">
                  <BookOpen className="h-4 w-4" /> Event overview
                </a>
                <a href="#founder-journeys" className="inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-secondary hover:text-secondary">
                  <Users className="h-4 w-4" /> Founder journey
                </a>
                <a href="#founder-lessons" className="inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-secondary hover:text-secondary">
                  <Lightbulb className="h-4 w-4" /> Key lessons
                </a>
              </div>
            </nav>

            <section aria-labelledby="founder-profile-links" className="rounded-3xl border-2 border-primary/15 bg-card p-6 shadow-sm">
              <h2 id="founder-profile-links" className="font-heading text-xl font-bold text-primary">Founder profiles</h2>
              <div className="mt-4 space-y-3">
                {summary.founderStories.map((story) => (
                  <article key={story.company} className="rounded-2xl border bg-surface-1 p-4">
                    <a href={`#founder-${story.anchor}`} className="font-bold text-primary hover:text-secondary">
                      {story.company}
                    </a>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{story.founders}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {story.directoryPath ? (
                        <Link to={story.directoryPath} className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary">
                          <Building2 className="h-3.5 w-3.5" /> Startup profile
                        </Link>
                      ) : (
                        <a href={story.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary">
                          <ExternalLink className="h-3.5 w-3.5" /> Website
                        </a>
                      )}
                      {story.founderProfiles.map((founder) =>
                        founder.internal ? (
                          <Link key={founder.name} to={founder.url} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A66C2] hover:underline">
                            <Users className="h-3.5 w-3.5" /> {founder.name}
                          </Link>
                        ) : (
                          <a key={founder.name} href={founder.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A66C2] hover:underline">
                            <Linkedin className="h-3.5 w-3.5" /> {founder.name}
                          </a>
                        ),
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <div className="rounded-3xl border-2 border-primary/15 bg-card p-6 shadow-sm">
              <BookOpen className="h-7 w-7 text-secondary" />
              <h2 className="mt-4 font-heading text-xl font-bold text-primary">Verified recap</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Founder names, stories, lessons, and media were verified against the event posts. Checked-in attendance remains unpublished until verified.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-surface-1 p-6">
              <div className="flex items-center gap-3"><Users className="h-5 w-5 text-secondary" /><span className="font-bold text-primary">Attendance</span></div>
              <p className="mt-2 text-sm text-muted-foreground">Use checked-in attendance only.</p>
              <div className="mt-5 flex items-center gap-3"><MapPin className="h-5 w-5 text-secondary" /><span className="font-bold text-primary">Location</span></div>
              <p className="mt-2 text-sm text-muted-foreground">{summary.address}</p>
            </div>
            <Link
              to="/resources/event-summaries"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/25 bg-card px-4 py-3 font-bold text-primary hover:border-primary"
            >
              Browse past event summaries <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/events?view=upcoming"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 font-bold text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
            >
              See upcoming events <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </main>
    </PageLayout>
  );
};

export default EventSummaryDetail;
