import { ArrowRight, CalendarDays, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import { weekArticles } from "@/data/sfTechWeekNotes";

const overview = weekArticles.find((article) => article.slug === "lessons") ?? weekArticles[0];
const reports = weekArticles.filter((article) => article.slug !== "lessons");

const SFTechWeek = () => (
  <PageLayout>
    <SEO
      title="SF Tech Week 2026 Founder Field Notes | StartupA2Z.org"
      description="Firsthand SF Tech Week notes on AI, fundraising, finance, customers, community, brand, security, and the questions founders can apply next."
      canonical="https://startupa2z.org/resources/insights/sf-tech-week-2026"
      ogImage={`https://startupa2z.org${overview.image?.src ?? "/insights/sf-tech-week-2026/sf-tech-week-field-notes.jpg"}`}
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "SF Tech Week 2026 Founder Field Notes",
        url: "https://startupa2z.org/resources/insights/sf-tech-week-2026",
        description: "A collection of firsthand SF Tech Week reports for startup founders.",
      }}
    />

    <header className="gradient-hero-solid px-4 text-white" style={{ paddingTop: "calc(64px + clamp(3rem, 6vw, 5rem))" }}>
      <div className="container-narrow pb-[clamp(3.5rem,7vw,6rem)]">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-secondary">
          <Sparkles className="h-4 w-4" /> SF Tech Week 2026
        </span>
        <h1 className="mt-6 max-w-5xl font-heading text-4xl font-bold tracking-tight md:text-6xl">
          What founders can carry forward from the room.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">
          Firsthand notes from conversations about AI, finance, fundraising, customers, community, brand, identity, and security. Each report ends with a decision or question founders can use.
        </p>
        <div className="mt-7 flex flex-wrap gap-3 text-sm text-white/75">
          <span className="rounded-full border border-white/15 px-4 py-2">{reports.length} event reports</span>
          <span className="rounded-full border border-white/15 px-4 py-2">5 to 8 October 2026</span>
          <span className="rounded-full border border-white/15 px-4 py-2">San Francisco Bay Area</span>
        </div>
      </div>
    </header>

    <main>
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <div className="grid overflow-hidden rounded-3xl border-2 border-primary/15 bg-card shadow-[0_16px_48px_rgba(27,75,57,0.10)] lg:grid-cols-[0.9fr_1.1fr]">
            <img src={overview.image?.src} alt={overview.image?.alt ?? "SF Tech Week attendees"} className="h-full min-h-72 w-full object-cover" />
            <div className="flex flex-col justify-center p-7 md:p-10">
              <p className="label-overline">Start here</p>
              <h2 className="mt-3 font-heading text-3xl font-bold text-primary md:text-4xl">{overview.title}</h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">{overview.summary}</p>
              <Link to={`/resources/insights/sf-tech-week-2026/${overview.slug}`} className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-secondary px-5 py-3 font-bold text-secondary-foreground hover:bg-primary hover:text-primary-foreground">
                Read the week overview <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/35">
        <div className="container-narrow">
          <div className="mb-10 max-w-3xl">
            <p className="label-overline">Event by event</p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-primary md:text-4xl">Browse the conversations</h2>
            <p className="mt-4 leading-7 text-muted-foreground">Choose the problem you are working through now. Each note separates what happened in the room from the practical founder takeaway.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {reports.map((article) => (
              <article key={article.slug} className="flex h-full flex-col overflow-hidden rounded-2xl border border-primary/15 bg-card shadow-sm">
                {article.image ? (
                  <Link to={`/resources/insights/sf-tech-week-2026/${article.slug}`} className="block aspect-[16/10] overflow-hidden bg-primary/5">
                    <img src={article.image.src} alt={article.image.alt} className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]" loading="lazy" />
                  </Link>
                ) : (
                  <div className="flex aspect-[16/10] items-end bg-[linear-gradient(135deg,#173f33,#246b55)] p-6 text-white">
                    <span className="text-xs font-bold uppercase tracking-[0.15em] text-secondary">{article.category}</span>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-xs font-bold uppercase tracking-[0.13em] text-secondary">{article.category}</span>
                  <h3 className="mt-3 font-heading text-2xl font-bold leading-tight text-primary">{article.shortTitle}</h3>
                  <p className="mt-3 flex-1 leading-7 text-muted-foreground">{article.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {article.eventDateLabel && <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{article.eventDateLabel}</span>}
                    {article.location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{article.location}</span>}
                  </div>
                  <Link to={`/resources/insights/sf-tech-week-2026/${article.slug}`} className="mt-6 inline-flex items-center gap-2 font-bold text-primary hover:text-secondary">
                    Read event notes <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-narrow overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">Use the collection</p>
              <h2 className="mt-3 font-heading text-3xl font-bold md:text-4xl">Bring one question into your next founder conversation.</h2>
              <p className="mt-4 max-w-2xl leading-7 text-primary-foreground/75">Good event notes should improve the next decision. Pick the report closest to your current problem, use its questions, and document what changes.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link to="/resources/insights" className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 font-bold text-secondary-foreground">All insights <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/events" className="inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-3 font-bold text-white hover:bg-white/10">StartupA2Z events</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  </PageLayout>
);

export default SFTechWeek;
