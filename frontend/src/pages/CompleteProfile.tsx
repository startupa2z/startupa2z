import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Building2, BriefcaseBusiness, Loader2, LogOut, UserRound } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApiError, fetchMemberProfile, updateMemberProfile, type FounderStatus } from "@/lib/api";
import { clearToken } from "@/lib/auth";
import { FOUNDER_STATUS_OPTIONS, safeMemberReturnTo } from "@/lib/member-profile";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = safeMemberReturnTo(searchParams.get("returnTo"));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [founderStatus, setFounderStatus] = useState<FounderStatus | "">("");

  useEffect(() => {
    let active = true;
    void fetchMemberProfile()
      .then(({ user }) => {
        if (!active) return;
        setEmail(user.email);
        setFullName(user.full_name ?? "");
        setCompany(user.company ?? "");
        setJobTitle(user.job_title ?? "");
        setFounderStatus(user.founder_status ?? "");
      })
      .catch((err) => {
        if (!active) return;
        if (err instanceof ApiError && err.status === 401) {
          clearToken();
          navigate("/welcome", { replace: true });
          return;
        }
        setError(err instanceof ApiError ? err.message : "Could not load your profile.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [navigate]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const cleanedName = fullName.trim();
    const cleanedCompany = company.trim();
    const cleanedTitle = jobTitle.trim();
    if (!cleanedName || !cleanedCompany || !cleanedTitle || !founderStatus) {
      setError("Complete all fields before continuing.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await updateMemberProfile({
        full_name: cleanedName,
        company: cleanedCompany,
        job_title: cleanedTitle,
        founder_status: founderStatus,
      });
      window.dispatchEvent(new Event("startupa2z-profile-change"));
      navigate(returnTo, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save your profile.");
    } finally {
      setSaving(false);
    }
  };

  const signOut = () => {
    clearToken();
    navigate("/", { replace: true });
  };

  if (loading) {
    return <PageLayout><div className="flex min-h-[70vh] items-center justify-center pt-16"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div></PageLayout>;
  }

  return (
    <PageLayout>
      <SEO title="Complete Your Profile | StartupA2Z.org" description="Complete your StartupA2Z.org member profile." canonical="https://startupa2z.org/complete-profile" />
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-6 pb-16 pt-28">
        <Card className="mx-auto w-full max-w-xl shadow-lg">
          <CardContent className="p-7 md:p-9">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><UserRound className="h-6 w-6" /></div>
            <h1 className="mt-5 font-heading text-3xl font-bold">Complete your member profile</h1>
            <p className="mt-2 text-sm text-muted-foreground">This helps us connect you with relevant founders, operators, mentors, and opportunities.</p>

            <form onSubmit={submit} className="mt-7 space-y-5">
              <div className="space-y-1.5"><Label htmlFor="profile-email">Email</Label><Input id="profile-email" type="email" value={email} readOnly className="bg-muted" /></div>
              <div className="space-y-1.5"><Label htmlFor="profile-full-name">Full name *</Label><Input id="profile-full-name" required minLength={2} maxLength={120} value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" /></div>
              <div className="space-y-1.5"><Label htmlFor="profile-company">Company / startup *</Label><div className="relative"><Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="profile-company" required minLength={2} maxLength={160} className="pl-9" value={company} onChange={(event) => setCompany(event.target.value)} autoComplete="organization" /></div><p className="text-xs text-muted-foreground">Use “Not applicable” if this does not apply.</p></div>
              <div className="space-y-1.5"><Label htmlFor="profile-job-title">Job title / role *</Label><div className="relative"><BriefcaseBusiness className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="profile-job-title" required minLength={2} maxLength={120} className="pl-9" value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} autoComplete="organization-title" /></div><p className="text-xs text-muted-foreground">Use “Not applicable” if this does not apply.</p></div>
              <div className="space-y-1.5"><Label htmlFor="profile-founder-status">Founder status *</Label><Select value={founderStatus} onValueChange={(value) => setFounderStatus(value as FounderStatus)}><SelectTrigger id="profile-founder-status"><SelectValue placeholder="Select your founder status" /></SelectTrigger><SelectContent>{FOUNDER_STATUS_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select></div>
              {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
              <Button type="submit" className="h-11 w-full rounded-full" disabled={saving}>{saving ? "Saving…" : "Save and continue"}</Button>
              <Button type="button" variant="ghost" className="w-full" onClick={signOut}><LogOut className="h-4 w-4" /> Sign out</Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </PageLayout>
  );
};

export default CompleteProfile;
