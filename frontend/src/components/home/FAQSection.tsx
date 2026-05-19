import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SectionHeading from "@/components/SectionHeading";

const faqs = [
  {
    question: "What is StartupA2Z?",
    answer:
      "StartupA2Z is a vibrant community platform connecting founders, investors, and entrepreneurs in the Bay Area. We organize events, provide resources, and foster collaboration to help startups grow and succeed.",
  },
  {
    question: "How can I join StartupA2Z events?",
    answer:
      "You can browse upcoming events on our Events page and RSVP directly. We also send out newsletters with event announcements. Membership is free for most events, though some premium sessions may require registration.",
  },
  {
    question: "Who can participate in StartupA2Z?",
    answer:
      "Our community is open to founders, co-founders, investors, mentors, and anyone interested in the startup ecosystem. Whether you're just starting out or a seasoned entrepreneur, you'll find valuable connections and opportunities here.",
  },
  {
    question: "How do I become a sponsor or partner?",
    answer:
      "We're always looking for partners who share our vision. Contact us through our Sponsorship page or email us directly. We offer various sponsorship tiers tailored to different needs and budgets.",
  },
  {
    question: "Are there resources for first-time founders?",
    answer:
      "Absolutely! We provide guides, mentorship programs, and workshops specifically designed for new entrepreneurs. Check out our Resources page for templates, checklists, and educational content.",
  },
  {
    question: "How can I get in touch with the team?",
    answer:
      "You can reach us through our Contact page, mailto:satish@startupa2z.org to us, or connect with us on social media. We're here to help and love hearing from our community members.",
  },
];

const FAQSection = () => (
  <section className="py-16 md:py-24 bg-background">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading
        tag="FAQ"
        title="Frequently Asked Questions"
        description="Got questions? We've got answers. Here are some of the most common questions we receive."
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-3xl mx-auto"
      >
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border rounded-lg px-6 bg-card hover:bg-accent/5 transition-colors"
            >
              <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  </section>
);

export default FAQSection;
