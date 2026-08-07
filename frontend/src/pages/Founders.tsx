import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, MapPin, Search, UserRound } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchFounders, type FounderListing } from "@/lib/api";

const allLabel = (label: string) => `All ${label}`;

const Founders = () => {
  const [founders, setFounders] = useState<FounderListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState(allLabel("roles"));
  const [category, setCategory] = useState(allLabel("industries"));
  const [location, setLocation] = useState(allLabel("locations"));

  useEffect(() => {
    let cancelled = false;
    fetchFounders()
      .then(({ data }) => { if (!cancelled) setFounders(data ?? []); })
      .catch(() => { if (!cancelled) setFounders([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const roles = useMemo(() => Array.from(new Set(founders.map((founder) => founder.role))).sort(), [founders]);
  const categories = useMemo(() => Array.from(new Set(founders.map((founder) => founder.company.category))).sort(), [founders]);
  const locations = useMemo(() => Array.from(new Set(founders.map((founder) => founder.company.location))).sort(), [founders]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return founders.filter((founder) => {
      const searchable = [founder.name, founder.role, founder.company.name, founder.company.pitch, founder.company.category, founder.company.location, founder.journey].filter(Boolean).join(" ").toLowerCase();
      return (!query || searchable.includes(query))
        && (role === allLabel("roles") || founder.role === role)
        && (category === allLabel("industries") || founder.company.category === category)
        && (location === allLabel("locations") || founder.company.location === location);
    });
  }, [category, founders, location, role, search]);

  const reset = () => {
    setSearch("");
    setRole(allLabel("roles"));
    setCategory(allLabel("industries"));
    setLocation(allLabel("locations"));
  };

  return (
    <PageLayout>
      <SEO
        title="Bay Area Founder Directory — StartupA2Z.org"
        description="Discover founders building startups across the Bay Area. Search by founder, company, industry, role, and location."
        canonical="https://startupa2z.org/founders"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "StartupA2Z.org Founder Directory",
          url: "https://startupa2z.org/founders",
        }}
      />

      <header className="gradient-hero-solid px-4 pb-12 pt-[calc(64px+3rem)] text-white md:pb-16 md:pt-[calc(64px+4rem)]">
        <div className="container-narrow">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Community</p>
          <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="font-heading text-4xl font-bold tracking-tight md:text-6xl">Founder Directory</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/70 md:text-lg">Meet the people building the next generation of Bay Area startups—and understand the journeys behind their companies.</p>
            </div>
            <Button asChild className="w-fit rounded-full bg-secondary px-6 text-secondary-foreground hover:bg-secondary/90"><Link to="/startups">Explore startups <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
        </div>
      </header>

      <section className="px-4 py-10 md:py-14" aria-label="Founder directory results">
        <div className="container-narrow">
          <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Directory</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{loading ? "—" : founders.length}</p>
                <p className="text-sm text-muted-foreground">published founder{founders.length === 1 ? "" : "s"}</p>
              </div>
              <div className="space-y-3">
                <Select value={role} onValueChange={setRole}><SelectTrigger aria-label="Filter founders by role"><SelectValue /></SelectTrigger><SelectContent><SelectItem value={allLabel("roles")}>All roles</SelectItem>{roles.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
                <Select value={category} onValueChange={setCategory}><SelectTrigger aria-label="Filter founders by industry"><SelectValue /></SelectTrigger><SelectContent><SelectItem value={allLabel("industries")}>All industries</SelectItem>{categories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
                <Select value={location} onValueChange={setLocation}><SelectTrigger aria-label="Filter founders by location"><SelectValue /></SelectTrigger><SelectContent><SelectItem value={allLabel("locations")}>All locations</SelectItem>{locations.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
                <Button type="button" variant="outline" className="w-full" onClick={reset}>Reset filters</Button>
              </div>
              <div className="rounded-xl border bg-muted/40 p-4"><p className="font-semibold text-foreground">Building something?</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Submit your startup and founder story for review.</p><Button asChild size="sm" className="mt-4 w-full"><Link to="/startups">List your startup</Link></Button></div>
            </aside>

            <section>
              <div className="relative mb-6"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search founders, companies, industries…" className="h-12 rounded-xl pl-11" /></div>
              <div className="mb-4 flex items-center justify-between"><p className="text-sm text-muted-foreground">Showing <span className="font-semibold text-foreground">{filtered.length}</span> founder{filtered.length === 1 ? "" : "s"}</p></div>
              {loading ? (
                <div className="rounded-2xl border bg-card p-10 text-center text-muted-foreground">Loading founder directory…</div>
              ) : filtered.length === 0 ? (
                <div className="rounded-2xl border bg-card p-10 text-center"><Search className="mx-auto h-10 w-10 text-muted-foreground/40" /><h2 className="mt-4 text-xl font-semibold">No founders found</h2><p className="mt-1 text-sm text-muted-foreground">Try another search or reset the filters.</p></div>
              ) : (
                <div className="grid gap-4 xl:grid-cols-2">
                  {filtered.map((founder) => (
                    <Link key={founder.id} to={`/founders/${founder.slug}`} className="group rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-secondary/40 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                      <div className="flex items-start gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                          {founder.photo_url ? <img src={founder.photo_url} alt={founder.name} className="h-full w-full object-cover" /> : <UserRound className="h-7 w-7 text-primary" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-semibold text-foreground transition-colors group-hover:text-secondary">{founder.name}</h2><p className="mt-0.5 text-sm text-muted-foreground">{founder.role} at <span className="font-medium text-foreground">{founder.company.name}</span></p></div><Badge variant="outline">{founder.company.category}</Badge></div>
                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{founder.journey || founder.company.pitch}</p>
                          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{founder.company.stage}</span><span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{founder.company.location}</span></div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Founders;
