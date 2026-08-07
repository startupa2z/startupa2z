import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearToken, getToken, getTokenPayload } from "@/lib/auth";
import {
  ApiError,
  type AdminSubmission,
  type AdminRSVP,
  type AdminEvent,
  fetchAdminSubmissions,
  fetchAdminRsvps,
  fetchAdminEventById,
  fetchEventsFromApi,
  deleteAdminRsvp,
  updateAdminRsvpAttendance,
  deleteAdminEvent,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CalendarDays,
  Download,
  Loader2,
  LogOut,
  Mail,
  Pencil,
  Search,
  ShieldAlert,
  Trash2,
  Users,
} from "lucide-react";
import EventForm, { type EditableEvent } from "@/components/admin/EventForm";
import AdminSidebar, { type AdminSection } from "@/components/admin/AdminSidebar";
import { adminSectionLabel } from "@/lib/admin-navigation";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminSectionTemplate from "@/components/admin/AdminSectionTemplate";
import EventManagement from "@/components/admin/EventManagement";
import BusinessManagement from "@/components/admin/BusinessManagement";
import MemberManagement from "@/components/admin/MemberManagement";
import SEO from "@/components/SEO";
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

type SortKey = keyof AdminSubmission;
type SortDir = "asc" | "desc";

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
  const [rows, setRows] = useState<AdminSubmission[]>([]);
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
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");

  const handleEditEvent = async (id: string) => {
    setEditOpen(true);
    setEditingEvent(null);
    setEditLoading(true);
    try {
      const { data } = await fetchAdminEventById(id);
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
        agenda: Array.isArray(data.agenda) ? data.agenda as { time: string; item: string }[] : [],
        speakers: Array.isArray(data.speakers) ? data.speakers as { name: string; role: string }[] : [],
        image_url: data.image_url,
      });
    } catch (err) {
      toast({
        title: "Could not load event",
        description: err instanceof ApiError ? err.message : "Event not found.",
        variant: "destructive",
      });
      setEditOpen(false);
    } finally {
      setEditLoading(false);
    }
  };

  const fetchEvents = async () => {
    setEventsLoading(true);
    try {
      const { data } = await fetchEventsFromApi();
      setAdminEvents((data ?? []) as AdminEvent[]);
    } catch (err) {
      toast({
        title: "Failed to load events",
        description: err instanceof ApiError ? err.message : "Unknown error.",
        variant: "destructive",
      });
    } finally {
      setEventsLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteAdminEvent(id);
      toast({ title: "Event deleted" });
      fetchEvents();
      fetchRSVPs();
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err instanceof ApiError ? err.message : "Unknown error.",
        variant: "destructive",
      });
    }
  };

  const fetchRSVPs = async () => {
    setRsvpsLoading(true);
    try {
      const { data } = await fetchAdminRsvps();
      setRsvps(data ?? []);
    } catch (err) {
      toast({
        title: "Failed to load RSVPs",
        description: err instanceof ApiError ? err.message : "Unknown error.",
        variant: "destructive",
      });
    } finally {
      setRsvpsLoading(false);
    }
  };

  const handleDeleteRSVP = async (id: string, name: string) => {
    if (!confirm(`Delete RSVP from "${name}"? This cannot be undone.`)) return;
    try {
      await deleteAdminRsvp(id);
      toast({ title: "RSVP deleted" });
      fetchRSVPs();
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err instanceof ApiError ? err.message : "Unknown error.",
        variant: "destructive",
      });
    }
  };

  const handleAttendance = async (rsvp: AdminRSVP) => {
    try {
      const { data } = await updateAdminRsvpAttendance(rsvp.id, !rsvp.attended);
      setRsvps((current) => current.map((item) => item.id === data.id ? data : item));
      toast({ title: data.attended ? "Marked as attended" : "Attendance removed" });
    } catch (err) {
      toast({ title: "Could not update attendance", description: err instanceof ApiError ? err.message : "Unknown error.", variant: "destructive" });
    }
  };

  const exportRSVPsCSV = () => {
    const filtered = filteredRsvps;
    if (filtered.length === 0) {
      toast({ title: "Nothing to export", description: "No RSVPs match your filters." });
      return;
    }
    const headers = ["Submitted", "Event", "First Name", "Last Name", "Email", "Phone", "Company", "Role", "Attendance", "Pitch Interest", "WhatsApp Opt-in", "Notes"];
    const csvRows = filtered.map((r) => [
      new Date(r.created_at).toISOString(),
      r.event_title, r.first_name, r.last_name, r.email,
      r.phone ?? "", r.company ?? "", r.role ?? "", r.attended ? "Attended" : "Registered",
      r.pitch_interest ? "Yes" : "No", r.whatsapp_opt_in ? "Yes" : "No",
      (r.notes ?? "").replace(/\n/g, " "),
    ]);
    const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [headers, ...csvRows].map((r) => r.map(escape).join(",")).join("\n");
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

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data } = await fetchAdminSubmissions();
      setRows(data ?? []);
    } catch (err) {
      toast({
        title: "Failed to load submissions",
        description: err instanceof ApiError ? err.message : "Unknown error.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Admin Dashboard | Startupa2z";

    const token = getToken();
    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }

    const payload = getTokenPayload();
    const roles: string[] = Array.isArray(payload.roles) ? payload.roles : [];
    const email = typeof payload.email === "string" ? payload.email : null;
    setUserEmail(email);

    if (!roles.includes("admin")) {
      setChecking(false);
      setIsAdmin(false);
      return;
    }

    setIsAdmin(true);
    setChecking(false);
    fetchSubmissions();
    fetchEvents();
    fetchRSVPs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignOut = () => {
    clearToken();
    navigate("/admin/login", { replace: true });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
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
    rsvps.forEach((r) => { if (!map.has(r.event_slug)) map.set(r.event_slug, r.event_title); });
    return Array.from(map.entries()).map(([slug, title]) => ({ slug, title }));
  }, [rsvps]);

  const rsvpCountBySlug = useMemo(() => {
    const map = new Map<string, number>();
    rsvps.forEach((r) => { map.set(r.event_slug, (map.get(r.event_slug) ?? 0) + 1); });
    return map;
  }, [rsvps]);

  const attendeesForSelected = useMemo(() => {
    if (!attendeesEvent) return [];
    return rsvps.filter((r) => r.event_slug === attendeesEvent.slug);
  }, [rsvps, attendeesEvent]);

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
    <>
      <SEO
        title="Admin Dashboard | StartupA2Z.org"
        description="Admin dashboard for Startupa2z."
        noindex={true}
        canonical="https://startupa2z.org/admin/submissions"
      />
      <div className="min-h-screen bg-muted/30">
        <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-4 md:px-6 h-16">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src="/logo-transparent.webp" alt="StartupA2Z.org" width={864} height={159} className="h-7 md:h-8 w-auto" />
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

        <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row">
          <AdminSidebar
            active={activeSection}
            onChange={setActiveSection}
            counts={{ submissions: rows.length, events: adminEvents.length, rsvps: rsvps.length }}
          />

          <main className="min-w-0 flex-1 px-4 md:px-6 xl:px-8 py-6 space-y-6">
            <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-primary">StartupA2Z.org admin</p>
                <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">{adminSectionLabel(activeSection)}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {activeSection === "overview" ? "Everything that needs attention, in one place." : activeSection === "event-management" ? "Create once, publish early and keep every channel current." : "Manage this part of the StartupA2Z.org community."}
                </p>
              </div>
              {activeSection !== "submissions" && activeSection !== "members" && activeSection !== "startups" && activeSection !== "event-management" && activeSection !== "rsvps" && activeSection !== "overview" && (
                <Badge variant="outline" className="w-fit">Visual template only</Badge>
              )}
            </section>

            <Tabs value={activeSection} className="space-y-6">
              <TabsContent value="overview" className="mt-0">
                <AdminOverview submissions={rows.length} events={adminEvents} rsvps={rsvps.length} onNavigate={setActiveSection} />
              </TabsContent>

            <TabsContent value="submissions" className="space-y-4 mt-0">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search name, email, inquiry, message…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground hidden md:block">Click any column header to sort</p>
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
                            <button onClick={() => handleSort(col.key)} className="inline-flex items-center gap-1 font-medium hover:text-foreground transition-colors">
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
                          <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{new Date(r.created_at).toLocaleString()}</TableCell>
                          <TableCell className="font-medium">{r.first_name}</TableCell>
                          <TableCell className="font-medium">{r.last_name}</TableCell>
                          <TableCell className="max-w-64 whitespace-normal"><a href={`mailto:${r.email}`} className="text-primary hover:underline break-all">{r.email}</a></TableCell>
                          <TableCell className="max-w-48 whitespace-normal break-words">{r.role || <span className="text-muted-foreground">—</span>}</TableCell>
                          <TableCell><Badge variant="secondary">{r.inquiry_type}</Badge></TableCell>
                          <TableCell>
                            {r.linkedin_url ? (
                              <a href={r.linkedin_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">Profile</a>
                            ) : <span className="text-muted-foreground">—</span>}
                          </TableCell>
                          <TableCell className="min-w-72 max-w-md whitespace-normal">
                            <p className="break-words text-sm">{r.message || <span className="text-muted-foreground">—</span>}</p>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="event-management" className="mt-0">
              <EventManagement events={adminEvents} registrations={rsvps} onCreated={() => { fetchEvents(); fetchRSVPs(); }} onEdit={handleEditEvent} onDelete={handleDeleteEvent} onViewAttendees={(event) => { setAttendeesEvent(event); setAttendeesOpen(true); }} />
            </TabsContent>

            <TabsContent value="startups" className="mt-0">
              <BusinessManagement />
            </TabsContent>

            <TabsContent value="members" className="mt-0">
              <MemberManagement />
            </TabsContent>

            <TabsContent value="rsvps" className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex flex-1 flex-col sm:flex-row gap-3 max-w-2xl">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search name, email, company, role…" value={rsvpSearch} onChange={(e) => setRsvpSearch(e.target.value)} className="pl-9" />
                  </div>
                  <select
                    value={rsvpEventFilter}
                    onChange={(e) => setRsvpEventFilter(e.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="all">All events ({rsvps.length})</option>
                    {rsvpEventOptions.map((opt) => (
                      <option key={opt.slug} value={opt.slug}>{opt.title}</option>
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
                      <TableHead>Attendance</TableHead>
                      <TableHead>Pitch</TableHead>
                      <TableHead>WhatsApp</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRsvps.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-16">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Users className="h-8 w-8 opacity-40" />
                            <p>{rsvpsLoading ? "Loading…" : "No RSVPs yet."}</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRsvps.map((r) => (
                        <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{new Date(r.created_at).toLocaleString()}</TableCell>
                          <TableCell><Link to={`/events/${r.event_slug}`} className="text-primary hover:underline text-sm font-medium">{r.event_title}</Link></TableCell>
                          <TableCell className="font-medium whitespace-nowrap">{r.first_name} {r.last_name !== "—" ? r.last_name : ""}</TableCell>
                          <TableCell className="max-w-64 whitespace-normal"><a href={`mailto:${r.email}`} className="text-primary hover:underline break-all">{r.email}</a></TableCell>
                          <TableCell className="text-sm">{r.phone || <span className="text-muted-foreground">—</span>}</TableCell>
                          <TableCell className="max-w-56 whitespace-normal break-words text-sm">{r.company || <span className="text-muted-foreground">—</span>}</TableCell>
                          <TableCell className="max-w-48 whitespace-normal break-words">{r.role ? <Badge variant="secondary" className="h-auto whitespace-normal text-left capitalize">{r.role}</Badge> : <span className="text-muted-foreground">—</span>}</TableCell>
                          <TableCell><Button variant={r.attended ? "default" : "outline"} size="sm" className="h-7 whitespace-nowrap text-xs" onClick={() => handleAttendance(r)}>{r.attended ? "Attended" : "Mark attended"}</Button></TableCell>
                          <TableCell>{r.pitch_interest ? <Badge>Yes</Badge> : <span className="text-muted-foreground">No</span>}</TableCell>
                          <TableCell>{r.whatsapp_opt_in ? <Badge className="bg-[#25D366] hover:bg-[#25D366]">Opted in</Badge> : <span className="text-muted-foreground">No</span>}</TableCell>
                          <TableCell className="min-w-64 max-w-md whitespace-normal"><p className="break-words text-sm">{r.notes || <span className="text-muted-foreground">—</span>}</p></TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteRSVP(r.id, `${r.first_name} ${r.last_name}`)} aria-label="Delete RSVP">
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

            {(["founders", "announcements", "posts", "social", "connectors", "analytics", "settings"] as AdminSection[]).map((section) => (
              <TabsContent key={section} value={section} className="mt-0">
                <AdminSectionTemplate section={section} />
              </TabsContent>
            ))}
          </Tabs>
          </main>
        </div>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit event</DialogTitle>
              <DialogDescription>Update any field below. Changes go live on /events immediately after saving.</DialogDescription>
            </DialogHeader>
            {editLoading || !editingEvent ? (
              <div className="py-12 flex items-center justify-center text-muted-foreground gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading event…
              </div>
            ) : (
              <EventForm event={editingEvent} onSaved={() => { setEditOpen(false); setEditingEvent(null); fetchEvents(); }} />
            )}
          </DialogContent>
        </Dialog>

        <Sheet open={attendeesOpen} onOpenChange={setAttendeesOpen}>
          <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
            <SheetHeader>
              <SheetTitle className="whitespace-normal break-words pr-6">{attendeesEvent?.title ?? "Attendees"}</SheetTitle>
              <SheetDescription>{attendeesForSelected.length} {attendeesForSelected.length === 1 ? "person" : "people"} RSVP'd</SheetDescription>
            </SheetHeader>
            <div className="mt-4 flex-1 overflow-y-auto -mx-6 px-6">
              {attendeesForSelected.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No RSVPs yet for this event.</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {attendeesForSelected.map((a) => (
                    <li key={a.id} className="rounded-lg border bg-background/60 p-3 hover:border-primary/40 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm whitespace-normal break-words">{a.first_name} {a.last_name !== "—" ? a.last_name : ""}</p>
                          <a href={`mailto:${a.email}`} className="text-xs text-primary hover:underline break-all">{a.email}</a>
                          {(a.company || a.role) && (
                            <p className="text-xs text-muted-foreground mt-1 whitespace-normal break-words">{[a.role, a.company].filter(Boolean).join(" • ")}</p>
                          )}
                          {(a.pitch_interest || a.whatsapp_opt_in) && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {a.pitch_interest && <Badge variant="secondary">Pitch interest</Badge>}
                              {a.whatsapp_opt_in && <Badge className="bg-[#25D366] hover:bg-[#25D366]">WhatsApp opt-in</Badge>}
                            </div>
                          )}
                          <Button variant={a.attended ? "default" : "outline"} size="sm" className="mt-2 h-7 text-xs" onClick={() => handleAttendance(a)}>{a.attended ? "Attended" : "Mark attended"}</Button>
                          {a.notes && <p className="text-xs text-muted-foreground mt-1 italic whitespace-pre-wrap break-words">"{a.notes}"</p>}
                          <p className="text-[10px] text-muted-foreground mt-1.5">{new Date(a.created_at).toLocaleString()}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0" onClick={() => handleDeleteRSVP(a.id, `${a.first_name} ${a.last_name}`)} aria-label="Remove RSVP">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default AdminSubmissions;
