import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Building2, CalendarDays, ExternalLink, Globe2, MapPin, Users } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { BusinessListing, fetchBusiness } from "@/lib/api";
import { companyPlaybookLinks, staticBusinessProfiles } from "@/data/staticBusinesses";

const BusinessDetail = () => {
  const { slug = "" } = useParams();
  const [business, setBusiness] = useState<BusinessListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchBusiness(slug)
      .then(({ data }) => {
        if (!cancelled) setBusiness(data || staticBusinessProfiles[slug] || null);
      })
      .catch(() => {
        if (!cancelled) setBusiness(staticBusinessProfiles[slug] || null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return <PageLayout><div className="min-h-[70vh] pt-32 text-center text-muted-foreground">Loading startup profile…</div></PageLayout>;
  }

  if (!business) {
    return (
      <PageLayout>
        <div className="min-h-[70vh] pt-32 text-center">
          <h1 className="font-heading text-3xl font-bold">Startup profile not found</h1>
          <p className="mt-3 text-muted-foreground">This profile may still be under review.</p>
          <Button asChild variant="outline" className="mt-6"><Link to="/startups"><ArrowLeft className="mr-2 h-4 w-4" /> Back to startups</Link></Button>
        </div>
      </PageLayout>
    );
  }

  const displayName = business.name;
  const playbookPath = companyPlaybookLinks[business.slug ?? slug];
  const companyChannels = (business.channels ?? []).filter((channel) =>
    !channel.label.toLowerCase().includes("linkedin") || channel.url.includes("/company/"),
  );
  const hasWebsiteChannel = companyChannels.some((channel) => channel.label.toLowerCase().includes("website"));

  return (
    <PageLayout>
      <SEO title={`${displayName} — StartupA2Z.org`} description={business.pitch} canonical={`https://startupa2z.org/startups/${business.slug ?? slug}`} />

      <header className="gradient-hero-solid px-4 pb-10 pt-[calc(64px+2rem)] text-white md:pb-12">
        <div className="container-narrow">
          <Link to="/startups" className="mb-6 inline-flex items-center text-sm font-medium text-white/70 transition-colors hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Startup directory
          </Link>
          <div className="flex max-w-4xl flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white/10 font-heading text-3xl font-bold shadow-sm">
              {business.logo_url ? <img src={business.logo_url} alt={`${displayName} logo`} className="h-full w-full object-contain" /> : displayName[0]}
            </div>
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">{business.category}</span>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">{business.stage}</span>
              </div>
              <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl">{displayName}</h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-white/75 md:text-lg">{business.pitch}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-10 md:py-14">
        <div className="container-narrow grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <section className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
              <p className="label-overline">Company overview</p>
              <h2 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">About {displayName}</h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">{business.pitch}</p>
              {business.tags.length > 0 && (
                <div className="mt-6 border-t pt-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Product focus</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {business.tags.map((tag) => <span key={tag} className="rounded-full border bg-muted/30 px-3 py-1.5 text-sm text-foreground">{tag}</span>)}
                  </div>
                </div>
              )}
            </section>

            {playbookPath && (
              <section className="rounded-2xl border border-secondary/25 bg-card p-6 shadow-sm md:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-secondary">Founder’s Playbook</p>
                    <h2 className="mt-2 text-xl font-bold text-foreground">Read the Founder’s Playbook</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Explore the founder’s talk, lessons, and practical takeaways from the StartupA2Z.org community.</p>
                  </div>
                  <Button asChild className="shrink-0"><Link to={playbookPath}><BookOpen className="mr-2 h-4 w-4" /> Open Playbook</Link></Button>
                </div>
              </section>
            )}
          </div>

          <aside className="rounded-2xl border bg-card p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Company details</p>
            <dl className="mt-5 space-y-5 text-sm">
              <div><dt className="flex items-center gap-2 text-muted-foreground"><Building2 className="h-4 w-4" /> Category</dt><dd className="mt-1.5 font-semibold text-foreground">{business.category}</dd></div>
              <div><dt className="flex items-center gap-2 text-muted-foreground"><Building2 className="h-4 w-4" /> Stage</dt><dd className="mt-1.5 font-semibold text-foreground">{business.stage}</dd></div>
              <div><dt className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> Location</dt><dd className="mt-1.5 font-semibold text-foreground">{business.location}</dd></div>
              {business.founded_year && <div><dt className="flex items-center gap-2 text-muted-foreground"><CalendarDays className="h-4 w-4" /> Founded</dt><dd className="mt-1.5 font-semibold text-foreground">{business.founded_year}</dd></div>}
              {business.team_size && <div><dt className="flex items-center gap-2 text-muted-foreground"><Users className="h-4 w-4" /> Team size</dt><dd className="mt-1.5 font-semibold text-foreground">{business.team_size}</dd></div>}
              {business.company_status && <div><dt className="text-muted-foreground">Status</dt><dd className="mt-1.5 font-semibold text-foreground">{business.company_status}</dd></div>}
            </dl>

            {(business.website_url || companyChannels.length > 0) && (
              <div className="mt-6 space-y-2 border-t pt-5">
                {business.website_url && !hasWebsiteChannel && <a href={business.website_url} target="_blank" rel="noopener noreferrer" aria-label={`${displayName} website`} className="flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-secondary hover:text-secondary"><span className="inline-flex items-center gap-2"><Globe2 className="h-4 w-4" /> Website</span><ExternalLink className="h-4 w-4" /></a>}
                {companyChannels.map((channel) => <a key={`${channel.label}-${channel.url}`} href={channel.url} target="_blank" rel="noopener noreferrer" aria-label={`${displayName} ${channel.label.toLowerCase()}`} className="flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-secondary hover:text-secondary"><span className="inline-flex items-center gap-2"><Globe2 className="h-4 w-4" /> {channel.label}</span><ExternalLink className="h-4 w-4" /></a>)}
              </div>
            )}
          </aside>
        </div>
      </main>
    </PageLayout>
  );
};

export default BusinessDetail;
