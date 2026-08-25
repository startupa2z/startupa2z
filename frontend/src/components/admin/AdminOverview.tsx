import type { AdminEvent } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  CalendarDays,
  Cable,
  FileText,
  Megaphone,
  Users,
} from "lucide-react";
import type { AdminSection } from "./AdminSidebar";

const channelNames = ["Luma", "Eventbrite", "LinkedIn", "X", "Instagram", "WhatsApp"];

const AdminOverview = ({
  submissions,
  events,
  rsvps,
  onNavigate,
}: {
  submissions: number;
  events: AdminEvent[];
  rsvps: number;
  onNavigate: (section: AdminSection) => void;
}) => {
  const upcoming = events[0];
  const stats = [
    { label: "Enquiries", value: submissions, icon: Users, section: "submissions" as const },
    { label: "Events", value: events.length, icon: CalendarDays, section: "event-management" as const },
    { label: "Event attendees", value: rsvps, icon: FileText, section: "event-management" as const },
    { label: "Connected channels", value: 0, suffix: `/${channelNames.length}`, icon: Cable, section: "connectors" as const },
  ];

  return (
    <div className="space-y-6">
      <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <button key={stat.label} type="button" onClick={() => onNavigate(stat.section)} className="text-left rounded-xl border bg-card p-4 shadow-sm hover:border-primary/40 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Icon className="h-4 w-4" /></div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-4 text-2xl font-bold">{stat.value}{stat.suffix}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </button>
          );
        })}
      </section>

      <section className="grid xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 shadow-sm">
          <CardHeader className="pb-3"><CardTitle className="text-lg">Quick actions</CardTitle></CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-3">
            {[
              { label: "All events", note: "Open the calendar portfolio overview", icon: CalendarDays, section: "event-management" as const },
              { label: "New announcement", note: "Email, LinkedIn or WhatsApp", icon: Megaphone, section: "announcements" as const },
              { label: "Draft a post", note: "LinkedIn, X or Instagram", icon: FileText, section: "posts" as const },
              { label: "Add a connector", note: "Connect publishing channels", icon: Cable, section: "connectors" as const },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button key={action.label} type="button" onClick={() => onNavigate(action.section)} className="flex items-center gap-3 rounded-xl border bg-background/60 p-4 text-left hover:border-primary/40 transition-colors">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-muted flex items-center justify-center"><Icon className="h-4 w-4" /></div>
                  <div className="min-w-0"><p className="text-sm font-medium">{action.label}</p><p className="text-xs text-muted-foreground whitespace-normal break-words">{action.note}</p></div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3"><CardTitle className="text-lg">Next event</CardTitle></CardHeader>
          <CardContent>
            {upcoming ? (
              <div className="space-y-3">
                <Badge variant="secondary">Upcoming</Badge>
                <div><p className="font-semibold leading-snug">{upcoming.title}</p><p className="text-sm text-muted-foreground mt-1">{upcoming.date} · {upcoming.venue}</p></div>
                <Button variant="outline" size="sm" onClick={() => onNavigate("event-management")}>View all events <ArrowRight className="h-4 w-4" /></Button>
              </div>
            ) : <p className="text-sm text-muted-foreground">No upcoming event yet.</p>}
          </CardContent>
        </Card>
      </section>

      <section className="grid xl:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-3 flex-row items-center justify-between"><CardTitle className="text-lg">Content queue</CardTitle><Badge variant="outline">Template</Badge></CardHeader>
          <CardContent className="space-y-3">
            {["Event announcement", "Speaker introduction", "Registration reminder"].map((item, index) => (
              <div key={item} className="flex items-center justify-between rounded-lg border p-3"><div><p className="text-sm font-medium">{item}</p><p className="text-xs text-muted-foreground">{index === 0 ? "LinkedIn + Email" : index === 1 ? "LinkedIn + Instagram" : "Email + WhatsApp"}</p></div><Badge variant="secondary">Draft</Badge></div>
            ))}
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-3 flex-row items-center justify-between"><CardTitle className="text-lg">Channel readiness</CardTitle><button type="button" onClick={() => onNavigate("connectors")} className="text-xs text-primary hover:underline">Manage</button></CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {channelNames.map((name) => <div key={name} className="rounded-lg border p-3"><p className="text-sm font-medium">{name}</p><p className="mt-1 text-xs text-muted-foreground">Not connected</p></div>)}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AdminOverview;
