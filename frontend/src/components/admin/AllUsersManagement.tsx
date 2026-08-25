import { useEffect, useMemo, useState } from "react";
import { FileSpreadsheet, RefreshCw, Search, Upload, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import {
  ApiError,
  type AdminAllUser,
  type AllUsersImportResult,
  fetchAdminAllUsers,
  importAdminAllUsersCsv,
} from "@/lib/api";

const sourceLabel: Record<AllUsersImportResult["source"], string> = {
  luma_csv: "Luma attendees",
  lead_csv: "Lead list",
  other_csv: "Other contacts",
};

const AllUsersManagement = () => {
  const [contacts, setContacts] = useState<AdminAllUser[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState<AllUsersImportResult["source"]>("luma_csv");
  const [result, setResult] = useState<AllUsersImportResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [search, setSearch] = useState("");

  const loadContacts = async () => {
    setLoading(true);
    try {
      const response = await fetchAdminAllUsers();
      setContacts(response.data ?? []);
    } catch (error) {
      toast({
        title: "Could not load all users",
        description: error instanceof ApiError ? error.message : "Unknown error.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadContacts(); }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return contacts;
    return contacts.filter((contact) => [
      contact.full_name,
      contact.first_name,
      contact.last_name,
      contact.email,
      contact.company,
      contact.job_title,
    ].filter(Boolean).some((value) => String(value).toLowerCase().includes(query)));
  }, [contacts, search]);

  const importCsv = async () => {
    if (!file) return;
    setImporting(true);
    try {
      const response = await importAdminAllUsersCsv(file, source);
      setResult(response.data);
      setFile(null);
      const input = document.getElementById("all-users-csv") as HTMLInputElement | null;
      if (input) input.value = "";
      await loadContacts();
      toast({
        title: response.data.dedupe_verified && response.data.enrichment_status === "completed" ? "Import complete" : "Import needs attention",
        description: `${response.data.created_rows} added · ${response.data.updated_rows} updated · ${response.data.fields_enriched} fields enriched`,
      });
    } catch (error) {
      toast({
        title: "CSV import failed",
        description: error instanceof ApiError ? error.message : "Could not import this file.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl"><Upload className="h-5 w-5 text-primary" />Import users from CSV</CardTitle>
          <p className="text-sm text-muted-foreground">Every import must pass table-wide email deduplication and first-party data enrichment before it is marked complete.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)_auto] md:items-end">
            <div className="space-y-1.5">
              <label htmlFor="all-users-source" className="text-sm font-medium">Import as</label>
              <select id="all-users-source" value={source} onChange={(event) => setSource(event.target.value as AllUsersImportResult["source"])} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                {Object.entries(sourceLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="all-users-csv" className="text-sm font-medium">CSV file</label>
              <Input id="all-users-csv" type="file" accept=".csv,text/csv" onChange={(event) => { setFile(event.target.files?.[0] ?? null); setResult(null); }} />
            </div>
            <Button onClick={() => void importCsv()} disabled={!file || importing}>
              {importing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
              {importing ? "Deduplicating and enriching…" : "Deduplicate, enrich and import"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Required column: Email. Optional: Name, First Name, Last Name, Phone, Company and Job Title. Maximum file size: 5 MB.</p>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-primary/30">
          <CardHeader><CardTitle className="text-base">Import complete · {result.filename}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
              {[
                ["CSV rows", result.total_rows],
                ["Unique emails", result.valid_unique_rows],
                ["Added", result.created_rows],
                ["Updated", result.updated_rows],
                ["Duplicates skipped", result.duplicate_rows],
                ["Invalid skipped", result.invalid_rows],
              ].map(([label, value]) => <div key={String(label)} className="rounded-lg bg-muted/40 p-3"><p className="text-xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>)}
            </div>
            <p className="mt-4 text-sm font-medium">Total people in All Users: {result.total_all_users}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant={result.dedupe_verified ? "default" : "destructive"}>{result.dedupe_verified ? "Deduplication verified" : "Deduplication failed"}</Badge>
              <Badge variant={result.enrichment_status === "completed" ? "default" : "destructive"}>Enrichment complete</Badge>
              <Badge variant="outline">{result.enrichment_matches} internal matches</Badge>
              <Badge variant="outline">{result.fields_enriched} missing fields filled</Badge>
            </div>
            {result.invalid_examples.length > 0 && <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs"><p className="font-semibold">Invalid rows were not imported</p>{result.invalid_examples.map((item) => <p key={`${item.row}-${item.email}`} className="mt-1 break-all">Row {item.row}: {item.email || "No email"}</p>)}</div>}
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search all users…" className="pl-9" /></div>
        <div className="flex items-center gap-2"><Badge variant="outline">{contacts.length} unique people</Badge><Button variant="outline" size="sm" onClick={() => void loadContacts()} disabled={loading}>{loading ? "Refreshing…" : "Refresh"}</Button></div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40"><TableHead>Person</TableHead><TableHead>Company / role</TableHead><TableHead>Sources</TableHead><TableHead>Enrichment</TableHead><TableHead>Last updated</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.length === 0 ? <TableRow><TableCell colSpan={5} className="py-16 text-center text-muted-foreground"><Users className="mx-auto mb-2 h-8 w-8 opacity-40" /><p>{loading ? "Loading…" : "No users found."}</p></TableCell></TableRow> : filtered.map((contact) => {
              const name = contact.full_name || [contact.first_name, contact.last_name].filter(Boolean).join(" ") || "Name not provided";
              return <TableRow key={contact.id}><TableCell className="max-w-72 whitespace-normal"><p className="font-medium break-words">{name}</p><a href={`mailto:${contact.email}`} className="break-all text-xs text-primary hover:underline">{contact.email}</a>{contact.linkedin_url && <a href={contact.linkedin_url} target="_blank" rel="noreferrer" className="mt-1 block text-xs text-primary hover:underline">LinkedIn</a>}</TableCell><TableCell className="max-w-64 whitespace-normal break-words"><p>{contact.company || "—"}</p>{contact.job_title && <p className="text-xs text-muted-foreground">{contact.job_title}</p>}</TableCell><TableCell><div className="flex max-w-72 flex-wrap gap-1">{contact.is_member && <Badge>Member</Badge>}{contact.is_website_registrant && <Badge variant="secondary">Website RSVP</Badge>}{contact.is_luma_attendee && <Badge variant="outline">Luma</Badge>}{contact.is_lead && <Badge variant="outline">Lead</Badge>}{!contact.is_member && !contact.is_website_registrant && !contact.is_luma_attendee && !contact.is_lead && <Badge variant="outline">Other</Badge>}</div></TableCell><TableCell><Badge variant={contact.enrichment_status === "completed" ? "secondary" : "outline"}>{contact.enrichment_status === "completed" ? "Complete" : "Pending"}</Badge>{contact.enrichment_sources.length > 0 && <p className="mt-1 max-w-48 text-xs text-muted-foreground">{contact.enrichment_sources.join(", ").replaceAll("_", " ")}</p>}</TableCell><TableCell className="text-sm text-muted-foreground">{new Date(contact.updated_at).toLocaleDateString()}</TableCell></TableRow>;
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AllUsersManagement;
