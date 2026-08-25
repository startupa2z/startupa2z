import { useEffect, useMemo, useState } from "react";
import {
  ApiError,
  fetchInvitationAudiencePreview,
  type AdminEvent,
  type InvitationAudiencePreview as PreviewData,
} from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, Loader2, ShieldCheck, Users } from "lucide-react";

const InvitationAudiencePreview = ({ events }: { events: AdminEvent[] }) => {
  const defaultSlug = useMemo(() => {
    const august25 = events.find((event) => event.slug === "founders-pitch-mix-2026-08-25")
      ?? events.find((event) => event.date.toLowerCase().includes("august 25"));
    return august25?.slug ?? events[0]?.slug ?? "founders-pitch-mix-2026-08-25";
  }, [events]);
  const [eventSlug, setEventSlug] = useState(defaultSlug);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setEventSlug(defaultSlug), [defaultSlug]);

  const loadPreview = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchInvitationAudiencePreview(eventSlug);
      setPreview(response.data);
    } catch (err) {
      setPreview(null);
      setError(err instanceof ApiError ? err.message : "Could not calculate the audience.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden border-violet-200 shadow-sm">
      <CardHeader className="bg-violet-50/60">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-violet-700 hover:bg-violet-700">Step 1 · Audience preview</Badge>
              <Badge variant="outline">Local database</Badge>
              <Badge variant="outline">Read only</Badge>
            </div>
            <CardTitle className="mt-3 text-xl">Who would receive the invitation?</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Counts only. No addresses are displayed, queued, exported, or sent.</p>
          </div>
          <ShieldCheck className="h-7 w-7 text-violet-700" />
        </div>
      </CardHeader>
      <CardContent className="space-y-5 p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={eventSlug}
            onChange={(event) => { setEventSlug(event.target.value); setPreview(null); }}
            className="h-10 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm"
          >
            {events.length === 0 && <option value={eventSlug}>August 25 event</option>}
            {events.map((event) => <option key={event.id} value={event.slug}>{event.date} · {event.title}</option>)}
          </select>
          <Button onClick={loadPreview} disabled={loading || !eventSlug}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
            Calculate audience
          </Button>
        </div>

        {error && <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</div>}

        {preview && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Unique contacts", preview.counts.unique_contacts],
                ["Duplicates removed", preview.counts.duplicates_removed],
                ["Already registered", preview.counts.already_registered],
                ["Eligible before suppression", preview.counts.eligible_before_suppression],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border bg-card p-4">
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              <div className="rounded-xl border p-4 text-sm">
                <p className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-4 w-4 text-emerald-600" />Applied exclusions</p>
                <dl className="mt-3 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-muted-foreground">
                  <dt>Invalid email addresses</dt><dd>{preview.counts.invalid_email}</dd>
                  <dt>Admin, internal, or test addresses</dt><dd>{preview.counts.internal_or_test}</dd>
                  <dt>Registered for this event</dt><dd>{preview.counts.already_registered}</dd>
                </dl>
              </div>
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
                <p className="flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4" />Not ready to send</p>
                <p className="mt-2">{preview.suppression.reason}</p>
                <p className="mt-2 font-medium">A provider and final approval are also required. This screen has no send capability.</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default InvitationAudiencePreview;
