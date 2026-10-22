import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Clock3, ExternalLink, Lightbulb, MapPin, Quote, ShieldCheck, UserRound } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import { getInsight } from "@/data/insights";

const themes = [
  {
    number: "01",
    title: "Reliable AI needs evaluation, not confidence alone",
    observation: "Several conversations focused on testing AI systems and determining whether their results are dependable.",
    founderQuestion: "What evidence tells us this system works well enough for the customer's actual workflow?",
  },
  {
    number: "02",
    title: "Sovereign AI is ultimately about control",
    observation: "Molly Mackinlay's session brought data ownership, infrastructure control, portability, and confidential processing into one founder-level discussion.",
    founderQuestion: "Can we export our data, context, and work in a usable form if we change providers?",
  },
  {
    number: "03",
    title: "Context and memory create value—and responsibility",
    observation: "What an AI system remembers, retains, and carries between tools affects product usefulness, privacy, and customer trust.",
    founderQuestion: "What should the product remember, for how long, and who can inspect or delete it?",
  },
  {
    number: "04",
    title: "Agent security has to match agent authority",
    observation: "Sessions involving Auth0 at Okta, Google for Startups, and Wiz added practical perspectives on identity, access, AI, and cloud security.",
    founderQuestion: "What can the agent access, what can it change, and how quickly can that authority be revoked?",
  },
  {
    number: "05",
    title: "Customer understanding comes before scale",
    observation: "Sessions at Reddit, Tonik, and Sell & Scale reinforced the value of community listening, honest brand feedback, and understanding how customers buy.",
    founderQuestion: "What is the customer struggling with, what have they tried, and what is still getting in the way?",
  },
  {
    number: "06",
    title: "Growth requires documented and financial discipline",
    observation: "The Series A discussion at Expensify and Financial Systems for Founders connected signed commitments, runway, cash timing, and scenario planning.",
    founderQuestion: "What milestone does our current cash buy, and are the commitments behind the plan documented?",
  },
];

const decisionMatrix = [
  ["AI quality", "How will we evaluate reliability?", "A repeatable test tied to a customer workflow", "Define one critical task and its pass criteria"],
  ["Data control", "Can customers take their data and context with them?", "Documented export, retention, and deletion paths", "Map what remains when a customer leaves"],
  ["Agent security", "What authority does the agent have?", "Scoped permissions, observable actions, and revocation", "List every system the agent can read or change"],
  ["Customer fit", "What problem is urgent enough to change behavior?", "Evidence from direct conversations and actual attempts", "Interview five customers before adding another feature"],
  ["Brand and community", "Can people explain the value after hearing it once?", "Clear language confirmed by honest external feedback", "Ask three outsiders to repeat the promise back"],
  ["Financial readiness", "What milestone will this spending reach?", "Base, upside, and downside plans tied to runway", "Calculate the runway impact of the next decision"],
  ["Fundraising readiness", "Are important commitments complete and signed?", "Organized records with clear owners and final versions", "Audit material agreements before diligence starts"],
];

const eventMap = [
  ["AI assurance", "AI evaluation conversations", "Trust needs measurable evidence"],
  ["Sovereign infrastructure", "Open Source × Sovereign AI", "Ownership includes data, context, infrastructure, and portability"],
  ["Secure agents", "Build AI Agents with Auth0 at Okta", "Authority and identity must be designed together"],
  ["Cloud and AI security", "Google for Startups and Wiz", "Customer trust depends on how the product operates, not only what it produces"],
  ["Brand and customer understanding", "Reddit, Tonik, and Sell & Scale", "Listening and positioning shape whether a product is understood"],
  ["Growth readiness", "Series A panel and Financial Systems for Founders", "Documentation, cash discipline, and milestones support durable growth"],
];

const InsightDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const insight = getInsight(slug || "");
  if (!insight) return <Navigate to="/resources/insights" replace />;

  const canonical = `https://startupa2z.org/resources/insights/${insight.slug}`;
  const absoluteImage = `https://startupa2z.org${insight.heroImage}`;

  return (
    <PageLayout>
      <SEO
        title={`${insight.title} | StartupA2Z.org`}
        description={insight.summary}
        canonical={canonical}
        ogImage={absoluteImage}
        ogType="article"
        keywords={["SF Tech Week", "startup founders", "AI evaluation", "sovereign AI", "agent security", "startup finance"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: insight.title,
          description: insight.summary,
          image: absoluteImage,
          datePublished: insight.publishedIso,
          author: { "@type": "Person", name: insight.author },
          publisher: { "@type": "Organization", name: "StartupA2Z.org", url: "https://startupa2z.org" },
          mainEntityOfPage: canonical,
        }}
      />

      <header className="gradient-hero-solid px-4 text-white" style={{ paddingTop: "calc(64px + clamp(2.5rem, 5vw, 4.5rem))" }}>
        <div className="container-narrow pb-[clamp(3.5rem,7vw,6rem)]">
          <Link to="/resources" className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white"><ArrowLeft className="h-4 w-4" />Back to Explore resources</Link>
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-secondary">{insight.category}</span>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em]">{insight.format}</span>
              </div>
              <h1 className="mt-6 font-heading text-4xl font-bold leading-tight tracking-tight md:text-6xl">{insight.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/78">{insight.deck}</p>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm text-white/70">
                <span className="inline-flex items-center gap-2"><UserRound className="h-4 w-4 text-secondary" />{insight.author}</span>
                <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-secondary" />{insight.publishedLabel}</span>
                <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-secondary" />{insight.readTime}</span>
                <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-secondary" />San Francisco Bay Area</span>
              </div>
            </div>
            <figure className="overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-3 shadow-2xl">
              <img src={insight.heroImage} alt={insight.heroAlt} className="aspect-square w-full rounded-2xl object-cover" />
              <figcaption className="px-2 pb-1 pt-3 text-xs text-white/60">Images shared in Satish Govindappa's SF Tech Week LinkedIn field notes.</figcaption>
            </figure>
          </div>
        </div>
      </header>

      <main className="bg-background px-4 py-[clamp(3.5rem,7vw,6rem)]">
        <div className="container-narrow grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="min-w-0 space-y-14">
            <section className="rounded-3xl border-2 border-primary/15 bg-card p-7 shadow-sm md:p-9">
              <p className="label-overline">The shift</p>
              <h2 className="mt-3 font-heading text-3xl font-bold text-primary">In-person conversations changed the quality of the questions</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">Much of our outreach and learning happens through cold calls, email, LinkedIn, and video. SF Tech Week added something those channels cannot fully reproduce: the ability to hear how founders describe the problem while they are still working through it.</p>
              <div className="mt-7 flex gap-4 rounded-2xl bg-primary px-5 py-5 text-primary-foreground">
                <Quote className="mt-1 h-7 w-7 shrink-0 text-secondary" />
                <blockquote className="text-xl font-bold leading-8">Spend more time listening before offering a solution.</blockquote>
              </div>
              <p className="mt-5 leading-7 text-muted-foreground">The most useful questions became: What is the team struggling with? What have they already tried? What is still getting in the way? The six themes below turn that listening into a repeatable founder framework.</p>
            </section>

            <section>
              <div className="max-w-3xl">
                <p className="label-overline">Six recurring themes</p>
                <h2 className="mt-3 font-heading text-3xl font-bold text-primary md:text-4xl">What founders should examine before they scale</h2>
              </div>
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {themes.map((theme) => (
                  <section key={theme.number} className="rounded-3xl border border-primary/15 bg-card p-6 shadow-sm">
                    <span className="text-sm font-black tracking-[0.18em] text-secondary">{theme.number}</span>
                    <h3 className="mt-3 font-heading text-xl font-bold text-primary">{theme.title}</h3>
                    <p className="mt-3 leading-7 text-muted-foreground">{theme.observation}</p>
                    <div className="mt-5 rounded-2xl bg-surface-1 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">Question to take back</p>
                      <p className="mt-2 font-semibold leading-6 text-foreground">{theme.founderQuestion}</p>
                    </div>
                  </section>
                ))}
              </div>
            </section>

            <section className="overflow-hidden rounded-3xl border-2 border-primary/15 bg-card shadow-sm">
              <div className="border-b border-primary/10 p-7 md:p-9">
                <p className="label-overline">Founder decision matrix</p>
                <h2 className="mt-3 font-heading text-3xl font-bold text-primary">Turn the themes into operating questions</h2>
                <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">Use this matrix in a founder meeting, product review, or planning session. It is designed to expose the next unanswered question, not produce a perfect score.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[880px] border-collapse text-left text-sm">
                  <thead className="bg-primary text-primary-foreground">
                    <tr>{["Decision area", "Question", "Evidence to look for", "First move"].map((heading) => <th key={heading} className="px-5 py-4 font-bold">{heading}</th>)}</tr>
                  </thead>
                  <tbody>
                    {decisionMatrix.map((row, index) => (
                      <tr key={row[0]} className={index % 2 ? "bg-surface-1" : "bg-card"}>
                        {row.map((cell, cellIndex) => <td key={cell} className={`border-t border-border px-5 py-4 align-top leading-6 ${cellIndex === 0 ? "font-bold text-primary" : "text-muted-foreground"}`}>{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <p className="label-overline">The week at a glance</p>
              <h2 className="mt-3 font-heading text-3xl font-bold text-primary">Where each theme surfaced</h2>
              <div className="mt-7 overflow-hidden rounded-3xl border border-primary/15 bg-card">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                    <thead className="bg-[#f8f0e3] text-primary"><tr>{["Lens", "Conversation or session", "What it clarified"].map((heading) => <th key={heading} className="px-5 py-4 font-bold">{heading}</th>)}</tr></thead>
                    <tbody>{eventMap.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={cell} className={`border-t border-border px-5 py-4 align-top leading-6 ${index === 0 ? "font-bold text-primary" : "text-muted-foreground"}`}>{cell}</td>)}</tr>)}</tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <figure className="overflow-hidden rounded-3xl border border-border bg-card md:col-span-2"><img src="/insights/sf-tech-week-2026/founder-session.jpg" alt="Founders and operators attending an SF Tech Week session" className="aspect-[4/3] h-full w-full object-cover" /></figure>
              <div className="grid gap-4">
              <figure className="overflow-hidden rounded-3xl border border-border bg-card"><img src="/insights/sf-tech-week-2026/satz-at-sf-tech-week.jpg" alt="Satish Govindappa attending an SF Tech Week session" className="aspect-[4/3] w-full object-cover" /></figure>
                <figure className="overflow-hidden rounded-3xl border border-border bg-card"><img src="/insights/sf-tech-week-2026/community-between-sessions.jpg" alt="SF Tech Week attendees connecting between sessions" className="aspect-[4/3] w-full object-cover" /></figure>
              </div>
            </section>

            <section className="rounded-3xl bg-dark p-7 text-white md:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">A practical 30-day follow-through</p>
              <h2 className="mt-3 font-heading text-3xl font-bold">Convert event learning into company evidence</h2>
              <div className="mt-7 grid gap-4 md:grid-cols-3">
                {[
                  ["Week 1", "Listen", "Interview customers using the three questions: struggle, prior attempts, remaining obstacle."],
                  ["Week 2", "Map", "Document AI data, memory, permissions, financial runway, and unsigned commitments."],
                  ["Weeks 3–4", "Prove", "Complete one evaluation, one permission review, and one customer-facing explanation."],
                ].map(([period, focus, action]) => (
                  <div key={period} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">{period}</p>
                    <h3 className="mt-2 text-xl font-bold">{focus}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/65">{action}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border-2 border-secondary/25 bg-secondary/5 p-7 md:p-9">
              <div className="flex gap-4">
                <Lightbulb className="mt-1 h-7 w-7 shrink-0 text-secondary" />
                <div>
                  <h2 className="font-heading text-2xl font-bold text-primary">The lasting takeaway</h2>
                  <p className="mt-3 text-lg leading-8 text-muted-foreground">Founders do not need more generic advice. They need better questions tied to the decision in front of them. The value of attending SF Tech Week was not collecting more topics—it was understanding where those topics collide inside a real company.</p>
                </div>
              </div>
            </section>
          </article>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <section className="rounded-3xl border border-primary/15 bg-card p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">Field note status</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />Based on Satish's firsthand attendance and published LinkedIn notes.</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />Original LinkedIn summary published October 10, 2026.</li>
                <li className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />StartupA2Z attended independently and is not presented as the event organizer.</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />The article expands the original themes without attributing unverified claims.</li>
              </ul>
              <a href={insight.sourcePostUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 font-bold text-primary hover:text-secondary">Read the original LinkedIn post <ExternalLink className="h-4 w-4" /></a>
            </section>
            <section className="rounded-3xl bg-primary p-6 text-primary-foreground">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">Continue learning</p>
              <h2 className="mt-3 font-heading text-2xl font-bold">Meet founders in the room</h2>
              <p className="mt-3 text-sm leading-6 text-white/70">Join an upcoming StartupA2Z gathering for practical conversations with founders, operators, and investors.</p>
              <Link to="/events?view=upcoming" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-secondary-foreground">Explore upcoming events <ArrowRight className="h-4 w-4" /></Link>
            </section>
          </aside>
        </div>
      </main>
    </PageLayout>
  );
};

export default InsightDetail;
