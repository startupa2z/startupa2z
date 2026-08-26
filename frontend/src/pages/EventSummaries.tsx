import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, CalendarDays, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import { eventSummaries } from "@/data/eventSummaries";

const EventSummaries = () => (
  <PageLayout>
    <SEO
      title="Past Events Summary | StartupA2Z.org"
      description="Founder journeys, hard-earned lessons, and community moments from StartupA2Z events."
      canonical="https://startupa2z.org/resources/event-summaries"
      noindex={eventSummaries.every((summary) => summary.status === "draft")}
    />

    <section
      className="gradient-hero-solid text-white"
      style={{ paddingTop: "calc(64px + clamp(3rem, 6vw, 5rem))" }}
    >
      <div className="container-narrow pb-[clamp(3rem,6vw,5rem)]">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-secondary">
          <BookOpen className="h-4 w-4" /> Resources · Past Events Summary
        </span>
        <h1 className="max-w-4xl font-heading text-4xl font-bold tracking-tight md:text-6xl">
          The founder journeys behind every StartupA2Z event.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
          Honest stories about how founders started, what tested them, how they
          moved forward, and what others can learn from the journey.
        </p>
      </div>
    </section>

    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="label-overline mb-3">Event archive</p>
            <h2 className="font-heading text-3xl font-bold text-primary md:text-4xl">
              Founder stories from the room
            </h2>
          </div>
          <Link to="/resources" className="hidden text-sm font-semibold text-primary hover:text-secondary md:block">
            Back to Resources
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {eventSummaries.map((summary, index) => (
            <motion.article
              key={summary.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="overflow-hidden rounded-3xl border-2 border-primary/15 bg-card shadow-[0_14px_44px_rgba(27,75,57,0.10)]"
            >
              <Link
                to={`/events/${summary.eventSlug}#founder-journeys`}
                aria-label={`Read the founder journeys from ${summary.title}`}
                className="group block aspect-[16/9] overflow-hidden border-b border-border bg-[#f8f0e3] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary"
              >
                <img
                  src={summary.coverImage}
                  alt={summary.coverImageAlt}
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </Link>
              <div className="p-6 md:p-8">
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">
                    Completed event
                  </span>
                  {summary.status === "draft" && (
                    <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800">
                      Local draft
                    </span>
                  )}
                </div>
                <h2 className="font-heading text-2xl font-bold leading-tight text-primary md:text-3xl">
                  {summary.title}
                </h2>
                <div className="mt-5 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-5">
                  <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-secondary" />{summary.date}</span>
                  <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-secondary" />{summary.venue}</span>
                </div>
                <p className="mt-5 line-clamp-3 leading-7 text-muted-foreground">{summary.summary}</p>
                <Link
                  to={`/events/${summary.eventSlug}`}
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 font-bold text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  Review the summary <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default EventSummaries;
