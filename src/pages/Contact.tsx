import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MapPin, Send, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const faqs = [
  { q: "How do I join Startupa2z?", a: "Simply fill out the contact form on this page or attend one of our open events. We'll get you connected with the right community group." },
  { q: "Is Startupa2z free?", a: "Our core community membership and most events are free. Some premium workshops and conferences may have a nominal fee." },
  { q: "Can I list my startup in the directory?", a: "Yes! Submit your startup details through the contact form, selecting 'Submit a Startup' as the inquiry type. We'll review and list it within 48 hours." },
  { q: "I'm an investor. How do I get involved?", a: "Register as an investor through this form. We'll connect you with our investor network and invite you to exclusive deal flow events." },
  { q: "Do you offer mentorship for early-stage founders?", a: "Yes. We pair early-stage founders with experienced operators and investors from the Bay Area. Select 'Join the Community' and mention you're looking for mentorship in your message." },
  { q: "How can my company sponsor or partner with Startupa2z?", a: "We work with companies on event sponsorships, ecosystem partnerships, and co-hosted programs. Reach out via the form with 'Sponsorship' or 'Partnership Inquiry' selected and our team will follow up within a few business days." },
];

const contactSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required").max(100, "Max 100 characters"),
  last_name: z.string().trim().min(1, "Last name is required").max(100, "Max 100 characters"),
  email: z.string().trim().email("Invalid email").max(255, "Max 255 characters"),
  linkedin_url: z.string().trim().url("Invalid URL").max(500).optional().or(z.literal("")),
  role: z.string().max(50).optional().or(z.literal("")),
  inquiry_type: z.string().min(1, "Inquiry type is required").max(50),
  message: z.string().max(2000, "Max 2000 characters").optional().or(z.literal("")),
});

type FormState = {
  first_name: string;
  last_name: string;
  email: string;
  linkedin_url: string;
  role: string;
  inquiry_type: string;
  message: string;
};

const initialState: FormState = {
  first_name: "",
  last_name: "",
  email: "",
  linkedin_url: "",
  role: "",
  inquiry_type: "",
  message: "",
};

const Contact = () => {
  const { toast } = useToast();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);

  const update = (k: keyof FormState, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      toast({
        title: "Please check the form",
        description: first?.message ?? "Some fields are invalid.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const payload = {
      first_name: parsed.data.first_name,
      last_name: parsed.data.last_name,
      email: parsed.data.email,
      linkedin_url: parsed.data.linkedin_url || null,
      role: parsed.data.role || null,
      inquiry_type: parsed.data.inquiry_type,
      message: parsed.data.message || null,
    };

    const { error } = await supabase.from("contact_submissions").insert(payload);
    setSubmitting(false);

    if (error) {
      console.error("Contact submission error:", error);
      toast({
        title: "Something went wrong",
        description: "We couldn't send your message. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Message sent!", description: "We'll get back to you within 48 hours." });
    setForm(initialState);
  };

  return (
    <PageLayout>
      <section className="section-padding gradient-hero-solid text-center" style={{ paddingTop: "calc(64px + clamp(3rem, 6vw, 5rem))" }}>
        <div className="container-narrow">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full bg-white/10 text-secondary">Contact</span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">Get in Touch</h1>
            <p className="text-lg text-white/70 max-w-xl mx-auto">Have a question, partnership idea, or want to join? We'd love to hear from you.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h3 className="font-heading text-2xl font-bold text-primary mb-6">Send Us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    placeholder="First name *"
                    required
                    maxLength={100}
                    value={form.first_name}
                    onChange={(e) => update("first_name", e.target.value)}
                    className="rounded-xl h-12"
                  />
                  <Input
                    placeholder="Last name *"
                    required
                    maxLength={100}
                    value={form.last_name}
                    onChange={(e) => update("last_name", e.target.value)}
                    className="rounded-xl h-12"
                  />
                </div>
                <Input
                  placeholder="Email address *"
                  type="email"
                  required
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="rounded-xl h-12"
                />
                <Input
                  placeholder="LinkedIn Profile (optional)"
                  type="url"
                  maxLength={500}
                  value={form.linkedin_url}
                  onChange={(e) => update("linkedin_url", e.target.value)}
                  className="rounded-xl h-12"
                />
                <Select value={form.role} onValueChange={(v) => update("role", v)}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="I am a..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="founder">Founder</SelectItem>
                    <SelectItem value="cofounder">Co-founder</SelectItem>
                    <SelectItem value="investor">Investor</SelectItem>
                    <SelectItem value="mentor">Mentor / Advisor</SelectItem>
                    <SelectItem value="operator">Operator / Employee</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="service-provider">Service Provider</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Select required value={form.inquiry_type} onValueChange={(v) => update("inquiry_type", v)}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Inquiry type *" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="join">Join the Community</SelectItem>
                    <SelectItem value="startup">Submit a Startup</SelectItem>
                    <SelectItem value="invest">Investor Registration</SelectItem>
                    <SelectItem value="partner">Partnership Inquiry</SelectItem>
                    <SelectItem value="sponsor">Sponsorship</SelectItem>
                    <SelectItem value="event">Event Collaboration</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Your message"
                  maxLength={2000}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className="rounded-xl min-h-[120px]"
                />
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-8 h-12 text-base font-semibold w-full sm:w-auto"
                >
                  {submitting ? "Sending..." : (<>Send Message <Send className="ml-2 w-4 h-4" /></>)}
                </Button>
              </form>
            </motion.div>

            {/* Info + FAQ */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="glass-card p-6 mb-8">
                <h4 className="font-heading font-semibold text-primary mb-4">Contact Info</h4>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-accent" /> hello@startupa2z.org</div>
                  <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-accent" /> San Francisco, Bay Area, CA</div>
                </div>
              </div>

              <h4 className="font-heading font-semibold text-primary mb-4">Frequently Asked Questions</h4>
              <div className="space-y-2">
                {faqs.map((faq, i) => (
                  <div key={i} className="glass-card overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left text-sm font-medium text-primary hover:bg-muted/50 transition-colors"
                    >
                      {faq.q}
                      {openFaq === i ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 text-sm text-muted-foreground">{faq.a}</div>
                    )}
                  </div>
                ))}
              </div>

            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Contact;
