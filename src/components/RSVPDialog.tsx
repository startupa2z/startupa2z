import { useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RSVPDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: {
    id?: string;
    slug?: string;
    title: string;
    date: string;
    time?: string;
    venue?: string;
  } | null;
}

const rsvpSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(20, "Phone must be less than 20 characters").optional().or(z.literal("")),
  role: z.string().min(1, "Please select your role"),
  company: z.string().trim().max(100, "Company name must be less than 100 characters").optional().or(z.literal("")),
  guests: z.string().min(1, "Please select number of guests"),
  notes: z.string().trim().max(500, "Notes must be less than 500 characters").optional().or(z.literal("")),
});

type FormData = z.infer<typeof rsvpSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

const RSVPDialog = ({ open, onOpenChange, event }: RSVPDialogProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    role: "",
    company: "",
    guests: "1",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = rsvpSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as keyof FormData] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (!event) return;

    setSubmitting(true);

    // Split full name into first/last for storage
    const trimmed = formData.name.trim();
    const firstSpace = trimmed.indexOf(" ");
    const firstName = firstSpace === -1 ? trimmed : trimmed.slice(0, firstSpace);
    const lastName = firstSpace === -1 ? "—" : trimmed.slice(firstSpace + 1).trim() || "—";

    const guestsNote = formData.guests && formData.guests !== "1" ? `Guests: ${formData.guests}` : "";
    const combinedNotes = [guestsNote, formData.notes?.trim()].filter(Boolean).join(" | ");

    const { error } = await supabase.from("event_rsvps").insert({
      event_id: event.id ?? null,
      event_slug: event.slug ?? "unknown",
      event_title: event.title,
      first_name: firstName,
      last_name: lastName,
      email: formData.email.trim(),
      phone: formData.phone?.trim() || null,
      company: formData.company?.trim() || null,
      role: formData.role,
      notes: combinedNotes || null,
    });

    setSubmitting(false);

    if (error) {
      // Postgres unique-violation -> duplicate RSVP for this event+email
      if ((error as { code?: string }).code === "23505") {
        setErrors({
          email: "You've already RSVP'd to this event with this email address.",
        });
        toast({
          title: "Already registered",
          description: "This email is already on the guest list for this event.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "RSVP failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setSubmitted(true);
    toast({
      title: "RSVP Confirmed!",
      description: `You're registered for ${event.title}. Check your email for details.`,
    });
  };

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", phone: "", role: "", company: "", guests: "1", notes: "" });
        setErrors({});
      }, 200);
    }
    onOpenChange(nextOpen);
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="py-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-9 h-9 text-secondary" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-primary mb-2">You're In!</h3>
            <p className="text-muted-foreground mb-6">
              Your RSVP for <span className="font-semibold text-foreground">{event.title}</span> is confirmed. We've sent the event details to your email.
            </p>
            <Button onClick={() => handleClose(false)} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-8">
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl text-primary">RSVP for {event.title}</DialogTitle>
              <DialogDescription asChild>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-2">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.date}</span>
                  {event.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time}</span>}
                  {event.venue && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.venue}</span>}
                </div>
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="rsvp-name">Full Name *</Label>
                  <Input id="rsvp-name" value={formData.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Jane Doe" maxLength={100} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rsvp-email">Email *</Label>
                  <Input id="rsvp-email" type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="jane@startup.com" maxLength={255} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="rsvp-phone">Phone (optional)</Label>
                  <Input id="rsvp-phone" type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+1 (555) 123-4567" maxLength={20} />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rsvp-company">Company (optional)</Label>
                  <Input id="rsvp-company" value={formData.company} onChange={(e) => updateField("company", e.target.value)} placeholder="Acme Inc." maxLength={100} />
                  {errors.company && <p className="text-xs text-destructive">{errors.company}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="rsvp-role">I am a *</Label>
                  <Select value={formData.role} onValueChange={(v) => updateField("role", v)}>
                    <SelectTrigger id="rsvp-role"><SelectValue placeholder="Select role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="founder">Founder</SelectItem>
                      <SelectItem value="investor">Investor</SelectItem>
                      <SelectItem value="operator">Operator / Employee</SelectItem>
                      <SelectItem value="mentor">Mentor / Advisor</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-xs text-destructive">{errors.role}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rsvp-guests">Number of Guests *</Label>
                  <Select value={formData.guests} onValueChange={(v) => updateField("guests", v)}>
                    <SelectTrigger id="rsvp-guests"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Just me</SelectItem>
                      <SelectItem value="2">2 people</SelectItem>
                      <SelectItem value="3">3 people</SelectItem>
                      <SelectItem value="4">4 people</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.guests && <p className="text-xs text-destructive">{errors.guests}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rsvp-notes">Anything we should know? (optional)</Label>
                <Textarea id="rsvp-notes" value={formData.notes} onChange={(e) => updateField("notes", e.target.value)} placeholder="Dietary restrictions, accessibility needs, what you're hoping to get out of the event..." maxLength={500} rows={3} />
                {errors.notes && <p className="text-xs text-destructive">{errors.notes}</p>}
              </div>

              <DialogFooter className="gap-2 sm:gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => handleClose(false)} className="rounded-full">Cancel</Button>
                <Button type="submit" disabled={submitting} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-8">
                  {submitting ? "Submitting..." : "Confirm RSVP"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RSVPDialog;
