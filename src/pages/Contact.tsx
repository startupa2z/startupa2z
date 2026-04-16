import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/SectionHeading";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MapPin, Send, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const faqs = [
  { q: "How do I join Startupa2z?", a: "Simply fill out the contact form on this page or attend one of our open events. We'll get you connected with the right community group." },
  { q: "Is Startupa2z free?", a: "Our core community membership and most events are free. Some premium workshops and conferences may have a nominal fee." },
  { q: "Can I list my startup in the directory?", a: "Yes! Submit your startup details through the contact form, selecting 'Submit a Startup' as the inquiry type. We'll review and list it within 48 hours." },
  { q: "I'm an investor. How do I get involved?", a: "Register as an investor through this form. We'll connect you with our investor network and invite you to exclusive deal flow events." },
  { q: "Do you offer mentorship for early-stage founders?", a: "Yes. We pair early-stage founders with experienced operators and investors from the Bay Area. Select 'Join the Community' and mention you're looking for mentorship in your message." },
  { q: "How can my company sponsor or partner with Startupa2z?", a: "We work with companies on event sponsorships, ecosystem partnerships, and co-hosted programs. Reach out via the form with 'Sponsorship' or 'Partnership Inquiry' selected and our team will follow up within a few business days." },
];

const Contact = () => {
  const { toast } = useToast();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message sent!", description: "We'll get back to you within 48 hours." });
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
                  <Input placeholder="First name *" required className="rounded-xl h-12" />
                  <Input placeholder="Last name *" required className="rounded-xl h-12" />
                </div>
                <Input placeholder="Email address *" type="email" required className="rounded-xl h-12" />
                <Input placeholder="LinkedIn Profile (optional)" type="url" className="rounded-xl h-12" />
                <Select>
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
                <Select required>
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
                <Textarea placeholder="Your message" className="rounded-xl min-h-[120px]" />
                <Button type="submit" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-8 h-12 text-base font-semibold w-full sm:w-auto">
                  Send Message <Send className="ml-2 w-4 h-4" />
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
