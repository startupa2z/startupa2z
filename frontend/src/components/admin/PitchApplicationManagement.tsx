import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { ExternalLink, Loader2, Presentation, RefreshCw, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ApiError, type AdminPitchApplication, type PaidSupportInterest, type PitchApplicationStatus, type PitchSupportNeed, updateAdminPitchApplication } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

type ReviewStatus = Exclude<PitchApplicationStatus, "draft" | "withdrawn">;

const statusVariant = (status: PitchApplicationStatus) => {
  if (status === "approved") return "default" as const;
  if (status === "declined") return "destructive" as const;
  return "secondary" as const;
};

const answer = (value: string | null) => value?.trim() || "No answer provided";

const supportNeedLabels: Record<PitchSupportNeed, string> = {
  funding: "Funding",
  customers: "Customers",
  gtm: "GTM",
  staffing: "Staffing",
  ai_development: "AI development",
  soc2_compliance: "SOC 2 / compliance",
  legal: "Legal",
  cloud_cybersecurity: "Cloud / cybersecurity",
  product_development: "Product development",
  partnerships: "Partnerships",
  mentors_advisors: "Mentors / advisors",
};

const timelineLabels = {
  right_now: "Right now",
  next_3_months: "Within 3 months",
  exploring: "Exploring for later",
} as const;

const paidSupportLabels: Record<PaidSupportInterest, string> = {
  actively_looking: "Actively looking for paid help",
  open_to_options: "Open to paid options",
  not_now: "Not looking for paid help now",
};

const PitchApplicationManagement = ({
  applications,
  setApplications,
  loading,
  onRefresh,
}: {
  applications: AdminPitchApplication[];
  setApplications: Dispatch<SetStateAction<AdminPitchApplication[]>>;
  loading: boolean;
  onRefresh: () => void;
}) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | ReviewStatus>("all");
  const [supportNeed, setSupportNeed] = useState<"all" | PitchSupportNeed>("all");
  const [paidInterest, setPaidInterest] = useState<"all" | PaidSupportInterest>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  const filtered = useMemo(() => applications.filter((application) => {
    if (status !== "all" && application.status !== status) return false;
    if (supportNeed !== "all" && !(application.support_needs ?? []).includes(supportNeed)) return false;
    if (paidInterest !== "all" && application.paid_support_interest !== paidInterest) return false;
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return [application.full_name, application.email, application.startup_name, application.company, application.event_title, (application.support_needs ?? []).map((need) => supportNeedLabels[need]).join(" ")]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  }), [applications, paidInterest, search, status, supportNeed]);

  const selected = applications.find((application) => application.id === selectedId) ?? null;

  const selectApplication = (application: AdminPitchApplication) => {
    setSelectedId(application.id);
    setNotes(application.admin_notes ?? "");
  };

  const changeStatus = async (nextStatus: ReviewStatus) => {
    if (!selected) return;
    setUpdating(true);
    try {
      const { data } = await updateAdminPitchApplication(selected.id, {
        status: nextStatus,
        admin_notes: notes,
      });
      setApplications((current) => current.map((item) => item.id === data.id ? data : item));
      toast({ title: `Pitch application marked ${nextStatus.replaceAll("_", " ")}` });
    } catch (error) {
      toast({
        title: "Could not update pitch application",
        description: error instanceof ApiError ? error.message : "Unknown error.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const counts = {
    submitted: applications.filter((item) => item.status === "submitted").length,
    underReview: applications.filter((item) => item.status === "under_review").length,
    approved: applications.filter((item) => item.status === "approved").length,
    buyerOpportunities: applications.filter((item) => item.paid_support_interest === "actively_looking" || item.paid_support_interest === "open_to_options").length,
  };

  return <div className="space-y-5">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-secondary/30"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Buyer opportunities</CardTitle></CardHeader><CardContent className="text-2xl font-bold text-secondary">{counts.buyerOpportunities}</CardContent></Card>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Waiting for review</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{counts.submitted}</CardContent></Card>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Under review</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{counts.underReview}</CardContent></Card>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{counts.approved}</CardContent></Card>
    </div>

    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative max-w-md flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search founder, startup, event…" className="pl-9" /></div>
        <select value={status} onChange={(event) => setStatus(event.target.value as "all" | ReviewStatus)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option value="all">All statuses</option><option value="submitted">Submitted</option><option value="under_review">Under review</option><option value="approved">Approved</option><option value="declined">Declined</option>
        </select>
        <select aria-label="Filter by need" value={supportNeed} onChange={(event) => setSupportNeed(event.target.value as "all" | PitchSupportNeed)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option value="all">All needs</option>{Object.entries(supportNeedLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select aria-label="Filter by buyer intent" value={paidInterest} onChange={(event) => setPaidInterest(event.target.value as "all" | PaidSupportInterest)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option value="all">All buyer intent</option><option value="actively_looking">Actively looking</option><option value="open_to_options">Open to options</option><option value="not_now">Not right now</option>
        </select>
      </div>
      <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Refresh</Button>
    </div>

    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <Table><TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40"><TableHead>Submitted</TableHead><TableHead>Founder</TableHead><TableHead>Startup</TableHead><TableHead>Looking for</TableHead><TableHead>Event</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
        <TableBody>{filtered.length === 0 ? <TableRow><TableCell colSpan={6} className="py-16 text-center text-muted-foreground"><Presentation className="mx-auto mb-2 h-8 w-8 opacity-40" />{loading ? "Loading applications…" : "No pitch applications found."}</TableCell></TableRow> : filtered.map((application) => <TableRow key={application.id} onClick={() => selectApplication(application)} className={`cursor-pointer ${selectedId === application.id ? "bg-primary/5" : "hover:bg-muted/30"}`}>
          <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{new Date(application.submitted_at || application.created_at).toLocaleString()}</TableCell>
          <TableCell><div className="font-medium">{application.full_name || "Member"}</div><div className="text-xs text-muted-foreground">{application.email}</div></TableCell>
          <TableCell>{application.startup_name || application.company || "Not provided"}</TableCell>
          <TableCell><div className="flex max-w-64 flex-wrap gap-1">{(application.support_needs ?? []).length ? <>{application.support_needs.slice(0, 2).map((need) => <Badge key={need} variant="outline" className="whitespace-nowrap text-[0.65rem]">{supportNeedLabels[need]}</Badge>)}{application.support_needs.length > 2 && <Badge variant="secondary" className="text-[0.65rem]">+{application.support_needs.length - 2}</Badge>}</> : <span className="text-xs text-muted-foreground">Not provided</span>}</div></TableCell>
          <TableCell>{application.event_title || "General application"}</TableCell>
          <TableCell><Badge variant={statusVariant(application.status)} className="capitalize">{application.status.replaceAll("_", " ")}</Badge></TableCell>
        </TableRow>)}</TableBody>
      </Table>
    </div>

    {selected && <Card className="border-primary/20 shadow-sm"><CardHeader><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><CardTitle>{selected.startup_name || selected.company || "Pitch application"}</CardTitle><p className="mt-1 text-sm text-muted-foreground">{selected.full_name || "Member"} · <a href={`mailto:${selected.email}`} className="text-primary hover:underline">{selected.email}</a></p></div><Badge variant={statusVariant(selected.status)} className="w-fit capitalize">{selected.status.replaceAll("_", " ")}</Badge></div></CardHeader><CardContent className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Event</p><p className="mt-1">{selected.event_title || "General application"}</p></div><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pitch title</p><p className="mt-1">{answer(selected.talk_title)}</p></div></div>
      <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Startup and customer</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6">{answer(selected.startup_summary)}</p></div>
      <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-4"><div className="grid gap-4 md:grid-cols-[1fr_auto_auto]"><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">What they need</p><div className="mt-2 flex flex-wrap gap-2">{(selected.support_needs ?? []).length ? selected.support_needs.map((need) => <Badge key={need} variant="outline" className="border-secondary/40 bg-background">{supportNeedLabels[need]}</Badge>) : <span className="text-sm text-muted-foreground">No buyer needs selected</span>}</div></div><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Timing</p><p className="mt-1 text-sm font-medium">{selected.support_timeline ? timelineLabels[selected.support_timeline] : "Not provided"}</p></div><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Paid help</p><p className="mt-1 text-sm font-medium">{selected.paid_support_interest ? paidSupportLabels[selected.paid_support_interest] : "Not provided"}</p></div></div></div>
      <div className="grid gap-5 md:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Problem</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6">{answer(selected.problem)}</p></div><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Solution</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6">{answer(selected.solution)}</p></div></div>
      <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Evidence and traction</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6">{answer(selected.traction)}</p></div>
      <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">What they want from the audience</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6">{answer(selected.ask_text)}</p></div>
      <div className="flex flex-wrap gap-4 text-sm">{selected.startup_website && <a href={selected.startup_website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">Website <ExternalLink className="h-3.5 w-3.5" /></a>}{selected.pitch_deck_url && <a href={selected.pitch_deck_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">Pitch deck or demo <ExternalLink className="h-3.5 w-3.5" /></a>}</div>
      <div><Label htmlFor="pitch-review-notes">Internal review notes</Label><Textarea id="pitch-review-notes" value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-1.5 min-h-24" placeholder="Selection reasoning, follow-up questions, or scheduling notes" /></div>
      <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => changeStatus("submitted")} disabled={updating}>Return to submitted</Button><Button variant="secondary" onClick={() => changeStatus("under_review")} disabled={updating}>Start review</Button><Button onClick={() => changeStatus("approved")} disabled={updating}>Approve</Button><Button variant="destructive" onClick={() => changeStatus("declined")} disabled={updating}>Decline</Button></div>
      <p className="text-xs text-muted-foreground">Status changes are internal. No email or attendee notification is sent.</p>
    </CardContent></Card>}
  </div>;
};

export default PitchApplicationManagement;
