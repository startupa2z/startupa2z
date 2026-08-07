import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Building2, CalendarDays, Gift, Globe2, Handshake, Lightbulb, Linkedin, MapPin, PlayCircle, TriangleAlert, UserRound, Users, X as XIcon } from "lucide-react";
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

const BulletList = ({ text, className = "" }: { text: string | string[]; className?: string }) => {
  const items = (Array.isArray(text) ? text : text.split(/\n+/))
    .map((item) => item.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 3);

  return (
    <ul className={`mt-4 list-disc space-y-2 pl-5 text-sm leading-7 ${className}`}>
      {items.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}
    </ul>
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
  const journeyPhotos = images.slice(0, 3);
  const primaryJourneyPhoto = journeyPhotos[0];
  const supportingJourneyPhotos = journeyPhotos.slice(1);
  const galleryImages = images.slice(3);
  const channels = business.channels ?? [];
  const linkedinChannel = channels.find((channel) => channel.label.toLowerCase().includes("linkedin"));
  const xChannel = channels.find((channel) => ["x", "twitter"].some((label) => channel.label.toLowerCase().includes(label)));
  const askContent = business.ask_text;
  const offerContent = business.offer_text;
  const displayName = business.name;

  return (
    <PageLayout>
      <SEO title={`${displayName} — StartupA2Z.org`} description={business.pitch} canonical={`https://startupa2z.org/startups/${business.slug ?? slug}`} />

      <header className="gradient-hero-solid px-4 pb-8 pt-[calc(64px+1.5rem)] text-white md:pb-10 md:pt-[calc(64px+2rem)]">
        <div className="container-narrow">
          <Link to="/startups" className="mb-5 inline-flex items-center text-sm font-medium text-white/70 transition-colors hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Startup directory
          </Link>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(380px,.72fr)] lg:items-start">
            <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white/10 font-heading text-3xl font-bold text-white shadow-sm">
                {business.logo_url ? <img src={business.logo_url} alt={`${displayName} logo`} className="h-full w-full object-cover" /> : displayName[0]}
              </div>
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">{business.category}</span>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">{business.stage}</span>
                </div>
                <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl">{displayName}</h1>
                <p className="mt-3 max-w-3xl text-base leading-7 text-white/75 md:text-lg">{business.pitch}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">Company</p>
              <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                {business.founded_year && <div><dt className="flex items-center gap-1.5 text-xs text-white/55"><CalendarDays className="h-3.5 w-3.5" />Founded</dt><dd className="mt-1.5 font-semibold text-white">{business.founded_year}</dd></div>}
                <div><dt className="flex items-center gap-1.5 text-xs text-white/55"><Users className="h-3.5 w-3.5" />Team size</dt><dd className="mt-1.5 font-semibold text-white">{business.team_size ?? founders.length}</dd></div>
                <div><dt className="flex items-center gap-1.5 text-xs text-white/55"><MapPin className="h-3.5 w-3.5" />Location</dt><dd className="mt-1.5 font-semibold text-white">{business.location}</dd></div>
                <div><dt className="flex items-center gap-1.5 text-xs text-white/55"><Building2 className="h-3.5 w-3.5" />Stage</dt><dd className="mt-1.5 font-semibold text-white">{business.stage}</dd></div>
              </dl>
              <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4"><span className="mr-1 text-xs text-white/55">Channels</span>{linkedinChannel ? <a href={linkedinChannel.url} target="_blank" rel="noopener noreferrer" aria-label={`${displayName} on LinkedIn`} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"><Linkedin className="h-3.5 w-3.5" /></a> : <span title="LinkedIn channel will be connected after the UI is approved" aria-label="LinkedIn channel pending" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/55"><Linkedin className="h-3.5 w-3.5" /></span>}{xChannel ? <a href={xChannel.url} target="_blank" rel="noopener noreferrer" aria-label={`${displayName} on X`} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"><XIcon className="h-3.5 w-3.5" /></a> : <span title="X channel will be connected after the UI is approved" aria-label="X channel pending" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/55"><XIcon className="h-3.5 w-3.5" /></span>}{business.website_url && <a href={business.website_url} target="_blank" rel="noopener noreferrer" aria-label={`${displayName} website`} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"><Globe2 className="h-3.5 w-3.5" /></a>}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-10 md:py-14">
        <div className="container-narrow space-y-12 md:space-y-16">
          <section className="space-y-5">
            <div>
              <p className="label-overline">The founder journey</p>
              <h2 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">The story behind {displayName}</h2>
            </div>
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:gap-8">
            <div className="min-w-0 space-y-5">
              {primaryJourneyPhoto && <section aria-label={`${displayName} photos`} className={`grid w-full overflow-hidden rounded-2xl border bg-card p-2 shadow-sm ${supportingJourneyPhotos.length > 0 ? "gap-2 md:grid-cols-[minmax(0,2fr)_minmax(180px,1fr)]" : ""}`}><figure className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-white ${supportingJourneyPhotos.length > 0 ? "h-72 md:h-80" : "h-[280px] md:h-[400px]"}`}>{supportingJourneyPhotos.length === 0 && <img src={primaryJourneyPhoto.url} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-25 blur-2xl" />}<img src={primaryJourneyPhoto.url} alt={primaryJourneyPhoto.caption || `${displayName} main story`} className={supportingJourneyPhotos.length > 0 ? "h-full w-full object-cover" : "relative z-10 h-full w-full object-contain"} /></figure>{supportingJourneyPhotos.length > 0 && <div className="grid grid-rows-2 gap-2">{supportingJourneyPhotos.map((photo, index) => <figure key={photo.id ?? photo.url} className="flex min-h-0 items-center justify-center overflow-hidden rounded-xl bg-white"><img src={photo.url} alt={photo.caption || `${displayName} supporting story ${index + 1}`} className="h-full w-full object-cover" /></figure>)}</div>}</section>}
              {(askContent || offerContent) && <section aria-label={`${displayName} ask and offer`} className="grid gap-4 md:grid-cols-2">
                {askContent && <article id="profile-ask" aria-labelledby="business-ask-heading" className="scroll-mt-24 rounded-2xl border border-secondary/25 bg-card p-6 shadow-sm"><p className="text-xs font-semibold uppercase tracking-widest text-secondary">Our ask</p><h2 id="business-ask-heading" className="mt-1 text-xl font-bold text-foreground">What {displayName} is looking for</h2><BulletList text={askContent} className="text-muted-foreground marker:text-secondary" /></article>}
                {offerContent && <article id="profile-offer" aria-labelledby="business-offer-heading" className="scroll-mt-24 rounded-2xl border border-secondary/25 bg-card p-6 shadow-sm"><p className="text-xs font-semibold uppercase tracking-widest text-secondary">Our offer</p><h2 id="business-offer-heading" className="mt-1 text-xl font-bold text-foreground">What {displayName} provides</h2><BulletList text={offerContent} className="text-muted-foreground marker:text-secondary" /></article>}
              </section>}
              {business.journey && (
                <article id="profile-story" className="scroll-mt-24 rounded-2xl border bg-card p-6 shadow-sm md:p-8">
                  <p className="label-overline text-secondary">Our story</p>
                  <h2 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">How {displayName} got here</h2>
                  <p className="mt-5 whitespace-pre-line text-sm leading-7 text-muted-foreground">{business.journey}</p>
                </article>
              )}
              {business.challenges && <article id="profile-challenge" className="scroll-mt-24 rounded-2xl border bg-card p-6 shadow-sm md:p-8"><p className="text-xs font-semibold uppercase tracking-widest text-secondary">The challenge</p><h2 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">What stood in the way</h2><p className="mt-5 whitespace-pre-line text-sm leading-7 text-muted-foreground">{business.challenges}</p></article>}
              {business.challenge_solution && <article id="profile-breakthrough" className="scroll-mt-24 rounded-2xl border border-secondary/25 bg-card p-6 shadow-sm md:p-8"><p className="text-xs font-semibold uppercase tracking-widest text-secondary">The breakthrough</p><h2 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">How the team moved forward</h2><p className="mt-5 whitespace-pre-line text-sm leading-7 text-muted-foreground">{business.challenge_solution}</p></article>}
            </div>

            <div className="space-y-4">
              <nav aria-label={`${displayName} profile sections`} className="rounded-2xl border bg-card p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Explore this profile</p>
                <p className="mt-1 text-sm text-muted-foreground">Jump directly to any section.</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  {askContent && <a href="#profile-ask" className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-secondary hover:text-secondary"><Handshake className="h-4 w-4" /> Our Ask</a>}
                  {offerContent && <a href="#profile-offer" className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-secondary hover:text-secondary"><Gift className="h-4 w-4" /> Our Offer</a>}
                  {business.journey && <a href="#profile-story" className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-secondary hover:text-secondary"><BookOpen className="h-4 w-4" /> Our Story</a>}
                  {business.challenges && <a href="#profile-challenge" className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-secondary hover:text-secondary"><TriangleAlert className="h-4 w-4" /> Challenge</a>}
                  {business.challenge_solution && <a href="#profile-breakthrough" className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-secondary hover:text-secondary"><Lightbulb className="h-4 w-4" /> Breakthrough</a>}
                  {founders.length > 0 && <a href="#profile-founders" className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-secondary hover:text-secondary"><Users className="h-4 w-4" /> Founders</a>}
                  {videos.length > 0 && <a href="#profile-watch" className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-secondary hover:text-secondary"><PlayCircle className="h-4 w-4" /> Watch</a>}
                </div>
              </nav>
            {founders.length > 0 && <aside id="profile-founders" className="scroll-mt-24 rounded-2xl border bg-card p-5 shadow-sm"><h2 className="font-heading text-xl font-bold text-foreground">Founders</h2><div className="mt-4 space-y-3">{founders.map((founder) => {
              const founderLinkedIn = founder.linkedin_url;
              return <article key={founder.id ?? `${founder.name}-${founder.role}`} className="flex min-w-0 items-center gap-4 rounded-xl border bg-muted/25 p-3"><div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10">{founder.photo_url ? <img src={founder.photo_url} alt={founder.name} className="h-full w-full object-cover" /> : <UserRound className="h-8 w-8 text-primary/45" />}</div><div className="min-w-0 flex-1">{founder.slug && founder.directory_visible !== false ? <Link to={`/founders/${founder.slug}`} className="font-semibold text-foreground hover:text-primary">{founder.name}</Link> : <p className="font-semibold text-foreground">{founder.name}</p>}<p className="mt-0.5 text-xs text-muted-foreground">{founder.role}</p>{founderLinkedIn && <a href={founderLinkedIn} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#0A66C2] hover:underline"><Linkedin className="h-3.5 w-3.5" />LinkedIn</a>}</div></article>;
            })}</div></aside>}
            </div>
            </div>
          </section>

          {galleryImages.length > 0 && <section><h2 className="mb-5 text-2xl font-bold text-foreground md:text-3xl">Inside {displayName}</h2><div className="grid gap-4 sm:grid-cols-2">{galleryImages.map((item) => <figure key={item.id ?? item.url} className="overflow-hidden rounded-2xl border bg-card shadow-sm"><div className="flex min-h-72 items-center justify-center bg-muted/50 p-2"><img src={item.url} alt={item.caption || `${displayName} gallery`} className="max-h-[680px] w-full object-contain" /></div>{item.caption && <figcaption className="border-t p-3 text-sm text-muted-foreground">{item.caption}</figcaption>}</figure>)}</div></section>}

          {business.tags.length > 0 && <div className="flex flex-wrap gap-2 border-t pt-8">{business.tags.map((tag) => <span key={tag} className="rounded-full border bg-card px-3 py-1.5 text-sm text-muted-foreground">{tag}</span>)}</div>}

          {videos.length > 0 && <section id="profile-watch" className="scroll-mt-24"><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:gap-8"><div><div className="mb-5"><p className="label-overline">Watch</p><h2 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">See what {displayName} is building</h2></div><div className={`grid gap-5 ${videos.length > 1 ? "md:grid-cols-2" : ""}`}>{videos.map((item) => <VideoCard key={item.id ?? item.url} url={item.url} caption={item.caption} name={displayName} />)}</div></div></div></section>}
        </div>
      </div>
    </PageLayout>
  );
};

export default BusinessDetail;
