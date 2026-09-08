import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clipboard, History, Loader2, RotateCcw, Save, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  ApiError,
  fetchEventOperationsPlaybook,
  updateEventOperationsPlaybook,
  type AdminPlaybook,
} from "@/lib/api";

const EventOperationsPlaybook = () => {
  const [playbook, setPlaybook] = useState<AdminPlaybook | null>(null);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const dirty = Boolean(playbook && draft !== playbook.content);
  const characterCount = useMemo(() => draft.length.toLocaleString(), [draft.length]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await fetchEventOperationsPlaybook();
        setPlaybook(data);
        setDraft(data.content);
      } catch (error) {
        toast({
          title: "Could not load event playbook",
          description: error instanceof ApiError ? error.message : "Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const save = async () => {
    if (!dirty || saving) return;
    setSaving(true);
    try {
      const { data } = await updateEventOperationsPlaybook(draft);
      setPlaybook(data);
      setDraft(data.content);
      toast({ title: `Playbook revision ${data.revision} saved` });
    } catch (error) {
      toast({
        title: "Could not save playbook",
        description: error instanceof ApiError ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(draft);
      toast({ title: "Prompt copied" });
    } catch {
      toast({ title: "Could not copy prompt", variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="flex min-h-64 items-center justify-center gap-2 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /> Loading event playbook…</div>;
  }

  if (!playbook) {
    return <Card><CardContent className="py-12 text-center text-muted-foreground">The event playbook is unavailable. Restart the local backend and try again.</CardContent></Card>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 shadow-sm">
        <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-xl">{playbook.title}</CardTitle>
              <Badge variant="secondary">Revision {playbook.revision}</Badge>
              {dirty ? <Badge variant="outline">Unsaved changes</Badge> : <Badge className="gap-1"><CheckCircle2 className="h-3 w-3" /> Saved</Badge>}
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              This is the editable operating memory for event work. Saving creates a new revision; it never publishes, deploys, or sends anything.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={copyPrompt}><Clipboard className="h-4 w-4" /> Copy</Button>
            <Button type="button" variant="outline" onClick={() => setDraft(playbook.content)} disabled={!dirty}><RotateCcw className="h-4 w-4" /> Discard</Button>
            <Button type="button" onClick={save} disabled={!dirty || saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save revision
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <label htmlFor="event-operations-prompt" className="mb-2 block text-sm font-semibold">Operating prompt</label>
          <Textarea
            id="event-operations-prompt"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="min-h-[620px] resize-y font-mono text-[13px] leading-6"
            spellCheck={false}
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>{characterCount} characters</span>
            <span>Last saved {new Date(playbook.updated_at).toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.45fr)]">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><History className="h-4 w-4 text-primary" /> Version history</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {playbook.revisions.map((revision) => (
              <div key={revision.revision} className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2"><span className="font-semibold">Revision {revision.revision}</span>{revision.revision === playbook.revision && <Badge variant="secondary">Current</Badge>}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{new Date(revision.created_at).toLocaleString()} · {revision.content.length.toLocaleString()} characters</p>
                </div>
                <Button type="button" size="sm" variant="outline" onClick={() => setDraft(revision.content)} disabled={draft === revision.content}>Load into editor</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="h-fit bg-primary text-primary-foreground">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-4 w-4 text-secondary" /> Built-in boundaries</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm leading-6 text-primary-foreground/80">
              <li>Local drafting and revision history are safe to iterate.</li>
              <li>Luma edits, attendee messages, social posts, and deployment require explicit approval.</li>
              <li>Production event and member data remain authoritative.</li>
              <li>Never place credentials or attendee personal data in this prompt.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventOperationsPlaybook;
