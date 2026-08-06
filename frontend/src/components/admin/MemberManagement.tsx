import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import {
  ApiError,
  type AdminMember,
  type AdminMemberSession,
  deleteAdminMember,
  fetchAdminMemberSessions,
  fetchAdminMembers,
  updateAdminMember,
} from "@/lib/api";
import { CalendarCheck, Pencil, Search, Trash2, Users } from "lucide-react";

const memberSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  full_name: z.string().trim().max(120, "Name is too long"),
  organization: z.string().trim().max(160, "Organization is too long"),
});

type MemberForm = z.infer<typeof memberSchema>;

const MemberManagement = () => {
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<AdminMember | null>(null);
  const [form, setForm] = useState<MemberForm>({ email: "", full_name: "", organization: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [historyMember, setHistoryMember] = useState<AdminMember | null>(null);
  const [sessions, setSessions] = useState<AdminMemberSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const { data } = await fetchAdminMembers();
      setMembers(data ?? []);
    } catch (err) {
      toast({ title: "Could not load members", description: err instanceof ApiError ? err.message : "Unknown error.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadMembers(); }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return members;
    return members.filter((member) => [member.full_name, member.email, member.organization]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query)));
  }, [members, search]);

  const openEdit = (member: AdminMember) => {
    setEditing(member);
    setForm({ email: member.email, full_name: member.full_name ?? "", organization: member.organization ?? "" });
    setError("");
  };

  const closeEdit = () => {
    setEditing(null);
    setError("");
  };

  const saveMember = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    const result = memberSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Check the member details.");
      return;
    }
    setSaving(true);
    try {
      const { data } = await updateAdminMember(editing.id, {
        email: result.data.email,
        full_name: result.data.full_name || null,
        organization: result.data.organization || null,
      });
      setMembers((current) => current.map((member) => member.id === data.id ? data : member));
      closeEdit();
      toast({ title: "Member updated" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update this member.");
    } finally {
      setSaving(false);
    }
  };

  const removeMember = async (member: AdminMember) => {
    const displayName = member.full_name || member.email;
    if (!confirm(`Delete member "${displayName}"? Their account access will be removed. Event history will remain.`)) return;
    try {
      await deleteAdminMember(member.id);
      setMembers((current) => current.filter((item) => item.id !== member.id));
      toast({ title: "Member deleted", description: `${displayName} can no longer sign in.` });
    } catch (err) {
      toast({ title: "Could not delete member", description: err instanceof ApiError ? err.message : "Unknown error.", variant: "destructive" });
    }
  };

  const openHistory = async (member: AdminMember) => {
    setHistoryMember(member);
    setSessions([]);
    setSessionsLoading(true);
    try {
      const { data } = await fetchAdminMemberSessions(member.id);
      setSessions(data ?? []);
    } catch (err) {
      toast({ title: "Could not load attendance history", description: err instanceof ApiError ? err.message : "Unknown error.", variant: "destructive" });
    } finally {
      setSessionsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search members…" className="pl-9" />
        </div>
        <div className="flex items-center gap-2"><Badge variant="outline">{members.length} members</Badge><Button variant="outline" size="sm" onClick={() => void loadMembers()} disabled={loading}>{loading ? "Refreshing…" : "Refresh"}</Button></div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40"><TableHead>Member</TableHead><TableHead>Organization</TableHead><TableHead>Sign-in</TableHead><TableHead>Sessions</TableHead><TableHead>Joined</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.length === 0 ? <TableRow><TableCell colSpan={6} className="py-16 text-center text-muted-foreground"><Users className="mx-auto mb-2 h-8 w-8 opacity-40" /><p>{loading ? "Loading…" : "No members found."}</p></TableCell></TableRow> : filtered.map((member) => (
              <TableRow key={member.id}>
                <TableCell><p className="font-medium">{member.full_name || "Name not provided"}</p><a href={`mailto:${member.email}`} className="text-xs text-primary hover:underline">{member.email}</a></TableCell>
                <TableCell>{member.organization || <span className="text-muted-foreground">—</span>}</TableCell>
                <TableCell><Badge variant="secondary">{member.linkedin_id ? "LinkedIn" : "Email"}</Badge></TableCell>
                <TableCell><p className="text-sm">{member.attended_sessions > 0 ? `${member.attended_sessions} attended` : "Has not attended any sessions"}</p><p className="text-xs text-muted-foreground">{member.registered_sessions} registered</p></TableCell>
                <TableCell className="text-sm text-muted-foreground">{new Date(member.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="whitespace-nowrap text-right"><Button variant="outline" size="sm" className="mr-1 h-8" onClick={() => void openHistory(member)}><CalendarCheck className="h-3.5 w-3.5" /> History</Button><Button variant="ghost" size="icon" onClick={() => openEdit(member)} aria-label={`Edit ${member.full_name || member.email}`}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="text-destructive" onClick={() => void removeMember(member)} aria-label={`Delete ${member.full_name || member.email}`}><Trash2 className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={Boolean(editing)} onOpenChange={(open) => { if (!open) closeEdit(); }}>
        <DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle>Edit member</DialogTitle><DialogDescription>Update the details shown in the member account.</DialogDescription></DialogHeader><form onSubmit={saveMember} className="space-y-4"><div className="space-y-1.5"><Label htmlFor="member-name">Full name</Label><Input id="member-name" value={form.full_name} onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))} /></div><div className="space-y-1.5"><Label htmlFor="member-email">Email</Label><Input id="member-email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} /></div><div className="space-y-1.5"><Label htmlFor="member-organization">Organization</Label><Input id="member-organization" value={form.organization} onChange={(event) => setForm((current) => ({ ...current, organization: event.target.value }))} /></div>{error && <p className="text-sm text-destructive">{error}</p>}<DialogFooter><Button type="button" variant="outline" onClick={closeEdit}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button></DialogFooter></form></DialogContent>
      </Dialog>

      <Dialog open={Boolean(historyMember)} onOpenChange={(open) => { if (!open) setHistoryMember(null); }}>
        <DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle>{historyMember?.full_name || historyMember?.email}</DialogTitle><DialogDescription>Registration and attendance history for this member.</DialogDescription></DialogHeader><div className="max-h-[55vh] space-y-2 overflow-y-auto">{sessionsLoading ? <p className="py-8 text-center text-sm text-muted-foreground">Loading history…</p> : sessions.length === 0 ? <div className="py-8 text-center text-muted-foreground"><CalendarCheck className="mx-auto mb-2 h-8 w-8 opacity-40" /><p className="text-sm">Not registered for any sessions.</p></div> : sessions.map((session) => <div key={session.id} className="flex items-center justify-between gap-3 rounded-lg border p-3"><div><p className="text-sm font-medium">{session.event_title}</p><p className="mt-1 text-xs text-muted-foreground">Registered {new Date(session.created_at).toLocaleDateString()}</p></div><Badge variant={session.attended ? "default" : "outline"}>{session.attended ? "Attended" : "Not checked in"}</Badge></div>)}</div></DialogContent>
      </Dialog>
    </div>
  );
};

export default MemberManagement;
