import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Building2, Gift, Handshake, Linkedin, MapPin, UserRound } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { fetchFounder, type FounderListing } from "@/lib/api";

const ProfilePoints = ({ text }: { text: string }) => (
  <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground marker:text-secondary">
    {text.split(/\n+/).map((point) => point.trim()).filter(Boolean).slice(0, 3).map((point) => <li key={point}>{point}</li>)}
  </ul>
);

const FounderDetail = () => {
  const { slug = "" } = useParams();
  const [founder, setFounder] = useState<FounderListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchFounder(slug)
      .then(({ data }) => { if (!cancelled) setFounder(data); })
      .catch(() => { if (!cancelled) setFounder(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) return <PageLayout><div className="min-h-[70vh] px-4 pt-32 text-center text-muted-foreground">Loading founder profile…</div></PageLayout>;
  if (!founder) return <PageLayout><div className="min-h-[70vh] px-4 pt-32 text-center"><h1 className="text-3xl font-bold">Founder not found</h1><Button asChild variant="outline" className="mt-6"><Link to="/founders"><ArrowLeft className="mr-2 h-4 w-4" /> Founder Directory</Link></Button></div></PageLayout>;

  const company = founder.company;
  const description = founder.journey || `${founder.name} is ${founder.role} at ${company.name}, a ${company.category} startup based in ${company.location}.`;

  return (
    <PageLayout>
      <SEO
        title={`${founder.name}, ${founder.role} at ${company.name} — StartupA2Z.org`}
        description={description}
        canonical={`https://startupa2z.org/founders/${founder.slug}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: founder.name,
          jobTitle: founder.role,
          url: `https://startupa2z.org/founders/${founder.slug}`,
          worksFor: { "@type": "Organization", name: company.name, url: `https://startupa2z.org/startups/${company.slug}` },
          sameAs: founder.linkedin_url ? [founder.linkedin_url] : undefined,
        }}
      />

      <header className="gradient-hero-solid px-4 pb-12 pt-[calc(64px+2.5rem)] text-white md:pb-16 md:pt-[calc(64px+3.5rem)]">
        <div className="container-narrow">
          <Link to="/founders" className="mb-8 inline-flex items-center text-sm font-medium text-white/70 hover:text-white"><ArrowLeft className="mr-2 h-4 w-4" /> Founder Directory</Link>
          <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10 shadow-sm md:h-36 md:w-36">
              {founder.photo_url ? <img src={founder.photo_url} alt={founder.name} className="h-full w-full object-cover" /> : <UserRound className="h-14 w-14 text-white/75" />}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{founder.role}</p>
              <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight md:text-6xl">{founder.name}</h1>
              <p className="mt-3 text-lg text-white/75">Building <Link to={`/startups/${company.slug}`} className="font-semibold text-white hover:text-secondary">{company.name}</Link></p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/65"><span className="inline-flex items-center gap-1.5"><Building2 className="h-4 w-4 text-secondary" />{company.category} · {company.stage}</span><span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-secondary" />{company.location}</span></div>
              {founder.linkedin_url && <Button asChild variant="outline" className="mt-6 rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20"><a href={founder.linkedin_url} target="_blank" rel="noopener noreferrer"><Linkedin className="mr-2 h-4 w-4" /> LinkedIn</a></Button>}
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-10 md:py-14">
        <div className="container-narrow space-y-10 md:space-y-14">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,.5fr)]">
            <section className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
              <p className="label-overline">Founder journey</p>
              <h2 className="mt-2 text-2xl font-bold md:text-3xl">The person behind the startup</h2>
              <p className="mt-5 whitespace-pre-line text-sm leading-7 text-muted-foreground">{founder.journey || `${founder.name} is helping build ${company.name}. More details about this founder’s journey will be added soon.`}</p>
            </section>
            <aside className="rounded-2xl bg-primary p-6 text-white shadow-sm md:p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/55">Building</p>
              <h2 className="mt-2 text-2xl font-bold">{company.name}</h2>
              <p className="mt-3 text-sm leading-6 text-white/70">{company.pitch}</p>
              <Button asChild className="mt-6 w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"><Link to={`/startups/${company.slug}`}>View startup story <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            </aside>
          </div>

          {(company.ask_text || company.offer_text) && (
            <section className="grid items-stretch gap-5 lg:grid-cols-2" aria-label={`${company.name} ask and offer`}>
              {company.ask_text && <article className="rounded-2xl border border-secondary/25 bg-card p-6 shadow-sm md:p-8"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10"><Handshake className="h-5 w-5 text-secondary" /></span><div><p className="text-xs font-semibold uppercase tracking-widest text-secondary">Our ask</p><h2 className="mt-1 text-2xl font-bold">What {company.name} is looking for</h2></div></div><ProfilePoints text={company.ask_text} /></article>}
              {company.offer_text && <article className="rounded-2xl border border-secondary/25 bg-card p-6 shadow-sm md:p-8"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10"><Gift className="h-5 w-5 text-secondary" /></span><div><p className="text-xs font-semibold uppercase tracking-widest text-secondary">Our offer</p><h2 className="mt-1 text-2xl font-bold">What {company.name} provides</h2></div></div><ProfilePoints text={company.offer_text} /></article>}
            </section>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default FounderDetail;
