import { ArrowLeft, BarChart3, CalendarDays, MapPin } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import FounderCaseStudy from "@/components/FounderCaseStudy";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import { getEventSummaryByEventSlug } from "@/data/eventSummaries";
import { getFounderPlaybook } from "@/data/founderPlaybooks";

const CaseStudyDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const playbook = getFounderPlaybook(slug || "");
  const event = playbook ? getEventSummaryByEventSlug(playbook.eventSlug) : undefined;
  const story = event?.founderStories.find((item) => item.anchor === playbook?.storyAnchor);

  if (!playbook?.caseStudy || !event || !story) {
    return <Navigate to="/resources/case-studies" replace />;
  }

  const canonical = `https://startupa2z.org/resources/case-studies/${playbook.slug}`;

  return (
    <PageLayout>
      <SEO
        title={`${playbook.caseStudy.title} | Startup Case Study | startupa2z.org`}
        description={playbook.caseStudy.deck}
        canonical={canonical}
        ogImage={playbook.caseStudy.visual}
        ogType="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: playbook.caseStudy.title,
          description: playbook.caseStudy.deck,
          image: new URL(playbook.caseStudy.visual, "https://startupa2z.org").toString(),
          datePublished: event.startDateIso.slice(0, 10),
          mainEntityOfPage: canonical,
          author: { "@type": "Person", name: story.founders },
          publisher: { "@type": "Organization", name: "startupa2z.org", url: "https://startupa2z.org/" },
        }}
      />

      <section className="gradient-hero-solid text-white" style={{ paddingTop: "calc(64px + clamp(2rem, 5vw, 4rem))" }}>
        <div className="container-narrow pb-[clamp(3rem,6vw,5rem)]">
          <Link to="/resources/case-studies" className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to Case Studies
          </Link>
          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-secondary">
            <BarChart3 className="h-4 w-4" /> Startup Case Study
          </div>
          <h1 className="mt-5 max-w-5xl font-heading text-4xl font-bold leading-tight tracking-tight md:text-6xl">{playbook.caseStudy.title}</h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-white/75">{playbook.caseStudy.deck}</p>
          <p className="mt-5 text-xl font-semibold text-white">{story.founders} · {story.company}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/70">
            <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-secondary" />{event.date}</span>
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-secondary" />{event.venue}</span>
          </div>
        </div>
      </section>

      <main className="section-padding bg-background">
        <article className="container-narrow">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
            <FounderCaseStudy playbook={playbook} story={story} event={event} />
            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <section className="rounded-3xl border-2 border-primary/15 bg-card p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">Case-study themes</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {story.keywords?.map((keyword) => (
                    <span key={keyword} className="rounded-full border border-primary/15 bg-surface-1 px-3 py-1.5 text-xs font-bold text-primary">{keyword}</span>
                  ))}
                </div>
              </section>
              <nav aria-label="Case study sections" className="rounded-3xl border-2 border-primary/15 bg-card p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">On this page</p>
                <div className="mt-4 grid gap-2 text-sm font-semibold text-foreground">
                  <a href="#company-snapshot" className="rounded-lg px-2 py-1.5 hover:bg-surface-1 hover:text-secondary">Company snapshot</a>
                  <a href="#visual-models" className="rounded-lg px-2 py-1.5 hover:bg-surface-1 hover:text-secondary">Visual models</a>
                  <a href="#case-story" className="rounded-lg px-2 py-1.5 hover:bg-surface-1 hover:text-secondary">The full story</a>
                  <a href="#links" className="rounded-lg px-2 py-1.5 hover:bg-surface-1 hover:text-secondary">Links</a>
                </div>
              </nav>
              <Link to={`/resources/founder-playbooks/${playbook.slug}`} className="flex items-center justify-between rounded-2xl border border-primary/15 bg-card p-5 font-bold text-primary hover:border-secondary hover:text-secondary">
                Read Founder’s Playbook <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </aside>
          </div>
        </article>
      </main>
    </PageLayout>
  );
};

export default CaseStudyDetail;
