import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import type { AdminEvent, AdminRSVP } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  CalendarCheck,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDashed,
  Clock3,
  Eye,
  FilePenLine,
  Globe2,
  LockKeyhole,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  Pencil,
  Send,
  Settings2,
  Users,
} from "lucide-react";
import {
  buildMessages,
  stageInfo,
  type CampaignMessage,
  type DemoEvent,
  type EventStage,
  type JourneyStep,
  type SimpleStatus,
} from "./campaign-demo";
import InvitationAudiencePreview from "./InvitationAudiencePreview";

const statusClass = (status: SimpleStatus) => status === "Sent"
  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
  : status === "Scheduled"
    ? "border-blue-300 bg-blue-50 text-blue-700"
    : "border-slate-300 bg-slate-50 text-slate-700";

const PublishingWorkspace = ({
  registrations,
  requestedEventId,
  onBackToEventManagement,
  onJourneyStepChange,
  demoEvents,
  setDemoEvents,
  onOpenEventPortfolio,
  events,
}: {
  registrations: AdminRSVP[];
  requestedEventId?: string | null;
  onBackToEventManagement?: () => void;
  onJourneyStepChange?: (step: JourneyStep) => void;
  onOpenEventPortfolio?: () => void;
  demoEvents: DemoEvent[];
  setDemoEvents: Dispatch<SetStateAction<DemoEvent[]>>;
  events: AdminEvent[];
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmEventId, setConfirmEventId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const selected = demoEvents.find((event) => event.id === selectedId) ?? null;
  const [messagesByEvent, setMessagesByEvent] = useState<Record<string, CampaignMessage[]>>(() => {
    return Object.fromEntries(demoEvents.map((event) => [event.id, buildMessages(event)]));
  });

  const stageCounts = useMemo(() => demoEvents.reduce<Record<EventStage, number>>((counts, event) => {
    counts[event.stage] += 1;
    return counts;
  }, { draft_event: 0, published: 0, campaign_draft: 0, scheduled: 0 }), [demoEvents]);

  const eventRsvps = selected ? registrations.filter((registration) => registration.event_slug === selected.slug) : [];
  const messages = selected ? messagesByEvent[selected.id] ?? buildMessages(selected) : [];

  useEffect(() => {
    if (!requestedEventId) return;
    const requested = demoEvents.find((event) => event.id === requestedEventId);
    if (!requested) return;
    if (requested.stage === "published") {
      setSelectedId(null);
      setConfirmEventId(requested.id);
      onJourneyStepChange?.(3);
    } else {
      setConfirmEventId(null);
      setSelectedId(requested.id);
      setEditingId(null);
      onJourneyStepChange?.(requested.stage === "scheduled" ? 5 : requested.stage === "campaign_draft" ? 4 : 2);
    }
  }, [demoEvents, onJourneyStepChange, requestedEventId]);

  const updateMessage = (id: CampaignMessage["id"], patch: Partial<CampaignMessage>) => {
    if (!selected) return;
    setMessagesByEvent((current) => ({
      ...current,
      [selected.id]: (current[selected.id] ?? buildMessages(selected)).map((message) => message.id === id ? { ...message, ...patch } : message),
    }));
  };

  const openEvent = (event: DemoEvent) => {
    if (event.stage === "published") {
      setConfirmEventId(event.id);
      return;
    }
    setSelectedId(event.id);
    setEditingId(null);
  };

  const createDraftOnly = () => {
    const event = demoEvents.find((item) => item.id === confirmEventId);
    if (!event) return;
    const updated = { ...event, stage: "campaign_draft" as const, note: "Three communication drafts are ready for review." };
    setDemoEvents((current) => current.map((item) => item.id === event.id ? updated : item));
    setMessagesByEvent((current) => ({ ...current, [event.id]: buildMessages(updated) }));
    setConfirmEventId(null);
    setSelectedId(event.id);
    onJourneyStepChange?.(4);
  };

  const approveLocalSchedule = () => {
    if (!selected) return;
    setDemoEvents((current) => current.map((event) => event.id === selected.id ? { ...event, stage: "scheduled", note: "The campaign schedule is approved in this local demo." } : event));
    setMessagesByEvent((current) => ({ ...current, [selected.id]: messages.map((message) => ({ ...message, status: "Scheduled" })) }));
    onJourneyStepChange?.(5);
  };

  if (selected) {
    const stage = stageInfo[selected.stage];
    const isDraftEvent = selected.stage === "draft_event";
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" className="w-fit px-0" onClick={() => setSelectedId(null)}><ArrowLeft className="h-4 w-4" />Back to campaign event list</Button>
            {onBackToEventManagement && <Button variant="outline" size="sm" onClick={onBackToEventManagement}><CalendarClock className="h-4 w-4" />Back to Event Management</Button>}
          </div>
          <Badge variant="outline" className="w-fit border-violet-300 bg-violet-50 text-violet-700">Local demo · browser session only</Badge>
        </div>

        <Card className="overflow-hidden shadow-sm">
          <CardContent className="p-0">
            <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:p-6">
              <div><Badge variant="outline" className={stage.tone}>{stage.label}</Badge><h2 className="mt-3 text-2xl font-bold">{selected.title}</h2><p className="mt-2 text-sm text-muted-foreground">{selected.note}</p></div>
              <div className="space-y-2 text-sm text-muted-foreground"><p className="flex gap-2"><CalendarClock className="h-4 w-4" />{selected.date} · {selected.time}</p><p className="flex gap-2"><MapPin className="h-4 w-4" />{selected.venue}</p></div>
            </div>
            <div className="border-t bg-muted/20 px-5 py-4 md:px-6">
              <div className="flex items-center justify-between text-xs"><span>Current progress</span><span className="font-semibold">{stage.progress}%</span></div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${stage.progress}%` }} /></div>
              <div className="mt-3 grid grid-cols-4 gap-2 text-center text-[11px] text-muted-foreground"><span>Event draft</span><span>Published</span><span>Campaign draft</span><span>Scheduled</span></div>
            </div>
          </CardContent>
        </Card>

        {isDraftEvent ? (
          <Card className="border-dashed shadow-sm"><CardContent className="flex flex-col items-center py-14 text-center"><FilePenLine className="h-9 w-9 text-muted-foreground/50" /><h3 className="mt-3 text-lg font-semibold">Complete the event before starting a campaign</h3><p className="mt-1 max-w-lg text-sm text-muted-foreground">This demo event still needs a venue and final description. Campaign drafting stays unavailable until the event is published.</p><Button className="mt-5" disabled><LockKeyhole className="h-4 w-4" />Event editor is outside this UI demo</Button></CardContent></Card>
        ) : (
          <>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><h3 className="text-xl font-bold">Campaign messages</h3><p className="text-sm text-muted-foreground">Three simple communications. No automatic send.</p></div><Badge variant="outline">{messages.length} messages</Badge></div>
            <div className="divide-y overflow-hidden rounded-xl border bg-card shadow-sm">
              {messages.map((message, index) => (
                <div key={message.id} className="p-4 md:p-5">
                  <div className="grid gap-4 md:grid-cols-[44px_180px_minmax(0,1fr)_150px] md:items-start">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{index + 1}</span>
                    <div><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{message.name}</p><Badge variant="outline" className={statusClass(message.status)}>{message.status}</Badge></div><p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><Clock3 className="h-4 w-4" />{message.timing}</p></div>
                    {editingId === message.id ? <div className="space-y-3"><div className="space-y-1.5"><Label>Subject</Label><Input value={message.subject} onChange={(event) => updateMessage(message.id, { subject: event.target.value })} /></div><div className="space-y-1.5"><Label>Message</Label><Textarea rows={7} value={message.body} onChange={(event) => updateMessage(message.id, { body: event.target.value })} /></div></div> : <div><p className="text-sm font-semibold">{message.subject}</p><p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">{message.body}</p></div>}
                    <Button variant="outline" size="sm" onClick={() => setEditingId(editingId === message.id ? null : message.id)} disabled={selected.stage === "scheduled"}><Pencil className="h-4 w-4" />{selected.stage === "scheduled" ? "View only" : editingId === message.id ? "Done" : "Edit draft"}</Button>
                  </div>
                </div>
              ))}
            </div>
            {selected.stage === "campaign_draft" && <Card className="border-violet-200 bg-violet-50/50 shadow-sm"><CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">Ready after reviewing all three drafts?</p><p className="mt-1 text-sm text-muted-foreground">Approval changes this browser-session demo to Scheduled. It does not send.</p></div><Button onClick={approveLocalSchedule}><Check className="h-4 w-4" />Approve local schedule</Button></CardContent></Card>}
            {selected.stage === "scheduled" && <Card className="border-blue-200 bg-blue-50/50 shadow-sm"><CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-3"><CalendarCheck className="mt-0.5 h-5 w-5 text-blue-700" /><div><p className="font-semibold text-blue-900">Campaign scheduled in local demo</p><p className="mt-1 text-sm text-blue-800">No provider or delivery worker exists. Nothing will be sent.</p></div></div>{onOpenEventPortfolio && <Button variant="outline" onClick={onOpenEventPortfolio}>Step 1 · All events</Button>}</CardContent></Card>}
          </>
        )}

        <details className="group rounded-xl border bg-card shadow-sm"><summary className="flex cursor-pointer list-none items-center justify-between p-4 font-semibold"><span className="flex items-center gap-2"><Settings2 className="h-4 w-4 text-muted-foreground" />Advanced details</span><ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" /></summary><div className="grid gap-4 border-t p-4 lg:grid-cols-3"><div className="rounded-xl border p-4"><Mail className="h-4 w-4" /><p className="mt-3 font-semibold">Channels</p><p className="mt-1 text-sm text-muted-foreground">Not connected. Preview only.</p></div><div className="rounded-xl border p-4"><Users className="h-4 w-4" /><p className="mt-3 font-semibold">Audience</p><p className="mt-1 text-sm text-muted-foreground">{eventRsvps.length} matching live RSVP{eventRsvps.length === 1 ? "" : "s"}; demo recipients are not queued.</p></div><div className="rounded-xl border p-4"><Send className="h-4 w-4" /><p className="mt-3 font-semibold">Delivery</p><p className="mt-1 text-sm text-muted-foreground">No provider, send, retry, or delivery confirmation.</p></div></div></details>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <InvitationAudiencePreview events={events} />
      <section className="rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-sm md:p-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex flex-wrap gap-2"><Badge>Events → Campaign</Badge><Badge variant="outline" className="border-violet-300 bg-violet-50 text-violet-700">Local demo events</Badge></div><h2 className="mt-3 text-2xl font-bold">Continue the same event lifecycle.</h2><p className="mt-1 text-sm text-muted-foreground">Choose the event you managed and published. Starting its campaign only creates drafts; it never sends automatically.</p></div><div className="flex flex-wrap gap-2"><Badge variant="outline">Browser session only</Badge>{onBackToEventManagement && <Button variant="outline" size="sm" onClick={onBackToEventManagement}><ArrowLeft className="h-4 w-4" />Event Management</Button>}</div></div></section>

      <section aria-label="Event workflow status" className="grid gap-2 rounded-xl border bg-card p-3 sm:grid-cols-2 lg:grid-cols-4">
        {([
          ["Draft events", stageCounts.draft_event, FilePenLine],
          ["Published", stageCounts.published, Globe2],
          ["Campaign drafts", stageCounts.campaign_draft, Megaphone],
          ["Scheduled", stageCounts.scheduled, CalendarCheck],
        ] as const).map(([label, count, Icon]) => <div key={label} className="flex items-center gap-3 rounded-lg bg-muted/30 p-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-primary ring-1 ring-border"><Icon className="h-4 w-4" /></span><p className="text-sm font-semibold">{label}</p><Badge variant="secondary" className="ml-auto">{count}</Badge></div>)}
      </section>

      <div className="divide-y overflow-hidden rounded-xl border bg-card shadow-sm">
        {demoEvents.map((event) => {
          const info = stageInfo[event.stage];
          const ActionIcon = event.stage === "draft_event" ? FilePenLine : event.stage === "published" ? Megaphone : Eye;
          return <div key={event.id} className="grid gap-4 p-4 transition-colors hover:bg-muted/20 lg:grid-cols-[minmax(0,1fr)_220px_210px] lg:items-center"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{event.title}</h3><Badge variant="outline" className="text-[10px]">Local demo</Badge></div><div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground"><span className="flex items-center gap-1.5"><CalendarClock className="h-4 w-4" />{event.date} · {event.time}</span><span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{event.venue}</span></div></div><div><Badge variant="outline" className={info.tone}>{info.label}</Badge><p className="mt-1 text-xs text-muted-foreground">{event.note}</p></div><Button onClick={() => openEvent(event)}><ActionIcon className="h-4 w-4" />{info.next}</Button></div>;
        })}
      </div>

      <Dialog open={Boolean(confirmEventId)} onOpenChange={(open) => !open && setConfirmEventId(null)}>
        <DialogContent className="sm:max-w-lg"><DialogHeader><div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"><Megaphone className="h-5 w-5" /></div><DialogTitle>Start an announcement campaign draft?</DialogTitle><DialogDescription>This creates three editable drafts in this browser session: Announcement, Reminder, and Final reminder.</DialogDescription></DialogHeader><div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><p className="flex gap-2 font-semibold"><LockKeyhole className="h-4 w-4" />Nothing will be sent</p><p className="mt-1">No account is connected and no audience, schedule, or delivery job will be created.</p></div><DialogFooter><Button variant="outline" onClick={() => setConfirmEventId(null)}>Cancel</Button><Button onClick={createDraftOnly}><FilePenLine className="h-4 w-4" />Create draft only</Button></DialogFooter></DialogContent>
      </Dialog>
    </div>
  );
};

export default PublishingWorkspace;
