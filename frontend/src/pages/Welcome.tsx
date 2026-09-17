import { useCallback, useEffect, useState, type ComponentType } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Building2, CalendarCheck, CalendarDays, Check, Handshake, LayoutDashboard, Linkedin, Loader2, LogOut, Mail, Mic2, Presentation, Rocket, TicketCheck, UserRound } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import AuthDialog from "@/components/AuthDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApiError, fetchCurrentPitchApplication, fetchEventsFromApi, fetchMemberProfile, fetchPitchApplications, savePitchApplicationDraft, submitPitchApplication, type DbEventRow, type MemberProfile, type PaidSupportInterest, type PitchApplication, type PitchApplicationDraftPayload, type PitchSupportNeed, type PitchSupportTimeline } from "@/lib/api";
import { clearToken, getToken, isMemberAuthenticated } from "@/lib/auth";

type MemberSection = "overview" | "profile" | "events" | "pitch" | "talk" | "startup" | "exchange";
type IconType = ComponentType<{ className?: string }>;
type MemberUserView = { full_name: string | null; email: string; company: string | null; job_title: string | null; founder_status: string | null; linkedin_connected: boolean; created_at: string };
type MemberSessionView = MemberProfile["sessions"];

const menuGroups: Array<{ label: string; items: Array<{ id: MemberSection; label: string; icon: IconType; badge?: string }> }> = [
  { label: "My membership", items: [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
  ] },
  { label: "Build your presence", items: [
    { id: "startup", label: "Add startup/business", icon: Rocket },
    { id: "pitch", label: "Apply to pitch", icon: Presentation },
  ] },
];

const MemberSidebar = ({ active, onChange, showPitchDraft }: { active: MemberSection; onChange: (section: MemberSection) => void; showPitchDraft: boolean }) => (
  <aside className="rounded-2xl border bg-card p-2.5 shadow-sm lg:sticky lg:top-20 lg:self-start">
    <nav aria-label="Member activities" className="space-y-3.5">
      {menuGroups.map((group) => <div key={group.label}>
        <p className="px-3 pb-1 text-[0.64rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">{group.label}</p>
        <div className="space-y-0.5">{group.items.map(({ id, label, icon: Icon, badge }) => { const visibleBadge = id === "pitch" && showPitchDraft ? "1 draft" : badge; return <button key={id} type="button" onClick={() => onChange(id)} aria-current={active === id ? "page" : undefined} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors ${active === id ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground hover:bg-muted"}`}><Icon className="h-4 w-4 shrink-0" /><span className="min-w-0 flex-1">{label}</span>{visibleBadge && <span className={`rounded-full px-2 py-0.5 text-[0.62rem] font-semibold ${active === id ? "bg-white/20 text-white" : "bg-secondary/10 text-secondary"}`}>{visibleBadge}</span>}</button>; })}</div>
      </div>)}
    </nav>
  </aside>
);

const PrototypeForm = () => {
  return <Card><CardHeader><div className="flex items-start justify-between gap-4"><div><Badge variant="secondary">UI prototype</Badge><CardTitle className="mt-3">Add startup/business</CardTitle><p className="mt-2 text-sm leading-6 text-muted-foreground">Create one profile for your venture, company or founder-supporting business.</p></div><Rocket className="h-7 w-7 text-secondary" /></div></CardHeader><CardContent className="space-y-5">
    <div className="grid gap-5 sm:grid-cols-2"><div><Label htmlFor="venture-name">Startup/business name *</Label><Input id="venture-name" className="mt-1.5" placeholder="Acme" /></div><div><Label htmlFor="venture-website">Website</Label><Input id="venture-website" className="mt-1.5" placeholder="https://" /></div></div>
    <div><Label htmlFor="venture-summary">Problem, solution or services *</Label><Textarea id="venture-summary" className="mt-1.5 min-h-28" placeholder="What do you provide, who do you help, and what problem do you solve?" /></div>
    <div className="grid gap-5 sm:grid-cols-2"><div><Label htmlFor="venture-stage">Stage or category</Label><Input id="venture-stage" className="mt-1.5" placeholder="MVP, Seed, Advisory, Engineering…" /></div><div><Label htmlFor="venture-location">Location</Label><Input id="venture-location" className="mt-1.5" placeholder="Mountain View, CA" /></div></div>
    <Button disabled className="rounded-full">Save draft</Button><p className="text-xs text-muted-foreground">Nothing is saved or published in this UI prototype.</p>
  </CardContent></Card>;
};

const AskOfferCard = ({ type }: { type: "ask" | "offer" }) => <><div className={`flex h-10 w-10 items-center justify-center rounded-full ${type === "ask" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"}`}><Handshake className="h-5 w-5" /></div><h3 className="mt-4 font-heading text-xl font-bold">My {type}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{type === "ask" ? "Customers, introductions, talent, capital or feedback you need." : "Expertise, introductions, mentoring or resources you can contribute."}</p><Textarea className="mt-4" placeholder={type === "ask" ? "I am looking for…" : "I can help with…"} /><Button disabled variant={type === "ask" ? "default" : "outline"} className="mt-4 rounded-full">Save {type}</Button></>;

const pitchSteps = ["About your startup", "Your pitch"];

const supportNeedOptions: Array<{ value: PitchSupportNeed; label: string }> = [
  { value: "funding", label: "Funding" },
  { value: "customers", label: "Customers" },
  { value: "gtm", label: "Go-to-market (GTM)" },
  { value: "staffing", label: "Hiring or staffing" },
  { value: "ai_development", label: "AI development" },
  { value: "soc2_compliance", label: "SOC 2 and compliance" },
  { value: "legal", label: "Legal" },
  { value: "cloud_cybersecurity", label: "Cloud and cybersecurity" },
  { value: "product_development", label: "Product development" },
  { value: "partnerships", label: "Partnerships" },
  { value: "mentors_advisors", label: "Mentors or advisors" },
];

type PitchFormState = {
  id: string | null;
  event_id: string;
  startup_name: string;
  startup_website: string;
  startup_summary: string;
  talk_title: string;
  problem: string;
  solution: string;
  monetization_challenge: string;
  breakthrough: string;
  lessons: [string, string, string];
  ask_text: string;
  offer_text: string;
  milestone: string;
  traction: string;
  pitch_deck_url: string;
  support_needs: PitchSupportNeed[];
  support_timeline: PitchSupportTimeline | "";
  paid_support_interest: PaidSupportInterest | "";
  consent_to_review: boolean;
};

const emptyPitchForm = (company = ""): PitchFormState => ({
  id: null,
  event_id: "",
  startup_name: company,
  startup_website: "",
  startup_summary: "",
  talk_title: "",
  problem: "",
  solution: "",
  monetization_challenge: "",
  breakthrough: "",
  lessons: ["", "", ""],
  ask_text: "",
  offer_text: "",
  milestone: "",
  traction: "",
  pitch_deck_url: "",
  support_needs: [],
  support_timeline: "",
  paid_support_interest: "",
  consent_to_review: false,
});

const pitchFormFromApplication = (application: PitchApplication, company = ""): PitchFormState => ({
  id: application.id,
  event_id: application.event_id ?? "",
  startup_name: application.startup_name ?? company,
  startup_website: application.startup_website ?? "",
  startup_summary: application.startup_summary ?? "",
  talk_title: application.talk_title ?? "",
  problem: application.problem ?? "",
  solution: application.solution ?? "",
  monetization_challenge: application.monetization_challenge ?? "",
  breakthrough: application.breakthrough ?? "",
  lessons: [application.lessons[0] ?? "", application.lessons[1] ?? "", application.lessons[2] ?? ""],
  ask_text: application.ask_text ?? "",
  offer_text: application.offer_text ?? "",
  milestone: application.milestone ?? "",
  traction: application.traction ?? "",
  pitch_deck_url: application.pitch_deck_url ?? "",
  support_needs: application.support_needs ?? [],
  support_timeline: application.support_timeline ?? "",
  paid_support_interest: application.paid_support_interest ?? "",
  consent_to_review: application.consent_to_review,
});

const EmbeddedPitchApplication = ({ user, preview }: { user: MemberUserView; preview: boolean }) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<PitchFormState>(() => emptyPitchForm(user.company ?? ""));
  const [events, setEvents] = useState<DbEventRow[]>([]);
  const [applications, setApplications] = useState<PitchApplication[]>([]);
  const [loading, setLoading] = useState(!preview);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [submitted, setSubmitted] = useState<PitchApplication | null>(null);
  const fieldClass = "mt-1.5";

  useEffect(() => {
    if (preview) {
      setEvents([{ id: "preview-event", slug: "founders-pitch-mix-2026-09-15", title: "What Raises Your Seed Round Will Sink Your Series C", date: "September 15, 2026", time: "5:00 PM – 8:00 PM", venue: "Hacker Dojo", address: "", type: "Founder Finance Masterclass", description: "", long_description: "", agenda: [], speakers: [{ name: "Vivek Somani", role: "Investor and former customer-focused technology leader" }], spots: 0, capacity: 0, price: "Free", featured: true, image_url: "/event-covers/startupa2z-vivek-seed-to-series-c-luma-social-v2.png?v=20260909", lifecycle_status: "published", created_at: new Date().toISOString(), updated_at: new Date().toISOString() }]);
      return;
    }
    let active = true;
    void Promise.all([fetchEventsFromApi(), fetchCurrentPitchApplication(), fetchPitchApplications()])
      .then(([eventResponse, draftResponse, applicationResponse]) => {
        if (!active) return;
        const upcoming = eventResponse.data.filter((event) => {
          const eventDate = Date.parse(event.date);
          return Number.isNaN(eventDate) || eventDate >= Date.now() - 86400000;
        });
        setEvents(upcoming);
        setApplications(applicationResponse.data);
        if (draftResponse.data) setForm(pitchFormFromApplication(draftResponse.data, user.company ?? ""));
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load your pitch application."))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [preview, user.company]);

  const update = <K extends keyof PitchFormState>(field: K, value: PitchFormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setSavedMessage("");
  };

  const toggleSupportNeed = (need: PitchSupportNeed) => {
    setForm((current) => {
      const supportNeeds = current.support_needs.includes(need)
        ? current.support_needs.filter((item) => item !== need)
        : [...current.support_needs, need];
      return {
        ...current,
        support_needs: supportNeeds,
        support_timeline: supportNeeds.length ? current.support_timeline : "",
        paid_support_interest: supportNeeds.length ? current.paid_support_interest : "",
      };
    });
    setError("");
    setSavedMessage("");
  };

  const draftPayload = (): PitchApplicationDraftPayload => ({
    id: form.id,
    event_id: form.event_id || null,
    startup_name: form.startup_name,
    startup_website: form.startup_website || null,
    startup_summary: form.startup_summary,
    talk_title: form.talk_title,
    problem: form.problem,
    solution: form.solution,
    monetization_challenge: form.monetization_challenge,
    breakthrough: form.breakthrough,
    lessons: form.lessons,
    ask_text: form.ask_text,
    offer_text: form.offer_text,
    milestone: form.milestone,
    traction: form.traction,
    pitch_deck_url: form.pitch_deck_url || null,
    support_needs: form.support_needs,
    support_timeline: form.support_timeline || null,
    paid_support_interest: form.paid_support_interest || null,
  });

  const validateStep = () => {
    if (form.startup_website && !/^https?:\/\//i.test(form.startup_website)) return "Enter a complete website URL beginning with http:// or https://.";
    if (form.pitch_deck_url && !/^https?:\/\//i.test(form.pitch_deck_url)) return "Enter a complete pitch deck URL beginning with http:// or https://.";
    return "";
  };

  const saveDraft = async () => {
    if (preview) {
      setSavedMessage("Preview only — draft saving is disabled.");
      return true;
    }
    setSaving(true);
    setError("");
    try {
      const response = await savePitchApplicationDraft(draftPayload());
      setForm((current) => ({ ...current, id: response.data.id }));
      setSavedMessage("Draft saved");
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save your draft.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const continueToNextStep = async () => {
    const message = validateStep();
    if (message) { setError(message); return; }
    if (await saveDraft()) setStep(1);
  };

  const submit = async () => {
    const message = validateStep();
    if (message) { setError(message); return; }
    if (preview) { setError("Sign in through the real member flow to submit an application."); return; }
    setSubmitting(true);
    setError("");
    try {
      const response = await submitPitchApplication({
        ...draftPayload(),
        consent_to_review: true,
      });
      setSubmitted(response.data);
      setApplications((current) => [response.data, ...current.filter((item) => item.id !== response.data.id)]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not submit your pitch application.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Card><CardContent className="flex min-h-64 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-primary" /></CardContent></Card>;
  if (submitted) return <Card><CardContent className="p-7"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><Check className="h-6 w-6" /></div><h2 className="mt-5 font-heading text-2xl font-bold">Pitch application submitted</h2><p className="mt-2 text-muted-foreground">Your application{submitted.event_title ? ` for ${submitted.event_title}` : ""} is now waiting for review.</p><div className="mt-5 rounded-xl border bg-muted/30 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</p><p className="mt-1 font-semibold capitalize">{submitted.status.replaceAll("_", " ")}</p></div></CardContent></Card>;

  return <div className="space-y-4">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="font-heading text-2xl font-bold">Pitch your startup</h2><p className="mt-1 text-sm text-muted-foreground">Continue saves your progress automatically.</p></div>{savedMessage && <span className="text-xs font-medium text-primary">{savedMessage}</span>}</div>
    {applications.some((application) => application.status !== "draft") && <div className="rounded-xl border bg-card p-3 text-sm"><span className="font-medium">Previous application:</span> {applications.find((application) => application.status !== "draft")?.event_title} · <span className="capitalize">{applications.find((application) => application.status !== "draft")?.status.replaceAll("_", " ")}</span></div>}
    <ol className="grid gap-2 sm:grid-cols-2">{pitchSteps.map((label, index) => <li key={label} className={`rounded-xl border px-3 py-2.5 ${index === step ? "border-primary bg-primary text-primary-foreground" : index < step ? "border-primary/30 bg-primary/5" : "bg-card"}`}><div className="flex items-center gap-2"><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${index === step ? "bg-white/20" : "bg-muted"}`}>{index < step ? <Check className="h-3.5 w-3.5" /> : index + 1}</span><span className="text-xs font-semibold">{label}</span></div></li>)}</ol>
    <Card className="shadow-sm"><CardContent className="p-5 md:p-6">
      {step === 0 && <div className="space-y-5"><div><h3 className="font-heading text-xl font-bold">Tell us the basics</h3><p className="mt-1 text-sm text-muted-foreground">Short, direct answers are best. You can submit what you have and we can follow up.</p></div><div><Label>Event</Label><Select value={form.event_id} onValueChange={(value) => update("event_id", value === "general" ? "" : value)}><SelectTrigger className={fieldClass}><SelectValue placeholder={events.length ? "Choose an upcoming event" : "General pitch application"} /></SelectTrigger><SelectContent><SelectItem value="general">General pitch application</SelectItem>{events.map((event) => <SelectItem key={event.id} value={event.id}>{event.title} · {event.date}</SelectItem>)}</SelectContent></Select></div><div className="grid gap-4 md:grid-cols-2"><div><Label htmlFor="embedded-startup-name">Startup name</Label><Input id="embedded-startup-name" className={fieldClass} value={form.startup_name} onChange={(event) => update("startup_name", event.target.value)} placeholder="Your startup" /></div><div><Label htmlFor="embedded-startup-url">Website</Label><Input id="embedded-startup-url" className={fieldClass} value={form.startup_website} onChange={(event) => update("startup_website", event.target.value)} placeholder="https://" /></div></div><div><Label htmlFor="embedded-one-line">What does your startup do, and who is it for?</Label><Textarea id="embedded-one-line" className={`${fieldClass} min-h-24`} value={form.startup_summary} onChange={(event) => update("startup_summary", event.target.value)} placeholder="One or two clear sentences are enough." maxLength={500} /></div><fieldset><legend className="text-sm font-medium">What are you looking for right now?</legend><p className="mt-1 text-xs text-muted-foreground">Select all that apply. This helps us prioritize useful support and introductions.</p><div className="mt-3 flex flex-wrap gap-2">{supportNeedOptions.map((option) => { const selected = form.support_needs.includes(option.value); return <button key={option.value} type="button" aria-pressed={selected} onClick={() => toggleSupportNeed(option.value)} className={`rounded-full border px-3 py-2 text-sm font-medium transition-colors ${selected ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:border-primary/50 hover:bg-primary/5"}`}>{option.label}</button>; })}</div></fieldset>{form.support_needs.length > 0 && <div className="grid gap-5 md:grid-cols-2"><div><Label htmlFor="embedded-support-timeline">How soon would you like help?</Label><Select value={form.support_timeline} onValueChange={(value) => update("support_timeline", value as PitchSupportTimeline)}><SelectTrigger id="embedded-support-timeline" className={fieldClass}><SelectValue placeholder="Choose a timeframe" /></SelectTrigger><SelectContent><SelectItem value="right_now">Right now</SelectItem><SelectItem value="next_3_months">Within 3 months</SelectItem><SelectItem value="exploring">Exploring for later</SelectItem></SelectContent></Select></div><div><Label htmlFor="embedded-paid-support">Would you like StartupA2Z to connect you with trusted paid help?</Label><Select value={form.paid_support_interest} onValueChange={(value) => update("paid_support_interest", value as PaidSupportInterest)}><SelectTrigger id="embedded-paid-support" className={fieldClass}><SelectValue placeholder="Choose one" /></SelectTrigger><SelectContent><SelectItem value="actively_looking">Yes, I am actively looking</SelectItem><SelectItem value="open_to_options">Maybe, show me options</SelectItem><SelectItem value="not_now">Not right now</SelectItem></SelectContent></Select></div></div>}</div>}
      {step === 1 && <div className="space-y-5"><div><h3 className="font-heading text-xl font-bold">Help us understand your pitch</h3><p className="mt-1 text-sm text-muted-foreground">Focus on what the audience should understand, believe, or help with.</p></div><div><Label htmlFor="embedded-talk-title">Pitch title</Label><Input id="embedded-talk-title" className={fieldClass} value={form.talk_title} onChange={(event) => update("talk_title", event.target.value)} placeholder="A working title is fine" /></div><div className="grid gap-5 md:grid-cols-2"><div><Label htmlFor="embedded-problem">What problem are you solving?</Label><Textarea id="embedded-problem" className={`${fieldClass} min-h-28`} value={form.problem} onChange={(event) => update("problem", event.target.value)} placeholder="Who has this problem, and what happens today?" /></div><div><Label htmlFor="embedded-solution">How does your product solve it?</Label><Textarea id="embedded-solution" className={`${fieldClass} min-h-28`} value={form.solution} onChange={(event) => update("solution", event.target.value)} placeholder="Explain the product in plain language." /></div></div><div><Label htmlFor="embedded-traction">What evidence tells you this is working?</Label><Textarea id="embedded-traction" className={fieldClass} value={form.traction} onChange={(event) => update("traction", event.target.value)} placeholder="Customers, pilots, users, revenue, waitlist, partnerships, or learning so far." /></div><div><Label htmlFor="embedded-ask">What would you like from the audience?</Label><Textarea id="embedded-ask" className={fieldClass} value={form.ask_text} onChange={(event) => update("ask_text", event.target.value)} placeholder="Feedback, introductions, customers, partners, talent, or funding." /></div><div><Label htmlFor="embedded-deck">Pitch deck or demo link</Label><Input id="embedded-deck" className={fieldClass} value={form.pitch_deck_url} onChange={(event) => update("pitch_deck_url", event.target.value)} placeholder="https://" /></div><div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">By submitting, you allow StartupA2Z.org to review this application and contact you about pitching opportunities.</div><Button onClick={submit} disabled={submitting || preview} className="rounded-full px-6">{submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Submit pitch application"}</Button>{preview && <p className="text-xs text-muted-foreground">Sign in through the member flow to submit.</p>}</div>}
      {error && <p role="alert" className="mt-5 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
      <div className="mt-6 flex items-center justify-between border-t pt-4"><Button variant="ghost" disabled={step === 0 || saving || submitting} onClick={() => setStep(0)}><ArrowLeft className="h-4 w-4" /> Back</Button>{step === 0 && <Button onClick={continueToNextStep} disabled={saving}>{saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : <>Continue <ArrowRight className="h-4 w-4" /></>}</Button>}</div>
    </CardContent></Card>
  </div>;
};

const SectionContent = ({ active, pitchIntent, preview, user, registered, attended, sessions, onChange }: { active: MemberSection; pitchIntent: boolean; preview: boolean; user: MemberUserView; registered: number; attended: number; sessions: MemberSessionView; onChange: (section: MemberSection) => void }) => {
  if (active === "profile") return <Card><CardHeader className="flex-row items-center justify-between"><div><CardTitle>My profile</CardTitle><p className="mt-1 text-sm text-muted-foreground">The identity used across registrations and applications.</p></div>{!preview && <Button asChild variant="outline" size="sm"><Link to="/complete-profile?returnTo=/welcome">Edit profile</Link></Button>}</CardHeader><CardContent className="grid gap-5 sm:grid-cols-2"><div className="flex gap-3"><UserRound className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Name</p><p className="font-medium">{user.full_name || "Not provided"}</p></div></div><div className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Email</p><p className="break-all font-medium">{user.email}</p></div></div><div className="flex gap-3"><Building2 className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Company / startup</p><p className="font-medium">{user.company || "Not provided"}</p></div></div><div className="flex gap-3"><BriefcaseBusiness className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Role</p><p className="font-medium">{user.job_title || "Not provided"}</p></div></div></CardContent></Card>;
  if (active === "events") return <Card><CardHeader className="flex-row items-center justify-between"><div><CardTitle>My events</CardTitle><p className="mt-1 text-sm text-muted-foreground">Registrations, attendance and upcoming participation.</p></div><Button asChild variant="outline" size="sm"><Link to="/events">Find events</Link></Button></CardHeader><CardContent>{sessions.length === 0 ? <div className="rounded-xl border border-dashed p-8 text-center"><CalendarCheck className="mx-auto h-7 w-7 text-muted-foreground" /><p className="mt-3 font-medium">No event activity yet</p><p className="mt-1 text-sm text-muted-foreground">Registered events will appear here.</p></div> : <div className="space-y-3">{sessions.map((session) => <Link key={session.event_slug} to={`/events/${session.event_slug}`} className="flex items-center justify-between gap-4 rounded-xl border p-4 hover:border-primary/40"><div><p className="font-medium">{session.event_title}</p><p className="mt-1 text-xs text-muted-foreground">Registered {new Date(session.registered_at).toLocaleDateString()}</p></div><Badge variant={session.attended ? "default" : "secondary"}>{session.attended ? "Attended" : "Registered"}</Badge></Link>)}</div>}</CardContent></Card>;
  if (active === "pitch") return <EmbeddedPitchApplication user={user} preview={preview} />;
  if (active === "talk") return <Card><CardHeader><Badge variant="secondary" className="w-fit">Founder education</Badge><CardTitle className="mt-3">Give a founder talk</CardTitle><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Apply for a 12–15-minute problem-first talk covering the problem, solution, monetization challenge, failed assumption, breakthrough, lessons, ask and offer.</p></CardHeader><CardContent><div className="grid gap-3 sm:grid-cols-2">{["Problem and customer", "Monetization challenge", "Breakthrough and lessons", "Your ask and offer"].map((item, index) => <div key={item} className="flex gap-3 rounded-xl border p-4"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{index + 1}</span><p className="text-sm font-medium">{item}</p></div>)}</div><Button disabled className="mt-6 rounded-full">Start founder talk application</Button><p className="mt-2 text-xs text-muted-foreground">Screen prototype only. The talk form will be designed after this dashboard is confirmed.</p></CardContent></Card>;
  if (active === "startup") return <PrototypeForm />;
  if (active === "exchange") return <div className="space-y-5"><div><Badge variant="secondary">Community exchange</Badge><h2 className="mt-3 font-heading text-3xl font-bold">What do you need—and what can you offer?</h2><p className="mt-2 text-muted-foreground">Create focused requests and offers that other members can act on.</p></div><div className="grid gap-5 md:grid-cols-2"><Card><CardContent className="p-6"><AskOfferCard type="ask" /></CardContent></Card><Card><CardContent className="p-6"><AskOfferCard type="offer" /></CardContent></Card></div></div>;
  const actions: Array<{ id: MemberSection; icon: IconType; title: string; text: string }> = [
    { id: "pitch", icon: Presentation, title: "Apply to pitch", text: "Pitch your startup at an upcoming event." },
    { id: "talk", icon: Mic2, title: "Give a founder talk", text: "Share the real journey behind your company." },
    { id: "startup", icon: Rocket, title: "Add startup/business", text: "Create one profile for your venture or business." },
    { id: "exchange", icon: Handshake, title: "Ask & offer", text: "Request help and contribute expertise." },
    { id: "events", icon: CalendarDays, title: "Find an event", text: "Register and track your participation." },
  ];
  return <div className="space-y-5">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Card><CardContent className="p-5"><TicketCheck className="h-5 w-5 text-primary" /><p className="mt-4 text-3xl font-bold">{registered}</p><p className="text-sm text-muted-foreground">Events registered</p></CardContent></Card><Card><CardContent className="p-5"><CalendarCheck className="h-5 w-5 text-primary" /><p className="mt-4 text-3xl font-bold">{attended}</p><p className="text-sm text-muted-foreground">Events attended</p></CardContent></Card><Card><CardContent className="p-5"><Mic2 className="h-5 w-5 text-secondary" /><p className="mt-4 text-lg font-semibold">{pitchIntent ? "1 draft" : "None"}</p><p className="text-sm text-muted-foreground">Pitch applications</p></CardContent></Card><Card><CardContent className="p-5"><Linkedin className="h-5 w-5 text-[#0A66C2]" /><p className="mt-4 text-lg font-semibold">{user.linkedin_connected ? "Connected" : "Not connected"}</p><p className="text-sm text-muted-foreground">LinkedIn</p></CardContent></Card></div>
    <div><h2 className="font-heading text-2xl font-bold">What would you like to do?</h2><div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{actions.map(({ id, icon: Icon, title, text }) => <button key={id} type="button" onClick={() => onChange(id)} className="group rounded-2xl border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"><Icon className="h-6 w-6 text-secondary" /><h3 className="mt-4 font-semibold group-hover:text-primary">{title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p></button>)}</div></div>
  </div>;
};

const Welcome = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pitchIntent = searchParams.get("intent") === "pitch";
  const pitchPreview = import.meta.env.DEV && pitchIntent && searchParams.get("preview") === "1";
  const [active, setActive] = useState<MemberSection>(pitchIntent ? "pitch" : "overview");
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authOpen, setAuthOpen] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!getToken() || !isMemberAuthenticated()) { setProfile(null); setLoading(false); return; }
    setLoading(true); setError("");
    try { setProfile(await fetchMemberProfile()); }
    catch (err) { setProfile(null); setError(err instanceof ApiError ? err.message : "Could not load your account."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void loadProfile(); const refresh = () => void loadProfile(); window.addEventListener("startupa2z-auth-change", refresh); return () => window.removeEventListener("startupa2z-auth-change", refresh); }, [loadProfile]);

  if (loading && !pitchPreview) return <PageLayout><div className="flex min-h-[70vh] items-center justify-center pt-16"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div></PageLayout>;
  if (!profile && !pitchPreview) return <PageLayout><SEO title="Member Sign In | StartupA2Z.org" description="Sign in to your StartupA2Z.org member account." canonical="https://startupa2z.org/welcome" /><section className="flex min-h-[70vh] items-center justify-center px-6 pb-16 pt-24"><Card className="w-full max-w-lg text-center shadow-lg"><CardContent className="p-8 md:p-10"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary"><UserRound className="h-7 w-7" /></div><h1 className="mt-5 font-heading text-3xl font-bold">Welcome to StartupA2Z.org</h1><p className="mt-2 text-muted-foreground">{pitchIntent ? "Sign in or register to continue your pitch application." : "Sign in to see your profile and member activities."}</p>{error && <p className="mt-3 text-sm text-destructive">{error}</p>}<Button className="mt-6 rounded-full px-8" onClick={() => setAuthOpen(true)}>Sign In</Button><AuthDialog open={authOpen} onOpenChange={setAuthOpen} redirectTo={pitchIntent ? "/welcome?intent=pitch" : "/welcome"} initialMode={pitchIntent ? "signup" : "signin"} /></CardContent></Card></section></PageLayout>;

  const user: MemberUserView = pitchPreview ? { full_name: "Founder", email: "founder@example.com", company: "Your Startup", job_title: "Founder & CEO", founder_status: "active_founder", linkedin_connected: true, created_at: new Date().toISOString() } : (profile as MemberProfile).user;
  const sessions: MemberSessionView = pitchPreview ? [] : (profile as MemberProfile).sessions;
  const registered = pitchPreview ? 3 : (profile as MemberProfile).summary.registered_sessions;
  const attended = pitchPreview ? 2 : (profile as MemberProfile).summary.attended_sessions;
  const displayName = user.full_name || user.email.split("@")[0];

  return <PageLayout><SEO title="Member Welcome | StartupA2Z.org" description="Your StartupA2Z.org member activities, applications and participation." canonical="https://startupa2z.org/welcome" /><section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-6 pb-5 pt-20"><div className="container-narrow flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><Badge>{pitchPreview ? "Local UI preview" : "Member dashboard"}</Badge><h1 className="mt-2 font-heading text-2xl font-bold md:text-3xl">Welcome, {displayName}</h1><p className="mt-1 text-sm text-muted-foreground">Your StartupA2Z.org member activities.</p></div><div className="flex items-center gap-2"><button type="button" onClick={() => setActive("profile")} className={`flex items-center gap-2.5 rounded-xl border bg-card px-3 py-2.5 text-left shadow-sm transition-colors hover:border-primary/40 ${active === "profile" ? "border-primary ring-1 ring-primary/20" : ""}`}><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><UserRound className="h-4 w-4" /></span><span className="text-sm font-semibold">My profile</span></button>{!pitchPreview && <Button size="icon" variant="outline" aria-label="Sign out" title="Sign out" onClick={() => { clearToken(); navigate("/"); }}><LogOut className="h-4 w-4" /></Button>}</div></div></section><section className="px-6 py-5"><div className="container-narrow grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]"><MemberSidebar active={active} onChange={setActive} showPitchDraft={pitchIntent} /><div className="min-w-0"><SectionContent active={active} pitchIntent={pitchIntent} preview={pitchPreview} user={user} registered={registered} attended={attended} sessions={sessions} onChange={setActive} /></div></div></section></PageLayout>;
};

export default Welcome;
