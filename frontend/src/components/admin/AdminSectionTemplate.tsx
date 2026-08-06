import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Cable, CircleDashed, FileText, Megaphone, Share2 } from "lucide-react";
import type { AdminSection } from "./AdminSidebar";

const templates: Partial<Record<AdminSection, { title: string; description: string; items: { title: string; note: string }[] }>> = {
  founders: { title: "Speakers", description: "Maintain the people who pitch, teach, mentor, and appear at events.", items: [
    { title: "Speaker profiles", note: "Bio, company, topic and LinkedIn" }, { title: "Speaker pipeline", note: "Invited, confirmed and completed" }, { title: "Session history", note: "Events, topics and feedback" },
  ] },
  startups: { title: "Startups", description: "Build the StartupA2Z.org company directory and connect each startup to its founders.", items: [
    { title: "Company profiles", note: "Industry, stage, location and website" }, { title: "Founder ownership", note: "Link people to companies" }, { title: "Visibility controls", note: "Draft, reviewed and published" },
  ] },
  announcements: { title: "Announcements", description: "Create one announcement and adapt it for the channels that should receive it.", items: [
    { title: "Event announcement", note: "Website, email, LinkedIn and WhatsApp" }, { title: "Speaker announcement", note: "LinkedIn and Instagram" }, { title: "Registration reminder", note: "Email and WhatsApp" },
  ] },
  posts: { title: "Posts", description: "Draft, review, approve, schedule, and track social content from one queue.", items: [
    { title: "LinkedIn", note: "Professional story and event updates" }, { title: "X", note: "Short updates and live event notes" }, { title: "Instagram", note: "Visual posts, stories and speaker cards" },
  ] },
  social: { title: "Social media", description: "See account readiness, publishing status, and the content calendar across platforms.", items: [
    { title: "Account health", note: "LinkedIn, X and Instagram connections" }, { title: "Publishing calendar", note: "Approved and scheduled posts" }, { title: "Performance", note: "Reach, clicks and registrations" },
  ] },
  connectors: { title: "Connectors", description: "Connect external tools once, then reuse them for events, announcements, and posts.", items: [
    { title: "Event platforms", note: "Luma and Eventbrite" }, { title: "Social platforms", note: "LinkedIn, X and Instagram" }, { title: "Community & email", note: "WhatsApp and Resend" },
  ] },
  analytics: { title: "Analytics", description: "Understand turnout, registrations, engagement, and which channels drive results.", items: [
    { title: "Event performance", note: "Registrations, attendance and turnout rate" }, { title: "Audience growth", note: "Members, founders and startups" }, { title: "Channel attribution", note: "Where registrations came from" },
  ] },
  settings: { title: "Settings", description: "Control admin access, defaults, branding, and community preferences.", items: [
    { title: "Admin users", note: "Roles and permissions" }, { title: "Organization", note: "Brand, sender and contact details" }, { title: "Defaults", note: "Timezone, event and publishing settings" },
  ] },
};

const iconFor = (section: AdminSection) => section === "announcements" ? Megaphone : section === "posts" ? FileText : section === "social" ? Share2 : section === "connectors" ? Cable : CircleDashed;

const AdminSectionTemplate = ({ section }: { section: AdminSection }) => {
  const template = templates[section];
  if (!template) return null;
  const Icon = iconFor(section);
  return (
    <div className="space-y-6">
      <div><div className="flex items-center gap-2"><h2 className="text-2xl font-bold tracking-tight">{template.title}</h2><Badge variant="outline">Template</Badge></div><p className="mt-1 text-sm text-muted-foreground max-w-2xl">{template.description}</p></div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {template.items.map((item) => (
          <Card key={item.title} className="shadow-sm hover:border-primary/30 transition-colors">
            <CardHeader className="pb-3"><div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3"><Icon className="h-4 w-4" /></div><CardTitle className="text-base">{item.title}</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground min-h-10">{item.note}</p><Button variant="ghost" size="sm" className="mt-4 px-0 text-muted-foreground" disabled>Coming later <ArrowRight className="h-4 w-4" /></Button></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminSectionTemplate;
