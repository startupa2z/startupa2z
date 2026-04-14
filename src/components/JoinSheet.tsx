import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowRight, Users } from "lucide-react";

interface JoinSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JoinSheet = ({ open, onOpenChange }: JoinSheetProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    linkedin: "",
    about: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.role) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Welcome to Startupa2z! We'll be in touch soon.");
      setFormData({ name: "", email: "", role: "", linkedin: "", about: "" });
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center mb-2">
            <Users className="w-6 h-6 text-secondary-foreground" />
          </div>
          <SheetTitle className="font-heading text-2xl text-primary">Join the Community</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Fill in your details to become a part of the Bay Area's most trusted startup ecosystem.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="join-name">Full Name <span className="text-destructive">*</span></Label>
            <Input
              id="join-name"
              placeholder="Jane Doe"
              maxLength={100}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="join-email">Email <span className="text-destructive">*</span></Label>
            <Input
              id="join-email"
              type="email"
              placeholder="jane@startup.com"
              maxLength={255}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="join-role">I am a… <span className="text-destructive">*</span></Label>
            <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
              <SelectTrigger id="join-role">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="founder">Founder</SelectItem>
                <SelectItem value="investor">Investor</SelectItem>
                <SelectItem value="mentor">Mentor / Advisor</SelectItem>
                <SelectItem value="operator">Operator (Eng / Design / PM)</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="join-linkedin">LinkedIn Profile <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Input
              id="join-linkedin"
              placeholder="https://linkedin.com/in/janedoe"
              maxLength={300}
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="join-about">Tell us about yourself <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Textarea
              id="join-about"
              placeholder="What are you working on? What are you looking for?"
              maxLength={500}
              rows={3}
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold rounded-full h-12 text-base"
          >
            {submitting ? "Submitting…" : "Join Now"}
            {!submitting && <ArrowRight className="ml-2 w-4 h-4" />}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By joining, you agree to our community guidelines and privacy policy.
          </p>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default JoinSheet;
