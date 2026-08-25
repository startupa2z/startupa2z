import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import type { AdminEvent, AdminRSVP } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import {
  ArrowRight,
  CalendarDays,
  CalendarRange,
  Archive,
  Ban,
  Check,
  ChevronRight,
  CircleDashed,
  FileEdit,
  Globe2,
  Megaphone,
  Eye,
  MoreHorizontal,
  Copy,
  Plus,
  RefreshCw,
  Send,
  Search,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import AdminCalendar from "./AdminCalendar";
import EventPortfolio from "./EventPortfolio";
import { stageInfo, type DemoEvent, type JourneyStep } from "./campaign-demo";

const prototypeAction = (title: string) => toast({
  title: `${title} — prototype`,
  description: "Nothing was published. External publishing will remain approval-gated.",
});

const EventManagement = ({
  events,
  registrations,
  onEdit,
  onDelete,
  onViewAttendees,
  onOpenCampaign,
  demoEvents,
  setDemoEvents,
  journeyStep,
  onJourneyStepChange,
}: {
  events: AdminEvent[];
  registrations: AdminRSVP[];
  onEdit: (id: string) => void;
  onDelete: (id: string, title: string) => void;
  onViewAttendees: (event: { slug: string; title: string }) => void;
  onOpenCampaign: (eventId: string) => void;
  demoEvents: DemoEvent[];
  setDemoEvents: Dispatch<SetStateAction<DemoEvent[]>>;
  journeyStep: JourneyStep;
  onJourneyStepChange: (step: JourneyStep) => void;
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(events[0]?.id ?? null);
  const [view, setView] = useState<"manage" | "calendar">("manage");
  const [eventSearch, setEventSearch] = useState("");
  const [draftError, setDraftError] = useState<string | null>(null);
  const [editingDemoId, setEditingDemoId] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    title: "",
    date: "",
    time: "",
    venue: "",
    type: "Networking",
    capacity: "50",
    description: "",
  });

  useEffect(() => {
    if (!selectedId && events[0]) setSelectedId(events[0].id);
    if (selectedId && !events.some((event) => event.id === selectedId)) setSelectedId(events[0]?.id ?? null);
  }, [events, selectedId]);

  const selected = useMemo(
    () => events.find((event) => event.id === selectedId) ?? events[0],
    [events, selectedId],
  );
  const filteredEvents = useMemo(() => {
    const query = eventSearch.trim().toLowerCase();
    if (!query) return events;
    return events.filter((event) => `${event.title} ${event.date} ${event.venue}`.toLowerCase().includes(query));
  }, [events, eventSearch]);

  const title = selected?.title ?? "Startup A to Z: Founders Mix & Pitch";
  const date = selected?.date ?? "August 12, 2026";
  const time = selected?.time ?? "5:00 PM – 8:00 PM";
  const venue = selected?.venue ?? "Hacker Dojo, Mountain View";
  const selectedRegistrations = selected ? registrations.filter((registration) => registration.event_slug === selected.slug).length : 0;

  const fields = [
    { label: "Date & time", value: `${date} · ${time}`, status: "Ready" },
    { label: "Venue", value: venue, status: "Ready" },
    { label: "Speaker", value: selected?.speakers?.[0]?.name || "To be announced", status: selected?.speakers?.length ? "Ready" : "Placeholder" },
    { label: "Talk topic", value: "Topic coming soon", status: "Placeholder" },
    { label: "Registration", value: "Website RSVP", status: "Ready" },
    { label: "Agenda", value: selected?.agenda?.length ? `${selected.agenda.length} agenda items` : "Networking + main session", status: selected?.agenda?.length ? "Ready" : "Partial" },
  ];

  const channels = [
    { name: "Website", status: "Current", style: "border-emerald-300 text-emerald-700" },
    { name: "Luma", status: "Not connected", style: "" },
    { name: "LinkedIn", status: "Update available", style: "border-amber-300 text-amber-700" },
    { name: "WhatsApp", status: "Update available", style: "border-amber-300 text-amber-700" },
    { name: "Email", status: "Not sent", style: "" },
  ];

  const updateDraft = (field: keyof typeof draft, value: string) => setDraft((current) => ({ ...current, [field]: value }));

  const saveDraftAndContinue = () => {
    if (!draft.title.trim() || !draft.date || !draft.time || !draft.venue.trim() || !draft.description.trim()) {
      setDraftError("Add the event title, date, time, venue, and description before continuing.");
      return;
    }
    if (editingDemoId) {
      setDemoEvents((current) => current.map((event) => event.id === editingDemoId ? {
        ...event,
        title: draft.title.trim(),
        date: draft.date,
        time: draft.time,
        venue: draft.venue.trim(),
        note: draft.description.trim(),
      } : event));
      setEditingDemoId(null);
      setDraftError(null);
      toast({ title: "Event updated locally", description: "The browser-session event now reflects your changes." });
      onJourneyStepChange(1);
      return;
    }
    const id = `local-created-${Date.now()}`;
    const slug = draft.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || id;
    setDemoEvents((current) => [{
      id,
      slug,
      title: draft.title.trim(),
      date: draft.date,
      time: draft.time,
      venue: draft.venue.trim(),
      stage: "draft_event",
      note: "All required event details are saved. Ready to publish in this local demo.",
    }, ...current]);
    setDraftError(null);
    toast({ title: "Event draft saved locally", description: "Nothing was published. Continue to Step 3 when ready." });
    onJourneyStepChange(3);
  };

  const publishLocalDemo = (event: DemoEvent) => {
    setDemoEvents((current) => current.map((item) => item.id === event.id ? { ...item, stage: "published", note: "The event is public in this local demo. Its campaign has not been started." } : item));
    toast({ title: "Event marked published in local demo", description: "No website or external channel was changed." });
  };

  const openInlineCreate = (date?: string) => {
    setEditingDemoId(null);
    setDraft({ title: "", date: date ?? "", time: "", venue: "", type: "Networking", capacity: "50", description: "" });
    setDraftError(null);
    onJourneyStepChange(2);
  };

  const openDemoEdit = (event: DemoEvent) => {
    const realEvent = events.find((item) => item.id === event.id || item.slug === event.slug);
    if (realEvent) {
      onEdit(realEvent.id);
      return;
    }
    const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(event.date)
      ? event.date
      : (() => {
          const value = new Date(`${event.date} 12:00:00`);
          if (Number.isNaN(value.getTime())) return "";
          return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
        })();
    const timeMatch = event.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    let inputTime = "";
    if (timeMatch) {
      let hours = Number(timeMatch[1]);
      const meridiem = timeMatch[3]?.toUpperCase();
      if (meridiem === "PM" && hours < 12) hours += 12;
      if (meridiem === "AM" && hours === 12) hours = 0;
      inputTime = `${String(hours).padStart(2, "0")}:${timeMatch[2]}`;
    }
    setEditingDemoId(event.id);
    setDraft({ title: event.title, date: parsedDate, time: inputTime, venue: event.venue, type: "Networking", capacity: "50", description: event.note });
    setDraftError(null);
    onJourneyStepChange(2);
  };

  const stepLabel = journeyStep === 1 ? "All events" : journeyStep === 2 ? editingDemoId ? "Edit event" : "Create event" : "Publish event";
  const stepTitle = journeyStep === 1 ? "All events" : journeyStep === 2 ? editingDemoId ? "Edit event" : "Create event" : "Publish the event, then continue directly into its campaign.";
  const stepDescription = journeyStep === 1 ? "Use the calendar or list to manage every event." : journeyStep === 2 ? editingDemoId ? "Update this event's details and save your changes." : "Complete the necessary event details below. Saving creates only a browser-session draft." : "Choose a draft event below and move it to Published in this local demo.";

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge>Step {journeyStep} · {stepLabel}</Badge>
            <Badge variant="outline">Local demo · browser session only</Badge>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">{stepTitle}</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{stepDescription}</p>
        </div>
        {journeyStep === 1 ? <Button onClick={() => openInlineCreate()} className="shrink-0"><Plus className="h-4 w-4" />Create event</Button> : journeyStep === 2 ? <Button variant="outline" onClick={() => { setEditingDemoId(null); onJourneyStepChange(1); }} className="shrink-0">All events</Button> : <Button variant="outline" onClick={() => openInlineCreate()} className="shrink-0"><Plus className="h-4 w-4" />Create another event</Button>}
      </section>

      <section aria-label="Complete event and campaign lifecycle" className="rounded-xl border bg-card px-4 py-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">The complete journey</p>
        <ol className="mt-3 grid gap-2 md:grid-cols-5">
          {[
            ["1", "All events", "View every event"],
            ["2", "Create event", "Add date, venue and details"],
            ["3", "Publish event", "Make the event public"],
            ["4", "Campaign & messages", "Create and review three drafts"],
            ["5", "Review & approve", "Approve the local schedule"],
          ].map(([step, label, note], index) => (
            <li key={step} className="relative flex gap-3 rounded-lg bg-muted/40 p-3">
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${index + 1 === journeyStep ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground ring-1 ring-border"}`}>{step}</span>
              <div><p className="text-sm font-semibold">{label}</p><p className="mt-0.5 text-xs text-muted-foreground">{note}</p></div>
              {index < 4 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 text-muted-foreground md:block" />}
            </li>
          ))}
        </ol>
      </section>

      {journeyStep === 2 ? (
      <section className="rounded-xl border bg-card shadow-sm" aria-label="Create event inline workspace">
        <div className="border-b px-5 py-4"><h3 className="text-lg font-semibold">{editingDemoId ? "Edit event details" : "Event details"}</h3><p className="mt-1 text-sm text-muted-foreground">Required fields are marked. This form does not call the backend.</p></div>
        <div className="grid gap-5 p-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2"><Label htmlFor="inline-event-title">Event title *</Label><Input id="inline-event-title" value={draft.title} onChange={(event) => updateDraft("title", event.target.value)} placeholder="Example: Bay Area Founder Night" /></div>
          <div className="space-y-2"><Label htmlFor="inline-event-date">Date *</Label><Input id="inline-event-date" type="date" value={draft.date} onChange={(event) => updateDraft("date", event.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="inline-event-time">Start time *</Label><Input id="inline-event-time" type="time" value={draft.time} onChange={(event) => updateDraft("time", event.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="inline-event-venue">Venue *</Label><Input id="inline-event-venue" value={draft.venue} onChange={(event) => updateDraft("venue", event.target.value)} placeholder="Venue name or Online" /></div>
          <div className="space-y-2"><Label htmlFor="inline-event-type">Event type</Label><Input id="inline-event-type" value={draft.type} onChange={(event) => updateDraft("type", event.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="inline-event-capacity">Capacity</Label><Input id="inline-event-capacity" type="number" min="1" value={draft.capacity} onChange={(event) => updateDraft("capacity", event.target.value)} /></div>
          <div className="space-y-2 md:col-span-2"><Label htmlFor="inline-event-description">Description *</Label><Textarea id="inline-event-description" rows={5} value={draft.description} onChange={(event) => updateDraft("description", event.target.value)} placeholder="What should attendees know about this event?" /></div>
        </div>
        <div className="flex flex-col gap-3 border-t bg-muted/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>{draftError && <p className="text-sm font-medium text-destructive">{draftError}</p>}<p className="text-xs text-muted-foreground">{editingDemoId ? "Save the changes to return to All events." : "Save this event when its required details are complete."}</p></div>
          <Button onClick={saveDraftAndContinue}>{editingDemoId ? "Save changes" : "Save draft and continue"} <ArrowRight className="h-4 w-4" /></Button>
        </div>
      </section>
      ) : journeyStep === 1 ? (
      <EventPortfolio events={demoEvents} onOpenCampaign={onOpenCampaign} onJourneyStepChange={onJourneyStepChange} onCreateEvent={openInlineCreate} onEditEvent={openDemoEdit} />
      ) : (
      <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="border-b px-4 py-3">
          <h3 className="font-semibold">Events and their next action</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Eight local examples show where every event is in the same lifecycle.</p>
        </div>
        <div className="divide-y">
          {demoEvents.map((event) => {
            const info = stageInfo[event.stage];
            const readyToPublish = event.stage === "draft_event" && event.id.startsWith("local-created-");
            const ActionIcon = event.stage === "draft_event" ? (readyToPublish ? Globe2 : FileEdit) : event.stage === "published" ? Megaphone : Eye;
            return (
              <div key={event.id} className="grid gap-3 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_190px_210px] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{event.title}</p><Badge variant="outline" className="text-[10px]">Local demo</Badge></div>
                  <p className="mt-1 text-sm text-muted-foreground">{event.date} · {event.venue}</p>
                </div>
                <div><Badge variant="outline" className={info.tone}>{info.label}</Badge><p className="mt-1 text-xs text-muted-foreground">{event.note}</p></div>
                <Button
                  variant={event.stage === "draft_event" ? "outline" : "default"}
                  onClick={() => readyToPublish ? publishLocalDemo(event) : event.stage === "draft_event" ? prototypeAction("Complete event details") : onOpenCampaign(event.id)}
                >
                  <ActionIcon className="h-4 w-4" />{readyToPublish ? "Publish event" : info.next}
                </Button>
              </div>
            );
          })}
        </div>
      </section>
      )}

      <details className="group rounded-xl border bg-card shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-medium">
          <span>Advanced event tools and calendar</span>
          <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
        </summary>
        <div className="space-y-5 border-t p-4">

      <div className="inline-flex rounded-lg border bg-card p-1 shadow-sm">
        <button type="button" onClick={() => setView("manage")} className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${view === "manage" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
          <CalendarDays className="h-4 w-4" /> Manage events
        </button>
        <button type="button" onClick={() => setView("calendar")} className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${view === "calendar" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
          <CalendarRange className="h-4 w-4" /> Calendar
        </button>
      </div>

      {view === "calendar" ? (
        <AdminCalendar events={events} registrations={registrations.length} onCreateInline={openInlineCreate} onEdit={onEdit} />
      ) : (
      <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
        <Card className="h-fit shadow-sm xl:sticky xl:top-24">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base">Your events</CardTitle>
              <Badge variant="secondary">{events.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="relative pb-1">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-[60%] text-muted-foreground" />
              <Input value={eventSearch} onChange={(event) => setEventSearch(event.target.value)} placeholder="Find an event…" className="h-9 pl-9 text-sm" />
            </div>
            {events.length === 0 ? (
              <button type="button" onClick={() => onJourneyStepChange(2)} className="w-full rounded-xl border border-dashed p-5 text-center text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground">
                <Plus className="mx-auto mb-2 h-5 w-5" /> Create your first event
              </button>
            ) : filteredEvents.length === 0 ? (
              <p className="py-5 text-center text-sm text-muted-foreground">No matching events.</p>
            ) : filteredEvents.map((event) => {
              const active = event.id === selected?.id;
              return (
                <button key={event.id} type="button" onClick={() => setSelectedId(event.id)} className={`w-full rounded-xl border p-3 text-left transition-colors ${active ? "border-primary bg-primary/5" : "hover:border-primary/40"}`}>
                  <div className="flex items-start gap-2">
                    <CalendarDays className={`mt-0.5 h-4 w-4 shrink-0 ${active ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{event.title}</p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">{event.date}</p>
                      <div className="mt-2 flex items-center justify-between"><Badge variant="secondary" className="text-[10px]">Announced</Badge><ChevronRight className="h-3.5 w-3.5 text-muted-foreground" /></div>
                    </div>
                  </div>
                </button>
              );
            })}
            <div className="mt-3 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground"><Users className="mr-1 inline h-3.5 w-3.5" /> {registrations.length} total registrations</div>
          </CardContent>
        </Card>

        <div className="min-w-0 space-y-5">
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2"><Badge className="bg-amber-600 hover:bg-amber-600">Announced with placeholders</Badge><span className="text-xs text-muted-foreground">Last updated 12 minutes ago</span></div>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{date} · {venue}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selected && <Button variant="outline" size="sm" onClick={() => onViewAttendees({ slug: selected.slug, title: selected.title })}><Users className="h-4 w-4" /> Attendees ({selectedRegistrations})</Button>}
                  {selected && <Button variant="outline" size="sm" onClick={() => onEdit(selected.id)}><FileEdit className="h-4 w-4" /> Edit master</Button>}
                  <Button size="sm" onClick={() => prototypeAction("Review updates")}><RefreshCw className="h-4 w-4" /> Review updates</Button>
                  {selected && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="outline" size="icon" className="h-9 w-9" aria-label="More event actions"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuLabel>Event actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(selected.id)}><FileEdit className="mr-2 h-4 w-4" /> Edit event</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => prototypeAction("Duplicate event")}><Copy className="mr-2 h-4 w-4" /> Duplicate</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => prototypeAction("Unpublish event")}><Ban className="mr-2 h-4 w-4" /> Unpublish</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => prototypeAction("Archive event")}><Archive className="mr-2 h-4 w-4" /> Archive</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(selected.id, selected.title)}><Trash2 className="mr-2 h-4 w-4" /> Delete permanently</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <section className="grid gap-3 lg:grid-cols-3">
            <Card className="border-primary/30 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">1</span><div><p className="font-semibold">Create the master event</p><p className="text-xs text-muted-foreground">Only date, time and venue are required.</p></div></div>
                <div className="mt-4 space-y-2 text-xs"><p className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> Core details confirmed</p><p className="flex items-center gap-2"><CircleDashed className="h-3.5 w-3.5 text-amber-600" /> Speaker and topic can be TBD</p></div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">2</span><div><p className="font-semibold">Publish early</p><p className="text-xs text-muted-foreground">Use clean public placeholders.</p></div></div>
                <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => prototypeAction("Publish placeholder")}><Megaphone className="h-4 w-4" /> Publish placeholder</Button>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">3</span><div><p className="font-semibold">Update once</p><p className="text-xs text-muted-foreground">See differences and republish selected channels.</p></div></div>
                <Button size="sm" className="mt-4 w-full" onClick={() => prototypeAction("Publish updates")}><Send className="h-4 w-4" /> Review & publish updates</Button>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-5 2xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
            <Card className="shadow-sm">
              <CardHeader className="pb-3"><div className="flex items-center justify-between gap-3"><div><CardTitle className="text-lg">Master event information</CardTitle><p className="mt-1 text-xs text-muted-foreground">The single source used by every channel.</p></div><Badge variant="outline">67% complete</Badge></div></CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {fields.map((field) => (
                  <div key={field.label} className="rounded-xl border bg-background/60 p-3">
                    <div className="flex items-center justify-between gap-3"><p className="text-xs text-muted-foreground">{field.label}</p><Badge variant="outline" className={field.status === "Placeholder" || field.status === "Partial" ? "border-amber-300 text-amber-700" : "border-emerald-300 text-emerald-700"}>{field.status}</Badge></div>
                    <p className="mt-2 text-sm font-medium">{field.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-3"><CardTitle className="text-lg">Publishing status</CardTitle><p className="text-xs text-muted-foreground">Nothing publishes without your approval.</p></CardHeader>
              <CardContent className="space-y-2">
                {channels.map((channel) => (
                  <div key={channel.name} className="flex items-center justify-between rounded-lg border p-3"><div className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-muted-foreground" /><span className="text-sm font-medium">{channel.name}</span></div><Badge variant="outline" className={channel.style}>{channel.status}</Badge></div>
                ))}
                <Button variant="outline" className="mt-2 w-full" onClick={() => prototypeAction("Choose channels")}><Send className="h-4 w-4" /> Choose channels</Button>
              </CardContent>
            </Card>
          </section>

          <Card className="border-amber-200 bg-amber-50/60 shadow-sm">
            <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3"><UserRound className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" /><div><p className="text-sm font-semibold text-amber-900">Two details still use placeholders</p><p className="mt-1 text-xs text-amber-800">When the speaker or topic arrives, edit the master record. The system will show which published channels are outdated.</p></div></div>
              <Button variant="outline" size="sm" className="shrink-0 bg-white" onClick={() => selected && onEdit(selected.id)}>Add missing details <ArrowRight className="h-4 w-4" /></Button>
            </CardContent>
          </Card>

          <section className="grid gap-5 lg:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader className="pb-3"><CardTitle className="text-lg">Event lifecycle</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  ["Draft", "Build privately before announcing."],
                  ["Published", "Live on selected channels."],
                  ["Updated", "Changes waiting for channel approval."],
                  ["Completed", "Keep registrations and analytics."],
                  ["Archived", "Hidden from active work; still recoverable."],
                ].map(([name, note], index) => <div key={name} className="flex gap-3"><span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${index === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{index + 1}</span><div><p className="font-medium">{name}</p><p className="text-xs text-muted-foreground">{note}</p></div></div>)}
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="pb-3"><CardTitle className="text-lg">Change history</CardTitle><p className="text-xs text-muted-foreground">Know what changed, when, and where it was published.</p></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3"><Check className="mt-0.5 h-4 w-4 text-emerald-600" /><div><p className="text-sm font-medium">Date and venue confirmed</p><p className="text-xs text-muted-foreground">Website current · 12 minutes ago</p></div></div>
                <div className="flex gap-3"><Megaphone className="mt-0.5 h-4 w-4 text-amber-600" /><div><p className="text-sm font-medium">Placeholder announcement prepared</p><p className="text-xs text-muted-foreground">LinkedIn and WhatsApp require approval</p></div></div>
                <div className="flex gap-3"><Archive className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="text-sm font-medium">Deletion safety</p><p className="text-xs text-muted-foreground">Archive is recommended. Permanent delete requires confirmation.</p></div></div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
      )}
        </div>
      </details>

    </div>
  );
};

export default EventManagement;
