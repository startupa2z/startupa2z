export type InsightFormat = "Article" | "Blog";

export type Insight = {
  slug: string;
  format: InsightFormat;
  category: string;
  title: string;
  deck: string;
  summary: string;
  author: string;
  publishedLabel: string;
  publishedIso: string;
  readTime: string;
  heroImage: string;
  heroAlt: string;
  sourcePostUrl: string;
};

export const insights: Insight[] = [
  {
    slug: "sf-tech-week-questions-founders-should-ask",
    format: "Article",
    category: "Ecosystem field notes",
    title: "SF Tech Week changed the questions I ask founders",
    deck: "Six recurring themes—and a practical decision matrix for founders building, securing, and financing the next stage of their company.",
    summary: "Satz Govindappa shares what changed after a week of in-person conversations about AI evaluation, sovereign infrastructure, agent security, customer understanding, brand, and financial readiness.",
    author: "Satish Govindappa",
    publishedLabel: "October 17, 2026",
    publishedIso: "2026-10-17",
    readTime: "9 min read",
    heroImage: "/insights/sf-tech-week-2026/sf-tech-week-field-notes.jpg",
    heroAlt: "SF Tech Week 2026 collage from Satish Govindappa's field notes",
    sourcePostUrl: "https://www.linkedin.com/feed/update/urn:li:share:7514885614949949440/",
  },
];

export const getInsight = (slug: string) => insights.find((insight) => insight.slug === slug);
