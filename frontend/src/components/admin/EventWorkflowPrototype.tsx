import type { AdminEvent } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  CircleDashed,
  Clock3,
  FileEdit,
  Globe2,
  Megaphone,
  Radio,
  RefreshCw,
  Send,
  UserRound,
} from "lucide-react";

const prototypeClick = (label: string) => toast({ title: `${label} — prototype`, description: "This action is not connected yet." });

const EventWorkflowPrototype = ({ event }: { event?: AdminEvent }) => {
  const title = event?.title ?? "Startup A to Z: Founders Mix & Pitch";
  const date = event?.date ?? "August 12, 2026";
  const venue = event?.venue ?? "Hacker Dojo, Mountain View";
  const stages = [
    { label: "Draft", done: true },
    { label: "Announced", done: true, active: true },
    { label: "Registration open", done: false },
    { label: "Ready", done: false },
    { label: "Completed", done: false },
  ];
  const fields = [
    { label: "Date & time", value: `${date} · 5:00 PM`, status: "Confirmed" },
    { label: "Venue", value: venue, status: "Confirmed" },
    { label: "Speaker", value: "To be announced", status: "TBD" },
    { label: "Talk topic", value: "Topic coming soon", status: "TBD" },
    { label: "Agenda", value: "Networking and startup basics confirmed", status: "Partial" },
    { label: "Registration", value: "Website RSVP", status: "Ready" },
  ];
  const channels = [
    { name: "Website", status: "Current", tone: "good" },
    { name: "Luma", status: "Not connected", tone: "muted" },
    { name: "Eventbrite", status: "Draft", tone: "muted" },
    { name: "LinkedIn", status: "Update needed", tone: "warn" },
    { name: "WhatsApp", status: "Update needed", tone: "warn" },
    { name: "Email", status: "Not sent", tone: "muted" },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card p-5 md:p-6 shadow-sm">
        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3"><Badge>Announced</Badge><Badge variant="outline">Prototype</Badge><span className="text-xs text-muted-foreground">Updated 12 minutes ago</span></div>
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{date} · {venue}</p>
          </div>
          <div className="w-full xl:w-72 rounded-xl border bg-background/70 p-4">
            <div className="flex items-center justify-between"><span className="text-sm font-medium">Event completeness</span><span className="text-sm font-bold">67%</span></div>
            <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden"><div className="h-full w-2/3 rounded-full bg-primary" /></div>
            <p className="mt-2 text-xs text-muted-foreground">2 important details are still TBD.</p>
          </div>
        </div>
      </section>

      <Card className="shadow-sm">
        <CardHeader className="pb-3"><CardTitle className="text-lg">Event lifecycle</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {stages.map((stage, index) => (
              <div key={stage.label} className="relative text-center">
                {index < stages.length - 1 && <div className={`absolute left-1/2 top-4 h-0.5 w-full ${stage.done ? "bg-primary" : "bg-border"}`} />}
                <div className={`relative mx-auto h-8 w-8 rounded-full border-2 flex items-center justify-center ${stage.done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`}>
                  {stage.done ? <Check className="h-4 w-4" /> : <span className="text-xs">{index + 1}</span>}
                </div>
                <p className={`mt-2 text-[10px] sm:text-xs ${stage.active ? "font-semibold text-primary" : "text-muted-foreground"}`}>{stage.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className="grid xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 shadow-sm">
          <CardHeader className="pb-3 flex-row items-center justify-between"><div><CardTitle className="text-lg">Master event information</CardTitle><p className="text-xs text-muted-foreground mt-1">The current truth used by every channel.</p></div><Button variant="outline" size="sm" onClick={() => prototypeClick("Edit details")}><FileEdit className="h-4 w-4" /> Edit</Button></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-3">
            {fields.map((field) => (
              <div key={field.label} className="rounded-xl border bg-background/60 p-3">
                <div className="flex items-center justify-between gap-3"><p className="text-xs text-muted-foreground">{field.label}</p><Badge variant={field.status === "Confirmed" || field.status === "Ready" ? "secondary" : "outline"} className={field.status === "TBD" ? "border-amber-300 text-amber-700" : ""}>{field.status}</Badge></div>
                <p className="mt-2 text-sm font-medium">{field.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3"><CardTitle className="text-lg">Needs attention</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3"><div className="flex items-center gap-2 text-amber-800"><UserRound className="h-4 w-4" /><p className="text-sm font-medium">Speaker TBD</p></div><p className="mt-1 text-xs text-amber-700">Placeholder is public. Update when confirmed.</p></div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3"><div className="flex items-center gap-2 text-amber-800"><CircleDashed className="h-4 w-4" /><p className="text-sm font-medium">Talk topic TBD</p></div><p className="mt-1 text-xs text-amber-700">No blocker for the initial announcement.</p></div>
            <div className="rounded-xl border bg-muted/30 p-3"><div className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-muted-foreground" /><p className="text-sm font-medium">Reminder not scheduled</p></div><p className="mt-1 text-xs text-muted-foreground">Recommended: 7 days and 24 hours before.</p></div>
          </CardContent>
        </Card>
      </section>

      <section className="grid xl:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-3 flex-row items-center justify-between"><div><CardTitle className="text-lg">Channel status</CardTitle><p className="text-xs text-muted-foreground mt-1">Know what matches the master event.</p></div><Button variant="ghost" size="sm" onClick={() => prototypeClick("Refresh channels")}><RefreshCw className="h-4 w-4" /> Refresh</Button></CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-3">
            {channels.map((channel) => (
              <div key={channel.name} className="flex items-center justify-between rounded-lg border p-3"><div className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-muted-foreground" /><span className="text-sm font-medium">{channel.name}</span></div><Badge variant="outline" className={channel.tone === "good" ? "border-emerald-300 text-emerald-700" : channel.tone === "warn" ? "border-amber-300 text-amber-700" : ""}>{channel.status}</Badge></div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3"><CardTitle className="text-lg">Recent changes</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[{ icon: CalendarCheck, title: "Date and venue confirmed", note: "Website updated · 12 minutes ago" }, { icon: Megaphone, title: "Placeholder announcement prepared", note: "LinkedIn and WhatsApp need approval" }, { icon: Radio, title: "Registration remains closed", note: "Open it when the RSVP destination is ready" }].map((entry) => { const Icon = entry.icon; return <div key={entry.title} className="flex gap-3"><div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0"><Icon className="h-4 w-4" /></div><div><p className="text-sm font-medium">{entry.title}</p><p className="text-xs text-muted-foreground">{entry.note}</p></div></div>; })}
          </CardContent>
        </Card>
      </section>

      <section className="sticky bottom-4 z-20 rounded-xl border bg-card/95 backdrop-blur-xl p-3 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div><p className="text-sm font-medium">What do you want to do next?</p><p className="text-xs text-muted-foreground">No action runs automatically. Every external announcement remains approval-gated.</p></div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => prototypeClick("Save draft")}><FileEdit className="h-4 w-4" /> Save draft</Button>
          <Button variant="outline" onClick={() => prototypeClick("Publish placeholder")}><Globe2 className="h-4 w-4" /> Publish placeholder</Button>
          <Button variant="outline" onClick={() => prototypeClick("Open registration")}><Send className="h-4 w-4" /> Open registration</Button>
          <Button onClick={() => prototypeClick("Create announcement")}><Megaphone className="h-4 w-4" /> Create announcement <ArrowRight className="h-4 w-4" /></Button>
        </div>
      </section>
    </div>
  );
};

export default EventWorkflowPrototype;
