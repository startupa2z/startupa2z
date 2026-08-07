import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  ApiError,
  type AdminBusiness,
  type BusinessMedia,
  deleteAdminBusiness,
  fetchAdminBusinesses,
  uploadBusinessImage,
  updateAdminBusiness,
} from "@/lib/api";
import { Building2, ExternalLink, Eye, EyeOff, ImagePlus, Pencil, Search, Trash2, Video } from "lucide-react";

const stages = ["Pre-Seed", "Seed", "Series A", "Series B", "Growth", "Other"];
const categories = ["SaaS", "Fintech", "Healthtech", "Greentech", "Deep Tech", "Cybersecurity", "AI", "Other"];

const editSchema = z.object({
  name: z.string().trim().min(2, "Enter the business name").max(120),
  pitch: z.string().trim().min(20, "Pitch must be at least 20 characters").max(280),
  stage: z.string().min(1, "Select a stage"),
  location: z.string().trim().min(2, "Enter a location").max(120),
  category: z.string().min(1, "Select a category"),
  tags: z.string().trim().max(160),
  website_url: z.string().trim().url("Enter a complete URL").optional().or(z.literal("")),
  journey: z.string().trim().max(4000),
  challenges: z.string().trim().max(3000),
  challenge_solution: z.string().trim().max(3000),
  contact_name: z.string().trim().max(100),
  contact_email: z.string().trim().email("Enter a valid email address").max(255).optional().or(z.literal("")),
  published: z.boolean(),
});

type EditForm = z.infer<typeof editSchema>;
type EditErrors = Partial<Record<keyof EditForm, string>>;

const BusinessManagement = () => {
  const [businesses, setBusinesses] = useState<AdminBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<AdminBusiness | null>(null);
  const [form, setForm] = useState<EditForm | null>(null);
  const [errors, setErrors] = useState<EditErrors>({});
  const [saving, setSaving] = useState(false);
  const [media, setMedia] = useState<BusinessMedia[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoCaption, setVideoCaption] = useState("");

  const loadBusinesses = async () => {
    setLoading(true);
    try {
      const { data } = await fetchAdminBusinesses();
      setBusinesses(data ?? []);
    } catch (error) {
      toast({
        title: "Could not load businesses",
        description: error instanceof ApiError ? error.message : "Unknown error.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinesses();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return businesses;
    return businesses.filter((business) =>
      [business.name, business.pitch, business.stage, business.location, business.category, business.contact_email]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [businesses, search]);

  const openEdit = (business: AdminBusiness) => {
    setEditing(business);
    setErrors({});
    setForm({
      name: business.name,
      pitch: business.pitch,
      stage: business.stage,
      location: business.location,
      category: business.category,
      tags: business.tags.join(", "),
      website_url: business.website_url ?? "",
      journey: business.journey ?? "",
      challenges: business.challenges ?? "",
      challenge_solution: business.challenge_solution ?? "",
      contact_name: business.contact_name ?? "",
      contact_email: business.contact_email ?? "",
      published: business.published,
    });
    setMedia((business.media ?? []).map((item) => ({ ...item })));
    setVideoUrl("");
    setVideoCaption("");
  };

  const closeEdit = () => {
    setEditing(null);
    setForm(null);
    setErrors({});
    setMedia([]);
    setVideoUrl("");
    setVideoCaption("");
  };

  const uploadImages = async (files: FileList | null) => {
    if (!files?.length) return;
    const imageCount = media.filter((item) => item.media_type === "image").length;
    const available = Math.min(6 - imageCount, 10 - media.length);
    if (available <= 0) {
      toast({ title: "Photo limit reached", description: "A profile can contain up to 6 photos.", variant: "destructive" });
      return;
    }
    const selected = Array.from(files).slice(0, available);
    setUploadingImages(true);
    try {
      const uploaded = await Promise.all(selected.map((file) => uploadBusinessImage(file)));
      setMedia((current) => [
        ...current,
        ...uploaded.map(({ url }) => ({ media_type: "image" as const, url, caption: "" })),
      ]);
    } catch (error) {
      toast({ title: "Could not upload photo", description: error instanceof ApiError ? error.message : "Unknown error.", variant: "destructive" });
    } finally {
      setUploadingImages(false);
    }
  };

  const addVideo = () => {
    const parsedUrl = z.string().url().safeParse(videoUrl.trim());
    if (!parsedUrl.success) {
      toast({ title: "Enter a complete video URL", description: "Use a YouTube, Vimeo, Loom, or other public video URL.", variant: "destructive" });
      return;
    }
    if (media.filter((item) => item.media_type === "video").length >= 3 || media.length >= 10) {
      toast({ title: "Video limit reached", description: "A profile can contain up to 3 videos.", variant: "destructive" });
      return;
    }
    setMedia((current) => [...current, { media_type: "video", url: parsedUrl.data, caption: videoCaption.trim() }]);
    setVideoUrl("");
    setVideoCaption("");
  };

  const updateMediaCaption = (index: number, caption: string) => {
    setMedia((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, caption } : item));
  };

  const removeMedia = (index: number) => {
    setMedia((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const updateField = <K extends keyof EditForm>(field: K, value: EditForm[K]) => {
    setForm((current) => current ? { ...current, [field]: value } : current);
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing || !form) return;

    const result = editSchema.safeParse(form);
    if (!result.success) {
      const nextErrors: EditErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof EditForm | undefined;
        if (field && !nextErrors[field]) nextErrors[field] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }

    let mediaToSave = media;
    const pendingVideoUrl = videoUrl.trim();
    if (pendingVideoUrl) {
      const parsedUrl = z.string().url().safeParse(pendingVideoUrl);
      if (!parsedUrl.success) {
        toast({
          title: "Enter a complete video URL",
          description: "Use a YouTube, Vimeo, Loom, or other public video URL.",
          variant: "destructive",
        });
        return;
      }

      const isDuplicate = media.some((item) => item.media_type === "video" && item.url === parsedUrl.data);
      if (!isDuplicate) {
        if (media.filter((item) => item.media_type === "video").length >= 3 || media.length >= 10) {
          toast({
            title: "Video limit reached",
            description: "A profile can contain up to 3 videos.",
            variant: "destructive",
          });
          return;
        }
        mediaToSave = [
          ...media,
          { media_type: "video", url: parsedUrl.data, caption: videoCaption.trim() },
        ];
      }
    }

    setSaving(true);
    try {
      const tags = result.data.tags.split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 5);
      const { data } = await updateAdminBusiness(editing.id, {
        name: result.data.name,
        pitch: result.data.pitch,
        stage: result.data.stage,
        location: result.data.location,
        category: result.data.category,
        tags,
        website_url: result.data.website_url || null,
        clear_website_url: !result.data.website_url,
        journey: result.data.journey,
        challenges: result.data.challenges || null,
        challenge_solution: result.data.challenge_solution || null,
        ...(result.data.contact_name ? { contact_name: result.data.contact_name } : {}),
        ...(result.data.contact_email ? { contact_email: result.data.contact_email } : {}),
        published: result.data.published,
        media: mediaToSave.map((item) => ({ media_type: item.media_type, url: item.url, caption: item.caption?.trim() || null })),
      });
      setBusinesses((current) => current.map((business) => business.id === data.id ? data : business));
      closeEdit();
      toast({ title: "Business updated", description: `${data.name} has been saved.` });
    } catch (error) {
      toast({
        title: "Could not update business",
        description: error instanceof ApiError ? error.message : "Unknown error.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleVisibility = async (business: AdminBusiness) => {
    try {
      const { data } = await updateAdminBusiness(business.id, { published: !business.published });
      setBusinesses((current) => current.map((item) => item.id === data.id ? data : item));
      toast({ title: data.published ? "Business published" : "Business hidden" });
    } catch (error) {
      toast({
        title: "Could not change visibility",
        description: error instanceof ApiError ? error.message : "Unknown error.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (business: AdminBusiness) => {
    if (!confirm(`Delete "${business.name}"? This cannot be undone.`)) return;
    try {
      await deleteAdminBusiness(business.id);
      setBusinesses((current) => current.filter((item) => item.id !== business.id));
      toast({ title: "Business deleted", description: `${business.name} was removed from the directory.` });
    } catch (error) {
      toast({
        title: "Could not delete business",
        description: error instanceof ApiError ? error.message : "Unknown error.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search businesses…" className="pl-9" />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{businesses.length} businesses</Badge>
          <Button variant="outline" size="sm" onClick={loadBusinesses} disabled={loading}>{loading ? "Refreshing…" : "Refresh"}</Button>
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Business</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16">
                  <Building2 className="h-8 w-8 opacity-40 mx-auto mb-2" />
                  <p className="text-muted-foreground">{loading ? "Loading…" : "No businesses found."}</p>
                </TableCell>
              </TableRow>
            ) : filtered.map((business) => (
              <TableRow key={business.id}>
                <TableCell className="max-w-sm">
                  <div className="font-medium flex items-center gap-1.5">
                    {business.name}
                    {business.website_url && <a href={business.website_url} target="_blank" rel="noreferrer" aria-label={`Open ${business.name} website`} className="text-primary"><ExternalLink className="h-3.5 w-3.5" /></a>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate" title={business.pitch}>{business.pitch}</p>
                </TableCell>
                <TableCell><Badge variant="secondary">{business.stage}</Badge></TableCell>
                <TableCell>{business.category}</TableCell>
                <TableCell>{business.location}</TableCell>
                <TableCell>
                  <p className="text-sm">{business.contact_name || "—"}</p>
                  {business.contact_email && <a href={`mailto:${business.contact_email}`} className="text-xs text-primary hover:underline">{business.contact_email}</a>}
                </TableCell>
                <TableCell>{business.status === "pending" ? <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending review</Badge> : business.published ? <Badge>Published</Badge> : <Badge variant="outline">Hidden</Badge>}</TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleVisibility(business)} aria-label={business.published ? `Hide ${business.name}` : `Publish ${business.name}`}>
                    {business.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(business)} aria-label={`Edit ${business.name}`}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(business)} aria-label={`Delete ${business.name}`}><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={Boolean(editing)} onOpenChange={(open) => { if (!open) closeEdit(); }}>
        <DialogContent className="sm:max-w-[760px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit business</DialogTitle>
            <DialogDescription>Changes update the public business directory immediately when published.</DialogDescription>
          </DialogHeader>
          {form && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label htmlFor="admin-business-name">Business name *</Label><Input id="admin-business-name" value={form.name} onChange={(event) => updateField("name", event.target.value)} />{errors.name && <p className="text-xs text-destructive">{errors.name}</p>}</div>
                <div className="space-y-1.5"><Label htmlFor="admin-business-website">Website</Label><Input id="admin-business-website" type="url" value={form.website_url} onChange={(event) => updateField("website_url", event.target.value)} placeholder="https://example.com" />{errors.website_url && <p className="text-xs text-destructive">{errors.website_url}</p>}</div>
              </div>
              <div className="space-y-1.5"><Label htmlFor="admin-business-pitch">Pitch *</Label><Textarea id="admin-business-pitch" value={form.pitch} onChange={(event) => updateField("pitch", event.target.value)} maxLength={280} />{errors.pitch && <p className="text-xs text-destructive">{errors.pitch}</p>}</div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1.5"><Label htmlFor="admin-business-stage">Stage *</Label><Select value={form.stage} onValueChange={(value) => updateField("stage", value)}><SelectTrigger id="admin-business-stage"><SelectValue /></SelectTrigger><SelectContent>{stages.map((stage) => <SelectItem key={stage} value={stage}>{stage}</SelectItem>)}</SelectContent></Select>{errors.stage && <p className="text-xs text-destructive">{errors.stage}</p>}</div>
                <div className="space-y-1.5"><Label htmlFor="admin-business-category">Category *</Label><Select value={form.category} onValueChange={(value) => updateField("category", value)}><SelectTrigger id="admin-business-category"><SelectValue /></SelectTrigger><SelectContent>{categories.map((category) => <SelectItem key={category} value={category}>{category}</SelectItem>)}</SelectContent></Select>{errors.category && <p className="text-xs text-destructive">{errors.category}</p>}</div>
                <div className="space-y-1.5"><Label htmlFor="admin-business-location">Location *</Label><Input id="admin-business-location" value={form.location} onChange={(event) => updateField("location", event.target.value)} />{errors.location && <p className="text-xs text-destructive">{errors.location}</p>}</div>
              </div>
              <div className="space-y-1.5"><Label htmlFor="admin-business-tags">Tags</Label><Input id="admin-business-tags" value={form.tags} onChange={(event) => updateField("tags", event.target.value)} placeholder="AI, B2B, Developer Tools" />{errors.tags && <p className="text-xs text-destructive">{errors.tags}</p>}</div>
              <div className="space-y-1.5"><Label htmlFor="admin-business-journey">Startup journey</Label><Textarea id="admin-business-journey" className="min-h-28" value={form.journey} onChange={(event) => updateField("journey", event.target.value)} />{errors.journey && <p className="text-xs text-destructive">{errors.journey}</p>}</div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label htmlFor="admin-business-challenges">Challenges</Label><Textarea id="admin-business-challenges" className="min-h-24" value={form.challenges} onChange={(event) => updateField("challenges", event.target.value)} />{errors.challenges && <p className="text-xs text-destructive">{errors.challenges}</p>}</div>
                <div className="space-y-1.5"><Label htmlFor="admin-business-solution">How they overcame them</Label><Textarea id="admin-business-solution" className="min-h-24" value={form.challenge_solution} onChange={(event) => updateField("challenge_solution", event.target.value)} />{errors.challenge_solution && <p className="text-xs text-destructive">{errors.challenge_solution}</p>}</div>
              </div>
              {editing && (editing.founders?.length ?? 0) > 0 && <div className="rounded-xl bg-muted/50 p-4 space-y-3"><p className="text-sm font-semibold">Founders</p>{editing.founders?.map((founder) => <div key={founder.id ?? founder.name} className="rounded-lg border bg-background p-3"><p className="font-medium">{founder.name} <span className="text-xs font-normal text-muted-foreground">· {founder.role}</span></p>{founder.journey && <p className="mt-1 text-xs leading-5 text-muted-foreground">{founder.journey}</p>}</div>)}</div>}
              <div className="rounded-xl border p-4 space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div><p className="font-semibold">Photos and videos</p><p className="text-xs text-muted-foreground">Changes are applied when you save this profile.</p></div>
                  <Label htmlFor="admin-business-photos" className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border bg-background px-3 text-sm font-medium hover:bg-accent">
                    <ImagePlus className="h-4 w-4" /> {uploadingImages ? "Uploading…" : "Add photos"}
                  </Label>
                  <Input id="admin-business-photos" type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" disabled={uploadingImages} onChange={(event) => { void uploadImages(event.target.files); event.target.value = ""; }} />
                </div>
                {media.some((item) => item.media_type === "image") && <div className="grid gap-3 sm:grid-cols-2">{media.map((item, index) => item.media_type === "image" && <div key={`${item.url}-${index}`} className="overflow-hidden rounded-lg border bg-background"><div className="relative aspect-video bg-muted"><img src={item.url} alt={item.caption || "Startup media"} className="h-full w-full object-cover" /><Button type="button" variant="destructive" size="icon" className="absolute right-2 top-2 h-8 w-8" onClick={() => removeMedia(index)} aria-label="Remove photo"><Trash2 className="h-4 w-4" /></Button></div><Input value={item.caption ?? ""} onChange={(event) => updateMediaCaption(index, event.target.value)} placeholder="Photo caption" className="rounded-none border-x-0 border-b-0" maxLength={200} /></div>)}</div>}
                <div className="rounded-lg bg-muted/50 p-3 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium"><Video className="h-4 w-4" /> Add video link</div>
                  <div className="grid gap-3 sm:grid-cols-2"><Input type="url" value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} placeholder="YouTube, Vimeo, or Loom URL" /><Input value={videoCaption} onChange={(event) => setVideoCaption(event.target.value)} placeholder="Video caption (optional)" maxLength={200} /></div>
                  <Button type="button" variant="outline" size="sm" onClick={addVideo}>Add video</Button>
                </div>
                {media.some((item) => item.media_type === "video") && <div className="space-y-2">{media.map((item, index) => item.media_type === "video" && <div key={`${item.url}-${index}`} className="grid gap-2 rounded-lg border bg-background p-3 sm:grid-cols-[1fr_1fr_auto]"><Input type="url" value={item.url} onChange={(event) => setMedia((current) => current.map((entry, itemIndex) => itemIndex === index ? { ...entry, url: event.target.value } : entry))} aria-label="Video URL" /><Input value={item.caption ?? ""} onChange={(event) => updateMediaCaption(index, event.target.value)} placeholder="Video caption" maxLength={200} /><Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => removeMedia(index)} aria-label="Remove video"><Trash2 className="h-4 w-4" /></Button></div>)}</div>}
                <p className="text-xs text-muted-foreground">{media.filter((item) => item.media_type === "image").length}/6 photos · {media.filter((item) => item.media_type === "video").length}/3 videos</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label htmlFor="admin-business-contact-name">Contact name</Label><Input id="admin-business-contact-name" value={form.contact_name} onChange={(event) => updateField("contact_name", event.target.value)} />{errors.contact_name && <p className="text-xs text-destructive">{errors.contact_name}</p>}</div>
                <div className="space-y-1.5"><Label htmlFor="admin-business-contact-email">Contact email</Label><Input id="admin-business-contact-email" type="email" value={form.contact_email} onChange={(event) => updateField("contact_email", event.target.value)} />{errors.contact_email && <p className="text-xs text-destructive">{errors.contact_email}</p>}</div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-3"><Checkbox id="admin-business-published" checked={form.published} onCheckedChange={(checked) => updateField("published", checked === true)} /><div><Label htmlFor="admin-business-published" className="cursor-pointer">Approve and publish this profile</Label><p className="text-xs text-muted-foreground">Unchecked profiles remain hidden from the public directory.</p></div></div>
              <DialogFooter><Button type="button" variant="outline" onClick={closeEdit}>Cancel</Button><Button type="submit" disabled={saving || uploadingImages}>{saving ? "Saving…" : "Save Changes"}</Button></DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessManagement;
