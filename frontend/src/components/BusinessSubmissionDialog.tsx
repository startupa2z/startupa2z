import { useState } from "react";
import { z } from "zod";
import { ChevronLeft, ChevronRight, ImagePlus, LoaderCircle, Plus, Trash2, UserRound, Video } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  ApiError,
  BusinessFounder,
  BusinessMedia,
  submitBusiness,
  uploadBusinessImage,
} from "@/lib/api";

const stages = ["Pre-Seed", "Seed", "Series A", "Series B", "Growth", "Other"];
const categories = ["SaaS", "Fintech", "Healthtech", "Greentech", "Deep Tech", "Cybersecurity", "AI", "Other"];
const stepLabels = ["Business", "Founders", "Journey", "Media", "Review"];

type FounderDraft = BusinessFounder & { linkedin_url: string; journey: string; photo_url: string };

type FormData = {
  name: string;
  pitch: string;
  stage: string;
  location: string;
  category: string;
  tags: string;
  website_url: string;
  logo_url: string;
  journey: string;
  challenges: string;
  challenge_solution: string;
  contact_name: string;
  contact_email: string;
  consent_to_publish: boolean;
};

const emptyFounder = (): FounderDraft => ({
  name: "",
  role: "Founder",
  linkedin_url: "",
  journey: "",
  photo_url: "",
});

const emptyForm: FormData = {
  name: "",
  pitch: "",
  stage: "",
  location: "",
  category: "",
  tags: "",
  website_url: "",
  logo_url: "",
  journey: "",
  challenges: "",
  challenge_solution: "",
  contact_name: "",
  contact_email: "",
  consent_to_publish: true,
};

const businessStepSchema = z.object({
  name: z.string().trim().min(2, "Enter the business name").max(120),
  pitch: z.string().trim().min(20, "Describe the business in at least 20 characters").max(280),
  stage: z.string().min(1, "Select a stage"),
  location: z.string().trim().min(2, "Enter a location").max(120),
  category: z.string().min(1, "Select a category"),
  website_url: z.string().trim().url("Enter a complete website URL").optional().or(z.literal("")),
});

const founderSchema = z.object({
  name: z.string().trim().min(2, "Founder name is required").max(100),
  role: z.enum(["Founder", "Co-founder"]),
  linkedin_url: z.string().trim().url("Enter a complete LinkedIn URL").optional().or(z.literal("")),
  journey: z.string().trim().max(2000),
  photo_url: z.string(),
});

const reviewSchema = z.object({
  contact_name: z.string().trim().min(2, "Enter your name").max(100),
  contact_email: z.string().trim().email("Enter a valid email address").max(255),
  consent_to_publish: z.literal(true, { errorMap: () => ({ message: "Confirm that we may review and publish this profile" }) }),
});

interface BusinessSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitted: () => void;
}

const BusinessSubmissionDialog = ({ open, onOpenChange, onSubmitted }: BusinessSubmissionDialogProps) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [founders, setFounders] = useState<FounderDraft[]>([emptyFounder()]);
  const [media, setMedia] = useState<BusinessMedia[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoCaption, setVideoCaption] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const updateFounder = <K extends keyof FounderDraft>(index: number, field: K, value: FounderDraft[K]) => {
    setFounders((current) => current.map((founder, founderIndex) => founderIndex === index ? { ...founder, [field]: value } : founder));
    setError("");
  };

  const validateStep = () => {
    if (step === 0) {
      const result = businessStepSchema.safeParse(form);
      if (!result.success) return result.error.issues[0]?.message ?? "Check the business details.";
    }
    if (step === 1) {
      for (const founder of founders) {
        const result = founderSchema.safeParse(founder);
        if (!result.success) return result.error.issues[0]?.message ?? "Check the founder details.";
      }
    }
    if (step === 2 && form.journey.trim().length < 20) return "Tell the startup journey in at least 20 characters.";
    if (step === 4) {
      const result = reviewSchema.safeParse(form);
      if (!result.success) return result.error.issues[0]?.message ?? "Check the contact details.";
    }
    return "";
  };

  const next = () => {
    const message = validateStep();
    if (message) {
      setError(message);
      return;
    }
    setStep((current) => Math.min(current + 1, stepLabels.length - 1));
  };

  const uploadOne = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) throw new Error("Images must be 5 MB or smaller.");
    return uploadBusinessImage(file);
  };

  const handleLogo = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadOne(file);
      update("logo_url", result.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not upload the logo.");
    } finally {
      setUploading(false);
    }
  };

  const handleFounderPhoto = async (index: number, file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadOne(file);
      updateFounder(index, "photo_url", result.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not upload the founder photo.");
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryImages = async (files: FileList | null) => {
    if (!files?.length) return;
    const available = Math.max(0, 6 - media.filter((item) => item.media_type === "image").length);
    const selected = Array.from(files).slice(0, available);
    if (!selected.length) {
      setError("You can add up to 6 gallery photos.");
      return;
    }
    setUploading(true);
    try {
      const uploaded: BusinessMedia[] = [];
      for (const file of selected) {
        const result = await uploadOne(file);
        uploaded.push({ media_type: "image", url: result.url, caption: "" });
      }
      setMedia((current) => [...current, ...uploaded]);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not upload the photos.");
    } finally {
      setUploading(false);
    }
  };

  const addVideo = () => {
    const urlResult = z.string().url().safeParse(videoUrl.trim());
    if (!urlResult.success) {
      setError("Enter a complete YouTube, Vimeo, or Loom URL.");
      return;
    }
    if (media.filter((item) => item.media_type === "video").length >= 3) {
      setError("You can add up to 3 videos.");
      return;
    }
    setMedia((current) => [...current, { media_type: "video", url: videoUrl.trim(), caption: videoCaption.trim() }]);
    setVideoUrl("");
    setVideoCaption("");
    setError("");
  };

  const resetAndClose = () => {
    setStep(0);
    setForm(emptyForm);
    setFounders([emptyFounder()]);
    setMedia([]);
    setVideoUrl("");
    setVideoCaption("");
    setError("");
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    const message = validateStep();
    if (message) {
      setError(message);
      return;
    }
    setSubmitting(true);
    try {
      await submitBusiness({
        name: form.name.trim(),
        pitch: form.pitch.trim(),
        stage: form.stage,
        location: form.location.trim(),
        category: form.category,
        tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 5),
        website_url: form.website_url.trim() || null,
        logo_url: form.logo_url || null,
        journey: form.journey.trim(),
        challenges: form.challenges.trim() || null,
        challenge_solution: form.challenge_solution.trim() || null,
        founders: founders.map((founder) => ({
          name: founder.name.trim(),
          role: founder.role,
          linkedin_url: founder.linkedin_url.trim() || null,
          journey: founder.journey.trim() || null,
          photo_url: founder.photo_url || null,
        })),
        media,
        contact_name: form.contact_name.trim(),
        contact_email: form.contact_email.trim(),
        consent_to_publish: form.consent_to_publish,
      });
      onSubmitted();
      resetAndClose();
      toast({
        title: "Profile submitted for review",
        description: "We’ll review the story and notify you before it is published.",
      });
    } catch (submitError) {
      setError(submitError instanceof ApiError ? submitError.message : "Could not submit the business profile.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) resetAndClose(); else onOpenChange(true); }}>
      <DialogContent className="sm:max-w-[760px] max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-primary">Create Your Startup Profile</DialogTitle>
          <DialogDescription>Your submission stays private until the StartupA2Z team reviews and publishes it.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-5 gap-2 py-2" aria-label="Submission progress">
          {stepLabels.map((label, index) => (
            <div key={label} className="text-center">
              <div className={`h-1.5 rounded-full mb-1.5 ${index <= step ? "bg-secondary" : "bg-muted"}`} />
              <span className={`text-[11px] ${index === step ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{label}</span>
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-xl border p-4">
              <div className="h-16 w-16 overflow-hidden rounded-xl bg-muted flex items-center justify-center shrink-0">
                {form.logo_url ? <img src={form.logo_url} alt="Business logo preview" className="h-full w-full object-cover" /> : <ImagePlus className="h-6 w-6 text-muted-foreground" />}
              </div>
              <div><Label htmlFor="business-logo">Logo (optional)</Label><Input id="business-logo" type="file" accept="image/jpeg,image/png,image/webp" className="mt-1.5" onChange={(event) => handleLogo(event.target.files?.[0])} disabled={uploading} /><p className="mt-1 text-xs text-muted-foreground">JPG, PNG, or WebP · maximum 5 MB</p></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label htmlFor="business-name">Business name *</Label><Input id="business-name" value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Acme AI" /></div>
              <div><Label htmlFor="business-website">Website</Label><Input id="business-website" type="url" value={form.website_url} onChange={(event) => update("website_url", event.target.value)} placeholder="https://example.com" /></div>
            </div>
            <div><Label htmlFor="business-pitch">What does your business do? *</Label><Textarea id="business-pitch" value={form.pitch} onChange={(event) => update("pitch", event.target.value)} maxLength={280} placeholder="One clear explanation of the customer, problem, and solution." /><p className="text-right text-xs text-muted-foreground">{form.pitch.length}/280</p></div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div><Label>Stage *</Label><Select value={form.stage} onValueChange={(value) => update("stage", value)}><SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger><SelectContent>{stages.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Category *</Label><Select value={form.category} onValueChange={(value) => update("category", value)}><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent>{categories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
              <div><Label htmlFor="business-location">Location *</Label><Input id="business-location" value={form.location} onChange={(event) => update("location", event.target.value)} placeholder="Mountain View, CA" /></div>
            </div>
            <div><Label htmlFor="business-tags">Tags</Label><Input id="business-tags" value={form.tags} onChange={(event) => update("tags", event.target.value)} placeholder="AI, B2B, Developer Tools (up to 5)" /></div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div><h3 className="font-heading text-lg font-semibold">The people behind the startup</h3><p className="text-sm text-muted-foreground">Add the founder first, then any co-founders. Their stories will lead the profile.</p></div>
            {founders.map((founder, index) => (
              <div key={index} className="space-y-4 rounded-xl border p-4">
                <div className="flex items-center justify-between"><div className="flex items-center gap-2 font-medium"><UserRound className="h-4 w-4 text-secondary" /> Founder {index + 1}</div>{founders.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => setFounders((current) => current.filter((_, itemIndex) => itemIndex !== index))}><Trash2 className="h-4 w-4" /></Button>}</div>
                <div className="grid sm:grid-cols-[100px_1fr] gap-4">
                  <div className="space-y-2"><div className="h-24 w-24 overflow-hidden rounded-xl bg-muted flex items-center justify-center">{founder.photo_url ? <img src={founder.photo_url} alt={`${founder.name || "Founder"} preview`} className="h-full w-full object-cover" /> : <UserRound className="h-7 w-7 text-muted-foreground" />}</div><Label className="cursor-pointer text-xs text-primary">Upload photo<Input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => handleFounderPhoto(index, event.target.files?.[0])} disabled={uploading} /></Label></div>
                  <div className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3"><div><Label htmlFor={`founder-name-${index}`}>Name *</Label><Input id={`founder-name-${index}`} value={founder.name} onChange={(event) => updateFounder(index, "name", event.target.value)} /></div><div><Label htmlFor={`founder-role-${index}`}>Role *</Label><Select value={founder.role} onValueChange={(value: "Founder" | "Co-founder") => updateFounder(index, "role", value)}><SelectTrigger id={`founder-role-${index}`}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Founder">Founder</SelectItem><SelectItem value="Co-founder">Co-founder</SelectItem></SelectContent></Select></div></div>
                    <div><Label htmlFor={`founder-linkedin-${index}`}>LinkedIn</Label><Input id={`founder-linkedin-${index}`} type="url" value={founder.linkedin_url} onChange={(event) => updateFounder(index, "linkedin_url", event.target.value)} placeholder="https://linkedin.com/in/..." /></div>
                  </div>
                </div>
                <div><Label htmlFor={`founder-journey-${index}`}>Founder journey</Label><Textarea id={`founder-journey-${index}`} value={founder.journey} onChange={(event) => updateFounder(index, "journey", event.target.value)} placeholder="What led this person to start the company?" /></div>
              </div>
            ))}
            {founders.length < 5 && <Button type="button" variant="outline" onClick={() => setFounders((current) => [...current, { ...emptyFounder(), role: "Co-founder" }])}><Plus className="mr-2 h-4 w-4" /> Add co-founder</Button>}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div><h3 className="font-heading text-lg font-semibold">Tell the real journey</h3><p className="text-sm text-muted-foreground">Useful lessons matter more than polished marketing language.</p></div>
            <div><Label htmlFor="business-journey">Journey to reach here *</Label><Textarea id="business-journey" className="min-h-28" value={form.journey} onChange={(event) => update("journey", event.target.value)} maxLength={4000} placeholder="How did the idea begin, and what important milestones brought the team here?" /></div>
            <div><Label htmlFor="business-challenges">What were the biggest challenges?</Label><Textarea id="business-challenges" className="min-h-24" value={form.challenges} onChange={(event) => update("challenges", event.target.value)} maxLength={3000} placeholder="Product, customers, hiring, fundraising, co-founder decisions…" /></div>
            <div><Label htmlFor="business-solutions">How did the team overcome them?</Label><Textarea id="business-solutions" className="min-h-24" value={form.challenge_solution} onChange={(event) => update("challenge_solution", event.target.value)} maxLength={3000} placeholder="What changed, and what did the team learn?" /></div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div><h3 className="font-heading text-lg font-semibold">Bring the story to life</h3><p className="text-sm text-muted-foreground">Add product, team, or event photos. Videos remain hosted on YouTube, Vimeo, or Loom.</p></div>
            <div className="rounded-xl border border-dashed p-5 text-center"><ImagePlus className="mx-auto mb-2 h-7 w-7 text-secondary" /><Label className="cursor-pointer font-medium text-primary">Upload gallery photos<Input type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => handleGalleryImages(event.target.files)} disabled={uploading} /></Label><p className="mt-1 text-xs text-muted-foreground">Up to 6 photos · 5 MB each</p></div>
            {media.some((item) => item.media_type === "image") && <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">{media.map((item, index) => item.media_type === "image" && <div key={`${item.url}-${index}`} className="group relative aspect-square overflow-hidden rounded-lg bg-muted"><img src={item.url} alt="Gallery preview" className="h-full w-full object-cover" /><button type="button" aria-label="Remove photo" onClick={() => setMedia((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"><Trash2 className="h-3 w-3" /></button></div>)}</div>}
            <div className="rounded-xl border p-4 space-y-3"><div className="flex items-center gap-2 font-medium"><Video className="h-4 w-4 text-secondary" /> Add video</div><div className="grid sm:grid-cols-2 gap-3"><Input type="url" value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} placeholder="YouTube, Vimeo, or Loom URL" /><Input value={videoCaption} onChange={(event) => setVideoCaption(event.target.value)} placeholder="Caption (optional)" /></div><Button type="button" variant="outline" onClick={addVideo}>Add video link</Button></div>
            {media.filter((item) => item.media_type === "video").map((item, index) => <div key={item.url} className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm"><span className="truncate">{item.caption || item.url}</span><Button type="button" variant="ghost" size="icon" onClick={() => setMedia((current) => current.filter((entry) => entry !== item))}><Trash2 className="h-4 w-4" /></Button></div>)}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <div className="rounded-xl bg-muted/60 p-5"><p className="text-xs font-semibold uppercase tracking-wider text-secondary">Ready for review</p><h3 className="mt-1 font-heading text-xl font-semibold">{form.name}</h3><p className="mt-2 text-sm text-muted-foreground">{form.pitch}</p><div className="mt-3 flex flex-wrap gap-2 text-xs"><span>{founders.length} founder{founders.length === 1 ? "" : "s"}</span><span>·</span><span>{media.filter((item) => item.media_type === "image").length} photos</span><span>·</span><span>{media.filter((item) => item.media_type === "video").length} videos</span></div></div>
            <div className="grid sm:grid-cols-2 gap-4"><div><Label htmlFor="business-contact-name">Your name *</Label><Input id="business-contact-name" value={form.contact_name} onChange={(event) => update("contact_name", event.target.value)} /></div><div><Label htmlFor="business-contact-email">Your email *</Label><Input id="business-contact-email" type="email" value={form.contact_email} onChange={(event) => update("contact_email", event.target.value)} /></div></div>
            <div className="flex items-start gap-3 rounded-lg border p-3"><Checkbox id="business-consent" checked={form.consent_to_publish} onCheckedChange={(checked) => update("consent_to_publish", checked === true)} /><Label htmlFor="business-consent" className="cursor-pointer leading-relaxed">I confirm that I have permission to submit this information and media for review and possible publication by StartupA2Z.</Label></div>
          </div>
        )}

        {error && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

        <DialogFooter className="mt-2 flex-row justify-between sm:justify-between">
          <Button type="button" variant="outline" onClick={() => step === 0 ? resetAndClose() : setStep((current) => current - 1)} disabled={submitting || uploading}>{step === 0 ? "Cancel" : <><ChevronLeft className="mr-1 h-4 w-4" /> Back</>}</Button>
          {step < stepLabels.length - 1 ? <Button type="button" onClick={next} disabled={uploading}>{uploading ? <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Uploading</> : <>Continue <ChevronRight className="ml-1 h-4 w-4" /></>}</Button> : <Button type="button" onClick={handleSubmit} disabled={submitting || uploading}>{submitting ? "Submitting…" : "Submit for Review"}</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessSubmissionDialog;
