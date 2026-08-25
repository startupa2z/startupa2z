import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowRight, BellRing, CalendarCheck, CheckCircle2, Mic2, UserRound } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import AuthDialog from "@/components/AuthDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { isMemberAuthenticated } from "@/lib/auth";

const benefits = [
  { icon: Mic2, title: "Submit once", text: "Share your startup story, talk outline, ask and offer in one guided application." },
  { icon: BellRing, title: "Never miss a deadline", text: "Your member account will keep pitch reminders and requested updates together." },
  { icon: CalendarCheck, title: "Track participation", text: "See applications, confirmed talks and event participation from your member page." },
];

const ApplyToPitch = () => {
  const [authenticated, setAuthenticated] = useState(isMemberAuthenticated());
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");

  useEffect(() => {
    const refresh = () => setAuthenticated(isMemberAuthenticated());
    window.addEventListener("startupa2z-auth-change", refresh);
    return () => window.removeEventListener("startupa2z-auth-change", refresh);
  }, []);

  if (authenticated) return <Navigate to="/welcome?intent=pitch" replace />;

  const openAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <PageLayout>
      <SEO title="Apply to Pitch | StartupA2Z.org" description="Become a StartupA2Z.org member and apply to pitch at an upcoming founder event." canonical="https://startupa2z.org/apply-to-pitch" />
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-6 pb-16 pt-28">
        <div className="container-narrow grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-secondary">
              <Mic2 className="h-4 w-4" /> Founder pitch application
            </div>
            <h1 className="mt-5 max-w-2xl font-heading text-4xl font-bold leading-tight md:text-5xl">Start with membership. Build your founder participation history.</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">StartupA2Z.org membership lets us send relevant reminders, connect your application to the right event and keep your talks and participation in one place.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button className="h-12 rounded-full px-7" onClick={() => openAuth("signup")}>Create member account <ArrowRight className="h-4 w-4" /></Button>
              <Button variant="outline" className="h-12 rounded-full px-7" onClick={() => openAuth("signin")}>Already a member? Sign in</Button>
            </div>
            {import.meta.env.DEV && <Button asChild variant="link" className="mt-3 h-auto px-0 text-primary"><Link to="/welcome?intent=pitch&preview=1">Preview registered-member flow →</Link></Button>}
            <p className="mt-4 text-sm text-muted-foreground">Creating an account does not guarantee a pitch slot. Every pitch application is reviewed.</p>
          </div>

          <Card className="overflow-hidden border-primary/15 shadow-xl">
            <CardContent className="p-0">
              <div className="bg-primary p-6 text-primary-foreground">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground/70">How it works</p>
                <h2 className="mt-2 font-heading text-2xl font-bold">One account. Every founder opportunity.</h2>
              </div>
              <div className="space-y-1 p-4 sm:p-6">
                {benefits.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex gap-4 rounded-2xl p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary"><Icon className="h-5 w-5" /></div>
                    <div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p></div>
                  </div>
                ))}
                <div className="mx-4 mt-2 flex items-center gap-2 rounded-xl border border-dashed border-primary/25 bg-primary/5 p-3 text-sm text-primary">
                  <CheckCircle2 className="h-4 w-4 shrink-0" /> Registration and pitch application are completed only once per member.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="px-6 py-14">
        <div className="container-narrow grid gap-4 md:grid-cols-3">
          {["Register or sign in", "Complete your pitch application", "Track review and participation"].map((label, index) => (
            <div key={label} className="rounded-2xl border bg-card p-5"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{index + 1}</span><p className="mt-4 font-semibold">{label}</p></div>
          ))}
        </div>
      </section>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} initialMode={authMode} redirectTo="/welcome?intent=pitch" />
    </PageLayout>
  );
};

export default ApplyToPitch;
