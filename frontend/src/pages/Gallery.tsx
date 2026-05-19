import React, { useState, useCallback, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import CTABanner from "@/components/CTABanner";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, ChevronLeft, ChevronRight, Camera } from "lucide-react";

type MediaType = "photo" | "video";
type EventTab = "Meetups" | "Conferences";

interface GalleryItem {
  id: number;
  type: MediaType;
  src: string;
  thumb: string;
  alt: string;
  event: Exclude<EventTab, "All">;
  caption: string;
}

const TABS: EventTab[] = ["Meetups", "Conferences"];

// Only show meetup group photos from the `public/event_pictures` folder.
const ITEMS: GalleryItem[] = [
  {
    id: 1,
    type: "photo",
    src: "/event_pictures/meetup_panel_1.png",
    thumb: "/event_pictures/meetup_panel_1.png",
    alt: "Group at StartupA2Z meetup — panel and attendees",
    event: "Meetups",
    caption: "Group Meetup — StartupA2Z",
  },
  {
    id: 2,
    type: "photo",
    src: "/event_pictures/meetup_panel_2.png",
    thumb: "/event_pictures/meetup_panel_2.png",
    alt: "Attendees networking at StartupA2Z meetup",
    event: "Meetups",
    caption: "Networking — Startup Meetup",
  },
  {
    id: 3,
    type: "photo",
    src: "/event_pictures/meetup_panel_4.png",
    thumb: "/event_pictures/meetup_panel_4.png",
    alt: "Group photo from the StartupA2Z meetup",
    event: "Meetups",
    caption: "Community Group Photo — Startup Meetup",
  },
  {
    id: 4,
    type: "photo",
    src: "/event_pictures/meetup_panel_5.png",
    thumb: "/event_pictures/meetup_panel_5.png",
    alt: "Speakers and founders at StartupA2Z meetup",
    event: "Meetups",
    caption: "Speakers & Founders — Startup Meetup",
  },
];

const Gallery = () => {
  const [activeTab, setActiveTab] = useState<EventTab>(TABS[0]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = ITEMS.filter((item) => item.event === activeTab);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  }, []);

  const prev = useCallback(() => {
    setLightboxIndex((i) =>
      i !== null ? (i - 1 + filtered.length) % filtered.length : 0,
    );
  }, [filtered.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i + 1) % filtered.length : 0));
  }, [filtered.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, prev, next, closeLightbox]);

  // Reset lightbox index when tab changes
  useEffect(() => {
    setLightboxIndex(null);
  }, [activeTab]);

  const activeLightboxItem =
    lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <PageLayout>
      <SEO
        title="Photo & Video Gallery | StartupA2Z"
        description="Browse photos and videos from StartupA2Z summits, demo days, hackathons, awards nights, and workshops."
        canonical="https://startupa2z.org/gallery"
        ogImage="https://startupa2z.org/assets/og-gallery.jpg"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          name: "StartupA2Z Gallery",
          url: "https://startupa2z.org/gallery",
        }}
      />

      {/* Hero */}
      <section
        className="section-padding gradient-hero-solid text-center"
        style={{ paddingTop: "calc(64px + clamp(3rem, 6vw, 5rem))" }}
      >
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full bg-white/10 text-secondary">
              Gallery
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
              Moments That
              <br />
              Define Us
            </h1>
            <p className="text-lg text-white/70 max-w-xl mx-auto">
              A visual archive of every summit, demo day, hackathon, and
              workshop — relive the energy of the StartupA2Z community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery section */}
      <section className="section-padding">
        <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,3rem)]">
          {/* Event / Year tab strip */}
          <div className="mb-10 overflow-x-auto pb-1 -mx-1 px-1">
            <div className="flex gap-2 min-w-max md:flex-wrap md:min-w-0 md:justify-center">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-muted text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Count + label */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + "-meta"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 mb-6"
            >
              <Camera className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {filtered.length} item{filtered.length !== 1 ? "s" : ""}
                <span className="ml-1 font-medium text-foreground">
                  — {activeTab}
                </span>
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Uniform grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
            >
              {filtered.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  className="group relative overflow-hidden rounded-xl bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  style={{ aspectRatio: "4/3" }}
                  onClick={() => openLightbox(i)}
                  aria-label={item.alt}
                >
                  <img
                    src={item.thumb}
                    alt={item.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Video badge */}
                  {item.type === "video" && (
                    <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <Play
                        className="w-3 h-3 text-white ml-0.5"
                        fill="white"
                      />
                    </div>
                  )}

                  {/* Caption on hover */}
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs font-medium leading-snug line-clamp-2">
                      {item.caption}
                    </p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <CTABanner
        title="Be Part of the Story"
        description="Join our next event and create memories with the StartupA2Z community."
        primaryCTA="See Upcoming Events"
      />

      {/* Lightbox */}
      <AnimatePresence>
        {activeLightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-black/96 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              onClick={closeLightbox}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/40 text-xs tabular-nums">
              {(lightboxIndex ?? 0) + 1} / {filtered.length}
            </div>

            {/* Prev */}
            {filtered.length > 1 && (
              <button
                className="absolute left-3 md:left-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Image / Video */}
            <motion.div
              key={activeLightboxItem.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-4xl mx-14 md:mx-20 flex flex-col items-center gap-4"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="relative w-full">
                <img
                  src={activeLightboxItem.src}
                  alt={activeLightboxItem.alt}
                  className="w-full max-h-[78vh] object-contain rounded-lg"
                />
                {activeLightboxItem.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-2xl">
                      <Play
                        className="w-6 h-6 text-primary ml-1"
                        fill="currentColor"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Caption */}
              <div className="text-center px-4">
                <p className="text-white text-sm md:text-base font-medium">
                  {activeLightboxItem.caption}
                </p>
                <span className="text-white/40 text-xs mt-0.5 block">
                  {activeLightboxItem.event}
                  {activeLightboxItem.type === "video" && " · Video"}
                </span>
              </div>
            </motion.div>

            {/* Next */}
            {filtered.length > 1 && (
              <button
                className="absolute right-3 md:right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

export default Gallery;
