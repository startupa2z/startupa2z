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
        </div>
      </section>

      <main className="section-padding bg-background">
        <article className="container-narrow">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="space-y-8">
              <figure className="overflow-hidden rounded-3xl border-2 border-primary/15 bg-[#f8f0e3] shadow-[0_14px_40px_rgba(27,75,57,0.08)]">
                <img src={story.image} alt={story.imageAlt} className="aspect-[16/9] w-full object-cover" />
              </figure>

              <div className="rounded-3xl border-2 border-primary/15 bg-card p-7 shadow-[0_14px_40px_rgba(27,75,57,0.08)] md:p-10">
                <section id="problem" className="scroll-mt-24">
                  <p className="label-overline mb-3">01 · The problem</p>
                  <h2 className="font-heading text-3xl font-bold text-primary">{playbook.problemHeading}</h2>
                  <p className="mt-5 text-lg leading-8 text-muted-foreground">{story.challenge}</p>
                  <ul className="mt-6 list-disc space-y-2 pl-6 leading-7 text-muted-foreground">
                    {playbook.problemPoints.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                </section>

                <section id="solution" className="mt-10 scroll-mt-24 border-t border-primary/10 pt-10">
                  <p className="label-overline mb-3">02 · The solution</p>
                  <h2 className="font-heading text-3xl font-bold text-primary">{playbook.solutionHeading}</h2>
                  <p className="mt-5 text-lg leading-8 text-muted-foreground">{story.approach}</p>
                </section>

                <section id="demonstration" className="mt-10 scroll-mt-24 border-t border-primary/10 pt-10">
                  <p className="label-overline mb-3">03 · What he demonstrated</p>
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

                <section id="founder-take" className="mt-10 scroll-mt-24 border-t border-primary/10 pt-10">
                  <p className="label-overline mb-3">04 · {playbook.takeLabel ?? "The founder take"}</p>
                  <h2 className="font-heading text-3xl font-bold text-primary">{playbook.takeHeading}</h2>
                  <p className="mt-5 text-lg leading-8 text-muted-foreground">{story.lesson}</p>
                  <div className="mt-7 grid gap-4 sm:grid-cols-3">
                    {playbook.takeaways.map((takeaway) => (
                      <div key={takeaway.title} className="rounded-2xl border border-primary/10 p-4">
                        <h3 className="font-bold text-foreground">{takeaway.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{takeaway.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="links" className="mt-10 scroll-mt-24 border-t border-primary/10 pt-10">
                  <p className="label-overline mb-3">05 · Continue exploring</p>
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
                  <a href="#problem" className="rounded-lg px-2 py-1.5 hover:bg-surface-1 hover:text-secondary">The problem</a>
                  <a href="#solution" className="rounded-lg px-2 py-1.5 hover:bg-surface-1 hover:text-secondary">The solution</a>
                  <a href="#demonstration" className="rounded-lg px-2 py-1.5 hover:bg-surface-1 hover:text-secondary">What he demonstrated</a>
                  <a href="#founder-take" className="rounded-lg px-2 py-1.5 hover:bg-surface-1 hover:text-secondary">The founder take</a>
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
