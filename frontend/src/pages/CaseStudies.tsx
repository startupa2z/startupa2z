import { ArrowLeft, ArrowRight, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import { eventSummaries } from "@/data/eventSummaries";
import { founderPlaybooks } from "@/data/founderPlaybooks";

const caseStudies = founderPlaybooks.flatMap((playbook) => {
  if (!playbook.caseStudy) return [];
  const event = eventSummaries.find((item) => item.eventSlug === playbook.eventSlug);
  const story = event?.founderStories.find((item) => item.anchor === playbook.storyAnchor);
  return event && story ? [{ playbook, event, story, caseStudy: playbook.caseStudy }] : [];
});

const CaseStudies = () => (
  <PageLayout>
    <SEO
      title="Startup Case Studies | startupa2z.org"
      description="Visual startup case studies that explain the challenge, decisions, business evolution, and practical founder lessons behind real companies."
      canonical="https://startupa2z.org/resources/case-studies"
      ogImage="/event-media/august-25-2026/enrouteai-case-study-freight-pricing.png"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "startupa2z.org Startup Case Studies",
        url: "https://startupa2z.org/resources/case-studies",
      }}
    />
    <section className="gradient-hero-solid text-white" style={{ paddingTop: "calc(64px + clamp(2rem, 5vw, 4rem))" }}>
      <div className="container-narrow pb-[clamp(3rem,6vw,5rem)]">
        <Link to="/resources" className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to Resources
        </Link>
        <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-secondary">
          <BarChart3 className="h-4 w-4" /> Case Studies
        </div>
        <h1 className="mt-5 max-w-4xl font-heading text-4xl font-bold leading-tight tracking-tight md:text-6xl">Understand how the business changed</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/75">Visual stories of the challenge, customer discovery, decisions, and business model behind real startup journeys.</p>
      </div>
    </section>
    <main className="section-padding bg-background">
      <div className="container-narrow">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="label-overline mb-2">Case-study library</p>
            <h2 className="font-heading text-3xl font-bold text-primary">Company journeys explained visually</h2>
          </div>
          <p className="text-sm font-semibold text-muted-foreground">{caseStudies.length} case study</p>
        </div>
        <div className="grid gap-7 md:grid-cols-2">
          {caseStudies.map(({ playbook, story, caseStudy }) => (
            <article key={playbook.slug} className="group overflow-hidden rounded-3xl border-2 border-primary/15 bg-card shadow-[0_14px_40px_rgba(27,75,57,0.08)]">
              <Link to={`/resources/case-studies/${playbook.slug}`} className="block overflow-hidden">
                <img src={caseStudy.visual} alt={caseStudy.visualAlt} className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
              </Link>
              <div className="p-6 md:p-7">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">{story.company} · Business evolution</p>
                <Link to={`/resources/case-studies/${playbook.slug}`} className="mt-3 block">
                  <h3 className="font-heading text-2xl font-bold leading-tight text-primary transition-colors group-hover:text-secondary">{caseStudy.title}</h3>
                </Link>
                <p className="mt-4 leading-7 text-muted-foreground">{caseStudy.deck}</p>
                <Link to={`/resources/case-studies/${playbook.slug}`} className="mt-6 inline-flex items-center gap-2 font-bold text-primary hover:text-secondary">
                  Open case study <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  </PageLayout>
);

export default CaseStudies;
