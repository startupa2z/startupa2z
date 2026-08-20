import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowLeft,
  CalendarDays,
  Camera,
  ChevronLeft,
  ChevronRight,
  Images,
  MapPin,
  Maximize2,
  X,
} from "lucide-react";
import CTABanner from "@/components/CTABanner";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";

interface GalleryPhoto {
  id: number;
  src: string;
  alt: string;
}

const EVENT = {
  slug: "startup-a-to-z-hacker-dojo-august-12",
  number: "01",
  title: "Bay Area Founders Pitch & Startup Networking",
  shortTitle: "Founder Pitch & Mix",
  date: "August 12, 2026",
  month: "AUG",
  day: "12",
  year: "2026",
  venue: "Hacker Dojo",
  city: "Mountain View, California",
  recapPath: "/events/startup-a-to-z-hacker-dojo-august-12",
  galleryPath: "/gallery/startup-a-to-z-hacker-dojo-august-12",
};

const PHOTO_COUNT = 20;
const DISPLAY_ORDER = [20, ...Array.from({ length: 19 }, (_, index) => index + 1)];

const PHOTOS: GalleryPhoto[] = DISPLAY_ORDER.map((photoNumber, index) => ({
  id: photoNumber,
  src: `/event-gallery/2026-08-12/event-01-${String(photoNumber).padStart(2, "0")}.jpg`,
  alt:
    index === 0
      ? "StartupA2Z founders and community members at Hacker Dojo after Event 1"
      : `StartupA2Z Event 1 founder gathering at Hacker Dojo, photo ${index + 1} of ${PHOTO_COUNT}`,
}));

const FEATURED_PHOTO = PHOTOS[0];

const GalleryLanding = () => (
  <PageLayout>
    <SEO
      title="Event Photo Gallery | StartupA2Z.org"
      description="Browse photo galleries from StartupA2Z founder gatherings, pitch nights, startup demonstrations, and Bay Area community events."
      canonical="https://startupa2z.org/gallery"
      ogImage={`https://startupa2z.org${FEATURED_PHOTO.src}`}
    />

    <section className="relative overflow-hidden bg-[#082c22] pt-[calc(64px+4rem)] text-white md:pt-[calc(64px+5rem)]">
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-secondary/20 blur-[110px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-primary/40 blur-[100px]" />
      <div className="relative mx-auto max-w-[1180px] px-6 pb-16 md:px-10 lg:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary backdrop-blur-sm">
            <Camera className="h-4 w-4" /> Community archive
          </div>
          <h1 className="font-heading text-5xl font-bold tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            Every event leaves
            <span className="mt-1 block text-secondary">a story worth revisiting.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
            Explore the people, pitches, demonstrations, and candid moments from each StartupA2Z founder gathering.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="bg-[#f7f6f1] py-16 md:py-24">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <div className="mb-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Event galleries</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">Go inside each gathering</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">New event galleries will appear here, with the newest gathering first.</p>
        </div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="group grid overflow-hidden rounded-[2rem] border border-black/[0.08] bg-white shadow-[0_22px_65px_rgba(20,45,35,0.09)] lg:grid-cols-[1.08fr_0.92fr]"
        >
          <Link to={EVENT.galleryPath} className="relative min-h-72 overflow-hidden bg-muted lg:min-h-[430px]">
            <img src={FEATURED_PHOTO.src} alt={FEATURED_PHOTO.alt} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
              <Images className="h-4 w-4 text-secondary" /> {PHOTO_COUNT} photos
            </div>
          </Link>

          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
              <span className="rounded-full bg-secondary/12 px-3 py-1.5 text-secondary">Latest gallery</span>
              <span>Event {EVENT.number}</span>
            </div>
            <h3 className="mt-5 font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">{EVENT.title}</h3>
            <div className="mt-5 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-secondary" /> {EVENT.date}</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-secondary" /> {EVENT.venue} · {EVENT.city}</p>
            </div>
            <p className="mt-6 leading-7 text-muted-foreground">Founder presentations, product demonstrations, community conversations, and the people who made StartupA2Z&apos;s first Hacker Dojo gathering memorable.</p>
            <Link to={EVENT.galleryPath} className="mt-8 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              View event gallery <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.article>
      </div>
    </section>

    <CTABanner
      title="Be in the Next Frame"
      description="Join the next StartupA2Z gathering and build alongside founders moving from idea to execution."
      primaryCTA="See Upcoming Events"
    />
  </PageLayout>
);

const GalleryEventDetail = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const activePhoto = useMemo(
    () => (lightboxIndex === null ? null : PHOTOS[lightboxIndex]),
    [lightboxIndex],
  );

  const openLightbox = useCallback(
    (index: number, trigger: HTMLButtonElement) => {
      returnFocusRef.current = trigger;
      setLightboxIndex(index);
    },
    [],
  );

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    window.setTimeout(() => returnFocusRef.current?.focus(), 0);
  }, []);

  const previousPhoto = useCallback(() => {
    setLightboxIndex((index) =>
      index === null ? 0 : (index - 1 + PHOTOS.length) % PHOTOS.length,
    );
  }, []);

  const nextPhoto = useCallback(() => {
    setLightboxIndex((index) =>
      index === null ? 0 : (index + 1) % PHOTOS.length,
    );
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") previousPhoto();
      if (event.key === "ArrowRight") nextPhoto();
      if (event.key === "Escape") closeLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeLightbox, lightboxIndex, nextPhoto, previousPhoto]);

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(distance) < 45) return;
    if (distance > 0) previousPhoto();
    else nextPhoto();
  };

  return (
    <PageLayout>
      <SEO
        title={`${EVENT.title} Photo Gallery | StartupA2Z.org`}
        description="Explore photos from StartupA2Z founder gatherings, pitch nights, startup demonstrations, and community events in the Bay Area."
        canonical={`https://startupa2z.org${EVENT.galleryPath}`}
        ogImage={`https://startupa2z.org${FEATURED_PHOTO.src}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          name: "StartupA2Z Event Gallery",
          url: `https://startupa2z.org${EVENT.galleryPath}`,
          datePublished: "2026-08-12",
          associatedMedia: PHOTOS.map((photo) => ({
            "@type": "ImageObject",
            contentUrl: `https://startupa2z.org${photo.src}`,
            caption: photo.alt,
          })),
        }}
      />

      <section
        className="relative overflow-hidden bg-[#082c22] pt-[calc(64px+4rem)] text-white md:pt-[calc(64px+5rem)]"
        aria-labelledby="gallery-heading"
      >
        <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-secondary/20 blur-[110px]" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-primary/40 blur-[100px]" />
        <div className="relative mx-auto grid max-w-[1400px] gap-12 px-6 pb-16 md:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16 lg:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <Link to="/gallery" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/65 transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" /> All event galleries
            </Link>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary backdrop-blur-sm">
              <Camera className="h-4 w-4" />
              Community archive
            </div>
            <h1
              id="gallery-heading"
              className="font-heading text-5xl font-bold tracking-[-0.04em] sm:text-6xl lg:text-7xl"
            >
              Built together.
              <span className="mt-1 block text-secondary">Remembered here.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
              The people, pitches, and candid moments behind StartupA2Z&apos;s
              growing founder community.
            </p>
            <a
              href="#event-01"
              className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#082c22] transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-[#082c22]"
            >
              Explore Event 01
              <ChevronRight className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="relative"
          >
            <div className="absolute -inset-3 rotate-2 rounded-[2rem] border border-white/10 bg-white/5" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] border border-white/15 bg-black/20 shadow-2xl shadow-black/30">
              <img
                src={FEATURED_PHOTO.src}
                alt={FEATURED_PHOTO.alt}
                className="h-full w-full object-cover"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                    Event 01
                  </span>
                  <p className="mt-1 text-lg font-bold sm:text-xl">{EVENT.shortTitle}</p>
                </div>
                <div className="rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md">
                  {PHOTO_COUNT} photos
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="event-01" className="scroll-mt-24 bg-[#f7f6f1] py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="rounded-[2rem] border border-black/[0.07] bg-white p-5 shadow-[0_24px_70px_rgba(20,45,35,0.08)] sm:p-8 lg:p-10">
            <div className="grid gap-7 border-b border-black/[0.08] pb-9 lg:grid-cols-[140px_1fr_auto] lg:items-center">
              <div className="flex w-fit items-center overflow-hidden rounded-2xl border border-primary/15 bg-primary/[0.06] text-primary lg:block lg:text-center">
                <div className="px-4 py-3 text-xs font-black tracking-[0.22em] lg:border-b lg:border-primary/15">
                  {EVENT.month}
                </div>
                <div className="border-l border-primary/15 px-4 py-2 font-heading text-4xl font-bold leading-none lg:border-l-0 lg:py-3 lg:text-5xl">
                  {EVENT.day}
                </div>
                <div className="border-l border-primary/15 px-4 py-3 text-xs font-bold tracking-[0.16em] lg:border-l-0 lg:border-t lg:border-primary/15">
                  {EVENT.year}
                </div>
              </div>

              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  <span>Event {EVENT.number}</span>
                  <span className="h-1 w-1 rounded-full bg-secondary" />
                  <span>{PHOTO_COUNT} photographs</span>
                </div>
                <h2 className="max-w-3xl font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {EVENT.title}
                </h2>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-secondary" />
                    {EVENT.date}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-secondary" />
                    {EVENT.venue} · {EVENT.city}
                  </span>
                </div>
              </div>

              <Link
                to={EVENT.recapPath}
                className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-primary/20 px-5 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Read event recap
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex flex-col gap-3 py-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  <Images className="h-4 w-4" />
                  All moments
                </div>
                <h3 className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
                  Inside the room
                </h3>
              </div>
              <p className="max-w-md text-sm leading-6 text-muted-foreground">
                Select any photo for the full-screen view. Use arrow keys, swipe,
                or the thumbnail strip to move through the event.
              </p>
            </div>

            <div className="grid auto-rows-[130px] grid-cols-2 gap-2 sm:auto-rows-[170px] sm:gap-3 md:grid-cols-3 lg:auto-rows-[210px] lg:grid-cols-4">
              {PHOTOS.map((photo, index) => {
                const isFeature = index === 0;
                return (
                  <motion.button
                    key={photo.id}
                    type="button"
                    onClick={(event) => openLightbox(index, event.currentTarget)}
                    className={`group relative overflow-hidden rounded-xl bg-muted text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:rounded-2xl ${isFeature ? "col-span-2 row-span-2" : ""}`}
                    aria-label={`Open photo ${index + 1} of ${PHOTOS.length}`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading={index < 5 ? "eager" : "lazy"}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035] group-hover:brightness-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-100" />
                    <span className="absolute bottom-3 left-3 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-sm">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="absolute bottom-3 right-3 grid h-9 w-9 translate-y-2 place-items-center rounded-full bg-white text-primary opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                      <Maximize2 className="h-4 w-4" />
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <CTABanner
        title="Be in the Next Frame"
        description="Join the next StartupA2Z gathering and build alongside founders who are moving from idea to execution."
        primaryCTA="See Upcoming Events"
      />

      <AnimatePresence>
        {activePhoto && lightboxIndex !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${EVENT.title} photo viewer`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[9999] flex flex-col bg-[#050706]/[0.98] text-white"
            onClick={closeLightbox}
            onTouchStart={(event) => {
              touchStartX.current = event.touches[0].clientX;
            }}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4 sm:px-6">
              <div className="min-w-0">
                <p className="truncate text-xs font-bold uppercase tracking-[0.16em] text-secondary">
                  Event {EVENT.number} · {EVENT.date}
                </p>
                <p className="mt-0.5 truncate text-sm font-medium text-white/75">
                  {EVENT.shortTitle}
                </p>
              </div>
              <div className="ml-4 flex items-center gap-3">
                <span className="text-xs tabular-nums text-white/55">
                  {lightboxIndex + 1} / {PHOTOS.length}
                </span>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    closeLightbox();
                  }}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                  aria-label="Close photo viewer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 py-4 sm:px-16 sm:py-6">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  previousPhoto();
                }}
                className="absolute left-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 backdrop-blur transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary sm:left-5 sm:h-12 sm:w-12"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <AnimatePresence mode="wait">
                <motion.img
                  key={activePhoto.id}
                  src={activePhoto.src}
                  alt={activePhoto.alt}
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.16 }}
                  onClick={(event) => event.stopPropagation()}
                  className="max-h-full max-w-full select-none object-contain shadow-2xl"
                  draggable={false}
                />
              </AnimatePresence>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  nextPhoto();
                }}
                className="absolute right-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 backdrop-blur transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary sm:right-5 sm:h-12 sm:w-12"
                aria-label="Next photo"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            <div
              className="shrink-0 border-t border-white/10 bg-black/30 px-3 py-3 sm:px-5"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto pb-1 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.25)_transparent]">
                {PHOTOS.map((photo, index) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md border-2 transition sm:h-16 sm:w-24 ${
                      index === lightboxIndex
                        ? "border-secondary opacity-100"
                        : "border-transparent opacity-45 hover:opacity-80"
                    }`}
                    aria-label={`View photo ${index + 1}`}
                    aria-current={index === lightboxIndex ? "true" : undefined}
                  >
                    <img src={photo.src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

const Gallery = () => {
  const { eventSlug } = useParams<{ eventSlug?: string }>();

  if (!eventSlug) return <GalleryLanding />;
  if (eventSlug !== EVENT.slug) return <Navigate to="/gallery" replace />;
  return <GalleryEventDetail />;
};

export default Gallery;
