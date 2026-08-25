import { useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

const stages = ["Pre-Seed", "Seed", "Series A", "Series B", "Growth", "Other"];
const categories = ["SaaS", "Fintech", "Healthtech", "Greentech", "Deep Tech", "Cybersecurity", "AI", "Other"];

interface BusinessSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BusinessSubmissionDialog = ({ open, onOpenChange }: BusinessSubmissionDialogProps) => {
  const [logoPreview, setLogoPreview] = useState("");

  useEffect(() => () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
  }, [logoPreview]);

  const previewLogo = (file?: File) => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(file ? URL.createObjectURL(file) : "");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-[680px]">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-primary">Add Startup/Business</DialogTitle>
          <DialogDescription>
            Create the basic profile now. You can add founders, your journey, ask and offer, photos, and videos later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="flex items-center gap-4 rounded-xl border p-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
              {logoPreview ? <img src={logoPreview} alt="Startup logo preview" className="h-full w-full object-contain" /> : <ImagePlus className="h-6 w-6 text-muted-foreground" />}
            </div>
            <div className="min-w-0 flex-1">
              <Label htmlFor="business-logo">Logo <span className="font-normal text-muted-foreground">(optional)</span></Label>
              <Input id="business-logo" type="file" accept="image/jpeg,image/png,image/webp" className="mt-1.5" onChange={(event) => previewLogo(event.target.files?.[0])} />
              <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, or WebP · maximum 5 MB</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label htmlFor="business-name">Startup/business name *</Label><Input id="business-name" placeholder="Acme AI" /></div>
            <div><Label htmlFor="business-website">Website</Label><Input id="business-website" type="url" placeholder="https://example.com" /></div>
          </div>

          <div>
            <Label htmlFor="business-pitch">What does your startup/business do? *</Label>
            <Textarea id="business-pitch" className="mt-1.5 min-h-24" maxLength={280} placeholder="Who do you help, what problem do you solve, and what do you provide?" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div><Label>Category *</Label><Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{categories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>Stage *</Label><Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{stages.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
            <div><Label htmlFor="business-location">Location *</Label><Input id="business-location" className="mt-1.5" placeholder="Mountain View, CA" /></div>
          </div>

          <div className="rounded-xl bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
            Your member name and email will be reused. Nothing is published until StartupA2Z.org reviews the profile.
          </div>
        </div>

        <DialogFooter className="mt-1 sm:justify-between">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <div className="text-right">
            <Button type="button" disabled>Add Startup/Business</Button>
            <p className="mt-1 text-xs text-muted-foreground">UI prototype — nothing is saved yet.</p>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessSubmissionDialog;
