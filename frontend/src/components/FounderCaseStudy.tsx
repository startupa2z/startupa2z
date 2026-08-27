import { ArrowRight, ExternalLink, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import type { EventSummary, FounderStory } from "@/data/eventSummaries";
import type { FounderPlaybook } from "@/data/founderPlaybooks";

type FounderCaseStudyProps = {
  playbook: FounderPlaybook;
  story: FounderStory;
  event: EventSummary;
};

const FounderCaseStudy = ({ playbook, story, event }: FounderCaseStudyProps) => {
  const caseStudy = playbook.caseStudy;

  if (!caseStudy) return null;

  const flow = [
    ["01", "Show a mock-up"],
    ["02", "Deliver manually"],
    ["03", "Observe customer pull"],
    ["04", "Build the repeatable product"],
  ];

  const evolution = [
    ["Starting insight", "Optimize package-delivery routes"],
    ["New capability", "Understand the cost of serving a load"],
    ["Market pull", "Price full-truckload capacity"],
  ];

  return (
    <div className="space-y-8">
      <figure className="overflow-hidden rounded-3xl border border-primary/15 bg-card shadow-[0_14px_40px_rgba(27,75,57,0.08)]">
        <img src={caseStudy.visual} alt={caseStudy.visualAlt} className="aspect-[16/9] w-full object-cover" />
        <figcaption className="border-t border-primary/10 px-5 py-3 text-sm leading-6 text-muted-foreground">
          EnrouteAI applies optimization to a practical question: what should a fleet charge for its available truck capacity?
        </figcaption>
      </figure>

      <section aria-label="Case study snapshot" className="grid overflow-hidden rounded-2xl border border-primary/15 bg-card sm:grid-cols-2 lg:grid-cols-4">
        {caseStudy.snapshot.map((item) => (
          <div key={item.label} className="border-b border-primary/10 p-5 last:border-b-0 sm:border-r sm:[&:nth-child(2)]:border-r-0 sm:[&:nth-child(n+3)]:border-b-0 lg:border-b-0 lg:[&:nth-child(2)]:border-r lg:last:border-r-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">{item.label}</p>
            <p className="mt-2 font-semibold leading-6 text-foreground">{item.value}</p>
          </div>
        ))}
      </section>

      <section id="company-snapshot" className="scroll-mt-24 rounded-3xl border border-primary/15 bg-card p-6 shadow-[0_14px_40px_rgba(27,75,57,0.06)] md:p-8">
        <p className="label-overline mb-3">Company snapshot</p>
        <h2 className="font-heading text-3xl font-bold text-primary">Operating context</h2>
        <div className="mt-7 grid overflow-hidden rounded-2xl border border-primary/10 sm:grid-cols-2 lg:grid-cols-4">
          {caseStudy.metrics.map((metric) => (
            <div key={metric.label} className="border-b border-primary/10 p-5 last:border-b-0 sm:border-r sm:[&:nth-child(2)]:border-r-0 sm:[&:nth-child(n+3)]:border-b-0 lg:border-b-0 lg:[&:nth-child(2)]:border-r lg:last:border-r-0">
              <p className="font-heading text-3xl font-bold text-secondary">{metric.value}</p>
              <p className="mt-2 font-bold text-foreground">{metric.label}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{metric.note}</p>
            </div>
          ))}
        </div>

        <figure className="mt-8 rounded-2xl bg-surface-1 p-6 md:p-8">
          <figcaption>
            <p className="font-heading text-xl font-bold text-primary">Customer-company size range</p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{caseStudy.customerRange.description}</p>
          </figcaption>
          <div className="mt-10 px-2">
            <div className="relative h-3 rounded-full bg-gradient-to-r from-secondary via-primary/65 to-primary">
              <span className="absolute left-0 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-card bg-secondary shadow" />
              <span className="absolute right-0 top-1/2 h-5 w-5 translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-card bg-primary shadow" />
            </div>
            <div className="mt-4 grid grid-cols-5 text-center text-xs font-semibold text-muted-foreground">
              <span className="text-left font-bold text-secondary">{caseStudy.customerRange.minimum}</span>
              <span>$10M</span>
              <span>$100M</span>
              <span>$1B</span>
              <span className="text-right font-bold text-primary">{caseStudy.customerRange.maximum}</span>
            </div>
          </div>
          <p className="mt-6 border-t border-primary/10 pt-4 text-xs leading-5 text-muted-foreground">Logarithmic visual scale. These figures describe customer-company revenue—not EnrouteAI revenue, valuation, or customer count.</p>
        </figure>
      </section>

      <div className="rounded-3xl border border-primary/15 bg-card px-6 py-8 shadow-[0_14px_40px_rgba(27,75,57,0.06)] md:px-10 md:py-12">
        <header className="max-w-3xl">
          <p className="label-overline mb-3">The case study</p>
          <h2 className="font-heading text-3xl font-bold leading-tight text-primary md:text-4xl">A product direction discovered through customer pull</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">The path was not a straight line from idea to product. Domain knowledge, direct selling, and an urgent customer deadline combined to reveal the business EnrouteAI should become.</p>
        </header>

        <section id="visual-models" className="mt-10 scroll-mt-24 border-t border-primary/10 pt-10">
          <p className="label-overline mb-3">Understand the case visually</p>
          <h2 className="font-heading text-3xl font-bold text-primary">Four models explain what changed</h2>

          <figure className="mt-8 rounded-2xl bg-surface-1 p-6 md:p-8">
            <figcaption className="font-heading text-xl font-bold text-primary">1. How the product evolved</figcaption>
            <ol className="mt-6 grid gap-3 md:grid-cols-3">
              {evolution.map(([label, value], index) => (
                <li key={value} className="relative rounded-xl border border-primary/15 bg-card p-5 md:pr-9">
                  <p className="text-xs font-bold uppercase tracking-[0.13em] text-secondary">{label}</p>
                  <p className="mt-2 font-heading text-lg font-bold leading-6 text-foreground">{value}</p>
                  {index < evolution.length - 1 && <ArrowRight className="absolute -bottom-5 left-1/2 z-10 h-5 w-5 -translate-x-1/2 text-secondary md:-right-4 md:bottom-auto md:left-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-0" aria-hidden="true" />}
                </li>
              ))}
            </ol>
          </figure>

          <figure className="mt-6 rounded-2xl border border-primary/15 p-6 md:p-8">
            <figcaption className="font-heading text-xl font-bold text-primary">2. A test for real demand</figcaption>
            <div className="mt-6 grid items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
              {[
                ["Blocked", "The customer cannot complete important work today."],
                ["Urgent", "The project is important enough to act now."],
                ["Deadline", "A real date creates consequences for delay."],
              ].map(([title, description], index) => (
                <div key={title} className="contents">
                  <div className="rounded-xl bg-primary px-5 py-6 text-primary-foreground">
                    <p className="font-heading text-xl font-bold">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-primary-foreground/75">{description}</p>
                  </div>
                  {index < 2 && <div className="flex items-center justify-center text-2xl font-bold text-secondary">+</div>}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-3 rounded-xl bg-secondary/10 px-5 py-4 text-center font-heading text-xl font-bold text-primary">
              <span className="text-secondary">=</span> Customer pull
            </div>
          </figure>

          <figure className="mt-6 rounded-2xl bg-surface-1 p-6 md:p-8">
            <figcaption className="font-heading text-xl font-bold text-primary">3. Push versus pull</figcaption>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="border-l-4 border-muted-foreground/25 pl-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Product push</p>
                <p className="mt-2 font-heading text-xl font-bold text-foreground">“Buy our pricing software.”</p>
                <p className="mt-3 leading-7 text-muted-foreground">Requires persuasion, workflow change, and continued convincing. A weak fit can produce churn later.</p>
              </div>
              <div className="border-l-4 border-secondary pl-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">Customer pull</p>
                <p className="mt-2 font-heading text-xl font-bold text-primary">“Price this bid before our deadline.”</p>
                <p className="mt-3 leading-7 text-muted-foreground">Starts with an outcome the customer already needs. Urgency makes the value and adoption path clear.</p>
              </div>
            </div>
          </figure>

          <figure className="mt-6 rounded-2xl border border-primary/15 p-6 md:p-8">
            <figcaption className="font-heading text-xl font-bold text-primary">4. The learn-by-selling loop</figcaption>
            <ol className="mt-6 grid gap-3 md:grid-cols-4">
              {flow.map(([number, label], index) => (
                <li key={label} className="relative flex items-center gap-3 rounded-xl bg-card py-3 md:block md:pr-7">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-extrabold text-secondary-foreground">{number}</span>
                  <p className="font-heading font-bold leading-6 text-foreground md:mt-3">{label}</p>
                  {index < flow.length - 1 && <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-primary/35 md:absolute md:right-1 md:top-6" aria-hidden="true" />}
                </li>
              ))}
            </ol>
            <p className="mt-5 border-t border-primary/10 pt-4 text-sm leading-6 text-muted-foreground">Each cycle reduces assumption and increases evidence. The product becomes the repeatable version of an outcome customers already pulled from the founder.</p>
          </figure>
        </section>

        <div id="case-story" className="scroll-mt-24">
          {caseStudy.chapters.map((chapter, index) => (
            <section key={chapter.title} className="grid gap-5 border-b border-primary/10 py-10 last:border-b-0 md:grid-cols-[150px_minmax(0,1fr)] md:py-12">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-secondary">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-1 text-sm font-bold text-primary">{chapter.label}</p>
              </div>
              <div className="max-w-3xl">
                <h2 className="font-heading text-2xl font-bold leading-tight text-primary md:text-3xl">{chapter.title}</h2>
                <div className="mt-5 space-y-4 text-[1.05rem] leading-8 text-muted-foreground">
                  {chapter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                {chapter.points?.length && (
                  <ul className="mt-6 space-y-3 border-l-2 border-secondary pl-5 leading-7 text-foreground">
                    {chapter.points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                )}
                {chapter.quote && (
                  <blockquote className="mt-7 border-l-4 border-secondary bg-surface-1 px-6 py-5 font-heading text-xl font-bold leading-8 text-primary">
                    “{chapter.quote}”
                  </blockquote>
                )}
              </div>
            </section>
          ))}
        </div>

        <figure className="my-10 overflow-hidden border-y border-primary/10 py-8 md:grid md:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)] md:items-center md:gap-8">
          <img src={story.image} alt={story.imageAlt} className="aspect-[16/10] w-full rounded-2xl object-cover" />
          <figcaption className="mt-6 md:mt-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">From the StartupA2Z session</p>
            <p className="mt-4 font-heading text-2xl font-bold leading-9 text-primary">“You learn by selling.”</p>
            <p className="mt-4 leading-7 text-muted-foreground">A practical message for early founders: a mock-up, a direct customer conversation, and even rejection can reveal more than months spent perfecting a product in isolation.</p>
          </figcaption>
        </figure>

        <section id="links" className="mt-12 scroll-mt-24 border-t border-primary/10 pt-10">
          <p className="label-overline mb-3">Continue exploring</p>
          <h2 className="font-heading text-3xl font-bold text-primary">Company, founder, and event links</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a href={story.website} target="_blank" rel="noreferrer" className="group flex items-center justify-between border-b border-primary/15 py-4 font-bold text-primary hover:text-secondary">
              {story.company} website <ExternalLink className="h-4 w-4" />
            </a>
            {story.founderProfiles.map((profile) => (
              <a key={profile.name} href={profile.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between border-b border-primary/15 py-4 font-bold text-[#0A66C2]">
                {profile.name} on LinkedIn <Linkedin className="h-4 w-4" />
              </a>
            ))}
            {story.sourcePost && (
              <a href={story.sourcePost} target="_blank" rel="noreferrer" className="group flex items-center justify-between border-b border-primary/15 py-4 font-bold text-primary hover:text-secondary">
                Supporting source <ExternalLink className="h-4 w-4" />
              </a>
            )}
            <Link to={event.galleryPath || `/gallery/${playbook.eventSlug}`} className="group flex items-center justify-between border-b border-primary/15 py-4 font-bold text-primary hover:text-secondary">
              {event.date} event gallery <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FounderCaseStudy;
