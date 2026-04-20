import { useRef, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { ImagePlus, Loader2, Plus, X } from "lucide-react";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

const schema = z.object({
  title: z.string().trim().min(2).max(150),
  date: z.string().trim().min(2).max(60),
  time: z.string().trim().min(2).max(60),
  venue: z.string().trim().min(2).max(150),
  address: z.string().trim().max(250).optional().default(""),
  type: z.string().trim().min(2).max(60),
  description: z.string().trim().max(400).optional().default(""),
  long_description: z.string().trim().max(4000).optional().default(""),
  spots: z.coerce.number().int().min(0).max(100000),
  capacity: z.coerce.number().int().min(0).max(100000),
  price: z.string().trim().max(60).optional().default("Free"),
  featured: z.boolean().default(false),
  agenda_text: z.string().max(4000).optional().default(""),
  speakers_text: z.string().max(2000).optional().default(""),
});

type Props = { onCreated?: () => void };

const parseAgenda = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [time, ...rest] = l.split("|");
      return { time: (time ?? "").trim(), item: rest.join("|").trim() };
    })
    .filter((a) => a.time && a.item);

const parseSpeakers = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [name, ...rest] = l.split("|");
      return { name: (name ?? "").trim(), role: rest.join("|").trim() };
    })
    .filter((s) => s.name);

const EventForm = ({ onCreated }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    venue: "",
    address: "",
    type: "Networking",
    description: "",
    long_description: "",
    spots: "0",
    capacity: "0",
    price: "Free",
    featured: false,
    agenda_text: "",
    speakers_text: "",
  });

  const update = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast({ title: "Unsupported image", description: "Use JPG, PNG, WebP or GIF.", variant: "destructive" });
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast({ title: "Image too large", description: "Max size is 5 MB.", variant: "destructive" });
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadImage = async (slug: string): Promise<string | null> => {
    if (!imageFile) return null;
    const ext = imageFile.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${slug}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("event-images")
      .upload(path, imageFile, { contentType: imageFile.type, upsert: false });
    if (uploadError) {
      toast({ title: "Image upload failed", description: uploadError.message, variant: "destructive" });
      return null;
    }
    const { data } = supabase.storage.from("event-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Check the form",
        description: parsed.error.issues[0]?.message ?? "Invalid input",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const slug = slugify(parsed.data.title) + "-" + Math.random().toString(36).slice(2, 6);

    let imageUrl: string | null = null;
    if (imageFile) {
      imageUrl = await uploadImage(slug);
      if (!imageUrl) {
        setSubmitting(false);
        return; // upload failed, toast already shown
      }
    }

    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from("events").insert({
      slug,
      title: parsed.data.title,
      date: parsed.data.date,
      time: parsed.data.time,
      venue: parsed.data.venue,
      address: parsed.data.address ?? "",
      type: parsed.data.type,
      description: parsed.data.description ?? "",
      long_description: parsed.data.long_description ?? "",
      spots: parsed.data.spots,
      capacity: parsed.data.capacity,
      price: parsed.data.price ?? "Free",
      featured: parsed.data.featured,
      agenda: parseAgenda(parsed.data.agenda_text ?? ""),
      speakers: parseSpeakers(parsed.data.speakers_text ?? ""),
      image_url: imageUrl,
      created_by: userData.user?.id ?? null,
    });
    setSubmitting(false);

    if (error) {
      toast({ title: "Could not create event", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Event created", description: `${parsed.data.title} is now live on /events.` });
    setForm({
      title: "",
      date: "",
      time: "",
      venue: "",
      address: "",
      type: "Networking",
      description: "",
      long_description: "",
      spots: "0",
      capacity: "0",
      price: "Free",
      featured: false,
      agenda_text: "",
      speakers_text: "",
    });
    clearImage();
    onCreated?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Title" required>
          <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Founder Friday: AI Edition" />
        </Field>
        <Field label="Type" required>
          <Input value={form.type} onChange={(e) => update("type", e.target.value)} placeholder="Networking" />
        </Field>
        <Field label="Date" required>
          <Input value={form.date} onChange={(e) => update("date", e.target.value)} placeholder="April 18, 2026" />
        </Field>
        <Field label="Time" required>
          <Input value={form.time} onChange={(e) => update("time", e.target.value)} placeholder="6:00 PM - 9:00 PM" />
        </Field>
        <Field label="Venue" required>
          <Input value={form.venue} onChange={(e) => update("venue", e.target.value)} placeholder="SOMA, San Francisco" />
        </Field>
        <Field label="Address">
          <Input value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="475 Brannan St, SF" />
        </Field>
        <Field label="Spots left">
          <Input type="number" min={0} value={form.spots} onChange={(e) => update("spots", e.target.value)} />
        </Field>
        <Field label="Capacity">
          <Input type="number" min={0} value={form.capacity} onChange={(e) => update("capacity", e.target.value)} />
        </Field>
        <Field label="Price">
          <Input value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="Free or $15" />
        </Field>
        <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
          <div>
            <Label className="text-sm font-medium">Featured</Label>
            <p className="text-xs text-muted-foreground">Highlight on the events page</p>
          </div>
          <Switch checked={form.featured} onCheckedChange={(v) => update("featured", v)} />
        </div>
      </div>

      <Field label="Short description">
        <Textarea
          rows={2}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Shown on event cards (1-2 sentences)."
        />
      </Field>

      <Field label="Long description">
        <Textarea
          rows={5}
          value={form.long_description}
          onChange={(e) => update("long_description", e.target.value)}
          placeholder="Shown on the event detail page."
        />
      </Field>

      <Field
        label="Agenda"
        hint="One item per line, format: TIME | ITEM (e.g. 6:00 PM | Doors open)"
      >
        <Textarea
          rows={4}
          value={form.agenda_text}
          onChange={(e) => update("agenda_text", e.target.value)}
          placeholder={"6:00 PM | Doors open\n6:45 PM | Lightning demos"}
        />
      </Field>

      <Field
        label="Speakers"
        hint="One per line, format: NAME | ROLE (e.g. Priya Shah | Founder, Lumen AI)"
      >
        <Textarea
          rows={3}
          value={form.speakers_text}
          onChange={(e) => update("speakers_text", e.target.value)}
          placeholder={"Priya Shah | Founder, Lumen AI"}
        />
      </Field>

      <div className="flex justify-end">
        <Button type="submit" disabled={submitting} className="gap-2">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {submitting ? "Creating…" : "Create event"}
        </Button>
      </div>
    </form>
  );
};

const Field = ({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-medium">
      {label} {required && <span className="text-destructive">*</span>}
    </Label>
    {children}
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
);

export default EventForm;
