import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CalendarDays,
  Download,
  Inbox,
  Loader2,
  LogOut,
  Mail,
  Pencil,
  Search,
  ShieldAlert,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import logo from "@/assets/logo.png";
import EventForm, { type EditableEvent } from "@/components/admin/EventForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type Submission = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  linkedin_url: string | null;
  role: string | null;
  inquiry_type: string;
  message: string | null;
};

type SortKey = keyof Submission;
type SortDir = "asc" | "desc";

type AdminEvent = {
  id: string;
  slug: string;
  title: string;
  date: string;
  type: string;
  venue: string;
  featured: boolean;
  image_url: string | null;
  created_at: string;
};

type AdminRSVP = {
  id: string;
  event_id: string | null;
  event_slug: string;
  event_title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  role: string | null;
  notes: string | null;
  created_at: string;
};

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "created_at", label: "Submitted" },
  { key: "first_name", label: "First name" },
  { key: "last_name", label: "Last name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "inquiry_type", label: "Inquiry type" },
  { key: "linkedin_url", label: "LinkedIn" },
  { key: "message", label: "Message" },
];

const AdminSubmissions = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [search, setSearch] = useState("");
  const [adminEvents, setAdminEvents] = useState<AdminEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EditableEvent | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [rsvps, setRsvps] = useState<AdminRSVP[]>([]);
  const [rsvpsLoading, setRsvpsLoading] = useState(false);
  const [rsvpSearch, setRsvpSearch] = useState("");
  const [rsvpEventFilter, setRsvpEventFilter] = useState<string>("all");
  const [attendeesOpen, setAttendeesOpen] = useState(false);
  const [attendeesEvent, setAttendeesEvent] = useState<{ slug: string; title: string } | null>(null);

  const handleEditEvent = async (id: string) => {
    setEditOpen(true);
    setEditingEvent(null);
    setEditLoading(true);
    const { data, error } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
    setEditLoading(false);
    if (error || !data) {
      toast({
        title: "Could not load event",
        description: error?.message ?? "Event not found.",
        variant: "destructive",
      });
      setEditOpen(false);
      return;
    }
    setEditingEvent({
      id: data.id,
      slug: data.slug,
      title: data.title,
      date: data.date,
      time: data.time,
      venue: data.venue,
      address: data.address,
      type: data.type,
      description: data.description,
      long_description: data.long_description,
      spots: data.spots,
      capacity: data.capacity,
      price: data.price,
      featured: data.featured,
      agenda: Array.isArray(data.agenda) ? (data.agenda as { time: string; item: string }[]) : [],
      speakers: Array.isArray(data.speakers) ? (data.speakers as { name: string; role: string }[]) : [],
      image_url: data.image_url,
    });
  };

  const fetchEvents = async () => {
    setEventsLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("id, slug, title, date, type, venue, featured, image_url, created_at")
      .order("created_at", { ascending: false });
    setEventsLoading(false);
    if (error) {
      toast({ title: "Failed to load events", description: error.message, variant: "destructive" });
      return;
    }
    setAdminEvents((data ?? []) as AdminEvent[]);
  };

  const handleDeleteEvent = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Event deleted" });
    fetchEvents();
    fetchRSVPs();
  };

  const fetchRSVPs = async () => {
    setRsvpsLoading(true);
    const { data, error } = await supabase
      .from("event_rsvps")
      .select("*")
      .order("created_at", { ascending: false });
    setRsvpsLoading(false);
    if (error) {
      toast({ title: "Failed to load RSVPs", description: error.message, variant: "destructive" });
      return;
    }
    setRsvps((data ?? []) as AdminRSVP[]);
  };

  const handleDeleteRSVP = async (id: string, name: string) => {
    if (!confirm(`Delete RSVP from "${name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("event_rsvps").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "RSVP deleted" });
    fetchRSVPs();
  };

  const exportRSVPsCSV = () => {
    const filtered = filteredRsvps;
    if (filtered.length === 0) {
      toast({ title: "Nothing to export", description: "No RSVPs match your filters." });
      return;
    }
    const headers = ["Submitted", "Event", "First Name", "Last Name", "Email", "Phone", "Company", "Role", "Notes"];
    const rows = filtered.map((r) => [
      new Date(r.created_at).toISOString(),
      r.event_title,
      r.first_name,
      r.last_name,
      r.email,
      r.phone ?? "",
      r.company ?? "",
      r.role ?? "",
      (r.notes ?? "").replace(/\n/g, " "),
    ]);
    const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rsvps-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    document.title = "Admin Dashboard | Startupa2z";

    let active = true;

    const init = async (session: Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"]) => {
      if (!session) {
        navigate("/admin/login", { replace: true });
        return;
      }
      setUserEmail(session.user.email ?? null);
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!active) return;
      if (error) {
        toast({ title: "Could not verify role", description: error.message, variant: "destructive" });
      }
      const admin = !!data;
      setIsAdmin(admin);
      setChecking(false);
      if (admin) {
        await fetchSubmissions();
        await fetchEvents();
        await fetchRSVPs();
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/admin/login", { replace: true });
    });

    supabase.auth.getSession().then(({ data: { session } }) => init(session));

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast({ title: "Failed to load submissions", description: error.message, variant: "destructive" });
      return;
    }
    setRows(data || []);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  const sorted = useMemo(() => {
    const filtered = search
      ? rows.filter((r) => {
          const q = search.toLowerCase();
          return [r.first_name, r.last_name, r.email, r.inquiry_type, r.role, r.message]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q));
        })
      : rows;

    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, sortKey, sortDir, search]);

  const filteredRsvps = useMemo(() => {
    return rsvps.filter((r) => {
      if (rsvpEventFilter !== "all" && r.event_slug !== rsvpEventFilter) return false;
      if (!rsvpSearch) return true;
      const q = rsvpSearch.toLowerCase();
      return [r.first_name, r.last_name, r.email, r.company, r.role, r.event_title, r.notes]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [rsvps, rsvpSearch, rsvpEventFilter]);

  const rsvpEventOptions = useMemo(() => {
    const map = new Map<string, string>();
    rsvps.forEach((r) => {
      if (!map.has(r.event_slug)) map.set(r.event_slug, r.event_title);
    });
    return Array.from(map.entries()).map(([slug, title]) => ({ slug, title }));
  }, [rsvps]);

  const rsvpCountBySlug = useMemo(() => {
    const map = new Map<string, number>();
    rsvps.forEach((r) => {
      map.set(r.event_slug, (map.get(r.event_slug) ?? 0) + 1);
    });
    return map;
  }, [rsvps]);

  const attendeesForSelected = useMemo(() => {
    if (!attendeesEvent) return [];
    return rsvps.filter((r) => r.event_slug === attendeesEvent.slug);
  }, [rsvps, attendeesEvent]);

  // Stats
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = rows.filter((r) => new Date(r.created_at) >= today).length;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekCount = rows.filter((r) => new Date(r.created_at) >= weekAgo).length;
    return { total: rows.length, today: todayCount, week: weekCount };
  }, [rows]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse">Checking access…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted px-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              Access denied
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your account does not have admin access. Ask an existing admin to grant you the
              <code className="mx-1 px-1 rounded bg-muted">admin</code> role.
            </p>
            <Button variant="outline" onClick={handleSignOut} className="w-full">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 md:px-8 h-16">
          <Link to="/" className="inline-flex items-center gap-3">
            <img src={logo} alt="StartupA2Z" width={160} height={44} className="h-10 w-auto" />
            <Badge variant="secondary" className="hidden sm:inline-flex">Admin</Badge>
          </Link>
          <div className="flex items-center gap-3">
            {userEmail && (
              <span className="hidden md:inline text-sm text-muted-foreground">{userEmail}</span>
            )}
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Welcome hero */}
        <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-accent/10 p-6 md:p-8">
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                Welcome to admin
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Hello{userEmail ? `, ${userEmail.split("@")[0]}` : ""} 👋
              </h1>
              <p className="text-muted-foreground mt-2 max-w-xl">
                Manage your community submissions, monitor activity, and keep the Bay Area startup
                ecosystem moving.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <StatCard label="Total" value={stats.total} />
              <StatCard label="This week" value={stats.week} />
              <StatCard label="Today" value={stats.today} />
            </div>
          </div>
        </section>

        {/* Tabs */}
        <Tabs defaultValue="submissions" className="space-y-6">
          <TabsList className="h-11 p-1 bg-muted/60 backdrop-blur">
            <TabsTrigger value="submissions" className="gap-2">
              <Inbox className="h-4 w-4" /> Contact submissions
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {rows.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2">
              <CalendarDays className="h-4 w-4" /> Events
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {adminEvents.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rsvps" className="gap-2">
              <Users className="h-4 w-4" /> RSVPs
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {rsvps.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submissions" className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name, email, inquiry, message…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground hidden md:block">
                  Click any column header to sort
                </p>
                <Button variant="outline" size="sm" onClick={fetchSubmissions} disabled={loading}>
                  {loading ? "Refreshing…" : "Refresh"}
                </Button>
              </div>
            </div>

            <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    {COLUMNS.map((col) => {
                      const active = sortKey === col.key;
                      const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                      return (
                        <TableHead key={col.key}>
                          <button
                            onClick={() => handleSort(col.key)}
                            className="inline-flex items-center gap-1 font-medium hover:text-foreground transition-colors"
                          >
                            {col.label}
                            <Icon className={`h-3 w-3 ${active ? "opacity-100 text-primary" : "opacity-50"}`} />
                          </button>
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={COLUMNS.length} className="text-center py-16">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Mail className="h-8 w-8 opacity-40" />
                          <p>{loading ? "Loading…" : "No submissions found."}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sorted.map((r) => (
                      <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                          {new Date(r.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium">{r.first_name}</TableCell>
                        <TableCell className="font-medium">{r.last_name}</TableCell>
                        <TableCell>
                          <a href={`mailto:${r.email}`} className="text-primary hover:underline">
                            {r.email}
                          </a>
                        </TableCell>
                        <TableCell>{r.role || <span className="text-muted-foreground">—</span>}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{r.inquiry_type}</Badge>
                        </TableCell>
                        <TableCell>
                          {r.linkedin_url ? (
                            <a
                              href={r.linkedin_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary hover:underline"
                            >
                              Profile
                            </a>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate text-sm" title={r.message || ""}>
                            {r.message || <span className="text-muted-foreground">—</span>}
                          </p>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Form */}
              <div className="lg:col-span-3 border rounded-xl bg-card shadow-sm p-6">
                <div className="mb-5">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-primary" /> Add a new event
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Published instantly to <Link to="/events" className="text-primary hover:underline">/events</Link>.
                  </p>
                </div>
                <EventForm onCreated={fetchEvents} />
              </div>

              {/* List */}
              <div className="lg:col-span-2 border rounded-xl bg-card shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Published events</h2>
                  <Button variant="outline" size="sm" onClick={fetchEvents} disabled={eventsLoading}>
                    {eventsLoading ? "Refreshing…" : "Refresh"}
                  </Button>
                </div>
                {adminEvents.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No events yet. Add one to get started.</p>
                  </div>
                ) : (
                  <ul className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                    {adminEvents.map((ev) => (
                      <li
                        key={ev.id}
                        className="group rounded-lg border bg-background/60 p-3 hover:border-primary/40 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {ev.image_url ? (
                            <img
                              src={ev.image_url}
                              alt={`${ev.title} cover`}
                              className="h-14 w-14 rounded-md object-cover flex-shrink-0 border"
                              loading="lazy"
                            />
                          ) : (
                            <div className="h-14 w-14 rounded-md bg-muted flex-shrink-0 flex items-center justify-center text-muted-foreground">
                              <CalendarDays className="h-5 w-5 opacity-60" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <Link
                              to={`/events/${ev.slug}`}
                              className="font-medium text-sm hover:text-primary truncate block"
                            >
                              {ev.title}
                            </Link>
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                              {ev.date} • {ev.venue}
                            </p>
                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                              <Badge variant="secondary" className="text-[10px]">{ev.type}</Badge>
                              {ev.featured && (
                                <Badge className="text-[10px] bg-primary/10 text-primary hover:bg-primary/15">
                                  Featured
                                </Badge>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setAttendeesEvent({ slug: ev.slug, title: ev.title });
                                  setAttendeesOpen(true);
                                }}
                                className="inline-flex items-center gap-1 rounded-full bg-accent/40 hover:bg-accent/70 transition-colors px-2 py-0.5 text-[10px] font-medium text-foreground"
                                aria-label={`View ${rsvpCountBySlug.get(ev.slug) ?? 0} attendees`}
                              >
                                <Users className="h-3 w-3" />
                                {rsvpCountBySlug.get(ev.slug) ?? 0} RSVP{(rsvpCountBySlug.get(ev.slug) ?? 0) === 1 ? "" : "s"}
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                              onClick={() => handleEditEvent(ev.id)}
                              aria-label="Edit event"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDeleteEvent(ev.id, ev.title)}
                              aria-label="Delete event"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rsvps" className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex flex-1 flex-col sm:flex-row gap-3 max-w-2xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search name, email, company, role…"
                    value={rsvpSearch}
                    onChange={(e) => setRsvpSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <select
                  value={rsvpEventFilter}
                  onChange={(e) => setRsvpEventFilter(e.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">All events ({rsvps.length})</option>
                  {rsvpEventOptions.map((opt) => (
                    <option key={opt.slug} value={opt.slug}>
                      {opt.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={exportRSVPsCSV} disabled={filteredRsvps.length === 0}>
                  <Download className="h-4 w-4" /> Export CSV
                </Button>
                <Button variant="outline" size="sm" onClick={fetchRSVPs} disabled={rsvpsLoading}>
                  {rsvpsLoading ? "Refreshing…" : "Refresh"}
                </Button>
              </div>
            </div>

            <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead>Submitted</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRsvps.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-16">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Users className="h-8 w-8 opacity-40" />
                          <p>{rsvpsLoading ? "Loading…" : "No RSVPs yet."}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRsvps.map((r) => (
                      <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                          {new Date(r.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Link to={`/events/${r.event_slug}`} className="text-primary hover:underline text-sm font-medium">
                            {r.event_title}
                          </Link>
                        </TableCell>
                        <TableCell className="font-medium whitespace-nowrap">
                          {r.first_name} {r.last_name !== "—" ? r.last_name : ""}
                        </TableCell>
                        <TableCell>
                          <a href={`mailto:${r.email}`} className="text-primary hover:underline">
                            {r.email}
                          </a>
                        </TableCell>
                        <TableCell className="text-sm">
                          {r.phone || <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="text-sm">
                          {r.company || <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell>
                          {r.role ? (
                            <Badge variant="secondary" className="capitalize">{r.role}</Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate text-sm" title={r.notes || ""}>
                            {r.notes || <span className="text-muted-foreground">—</span>}
                          </p>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteRSVP(r.id, `${r.first_name} ${r.last_name}`)}
                            aria-label="Delete RSVP"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit event</DialogTitle>
            <DialogDescription>
              Update any field below. Changes go live on /events immediately after saving.
            </DialogDescription>
          </DialogHeader>
          {editLoading || !editingEvent ? (
            <div className="py-12 flex items-center justify-center text-muted-foreground gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading event…
            </div>
          ) : (
            <EventForm
              event={editingEvent}
              onSaved={() => {
                setEditOpen(false);
                setEditingEvent(null);
                fetchEvents();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-xl border bg-card/80 backdrop-blur px-4 py-3 text-center shadow-sm">
    <p className="text-2xl font-bold tracking-tight">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

export default AdminSubmissions;
