import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarCheck, CalendarDays, ChevronLeft, ChevronRight, FileEdit, Globe2, List, MapPin, Megaphone, Plus } from "lucide-react";
import { stageInfo, type DemoEvent, type EventStage } from "./campaign-demo";

type PortfolioFilter = "all" | EventStage;

const parseDate = (value: string) => {
  const parsed = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00` : `${value} 12:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const dayKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const eventStatus = (event: DemoEvent) => event.stage === "draft_event" ? "Draft" : "Published";
const campaignStatus = (event: DemoEvent) => event.stage === "campaign_draft" ? "Draft" : event.stage === "scheduled" ? "Scheduled" : "Not started";

const statusTone = (stage: EventStage) => stage === "draft_event"
  ? "border-slate-300 bg-slate-50 text-slate-700"
  : stage === "published"
    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
    : stage === "campaign_draft"
      ? "border-amber-300 bg-amber-50 text-amber-700"
      : "border-blue-300 bg-blue-50 text-blue-700";

const EventPortfolio = ({
  events,
  onOpenCampaign,
  onJourneyStepChange,
  onCreateEvent,
  onEditEvent,
}: {
  events: DemoEvent[];
  onOpenCampaign: (eventId: string) => void;
  onJourneyStepChange: (step: 1 | 2 | 3 | 4 | 5) => void;
  onCreateEvent: (date?: string) => void;
  onEditEvent: (event: DemoEvent) => void;
}) => {
  const [view, setView] = useState<"list" | "calendar">("calendar");
  const [filter, setFilter] = useState<PortfolioFilter>("all");
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const sortedEvents = useMemo(() => [...events].sort((a, b) => {
    const aTime = parseDate(a.date)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const bTime = parseDate(b.date)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    return aTime - bTime;
  }), [events]);

  const filteredEvents = filter === "all" ? sortedEvents : sortedEvents.filter((event) => event.stage === filter);
  const counts = useMemo(() => events.reduce<Record<EventStage, number>>((total, event) => {
    total[event.stage] += 1;
    return total;
  }, { draft_event: 0, published: 0, campaign_draft: 0, scheduled: 0 }), [events]);

  const firstDate = sortedEvents.map((event) => parseDate(event.date)).find((date): date is Date => Boolean(date)) ?? new Date();
  const [month, setMonth] = useState(() => new Date(firstDate.getFullYear(), firstDate.getMonth(), 1));

  const calendarDays = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [month]);

  const calendarMap = useMemo(() => {
    const map = new Map<string, DemoEvent[]>();
    filteredEvents.forEach((event) => {
      const date = parseDate(event.date);
      if (!date) return;
      const key = dayKey(date);
      map.set(key, [...(map.get(key) ?? []), event]);
    });
    return map;
  }, [filteredEvents]);

  const takeNextAction = (event: DemoEvent) => {
    setFocusedId(event.id);
    if (event.stage === "draft_event") {
      onJourneyStepChange(event.id.startsWith("local-created-") ? 3 : 2);
      return;
    }
    onOpenCampaign(event.id);
  };

  const nextActionLabel = (event: DemoEvent) => event.stage === "draft_event"
    ? event.id.startsWith("local-created-") ? "Publish event" : "Complete details"
    : stageInfo[event.stage].next;

  const focusFromCalendar = (event: DemoEvent) => {
    setFocusedId(event.id);
    onEditEvent(event);
  };

  const filters = [
    { id: "all" as const, label: "All events", count: events.length, note: "Complete event portfolio", icon: CalendarDays },
    { id: "draft_event" as const, label: "Event drafts", count: counts.draft_event, note: "Need event details", icon: FileEdit },
    { id: "campaign_draft" as const, label: "Campaign drafts", count: counts.campaign_draft, note: "Need review", icon: Megaphone },
    { id: "published" as const, label: "Published", count: counts.published, note: "Ready for campaigns", icon: Globe2 },
    { id: "scheduled" as const, label: "Scheduled", count: counts.scheduled, note: "Campaign approved", icon: CalendarCheck },
  ];

  return (
    <section className="space-y-4" aria-label="All events">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5" aria-label="Event dashboard">
        {filters.map((item) => {
          const Icon = item.icon;
          const selected = filter === item.id;
          return (
            <button key={item.id} type="button" onClick={() => setFilter(item.id)} className={`rounded-xl border p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md ${selected ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>
              <span className="flex items-start justify-between gap-3"><span className={`flex h-9 w-9 items-center justify-center rounded-lg ${selected ? "bg-primary-foreground/15" : "bg-primary/10 text-primary"}`}><Icon className="h-4 w-4" /></span><span className="text-2xl font-bold">{item.count}</span></span>
              <span className="mt-3 block text-sm font-semibold">{item.label}</span>
              <span className={`mt-0.5 block text-xs ${selected ? "text-primary-foreground/75" : "text-muted-foreground"}`}>{item.note}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div><h3 className="font-semibold">{filters.find((item) => item.id === filter)?.label ?? "All events"}</h3><p className="mt-0.5 text-xs text-muted-foreground">Switch between the date-first list and calendar.</p></div>
        <div className="inline-flex w-fit rounded-lg border bg-background p-1">
          <button type="button" onClick={() => setView("list")} className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium ${view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}><List className="h-4 w-4" />List</button>
          <button type="button" onClick={() => setView("calendar")} className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium ${view === "calendar" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}><CalendarDays className="h-4 w-4" />Calendar</button>
        </div>
      </div>

      {view === "list" ? (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Event</th><th className="px-4 py-3">Event status</th><th className="px-4 py-3">Campaign status</th><th className="px-4 py-3">Next action</th><th className="px-4 py-3 text-right">Controls</th></tr>
              </thead>
              <tbody className="divide-y">
                {filteredEvents.map((event) => {
                  const date = parseDate(event.date);
                  const focused = focusedId === event.id;
                  return <tr key={event.id} className={focused ? "bg-primary/5 ring-1 ring-inset ring-primary/30" : "hover:bg-muted/20"}>
                    <td className="whitespace-nowrap px-4 py-4"><p className="font-semibold">{date ? date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : event.date}</p><p className="mt-1 text-xs text-muted-foreground">{event.time}</p></td>
                    <td className="px-4 py-4"><button type="button" onClick={() => onEditEvent(event)} className="text-left hover:text-primary"><span className="font-semibold">{event.title}</span><span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{event.venue}</span></button></td>
                    <td className="px-4 py-4"><Badge variant="outline" className={event.stage === "draft_event" ? statusTone("draft_event") : statusTone("published")}>{eventStatus(event)}</Badge></td>
                    <td className="px-4 py-4"><Badge variant="outline" className={statusTone(event.stage)}>{campaignStatus(event)}</Badge></td>
                    <td className="px-4 py-4"><p className="font-medium">{nextActionLabel(event)}</p><p className="mt-1 max-w-52 text-xs text-muted-foreground">{event.note}</p></td>
                    <td className="px-4 py-4 text-right"><Button size="sm" onClick={() => takeNextAction(event)}>{nextActionLabel(event)}</Button></td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
          {filteredEvents.length === 0 && <p className="p-10 text-center text-sm text-muted-foreground">No events match this status.</p>}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b p-4">
            <div><h3 className="font-semibold">{month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h3><p className="mt-1 text-xs text-muted-foreground">Click a date to add an event. Click an event to edit it.</p></div>
            <div className="flex items-center gap-2"><Button size="sm" onClick={() => onCreateEvent(dayKey(new Date(month.getFullYear(), month.getMonth(), 1)))}><Plus className="h-4 w-4" />Add event</Button><Button variant="outline" size="icon" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="Previous month"><ChevronLeft className="h-4 w-4" /></Button><Button variant="outline" size="sm" onClick={() => setMonth(new Date(firstDate.getFullYear(), firstDate.getMonth(), 1))}>Events month</Button><Button variant="outline" size="icon" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="Next month"><ChevronRight className="h-4 w-4" /></Button></div>
          </div>
          <div className="grid grid-cols-7 border-b bg-muted/30">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <div key={day} className="p-2 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{day}</div>)}</div>
          <div className="grid grid-cols-7">
            {calendarDays.map((date) => {
              const key = dayKey(date);
              const inMonth = date.getMonth() === month.getMonth();
              const dayEvents = calendarMap.get(key) ?? [];
              return <div key={key} className={`group relative min-h-28 border-b border-r p-2 transition-colors hover:bg-primary/5 ${inMonth ? "bg-card" : "bg-muted/20 text-muted-foreground"}`}><button type="button" onClick={() => onCreateEvent(key)} className="absolute inset-0 z-0" aria-label={`Add event on ${date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`} /><div className="pointer-events-none relative z-10"><span className="text-xs font-medium">{date.getDate()}</span><div className="mt-2 space-y-1">{dayEvents.slice(0, 3).map((event) => <button key={event.id} type="button" onClick={(clickEvent) => { clickEvent.stopPropagation(); focusFromCalendar(event); }} className={`pointer-events-auto block w-full truncate rounded border px-2 py-1 text-left text-[11px] font-medium ${statusTone(event.stage)}`} title={`Edit ${event.title}`}>{event.title}<span className="ml-1 opacity-70">· {stageInfo[event.stage].label}</span></button>)}{dayEvents.length > 3 && <p className="text-[10px] text-muted-foreground">+{dayEvents.length - 3} more</p>}</div></div></div>;
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default EventPortfolio;
