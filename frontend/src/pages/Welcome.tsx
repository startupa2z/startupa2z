import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  CalendarCheck,
  Linkedin,
  Loader2,
  LogOut,
  Mail,
  TicketCheck,
  UserRound,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import AuthDialog from "@/components/AuthDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiError, fetchMemberProfile, type MemberProfile } from "@/lib/api";
import { clearToken, getToken, isMemberAuthenticated } from "@/lib/auth";

const Welcome = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authOpen, setAuthOpen] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!getToken() || !isMemberAuthenticated()) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await fetchMemberProfile();
      setProfile(data);
    } catch (err) {
      setProfile(null);
      setError(err instanceof ApiError ? err.message : "Could not load your account.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
    const refresh = () => void loadProfile();
    window.addEventListener("startupa2z-auth-change", refresh);
    return () => window.removeEventListener("startupa2z-auth-change", refresh);
  }, [loadProfile]);

  const signOut = () => {
    clearToken();
    navigate("/");
  };

  if (loading) {
    return <PageLayout><div className="flex min-h-[70vh] items-center justify-center pt-16"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div></PageLayout>;
  }

  if (!profile) {
    return (
      <PageLayout>
        <SEO title="Member Sign In | StartupA2Z" description="Sign in to your StartupA2Z member account." canonical="https://startupa2z.org/welcome" />
        <section className="flex min-h-[70vh] items-center justify-center px-6 pt-24 pb-16">
          <Card className="w-full max-w-lg text-center shadow-lg">
            <CardContent className="p-8 md:p-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary"><UserRound className="h-7 w-7" /></div>
              <h1 className="mt-5 font-heading text-3xl font-bold">Welcome to StartupA2Z</h1>
              <p className="mt-2 text-muted-foreground">Sign in to see your profile and session history.</p>
              {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
              <Button className="mt-6 rounded-full px-8" onClick={() => setAuthOpen(true)}>Sign In</Button>
              <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
            </CardContent>
          </Card>
        </section>
      </PageLayout>
    );
  }

  const { user, summary, sessions } = profile;
  const displayName = user.full_name || user.email.split("@")[0];

  return (
    <PageLayout>
      <SEO title="Welcome | StartupA2Z" description="Your StartupA2Z member dashboard." canonical="https://startupa2z.org/welcome" />
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-6 pt-28 pb-10">
        <div className="container-narrow">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Badge>Member dashboard</Badge>
              <h1 className="mt-3 font-heading text-3xl font-bold md:text-4xl">Welcome, {displayName}</h1>
              <p className="mt-2 text-muted-foreground">Your StartupA2Z profile and participation history.</p>
            </div>
            <Button variant="outline" onClick={signOut}><LogOut className="h-4 w-4" /> Sign out</Button>
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="container-narrow space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card><CardContent className="p-5"><TicketCheck className="h-5 w-5 text-primary" /><p className="mt-4 text-3xl font-bold">{summary.registered_sessions}</p><p className="text-sm text-muted-foreground">Sessions registered</p></CardContent></Card>
            <Card><CardContent className="p-5"><CalendarCheck className="h-5 w-5 text-primary" /><p className="mt-4 text-3xl font-bold">{summary.attended_sessions}</p><p className="text-sm text-muted-foreground">Sessions attended</p></CardContent></Card>
            <Card><CardContent className="p-5"><Linkedin className="h-5 w-5 text-[#0A66C2]" /><p className="mt-4 text-lg font-semibold">{user.linkedin_connected ? "Connected" : "Not connected"}</p><p className="text-sm text-muted-foreground">LinkedIn</p></CardContent></Card>
            <Card><CardContent className="p-5"><UserRound className="h-5 w-5 text-primary" /><p className="mt-4 text-lg font-semibold">{new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p><p className="text-sm text-muted-foreground">Member since</p></CardContent></Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <Card>
              <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3"><UserRound className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Name</p><p className="font-medium">{user.full_name || "Not provided"}</p></div></div>
                <div className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium">{user.email}</p></div></div>
                <div className="flex gap-3"><Building2 className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Company / organization</p><p className="font-medium">{user.organization || "Not provided"}</p></div></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-center justify-between"><CardTitle>Session history</CardTitle><Link to="/events" className="text-sm font-medium text-primary hover:underline">View events</Link></CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-8 text-center"><CalendarCheck className="mx-auto h-7 w-7 text-muted-foreground" /><p className="mt-3 font-medium">No sessions yet</p><p className="mt-1 text-sm text-muted-foreground">Register for an event and it will appear here.</p></div>
                ) : (
                  <div className="space-y-3">{sessions.map((session) => (
                    <Link key={session.event_slug} to={`/events/${session.event_slug}`} className="flex items-center justify-between gap-4 rounded-xl border p-4 hover:border-primary/40">
                      <div><p className="font-medium">{session.event_title}</p><p className="mt-1 text-xs text-muted-foreground">Registered {new Date(session.registered_at).toLocaleDateString()}</p></div>
                      <Badge variant={session.attended ? "default" : "secondary"}>{session.attended ? "Attended" : "Registered"}</Badge>
                    </Link>
                  ))}</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Welcome;
