import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ApiError,
  type AdminEvent,
  type ContentItemStatus,
  type ContentItemType,
  type EventChannel,
  type EventContentItem,
  type EventPublishingWorkspace,
  type PublishingChannelName,
  type PublishingChannelStatus,
  createEventContent,
  deleteEventContent,
  fetchEventPublishing,
  generateEventContent,
  updateEventChannel,
  updateEventContent,
} from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { CalendarClock, ExternalLink, Loader2, Send, Sparkles, Trash2 } from "lucide-react";

const CHANNELS: { key: PublishingChannelName; label: string }[] = [
  { key: "website", label: "Website" },
  { key: "luma", label: "Luma" },
  { key: "eventbrite", label: "Eventbrite" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "x", label: "X" },
];

const CHANNEL_STATUSES: PublishingChannelStatus[] = [
  "not_connected",
  "draft",
  "ready",
  "scheduled",
  "published",
  "failed",
];

const CONTENT_STATUSES: ContentItemStatus[] = ["draft", "in_review", "approved", "scheduled", "published"];

const statusLabel = (value: string) => value.replaceAll("_", " ");

const statusClass = (status: string) => {
  if (status === "published" || status === "approved") return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
  if (status === "failed") return "bg-destructive/10 text-destructive hover:bg-destructive/10";
  if (status === "scheduled" || status === "ready") return "bg-blue-100 text-blue-800 hover:bg-blue-100";
  return "bg-muted text-muted-foreground hover:bg-muted";
};

const ChannelCard = ({
  eventId,
  channel,
  onSaved,
}: {
  eventId: string;
  channel: EventChannel | null;
  onSaved: () => void;
}) => {
  const channelName = channel?.channel ?? "luma";
  const [status, setStatus] = useState<PublishingChannelStatus>(channel?.status ?? "not_connected");
  const [url, setUrl] = useState(channel?.external_url ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStatus(channel?.status ?? "not_connected");
    setUrl(channel?.external_url ?? "");
  }, [channel]);

  const save = async () => {
    setSaving(true);
    try {
      await updateEventChannel(eventId, { channel: channelName, status, external_url: url.trim() || null });
      toast({ title: `${CHANNELS.find((item) => item.key === channelName)?.label} updated` });
      onSaved();
    } catch (error) {
      toast({
        title: "Could not update channel",
        description: error instanceof ApiError ? error.message : "Unknown error.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">{CHANNELS.find((item) => item.key === channelName)?.label}</CardTitle>
          <Badge className={statusClass(status)}>{statusLabel(status)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as PublishingChannelStatus)}
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          {CHANNEL_STATUSES.map((value) => <option key={value} value={value}>{statusLabel(value)}</option>)}
        </select>
        <Input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="External event URL" />
        <div className="flex gap-2">
          <Button size="sm" onClick={save} disabled={saving} className="flex-1">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
          </Button>
          {url && (
            <Button size="icon" variant="outline" className="h-9 w-9" asChild>
              <a href={url} target="_blank" rel="noreferrer" aria-label="Open external event"><ExternalLink className="h-4 w-4" /></a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const PublishingWorkspace = ({ events }: { events: AdminEvent[] }) => {
  const [eventId, setEventId] = useState(events[0]?.id ?? "");
  const [workspace, setWorkspace] = useState<EventPublishingWorkspace | null>(null);
  const [loading, setLoading] = useState(false);
  const [channel, setChannel] = useState<PublishingChannelName>("linkedin");
  const [contentType, setContentType] = useState<ContentItemType>("announcement");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<ContentItemStatus>("draft");
  const [schedule, setSchedule] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!eventId && events[0]?.id) setEventId(events[0].id);
  }, [eventId, events]);

  const load = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const { data } = await fetchEventPublishing(eventId);
      setWorkspace(data);
    } catch (error) {
      toast({
        title: "Could not load publishing workspace",
        description: error instanceof ApiError ? error.message : "Unknown error.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => { load(); }, [load]);

  const channelMap = useMemo(() => {
    const map = new Map<PublishingChannelName, EventChannel>();
    workspace?.channels.forEach((item) => map.set(item.channel, item));
    return map;
  }, [workspace]);

  const scheduledItems = useMemo(
    () => (workspace?.content ?? [])
      .filter((item) => item.scheduled_at)
      .sort((a, b) => new Date(a.scheduled_at!).getTime() - new Date(b.scheduled_at!).getTime()),
    [workspace],
  );

  const generate = async () => {
    if (!eventId) return;
    setGenerating(true);
    try {
      const { data } = await generateEventContent(eventId, { channel, content_type: contentType });
      setTitle(data.title);
      setBody(data.body);
      toast({ title: "Draft generated", description: "Review and edit it before approval." });
    } catch (error) {
      toast({ title: "Could not generate draft", description: error instanceof ApiError ? error.message : "Unknown error.", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const create = async () => {
    if (!eventId || !body.trim()) return;
    if ((status === "scheduled" || schedule) && !schedule) {
      toast({ title: "Choose a schedule time", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await createEventContent({
        event_id: eventId,
        channel,
        content_type: contentType,
        title: title.trim(),
        body: body.trim(),
        status,
        scheduled_at: schedule ? new Date(schedule).toISOString() : null,
      });
      setTitle(""); setBody(""); setStatus("draft"); setSchedule("");
      toast({ title: "Content saved" });
      load();
    } catch (error) {
      toast({ title: "Could not save content", description: error instanceof ApiError ? error.message : "Unknown error.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const changeContentStatus = async (item: EventContentItem, nextStatus: ContentItemStatus) => {
    if (nextStatus === "scheduled" && !item.scheduled_at) {
      toast({ title: "Add a schedule before marking this item scheduled.", variant: "destructive" });
      return;
    }
    try {
      await updateEventContent(item.id, { status: nextStatus });
      load();
    } catch (error) {
      toast({ title: "Could not update content", description: error instanceof ApiError ? error.message : "Unknown error.", variant: "destructive" });
    }
  };

  const removeContent = async (id: string) => {
    if (!confirm("Delete this content draft?")) return;
    try { await deleteEventContent(id); load(); } catch (error) {
      toast({ title: "Could not delete content", description: error instanceof ApiError ? error.message : "Unknown error.", variant: "destructive" });
    }
  };

  if (events.length === 0) return <p className="text-sm text-muted-foreground">Create an event before setting up publishing.</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end gap-3">
        <div className="space-y-1.5 flex-1 max-w-xl">
          <Label>Master event</Label>
          <select value={eventId} onChange={(event) => setEventId(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
            {events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}
          </select>
        </div>
        <Button variant="outline" onClick={load} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}</Button>
      </div>

      {workspace && (
        <Tabs defaultValue="workflow" className="space-y-5">
          <TabsList>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="calendar">Calendar ({scheduledItems.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="workflow" className="space-y-6">
            <section className="space-y-3">
              <div>
                <h2 className="text-lg font-semibold">Publishing channels</h2>
                <p className="text-sm text-muted-foreground">Website is live. External channels stay approval-gated until connected.</p>
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-3">
                {CHANNELS.map((item) => (
                  <ChannelCard
                    key={item.key}
                    eventId={eventId}
                    channel={channelMap.get(item.key) ?? ({ channel: item.key } as EventChannel)}
                    onSaved={load}
                  />
                ))}
              </div>
            </section>

            <section className="grid xl:grid-cols-5 gap-5">
              <Card className="xl:col-span-2 shadow-sm">
                <CardHeader><CardTitle className="text-lg">Create content</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5"><Label>Channel</Label><select value={channel} onChange={(event) => setChannel(event.target.value as PublishingChannelName)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">{CHANNELS.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select></div>
                    <div className="space-y-1.5"><Label>Type</Label><select value={contentType} onChange={(event) => setContentType(event.target.value as ContentItemType)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="announcement">Announcement</option><option value="reminder">Reminder</option><option value="follow_up">Follow-up</option></select></div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={generate} disabled={generating}>{generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate platform draft</Button>
                  <div className="space-y-1.5"><Label>Title</Label><Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Content title" /></div>
                  <div className="space-y-1.5"><Label>Post copy</Label><Textarea value={body} onChange={(event) => setBody(event.target.value)} rows={9} placeholder="Generate a draft or write your own." /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5"><Label>Status</Label><select value={status} onChange={(event) => setStatus(event.target.value as ContentItemStatus)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">{CONTENT_STATUSES.map((value) => <option key={value} value={value}>{statusLabel(value)}</option>)}</select></div>
                    <div className="space-y-1.5"><Label>Schedule</Label><Input type="datetime-local" value={schedule} onChange={(event) => setSchedule(event.target.value)} /></div>
                  </div>
                  <Button className="w-full" onClick={create} disabled={saving || !body.trim()}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Save to library</Button>
                </CardContent>
              </Card>

              <Card className="xl:col-span-3 shadow-sm">
                <CardHeader><CardTitle className="text-lg">Content library</CardTitle></CardHeader>
                <CardContent>
                  {workspace.content.length === 0 ? (
                    <div className="py-16 text-center text-sm text-muted-foreground">No content yet. Generate the first announcement.</div>
                  ) : (
                    <ul className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
                      {workspace.content.map((item) => (
                        <li key={item.id} className="rounded-xl border bg-background/60 p-4 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div><div className="flex flex-wrap gap-2"><Badge variant="outline">{item.channel}</Badge><Badge variant="secondary">{statusLabel(item.content_type)}</Badge><Badge className={statusClass(item.status)}>{statusLabel(item.status)}</Badge></div><p className="font-medium mt-2">{item.title || workspace.event.title}</p></div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeContent(item.id)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-5">{item.body}</p>
                          {item.scheduled_at && <p className="text-xs flex items-center gap-1 text-muted-foreground"><CalendarClock className="h-3.5 w-3.5" /> {new Date(item.scheduled_at).toLocaleString()}</p>}
                          <div className="flex items-center gap-2">
                            <Label className="text-xs">Move to</Label>
                            <select value={item.status} onChange={(event) => changeContentStatus(item, event.target.value as ContentItemStatus)} className="h-8 rounded-md border border-input bg-background px-2 text-xs">{CONTENT_STATUSES.map((value) => <option key={value} value={value}>{statusLabel(value)}</option>)}</select>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          <TabsContent value="calendar">
            <Card className="shadow-sm">
              <CardHeader><CardTitle className="text-lg">Scheduled content</CardTitle></CardHeader>
              <CardContent>
                {scheduledItems.length === 0 ? <p className="py-12 text-center text-sm text-muted-foreground">Nothing scheduled yet.</p> : (
                  <div className="divide-y">{scheduledItems.map((item) => <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5"><div className="sm:w-52 text-sm font-medium">{new Date(item.scheduled_at!).toLocaleString()}</div><div className="flex-1"><p className="text-sm font-medium">{item.title || workspace.event.title}</p><p className="text-xs text-muted-foreground capitalize">{item.channel} · {statusLabel(item.content_type)}</p></div><Badge className={statusClass(item.status)}>{statusLabel(item.status)}</Badge></div>)}</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default PublishingWorkspace;
