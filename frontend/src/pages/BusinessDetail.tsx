import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Linkedin, MapPin, PlayCircle, Users } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { BusinessListing, fetchBusiness } from "@/lib/api";

const embedUrl = (value: string) => {
  try {
    const url = new URL(value);
    if (url.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${url.pathname.slice(1)}`;
    if (url.hostname.includes("youtube.com")) {
      const id = url.searchParams.get("v") || url.pathname.split("/").filter(Boolean).pop();
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (url.hostname.includes("vimeo.com")) {
      const id = url.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    if (url.hostname.includes("loom.com")) {
      const id = url.pathname.split("/").filter(Boolean).pop();
      return id ? `https://www.loom.com/embed/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
};

const BusinessDetail = () => {
  const { slug = "" } = useParams();
  const [business, setBusiness] = useState<BusinessListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchBusiness(slug)
      .then(({ data }) => { if (!cancelled) setBusiness(data); })
      .catch(() => { if (!cancelled) setBusiness(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) return <PageLayout><div className="min-h-[70vh] pt-32 text-center text-muted-foreground">Loading startup profile…</div></PageLayout>;

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

  const founders = business.founders ?? [];
  const images = (business.media ?? []).filter((item) => item.media_type === "image");
  const videos = (business.media ?? []).filter((item) => item.media_type === "video");

  return (
    <PageLayout>
      <SEO title={`${business.name} — StartupA2Z.org`} description={business.pitch} canonical={`https://startupa2z.org/startups/${business.slug ?? slug}`} />
      <div>
        <section className="gradient-hero-solid text-white" style={{ paddingTop: "calc(64px + clamp(3rem, 6vw, 5rem))", paddingBottom: "clamp(3rem, 6vw, 5rem)" }}>
          <div className="container-narrow">
            <Link to="/startups" className="mb-8 inline-flex items-center text-sm text-white/70 hover:text-white"><ArrowLeft className="mr-2 h-4 w-4" /> Startup directory</Link>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="flex items-start gap-5">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white/10 flex items-center justify-center font-heading text-3xl font-bold">
                  {business.logo_url ? <img src={business.logo_url} alt={`${business.name} logo`} className="h-full w-full object-cover" /> : business.name[0]}
                </div>
                <div><div className="mb-2 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider text-secondary"><span>{business.category}</span><span>·</span><span>{business.stage}</span></div><h1 className="font-heading text-4xl font-bold md:text-6xl">{business.name}</h1><p className="mt-4 max-w-3xl text-lg text-white/75">{business.pitch}</p><p className="mt-3 flex items-center text-sm text-white/65"><MapPin className="mr-1.5 h-4 w-4" />{business.location}</p></div>
              </div>
              {business.website_url && <Button asChild className="shrink-0 bg-secondary text-secondary-foreground hover:bg-secondary/90"><a href={business.website_url} target="_blank" rel="noopener noreferrer">Visit website <ExternalLink className="ml-2 h-4 w-4" /></a></Button>}
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-narrow space-y-16">
            {founders.length > 0 && (
              <section><div className="mb-7 flex items-center gap-2"><Users className="h-5 w-5 text-secondary" /><h2 className="font-heading text-3xl font-bold text-primary">Meet the founders</h2></div><div className="grid gap-5 md:grid-cols-2">{founders.map((founder) => <article key={founder.id ?? `${founder.name}-${founder.role}`} className="rounded-2xl border bg-card p-6"><div className="flex gap-4"><div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted flex items-center justify-center">{founder.photo_url ? <img src={founder.photo_url} alt={founder.name} className="h-full w-full object-cover" /> : <span className="font-heading text-2xl font-bold text-primary">{founder.name[0]}</span>}</div><div><p className="text-xs font-semibold uppercase tracking-wider text-secondary">{founder.role}</p><h3 className="font-heading text-xl font-semibold">{founder.name}</h3>{founder.linkedin_url && <a href={founder.linkedin_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center text-sm text-[#0A66C2] hover:underline"><Linkedin className="mr-1.5 h-4 w-4" /> LinkedIn</a>}</div></div>{founder.journey && <p className="mt-5 whitespace-pre-line text-sm leading-7 text-muted-foreground">{founder.journey}</p>}</article>)}</div></section>
            )}

            {business.journey && <section className="max-w-4xl"><p className="text-xs font-semibold uppercase tracking-widest text-secondary">Our story</p><h2 className="mt-2 font-heading text-3xl font-bold text-primary">The journey to reach here</h2><p className="mt-5 whitespace-pre-line text-base leading-8 text-muted-foreground">{business.journey}</p></section>}

            {(business.challenges || business.challenge_solution) && <section className="grid gap-5 md:grid-cols-2">{business.challenges && <div className="rounded-2xl bg-muted/60 p-7"><p className="text-xs font-semibold uppercase tracking-widest text-secondary">The challenge</p><h2 className="mt-2 font-heading text-2xl font-bold text-primary">What stood in the way</h2><p className="mt-4 whitespace-pre-line leading-7 text-muted-foreground">{business.challenges}</p></div>}{business.challenge_solution && <div className="rounded-2xl border border-secondary/25 bg-card p-7"><p className="text-xs font-semibold uppercase tracking-widest text-secondary">The breakthrough</p><h2 className="mt-2 font-heading text-2xl font-bold text-primary">How the team moved forward</h2><p className="mt-4 whitespace-pre-line leading-7 text-muted-foreground">{business.challenge_solution}</p></div>}</section>}

            {images.length > 0 && <section><h2 className="mb-7 font-heading text-3xl font-bold text-primary">Inside {business.name}</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{images.map((item) => <figure key={item.id ?? item.url} className="overflow-hidden rounded-2xl bg-muted"><img src={item.url} alt={item.caption || `${business.name} gallery`} className="aspect-[4/3] w-full object-cover" />{item.caption && <figcaption className="p-3 text-sm text-muted-foreground">{item.caption}</figcaption>}</figure>)}</div></section>}

            {videos.length > 0 && <section><h2 className="mb-7 font-heading text-3xl font-bold text-primary">Watch the story</h2><div className="grid gap-5 md:grid-cols-2">{videos.map((item) => { const embedded = embedUrl(item.url); return <article key={item.id ?? item.url} className="overflow-hidden rounded-2xl border bg-card">{embedded ? <iframe src={embedded} title={item.caption || `${business.name} video`} className="aspect-video w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex aspect-video items-center justify-center bg-muted text-primary"><PlayCircle className="mr-2 h-7 w-7" /> Watch video</a>}{item.caption && <p className="p-4 text-sm text-muted-foreground">{item.caption}</p>}</article>; })}</div></section>}

            {business.tags.length > 0 && <div className="flex flex-wrap gap-2 border-t pt-8">{business.tags.map((tag) => <span key={tag} className="rounded-full border px-3 py-1.5 text-sm text-muted-foreground">{tag}</span>)}</div>}
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default BusinessDetail;
