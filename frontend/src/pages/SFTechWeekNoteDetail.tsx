import { ArrowLeft, ArrowRight, CalendarDays, ExternalLink, MapPin } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import { weekArticles } from "@/data/sfTechWeekNotes";

const SFTechWeekNoteDetail = () => {
  const { slug } = useParams();
  const article = weekArticles.find((item) => item.slug === slug);
  if (!article) return <Navigate to="/resources/insights/sf-tech-week-2026" replace />;

  const index = weekArticles.findIndex((item) => item.slug === article.slug);
  const next = weekArticles[(index + 1) % weekArticles.length];
  const canonical = `https://startupa2z.org/resources/insights/sf-tech-week-2026/${article.slug}`;
  const localLinks = article.links.filter((link) => link.url.startsWith("/resources"));
  const sourceLinks = article.links.filter((link) => !link.url.startsWith("/resources"));

  return (
    <PageLayout>
      <SEO
        title={`${article.title} | StartupA2Z.org`}
        description={article.description}
        canonical={canonical}
        ogImage={article.image ? `https://startupa2z.org${article.image.src}` : undefined}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.description,
          datePublished: article.eventDate ?? "2026-10-11",
          author: { "@type": "Person", name: "Satish Govindappa" },
          publisher: { "@type": "Organization", name: "StartupA2Z.org" },
          mainEntityOfPage: canonical,
        }}
      />

      <header className="gradient-hero-solid px-4 text-white" style={{ paddingTop: "calc(64px + clamp(2.5rem, 5vw, 4.5rem))" }}>
        <div className="container-narrow pb-[clamp(3rem,6vw,5rem)]">
          <Link to="/resources" className="inline-flex items-center gap-2 text-sm font-bold text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to Explore resources
          </Link>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.16em] text-secondary">{article.category}</p>
          <h1 className="mt-4 max-w-5xl font-heading text-4xl font-bold tracking-tight md:text-6xl">{article.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">{article.summary}</p>
          <div className="mt-7 flex flex-wrap gap-4 text-sm text-white/70">
            {article.eventDateLabel && <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" />{article.eventDateLabel}</span>}
            {article.location && <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{article.location}</span>}
            <span>Field notes by Satish Govindappa</span>
          </div>
        </div>
      </header>

      <main className="bg-background">
        <article className="section-padding">
          <div className="container-narrow">
            {article.image && (
              <figure className="mx-auto mb-12 max-w-5xl overflow-hidden rounded-3xl border border-primary/10 bg-card shadow-sm">
                <img src={article.image.src} alt={article.image.alt} width={article.image.width} height={article.image.height} className="aspect-[16/10] w-full object-cover" />
                <figcaption className="px-5 py-3 text-sm text-muted-foreground">{article.image.caption}</figcaption>
              </figure>
            )}

            <div className="mx-auto max-w-4xl">
              <div className="space-y-5 text-lg leading-8 text-foreground/85">
                {article.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>

              <section className="mt-12" aria-labelledby="notes-table-title">
                <p className="label-overline">What stood out</p>
                <h2 id="notes-table-title" className="mt-3 font-heading text-3xl font-bold text-primary">Signals and founder implications</h2>
                <div className="mt-6 overflow-x-auto rounded-2xl border border-primary/15">
                  <table className="w-full min-w-[680px] border-collapse text-left">
                    <thead className="bg-primary text-primary-foreground">
                      <tr><th className="px-5 py-4 text-sm font-bold">Signal</th><th className="px-5 py-4 text-sm font-bold">What founders can carry forward</th></tr>
                    </thead>
                    <tbody>
                      {article.highlights.map((highlight, itemIndex) => (
                        <tr key={highlight.title} className={itemIndex % 2 ? "bg-muted/30" : "bg-card"}>
                          <th className="w-[30%] px-5 py-5 align-top font-heading text-lg text-primary">{highlight.title}</th>
                          <td className="px-5 py-5 leading-7 text-muted-foreground">{highlight.body}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <aside className="mt-10 rounded-3xl border-2 border-secondary/30 bg-secondary/10 p-7 md:p-9">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">Practical takeaway</p>
                <p className="mt-3 font-heading text-2xl font-bold leading-9 text-primary">{article.takeaway}</p>
              </aside>

              <section className="mt-12 space-y-5 text-lg leading-8 text-foreground/85">
                {article.closing.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                <p className="rounded-2xl bg-primary p-6 font-heading text-2xl font-bold leading-9 text-primary-foreground">{article.question}</p>
              </section>

              {article.questions.length > 0 && (
                <section className="mt-12">
                  <p className="label-overline">Quick answers</p>
                  <h2 className="mt-3 font-heading text-3xl font-bold text-primary">Questions founders may ask</h2>
                  <div className="mt-6 grid gap-4">
                    {article.questions.map((item) => (
                      <div key={item.question} className="rounded-2xl border border-primary/15 bg-card p-6">
                        <h3 className="font-heading text-xl font-bold text-primary">{item.question}</h3>
                        <p className="mt-3 leading-7 text-muted-foreground">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {(sourceLinks.length > 0 || localLinks.length > 0) && (
                <section className="mt-12 rounded-2xl bg-muted/40 p-6 md:p-8">
                  <h2 className="font-heading text-2xl font-bold text-primary">Sources and related reading</h2>
                  <ul className="mt-5 grid gap-3">
                    {[...sourceLinks, ...localLinks].map((link) => (
                      <li key={`${link.label}-${link.url}`}>
                        {link.url.startsWith("/") ? (
                          <Link to={link.url} className="inline-flex items-start gap-2 font-semibold text-primary hover:text-secondary">{link.label}<ArrowRight className="mt-1 h-4 w-4 shrink-0" /></Link>
                        ) : (
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2 font-semibold text-primary hover:text-secondary">{link.label}<ExternalLink className="mt-1 h-4 w-4 shrink-0" /></a>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        </article>

        <section className="section-padding bg-muted/35">
          <div className="container-narrow flex flex-col justify-between gap-6 rounded-3xl bg-primary p-8 text-primary-foreground md:flex-row md:items-center md:p-10">
            <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">Continue the collection</p><h2 className="mt-2 font-heading text-2xl font-bold md:text-3xl">{next.shortTitle}</h2></div>
            <Link to={`/resources/insights/sf-tech-week-2026/${next.slug}`} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 font-bold text-secondary-foreground">Next report <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </main>
    </PageLayout>
  );
};

export default SFTechWeekNoteDetail;
