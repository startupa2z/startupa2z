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
  Inbox,
  LogOut,
  Mail,
  Search,
  ShieldAlert,
  Sparkles,
  Trash2,
} from "lucide-react";
import logo from "@/assets/logo.png";
import EventForm from "@/components/admin/EventForm";

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
      if (admin) await fetchSubmissions();
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
            {/* Add more tabs here, e.g.:
            <TabsTrigger value="users" className="gap-2"><Users className="h-4 w-4" /> Users</TabsTrigger>
            */}
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
        </Tabs>
      </main>
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
