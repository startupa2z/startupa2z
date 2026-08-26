import { ArrowLeft, ArrowRight, BookOpen, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import { eventSummaries } from "@/data/eventSummaries";
import { founderPlaybooks, getFounderPlaybookPath } from "@/data/founderPlaybooks";

const playbookCards = founderPlaybooks.flatMap((playbook) => {
  const event = eventSummaries.find((item) => item.eventSlug === playbook.eventSlug);
  const story = event?.founderStories.find((item) => item.anchor === playbook.storyAnchor);
  return event && story ? [{ playbook, event, story }] : [];
});

const FounderPlaybooks = () => (
  <PageLayout>
    <SEO
      title="Founder’s Playbook Library | startupa2z.org"
      description="Explore practical founder and builder playbooks drawn from startupa2z.org talks: the problem, solution, demonstration, and lessons behind each startup journey."
      canonical="https://startupa2z.org/resources/founder-playbooks"
      ogImage="/event-media/august-25-2026/event-summary-collage.jpg"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "startupa2z.org Founder’s Playbook Library",
        url: "https://startupa2z.org/resources/founder-playbooks",
        hasPart: playbookCards.map(({ playbook, story }) => ({
          "@type": "Article",
          name: story.headline,
          url: `https://startupa2z.org${getFounderPlaybookPath(playbook)}`,
        })),
      }}
    />

    <section className="gradient-hero-solid text-white" style={{ paddingTop: "calc(64px + clamp(2rem, 5vw, 4rem))" }}>
      <div className="container-narrow pb-[clamp(3rem,6vw,5rem)]">
        <Link to="/resources" className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to Resources
        </Link>
        <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-secondary">
          <BookOpen className="h-4 w-4" /> Founder’s Playbook
        </div>
        <h1 className="mt-5 max-w-4xl font-heading text-4xl font-bold leading-tight tracking-tight md:text-6xl">
          The decisions behind the startup
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/75">
          Practical playbooks from founders and builders who shared the real problem, what they built, what they demonstrated, and what another founder can apply.
        </p>
      </div>
    </section>

    <main className="section-padding bg-background">
      <div className="container-narrow">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="label-overline mb-2">Playbook library</p>
            <h2 className="font-heading text-3xl font-bold text-primary">All founder and builder talks</h2>
          </div>
          <p className="text-sm font-semibold text-muted-foreground">{playbookCards.length} playbooks</p>
        </div>

        <div className="grid gap-7 md:grid-cols-2">
          {playbookCards.map(({ playbook, event, story }) => (
            <article key={playbook.slug} className="group overflow-hidden rounded-3xl border-2 border-primary/15 bg-card shadow-[0_14px_40px_rgba(27,75,57,0.08)]">
              <Link to={getFounderPlaybookPath(playbook)} aria-label={`Open ${story.headline}`} className="block overflow-hidden bg-[#f8f0e3]">
                <img
                  src={story.image}
                  alt={story.imageAlt}
                  className={`aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.025] ${story.anchor === "keyframe-ai" ? "object-[center_72%]" : ""}`}
                />
              </Link>
              <div className="p-6 md:p-7">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-bold uppercase tracking-[0.12em] text-secondary">
                  <span>{story.company}</span>
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground"><CalendarDays className="h-3.5 w-3.5" />{event.date}</span>
                </div>
                <Link to={getFounderPlaybookPath(playbook)} className="mt-3 block">
                  <h3 className="font-heading text-2xl font-bold leading-tight text-primary transition-colors group-hover:text-secondary">{story.headline}</h3>
                </Link>
                <p className="mt-3 font-semibold text-foreground">{story.founders}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {story.keywords?.slice(0, 4).map((keyword) => (
                    <span key={keyword} className="rounded-full border border-primary/15 bg-surface-1 px-3 py-1.5 text-xs font-bold text-primary">{keyword}</span>
                  ))}
                </div>
                <Link to={getFounderPlaybookPath(playbook)} className="mt-6 inline-flex items-center gap-2 font-bold text-primary hover:text-secondary">
                  Read playbook <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  </PageLayout>
);

export default FounderPlaybooks;
