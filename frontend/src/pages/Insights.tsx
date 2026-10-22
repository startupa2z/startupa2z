import { ArrowRight, BookOpen, Clock3, FileText, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import { insights } from "@/data/insights";
import { weekArticles } from "@/data/sfTechWeekNotes";

const weekOverview = weekArticles.find((article) => article.slug === "lessons") ?? weekArticles[0];

const Insights = () => (
  <PageLayout>
    <SEO
      title="Founder Insights, Blogs & Articles | StartupA2Z.org"
      description="Practical articles, founder field notes, and event insights from the Bay Area startup ecosystem."
      canonical="https://startupa2z.org/resources/insights"
      ogImage={`https://startupa2z.org${insights[0].heroImage}`}
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "StartupA2Z Insights",
        url: "https://startupa2z.org/resources/insights",
        description: "Practical articles and field notes for startup founders.",
      }}
    />

    <section className="gradient-hero-solid px-4 text-white" style={{ paddingTop: "calc(64px + clamp(3rem, 6vw, 5rem))" }}>
      <div className="container-narrow pb-[clamp(3.5rem,7vw,6rem)]">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-secondary">
          <BookOpen className="h-4 w-4" /> Resources · Insights
        </span>
        <h1 className="mt-6 max-w-4xl font-heading text-4xl font-bold tracking-tight md:text-6xl">Ideas founders can turn into better decisions.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">Blogs, articles, and firsthand field notes that translate startup conversations into practical questions, frameworks, and next steps.</p>
      </div>
    </section>

    <main>
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <div className="mb-10 max-w-3xl">
            <p className="label-overline mb-3">Featured collection</p>
            <h2 className="font-heading text-3xl font-bold text-primary md:text-4xl">SF Tech Week, event by event</h2>
            <p className="mt-4 leading-7 text-muted-foreground">A structured collection of firsthand reports on AI, finance, fundraising, customers, brand, community, identity, and security.</p>
          </div>
          <article className="grid overflow-hidden rounded-3xl border-2 border-primary/15 bg-card shadow-[0_16px_48px_rgba(27,75,57,0.10)] lg:grid-cols-[0.9fr_1.1fr]">
            <Link to="/resources/insights/sf-tech-week-2026" className="group block min-h-72 overflow-hidden bg-[#f8f0e3]">
              <img src={weekOverview.image?.src} alt={weekOverview.image?.alt ?? "SF Tech Week attendees"} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
            </Link>
            <div className="flex flex-col justify-center p-7 md:p-10">
              <div className="flex flex-wrap gap-2"><span className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">SF Tech Week 2026</span><span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1.5 text-xs font-bold text-secondary"><Sparkles className="h-3.5 w-3.5" />{weekArticles.length - 1} reports</span></div>
              <h3 className="mt-5 font-heading text-3xl font-bold leading-tight text-primary md:text-4xl">What founders can carry forward from the room</h3>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">Choose the conversation closest to your current problem, then use its practical takeaway and founder questions.</p>
              <Link to="/resources/insights/sf-tech-week-2026" className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-secondary px-5 py-3 font-bold text-secondary-foreground hover:bg-primary hover:text-primary-foreground">Explore all event notes <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </article>
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <div className="mb-10 max-w-3xl">
            <p className="label-overline mb-3">Articles</p>
            <h2 className="font-heading text-3xl font-bold text-primary md:text-4xl">From observation to a decision you can use</h2>
            <p className="mt-4 leading-7 text-muted-foreground">Each piece separates firsthand observations from outside research and ends with actions a founder can apply.</p>
          </div>

          <div className="grid gap-8">
            {insights.map((insight) => (
              <article key={insight.slug} className="grid overflow-hidden rounded-3xl border-2 border-primary/15 bg-card shadow-[0_16px_48px_rgba(27,75,57,0.10)] lg:grid-cols-[0.9fr_1.1fr]">
                <Link to={`/resources/insights/${insight.slug}`} className="group block min-h-72 overflow-hidden bg-[#f8f0e3]"><img src={insight.heroImage} alt={insight.heroAlt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" /></Link>
                <div className="flex flex-col justify-center p-7 md:p-10">
                  <div className="flex flex-wrap gap-2"><span className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">{insight.category}</span><span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1.5 text-xs font-bold text-secondary"><FileText className="h-3.5 w-3.5" />{insight.format}</span></div>
                  <h2 className="mt-5 font-heading text-3xl font-bold leading-tight text-primary md:text-4xl">{insight.title}</h2>
                  <p className="mt-4 text-lg leading-8 text-muted-foreground">{insight.deck}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground"><span>{insight.author}</span><span aria-hidden="true">·</span><span>{insight.publishedLabel}</span><span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4" />{insight.readTime}</span></div>
                  <Link to={`/resources/insights/${insight.slug}`} className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-secondary px-5 py-3 font-bold text-secondary-foreground hover:bg-primary hover:text-primary-foreground">Read the article <ArrowRight className="h-4 w-4" /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  </PageLayout>
);

export default Insights;
