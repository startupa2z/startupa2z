import { useMemo, useState } from "react";
import type { AdminEvent } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Users } from "lucide-react";

const dayKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const parseEventDate = (value: string) => {
  const parsed = new Date(`${value} 12:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const AdminCalendar = ({
  events,
  registrations,
  onCreateInline,
  onEdit,
}: {
  events: AdminEvent[];
  registrations: number;
  onCreateInline: (date?: string) => void;
  onEdit: (id: string) => void;
}) => {
  const today = new Date();
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const eventMap = useMemo(() => {
    const map = new Map<string, AdminEvent[]>();
    events.forEach((event) => {
      const date = parseEventDate(event.date);
      if (!date) return;
      const key = dayKey(date);
      map.set(key, [...(map.get(key) ?? []), event]);
    });
    return map;
  }, [events]);

  const monthEvents = useMemo(() => events.filter((event) => {
    const date = parseEventDate(event.date);
    return date && date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth();
  }), [events, month]);

  const days = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const gridStart = new Date(first);
    gridStart.setDate(first.getDate() - first.getDay());
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);
      return date;
    });
  }, [month]);

  const openCreate = (date: Date) => {
    onCreateInline(dayKey(date));
  };

  return (
    <div className="space-y-5">
      <section className="grid sm:grid-cols-3 gap-3">
        <Card className="shadow-sm"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Events this month</p><p className="mt-1 text-2xl font-bold">{monthEvents.length}</p></CardContent></Card>
        <Card className="shadow-sm"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total registrations</p><p className="mt-1 text-2xl font-bold">{registrations}</p></CardContent></Card>
        <Card className="shadow-sm"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Event days</p><p className="mt-1 text-2xl font-bold">{new Set(monthEvents.map((event) => event.date)).size}</p></CardContent></Card>
      </section>

      <section className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b p-4">
          <div>
            <h2 className="text-lg font-semibold">{month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h2>
            <p className="text-xs text-muted-foreground">Click any day to add an event.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="Previous month"><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => setMonth(new Date(today.getFullYear(), today.getMonth(), 1))}>Today</Button>
            <Button variant="outline" size="icon" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="Next month"><ChevronRight className="h-4 w-4" /></Button>
            <Button size="sm" onClick={() => openCreate(new Date(month.getFullYear(), month.getMonth(), 1))}><Plus className="h-4 w-4" /> Add event</Button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b bg-muted/40">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((name) => <div key={name} className="px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{name}</div>)}
        </div>

        <div className="grid grid-cols-7">
          {days.map((date) => {
            const key = dayKey(date);
            const inMonth = date.getMonth() === month.getMonth();
            const isToday = key === dayKey(today);
            const dateEvents = eventMap.get(key) ?? [];
            return (
              <div
                key={key}
                className={`group relative min-h-24 border-b border-r p-1.5 text-left align-top transition-colors hover:bg-primary/5 sm:min-h-28 sm:p-2 ${inMonth ? "bg-card" : "bg-muted/20 text-muted-foreground"}`}
              >
                <button type="button" onClick={() => openCreate(date)} className="absolute inset-0 z-0" aria-label={`Add event on ${date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`} />
                <div className="pointer-events-none relative z-10">
                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${isToday ? "bg-primary text-primary-foreground" : ""}`}>{date.getDate()}</span>
                  <div className="mt-1 space-y-1">
                  {dateEvents.slice(0, 2).map((event) => (
                    <button key={event.id} type="button" onClick={(clickEvent) => { clickEvent.stopPropagation(); onEdit(event.id); }} className="pointer-events-auto block w-full truncate rounded bg-primary/10 px-1.5 py-1 text-left text-[10px] font-medium text-primary hover:bg-primary/20 sm:text-[11px]" title={`Edit ${event.title}`}>{event.title}</button>
                  ))}
                  {dateEvents.length > 2 && <span className="text-[10px] text-muted-foreground">+{dateEvents.length - 2} more</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <Badge variant="outline" className="gap-1"><CalendarDays className="h-3 w-3" /> Event</Badge>
        <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> Monthly registration total uses current admin data</span>
      </div>

    </div>
  );
};

export default AdminCalendar;
