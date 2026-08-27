import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, ExternalLink, Linkedin, MapPin } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import { getEventSummaryByEventSlug } from "@/data/eventSummaries";
import { getFounderPlaybook } from "@/data/founderPlaybooks";

const FounderPlaybookDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const playbook = getFounderPlaybook(slug || "");
  const event = playbook ? getEventSummaryByEventSlug(playbook.eventSlug) : undefined;
  const story = event?.founderStories.find((item) => item.anchor === playbook?.storyAnchor);

  if (!playbook || !event || !story) {
    return <Navigate to="/resources#founder-playbooks" replace />;
  }

  const canonical = `https://startupa2z.org/resources/founder-playbooks/${playbook.slug}`;
  const hasIntroduction = Boolean(playbook.introductionParagraphs?.length);
  const sectionNumber = (value: number) => String(value).padStart(2, "0");

  return (
    <PageLayout>
      <SEO
        title={`${story.headline} | Founder’s Playbook | startupa2z.org`}
        description={story.lesson}
        canonical={canonical}
        ogImage={story.image}
        ogType="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: story.headline,
          description: story.lesson,
          image: new URL(story.image, "https://startupa2z.org").toString(),
          datePublished: event.startDateIso.slice(0, 10),
          mainEntityOfPage: canonical,
          author: { "@type": "Person", name: story.founders },
          publisher: { "@type": "Organization", name: "startupa2z.org", url: "https://startupa2z.org/" },
        }}
      />

      <section className="gradient-hero-solid text-white" style={{ paddingTop: "calc(64px + clamp(2rem, 5vw, 4rem))" }}>
        <div className="container-narrow pb-[clamp(3rem,6vw,5rem)]">
          <Link to={`/events/${playbook.eventSlug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to event recap
          </Link>
          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-secondary">
            <BookOpen className="h-4 w-4" /> Founder’s Playbook
          </div>
          <h1 className="mt-5 max-w-5xl font-heading text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            {story.headline}
          </h1>
          <p className="mt-5 text-xl font-semibold text-white">{story.founders} · {story.company}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/70">
            <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-secondary" />{event.date}</span>
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-secondary" />{event.venue}</span>
          </div>
          {playbook.caseStudy && (
            <Link
              to={`/resources/case-studies/${playbook.slug}`}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 font-bold text-secondary-foreground shadow-sm transition-colors hover:bg-white hover:text-primary"
            >
              View Case Study <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>

      <main className="section-padding bg-background">
        <article className="container-narrow">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="space-y-8">
              <figure className="overflow-hidden rounded-3xl border-2 border-primary/15 bg-[#f8f0e3] shadow-[0_14px_40px_rgba(27,75,57,0.08)]">
                <img src={story.image} alt={story.imageAlt} className="aspect-[16/9] w-full object-cover" />
              </figure>

              {playbook.caseStudy && (
                <section aria-label="Company snapshot" className="overflow-hidden rounded-3xl border-2 border-primary/15 bg-card shadow-[0_14px_40px_rgba(27,75,57,0.08)]">
                  <div className="p-6 md:p-7">
                    <p className="label-overline mb-2">Company snapshot</p>
                    <h2 className="font-heading text-2xl font-bold text-primary">The business behind the playbook</h2>
                  </div>
                  <div className="grid border-t border-primary/10 sm:grid-cols-2 lg:grid-cols-4">
                    {playbook.caseStudy.snapshot.map((item) => (
                      <div key={item.label} className="border-b border-primary/10 p-5 last:border-b-0 sm:border-r sm:[&:nth-child(2)]:border-r-0 sm:[&:nth-child(n+3)]:border-b-0 lg:border-b-0 lg:[&:nth-child(2)]:border-r lg:last:border-r-0">
                        <p className="text-xs font-bold uppercase tracking-[0.13em] text-secondary">{item.label}</p>
                        <p className="mt-2 font-semibold leading-6 text-foreground">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {playbook.caseStudy && (
                <figure className="rounded-3xl border-2 border-primary/15 bg-card p-6 shadow-[0_14px_40px_rgba(27,75,57,0.08)] md:p-8">
                  <figcaption>
                    <p className="label-overline mb-2">Customer-company size</p>
                    <h2 className="font-heading text-2xl font-bold text-primary">From small operators to major enterprises</h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{playbook.caseStudy.customerRange.description}</p>
                  </figcaption>
                  <div className="mt-9 px-2">
                    <div className="relative h-3 rounded-full bg-gradient-to-r from-secondary via-primary/65 to-primary">
                      <span className="absolute left-0 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-card bg-secondary shadow" />
                      <span className="absolute right-0 top-1/2 h-5 w-5 translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-card bg-primary shadow" />
                    </div>
                    <div className="mt-4 grid grid-cols-5 text-center text-xs font-semibold text-muted-foreground">
                      <span className="text-left font-bold leading-4 text-secondary">{playbook.caseStudy.customerRange.minimum}</span>
                      <span>$10M</span>
                      <span>$100M</span>
                      <span>$1B</span>
                      <span className="text-right font-bold leading-4 text-primary">{playbook.caseStudy.customerRange.maximum}</span>
                    </div>
                  </div>
                  <p className="mt-6 border-t border-primary/10 pt-4 text-xs leading-5 text-muted-foreground">Logarithmic visual scale. The figures describe customer-company revenue—not EnrouteAI revenue, valuation, or customer count.</p>
                </figure>
              )}

              <div className="rounded-3xl border-2 border-primary/15 bg-card p-7 shadow-[0_14px_40px_rgba(27,75,57,0.08)] md:p-10">
                {playbook.introductionParagraphs?.length && (
                  <section id="introduction" className="scroll-mt-24">
                    <p className="label-overline mb-3">01 · Introduction</p>
                    <h2 className="font-heading text-3xl font-bold text-primary">{playbook.introductionHeading}</h2>
                    <div className="mt-5 space-y-4 text-lg leading-8 text-muted-foreground">
                      {playbook.introductionParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    </div>
                  </section>
                )}

                <section id="problem" className="scroll-mt-24">
                  <p className={`label-overline mb-3 ${hasIntroduction ? "mt-10 border-t border-primary/10 pt-10" : ""}`}>{sectionNumber(1 + Number(hasIntroduction))} · The problem</p>
                  <h2 className="font-heading text-3xl font-bold text-primary">{playbook.problemHeading}</h2>
                  <p className="mt-5 text-lg leading-8 text-muted-foreground">{playbook.problemNarrative ?? story.challenge}</p>
                  <ul className="mt-6 list-disc space-y-2 pl-6 leading-7 text-muted-foreground">
                    {playbook.problemPoints.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                </section>

                <section id="solution" className="mt-10 scroll-mt-24 border-t border-primary/10 pt-10">
                  <p className="label-overline mb-3">{sectionNumber(2 + Number(hasIntroduction))} · The solution</p>
                  <h2 className="font-heading text-3xl font-bold text-primary">{playbook.solutionHeading}</h2>
                  <p className="mt-5 text-lg leading-8 text-muted-foreground">{playbook.solutionNarrative ?? story.approach}</p>
                </section>

                {playbook.founderJourney?.length && (
                  <section id="founder-journey" className="mt-10 scroll-mt-24 border-t border-primary/10 pt-10">
                    <p className="label-overline mb-3">{sectionNumber(3 + Number(hasIntroduction))} · The founder journey</p>
                    <h2 className="font-heading text-3xl font-bold text-primary">{playbook.founderJourneyHeading}</h2>
                    <ol className="mt-7 space-y-4">
                      {playbook.founderJourney.map((item, index) => (
                        <li key={item} className="flex gap-4 rounded-2xl border border-primary/10 bg-surface-1 p-5 leading-7 text-muted-foreground">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-extrabold text-secondary-foreground">{index + 1}</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ol>
                  </section>
                )}

                <section id="demonstration" className="mt-10 scroll-mt-24 border-t border-primary/10 pt-10">
                  <p className="label-overline mb-3">{sectionNumber(3 + Number(hasIntroduction) + Number(Boolean(playbook.founderJourney?.length)))} · What was demonstrated</p>
                  <h2 className="font-heading text-3xl font-bold text-primary">{playbook.demonstrationHeading}</h2>
                  <p className="mt-5 leading-7 text-muted-foreground">The talk broke the approach into a practical sequence:</p>
                  <ol className="mt-7 grid gap-3 sm:grid-cols-2">
                    {playbook.workflowSteps.map((item, index) => (
                      <li key={item} className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-surface-1 p-4 font-semibold text-foreground">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-extrabold text-secondary-foreground">{index + 1}</span>
                        {item}
                      </li>
                    ))}
                  </ol>
                </section>

                {playbook.lessons?.length && (
                  <section id="lessons" className="mt-10 scroll-mt-24 border-t border-primary/10 pt-10">
                    <p className="label-overline mb-3">{sectionNumber(4 + Number(hasIntroduction) + Number(Boolean(playbook.founderJourney?.length)))} · Practical lessons</p>
                    <h2 className="font-heading text-3xl font-bold text-primary">{playbook.lessonsHeading}</h2>
                    <div className="mt-7 grid gap-4 md:grid-cols-2">
                      {playbook.lessons.map((lesson, index) => (
                        <article key={lesson.title} className="rounded-2xl border border-primary/10 p-5">
                          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-secondary">Lesson {index + 1}</p>
                          <h3 className="mt-2 font-heading text-xl font-bold text-foreground">{lesson.title}</h3>
                          <p className="mt-3 leading-7 text-muted-foreground">{lesson.description}</p>
                        </article>
                      ))}
                    </div>
                  </section>
                )}

                <section id="founder-take" className="mt-10 scroll-mt-24 border-t border-primary/10 pt-10">
                  <p className="label-overline mb-3">{sectionNumber(4 + Number(hasIntroduction) + Number(Boolean(playbook.founderJourney?.length)) + Number(Boolean(playbook.lessons?.length)))} · {playbook.takeLabel ?? "The founder take"}</p>
                  <h2 className="font-heading text-3xl font-bold text-primary">{playbook.takeHeading}</h2>
                  <p className="mt-5 text-lg leading-8 text-muted-foreground">{playbook.takeNarrative ?? story.lesson}</p>
                  <div className="mt-7 grid gap-4 sm:grid-cols-3">
                    {playbook.takeaways.map((takeaway) => (
                      <div key={takeaway.title} className="rounded-2xl border border-primary/10 p-4">
                        <h3 className="font-bold text-foreground">{takeaway.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{takeaway.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {playbook.faqs?.length && (
                  <section id="faqs" className="mt-10 scroll-mt-24 border-t border-primary/10 pt-10">
                    <p className="label-overline mb-3">{sectionNumber(5 + Number(hasIntroduction) + Number(Boolean(playbook.founderJourney?.length)) + Number(Boolean(playbook.lessons?.length)))} · FAQs</p>
                    <h2 className="font-heading text-3xl font-bold text-primary">Questions from the talk</h2>
                    <div className="mt-7 divide-y divide-primary/10 rounded-2xl border border-primary/10 px-5">
                      {playbook.faqs.map((faq) => (
                        <details key={faq.question} className="group py-5">
                          <summary className="cursor-pointer list-none pr-8 font-bold text-foreground marker:content-none">
                            {faq.question}
                            <span className="float-right text-xl leading-5 text-secondary transition-transform group-open:rotate-45">+</span>
                          </summary>
                          <p className="mt-3 pr-8 leading-7 text-muted-foreground">{faq.answer}</p>
                        </details>
                      ))}
                    </div>
                  </section>
                )}

                <section id="links" className="mt-10 scroll-mt-24 border-t border-primary/10 pt-10">
                  <p className="label-overline mb-3">{sectionNumber(5 + Number(hasIntroduction) + Number(Boolean(playbook.founderJourney?.length)) + Number(Boolean(playbook.lessons?.length)) + Number(Boolean(playbook.faqs?.length)))} · Continue exploring</p>
                  <h2 className="font-heading text-3xl font-bold text-primary">Links and supporting material</h2>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {!story.founderProfiles.some((profile) => profile.url === story.website) && (
                      story.directoryPath ? (
                        <Link to={story.directoryPath} className="group flex items-center justify-between rounded-2xl border border-primary/15 p-4 font-bold text-primary hover:border-secondary hover:text-secondary">
                          {story.company} profile <ArrowRight className="h-4 w-4" />
                        </Link>
                      ) : (
                        <a href={story.website} target="_blank" rel="noreferrer" className="group flex items-center justify-between rounded-2xl border border-primary/15 p-4 font-bold text-primary hover:border-secondary hover:text-secondary">
                          {story.company} website <ExternalLink className="h-4 w-4" />
                        </a>
                      )
                    )}
                    {story.founderProfiles.map((profile) => profile.internal ? (
                      <Link key={profile.name} to={profile.url} className="group flex items-center justify-between rounded-2xl border border-[#0A66C2]/25 p-4 font-bold text-[#0A66C2] hover:border-[#0A66C2]">
                        {profile.name} profile <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <a key={profile.name} href={profile.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between rounded-2xl border border-[#0A66C2]/25 p-4 font-bold text-[#0A66C2] hover:border-[#0A66C2]">
                        {profile.name} on LinkedIn <Linkedin className="h-4 w-4" />
                      </a>
                    ))}
                    {story.sourcePost && (
                      <a href={story.sourcePost} target="_blank" rel="noreferrer" className="group flex items-center justify-between rounded-2xl border border-primary/15 p-4 font-bold text-primary hover:border-secondary hover:text-secondary">
                        Supporting source <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <Link to={event.galleryPath || `/gallery/${playbook.eventSlug}`} className="group flex items-center justify-between rounded-2xl border border-primary/15 p-4 font-bold text-primary hover:border-secondary hover:text-secondary">
                      {event.date} event gallery <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </section>
              </div>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <section className="rounded-3xl border-2 border-primary/15 bg-card p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">Important keywords</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {story.keywords?.map((keyword) => (
                    <span key={keyword} className="rounded-full border border-primary/15 bg-surface-1 px-3 py-1.5 text-xs font-bold text-primary">{keyword}</span>
                  ))}
                </div>
              </section>

              <nav aria-label="Playbook sections" className="rounded-3xl border-2 border-primary/15 bg-card p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">On this page</p>
                <div className="mt-4 grid gap-2 text-sm font-semibold text-foreground">
                  {playbook.introductionParagraphs?.length && <a href="#introduction" className="rounded-lg px-2 py-1.5 hover:bg-surface-1 hover:text-secondary">Introduction</a>}
                  <a href="#problem" className="rounded-lg px-2 py-1.5 hover:bg-surface-1 hover:text-secondary">The problem</a>
                  <a href="#solution" className="rounded-lg px-2 py-1.5 hover:bg-surface-1 hover:text-secondary">The solution</a>
                  {playbook.founderJourney?.length && <a href="#founder-journey" className="rounded-lg px-2 py-1.5 hover:bg-surface-1 hover:text-secondary">Founder journey</a>}
                  <a href="#demonstration" className="rounded-lg px-2 py-1.5 hover:bg-surface-1 hover:text-secondary">What was demonstrated</a>
                  {playbook.lessons?.length && <a href="#lessons" className="rounded-lg px-2 py-1.5 hover:bg-surface-1 hover:text-secondary">Practical lessons</a>}
                  <a href="#founder-take" className="rounded-lg px-2 py-1.5 hover:bg-surface-1 hover:text-secondary">The founder take</a>
                  {playbook.faqs?.length && <a href="#faqs" className="rounded-lg px-2 py-1.5 hover:bg-surface-1 hover:text-secondary">FAQs</a>}
                  <a href="#links" className="rounded-lg px-2 py-1.5 hover:bg-surface-1 hover:text-secondary">Links</a>
                </div>
              </nav>
            </aside>
          </div>
        </article>
      </main>
    </PageLayout>
  );
};

export default FounderPlaybookDetail;
