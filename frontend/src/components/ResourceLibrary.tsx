import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, CalendarDays, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { founderPlaybooks, getFounderPlaybookPath } from "@/data/founderPlaybooks";
import { eventSummaries } from "@/data/eventSummaries";
import { insights } from "@/data/insights";
import { hubPath, weekArticles } from "@/data/sfTechWeekNotes";

type ResourceKind = "Insights" | "Event notes" | "Playbooks" | "Case studies";

type ResourceCard = {
  title: string;
  description: string;
  href: string;
  kind: ResourceKind;
  topic: string;
  image?: string;
  imageAlt?: string;
  action: string;
};

const resources: ResourceCard[] = [
  ...insights.map((insight) => ({
    title: insight.title,
    description: insight.deck,
    href: `/resources/insights/${insight.slug}`,
    kind: "Insights" as const,
    topic: insight.category,
    image: insight.heroImage,
    imageAlt: insight.heroAlt,
    action: "Read the article",
  })),
  ...weekArticles.filter((article) => article.slug !== "lessons").map((article) => ({
    title: article.title,
    description: article.description,
    href: `${hubPath}/${article.slug}`,
    kind: "Event notes" as const,
    topic: article.location ?? "SF Tech Week",
    image: article.image?.src,
    imageAlt: article.image?.alt,
    action: "Read the event note",
  })),
  ...eventSummaries.filter((summary) => summary.status === "published").map((summary) => ({
    title: summary.title,
    description: summary.summary,
    href: `/events/${summary.eventSlug}?from=resources`,
    kind: "Event notes" as const,
    topic: summary.date,
    image: summary.coverImage,
    imageAlt: summary.coverImageAlt,
    action: "Read the event summary",
  })),
  ...founderPlaybooks.map((playbook) => ({
    title: playbook.label,
    description: `${playbook.problemHeading} ${playbook.takeHeading}`,
    href: getFounderPlaybookPath(playbook),
    kind: "Playbooks" as const,
    topic: "Founder playbook",
    image: eventSummaries.find((summary) => summary.eventSlug === playbook.eventSlug)?.coverImage,
    imageAlt: eventSummaries.find((summary) => summary.eventSlug === playbook.eventSlug)?.coverImageAlt,
    action: "Read the playbook",
  })),
  ...founderPlaybooks.filter((playbook) => playbook.caseStudy).map((playbook) => ({
    title: playbook.caseStudy!.title,
    description: playbook.caseStudy!.deck,
    href: `/resources/case-studies/${playbook.slug}`,
    kind: "Case studies" as const,
    topic: playbook.label,
    image: playbook.caseStudy!.visual,
    imageAlt: playbook.caseStudy!.visualAlt,
    action: "Read the case study",
  })),
];

const kinds: Array<"All" | ResourceKind> = ["All", "Insights", "Event notes", "Playbooks", "Case studies"];

const ResourceLibrary = () => {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<(typeof kinds)[number]>("All");

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return resources.filter((resource) => {
      const matchesKind = kind === "All" || resource.kind === kind;
      const searchable = `${resource.title} ${resource.description} ${resource.kind} ${resource.topic}`.toLowerCase();
      return matchesKind && (!term || searchable.includes(term));
    });
  }, [kind, query]);

  return (
    <section className="bg-muted/30 pb-[clamp(3rem,6vw,5rem)] pt-[calc(64px+1rem)] md:pt-[calc(64px+1.25rem)]" aria-labelledby="resource-library-title">
      <div className="container-narrow">
        <div className="mx-auto max-w-3xl text-center">
          <h1 id="resource-library-title" className="font-heading text-3xl font-bold text-primary md:text-4xl">Explore resources</h1>
          <p className="mt-3 leading-6 text-muted-foreground">Browse founder insights, event notes, playbooks, and case studies. Search by the topic or problem you are working through.</p>
        </div>

        <div className="mx-auto mt-6 max-w-3xl">
          <label className="flex items-center gap-3 rounded-xl border border-primary/15 bg-card px-4 py-2.5 shadow-sm">
            <Search className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <span className="sr-only">Search resources</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search by topic, event, or founder problem" className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground/70" />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Filter resources by type">
          {kinds.map((item) => (
            <button key={item} type="button" onClick={() => setKind(item)} className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${kind === item ? "border-primary bg-primary text-primary-foreground" : "border-primary/15 bg-card text-primary hover:border-primary/40"}`}>
              {item}
            </button>
          ))}
        </div>

        <p className="mt-7 text-sm font-semibold text-muted-foreground" aria-live="polite">Showing {visible.length} resource{visible.length === 1 ? "" : "s"}</p>

        {visible.length > 0 ? (
          <div className="mt-3 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {visible.map((resource) => (
              <article key={`${resource.kind}-${resource.href}`} className="flex h-full flex-col overflow-hidden rounded-xl border border-primary/15 bg-card shadow-sm">
                {resource.image ? (
                  <Link to={resource.href} className="block aspect-[16/9] overflow-hidden bg-primary/5">
                    <img src={resource.image} alt={resource.imageAlt ?? ""} className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]" loading="lazy" />
                  </Link>
                ) : (
                  <div className="flex aspect-[16/9] items-center justify-center bg-[linear-gradient(135deg,#173f33,#246b55)] text-secondary">
                    {resource.kind === "Event notes" ? <CalendarDays className="h-9 w-9" /> : <BookOpen className="h-9 w-9" />}
                  </div>
                )}
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em]"><span className="text-secondary">{resource.kind}</span><span className="text-muted-foreground">{resource.topic}</span></div>
                  <h3 className="mt-2 font-heading text-lg font-bold leading-snug text-primary">{resource.title}</h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">{resource.description}</p>
                  <Link to={resource.href} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary">{resource.action}<ArrowRight className="h-4 w-4" /></Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-primary/15 bg-card p-8 text-center"><h3 className="font-heading text-2xl font-bold text-primary">No matching resources yet</h3><p className="mt-2 text-muted-foreground">Try another search term or choose All.</p></div>
        )}
      </div>
    </section>
  );
};

export default ResourceLibrary;
