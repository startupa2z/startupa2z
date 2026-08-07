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

const VideoCard = ({ url, caption, name }: { url: string; caption?: string | null; name: string }) => {
  const embedded = embedUrl(url);
  return (
    <article className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      {embedded ? (
        <iframe
          src={embedded}
          title={caption || `${name} video`}
          className="aspect-video w-full bg-black"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex aspect-video items-center justify-center bg-muted text-primary">
          <PlayCircle className="mr-2 h-7 w-7" /> Watch video
        </a>
      )}
      {caption && <p className="border-t px-4 py-3 text-sm text-muted-foreground">{caption}</p>}
    </article>
  );
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
  const featuredVideo = videos[0];
  const galleryImages = images;

  return (
    <PageLayout>
      <SEO title={`${business.name} — StartupA2Z.org`} description={business.pitch} canonical={`https://startupa2z.org/startups/${business.slug ?? slug}`} />

      <header className="gradient-hero-solid px-4 pb-10 pt-[calc(64px+2rem)] text-white md:pb-14 md:pt-[calc(64px+3rem)]">
        <div className="container-narrow">
          <Link to="/startups" className="mb-7 inline-flex items-center text-sm font-medium text-white/70 transition-colors hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Startup directory
          </Link>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,.55fr)] lg:items-stretch">
            <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white/10 font-heading text-3xl font-bold text-white shadow-sm md:h-24 md:w-24">
                {business.logo_url ? <img src={business.logo_url} alt={`${business.name} logo`} className="h-full w-full object-cover" /> : business.name[0]}
              </div>
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">{business.category}</span>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">{business.stage}</span>
                </div>
                <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl">{business.name}</h1>
                <p className="mt-3 max-w-3xl text-base leading-7 text-white/75 md:text-lg">{business.pitch}</p>
              </div>
            </div>
            <aside className="flex flex-col justify-between rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">Startup snapshot</p>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5">
                  <div><dt className="text-xs text-white/55">Category</dt><dd className="mt-1 font-semibold">{business.category}</dd></div>
                  <div><dt className="text-xs text-white/55">Stage</dt><dd className="mt-1 font-semibold">{business.stage}</dd></div>
                  <div className="col-span-2"><dt className="text-xs text-white/55">Based in</dt><dd className="mt-1 flex items-center font-semibold"><MapPin className="mr-1.5 h-4 w-4 text-secondary" />{business.location}</dd></div>
                </dl>
              </div>
              {business.website_url && <Button asChild size="lg" className="mt-6 w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"><a href={business.website_url} target="_blank" rel="noopener noreferrer">Visit website <ExternalLink className="ml-2 h-4 w-4" /></a></Button>}
            </aside>
          </div>
        </div>
      </header>

      <div className="px-4 py-10 md:py-14">
        <div className="container-narrow space-y-12 md:space-y-16">
          {featuredVideo && (
            <section>
              <div className="mb-5">
                <p className="label-overline">Featured</p>
                <h2 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">See what {business.name} is building</h2>
              </div>
              <div className="max-w-5xl"><VideoCard url={featuredVideo.url} caption={featuredVideo.caption} name={business.name} /></div>
            </section>
          )}

          {founders.length > 0 && (
            <section>
              <div className="mb-5 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground md:text-3xl">Meet the founders</h2>
              </div>
              <div className="grid items-start gap-5 md:grid-cols-2">
                {founders.map((founder) => (
                  <article key={founder.id ?? `${founder.name}-${founder.role}`} className="min-w-0 rounded-2xl border bg-card p-5 shadow-sm md:p-6">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                        {founder.photo_url ? <img src={founder.photo_url} alt={founder.name} className="h-full w-full object-cover" /> : <span className="text-xl font-bold text-primary">{founder.name[0]}</span>}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-secondary">{founder.role}</p>
                        <h3 className="text-xl font-semibold text-foreground">{founder.name}</h3>
                        {founder.linkedin_url && <a href={founder.linkedin_url} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-flex items-center text-sm font-medium text-[#0A66C2] hover:underline"><Linkedin className="mr-1.5 h-4 w-4" /> LinkedIn</a>}
                      </div>
                    </div>
                    {founder.journey && <p className="mt-5 whitespace-pre-line border-t pt-4 text-sm leading-7 text-muted-foreground">{founder.journey}</p>}
                  </article>
                ))}
              </div>
            </section>
          )}

          {(business.journey || business.challenges || business.challenge_solution) && (
            <section>
              <div className="mb-5">
                <p className="label-overline">The founder journey</p>
                <h2 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">The story behind {business.name}</h2>
              </div>
              <div className="grid items-stretch gap-5 lg:grid-cols-3">
              {business.journey && (
                <article className="h-full rounded-2xl border bg-card p-6 shadow-sm">
                  <p className="label-overline">Our story</p>
                  <h2 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">How {business.name} got here</h2>
                  <p className="mt-5 whitespace-pre-line text-sm leading-7 text-muted-foreground">{business.journey}</p>
                </article>
              )}
              {business.challenges && <article className="h-full rounded-2xl bg-primary p-6 text-primary-foreground shadow-sm"><p className="text-xs font-semibold uppercase tracking-widest text-white/60">The challenge</p><h2 className="mt-2 text-2xl font-bold">What stood in the way</h2><p className="mt-5 whitespace-pre-line text-sm leading-7 text-white/75">{business.challenges}</p></article>}
              {business.challenge_solution && <article className="h-full rounded-2xl border border-secondary/25 bg-card p-6 shadow-sm"><p className="text-xs font-semibold uppercase tracking-widest text-secondary">The breakthrough</p><h2 className="mt-2 text-2xl font-bold text-foreground">How the team moved forward</h2><p className="mt-5 whitespace-pre-line text-sm leading-7 text-muted-foreground">{business.challenge_solution}</p></article>}
              </div>
            </section>
          )}

          {galleryImages.length > 0 && (
            <section>
              <h2 className="mb-5 text-2xl font-bold text-foreground md:text-3xl">Inside {business.name}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {galleryImages.map((item) => <figure key={item.id ?? item.url} className="overflow-hidden rounded-2xl border bg-card shadow-sm"><div className="flex min-h-72 items-center justify-center bg-muted/50 p-2"><img src={item.url} alt={item.caption || `${business.name} gallery`} className="max-h-[680px] w-full object-contain" /></div>{item.caption && <figcaption className="border-t p-3 text-sm text-muted-foreground">{item.caption}</figcaption>}</figure>)}
              </div>
            </section>
          )}

          {videos.length > 1 && (
            <section>
              <h2 className="mb-5 text-2xl font-bold text-foreground md:text-3xl">More from {business.name}</h2>
              <div className="grid gap-5 md:grid-cols-2">{videos.slice(1).map((item) => <VideoCard key={item.id ?? item.url} url={item.url} caption={item.caption} name={business.name} />)}</div>
            </section>
          )}

          {business.tags.length > 0 && <div className="flex flex-wrap gap-2 border-t pt-8">{business.tags.map((tag) => <span key={tag} className="rounded-full border bg-card px-3 py-1.5 text-sm text-muted-foreground">{tag}</span>)}</div>}
        </div>
      </div>
    </PageLayout>
  );
};

export default BusinessDetail;
