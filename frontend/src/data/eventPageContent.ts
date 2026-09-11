export type EventPageLink = {
  label: string;
  url: string;
};

export type EventSessionSegment = {
  time: string;
  title: string;
  description: string;
};

export type PreviousSession = {
  title: string;
  recapUrl: string;
  summary: string;
  takeaway: string;
  image: string;
  imageAlt: string;
  caption: string;
  galleryUrl: string;
};

export type EventPageContent = {
  why: string[];
  value: Array<{ title: string; description: string }>;
  speakerHeading: string;
  speaker: string[];
  speakerLinks: EventPageLink[];
  audience: string;
  sessionHeading: string;
  sessionIntro: string;
  sessionSegments: EventSessionSegment[];
};

export const previousStartupA2ZSessions: PreviousSession[] = [
  {
    title: "August 12 · Founder Fundamentals and Product Demonstrations",
    recapUrl: "/events/startup-a-to-z-hacker-dojo-august-12",
    summary:
      "Founders shared work across repeatable AI-video production, accessible hands-on computing, easier FPGA deployment, and continuous application security.",
    takeaway:
      "The strongest products remove a specific constraint, fit the user's real workflow, and make learning or feedback faster.",
    image: "/event-gallery/2026-08-12/event-01-20.jpg",
    imageAlt: "StartupA2Z August 12 founder session group photo",
    caption: "Founders and builders at the August 12 StartupA2Z session at Hacker Dojo.",
    galleryUrl: "/gallery/startup-a-to-z-hacker-dojo-august-12",
  },
  {
    title: "August 25 · Founder Stories, Product Demos, and Direct Feedback",
    recapUrl: "/events/founders-pitch-mix-2026-08-25",
    summary:
      "Founders spoke about freight-pricing automation, what traction does—and does not—prove, post-quantum wallet protection, and other real product journeys.",
    takeaway:
      "Build around a recurring customer problem, reduce adoption friction, and treat traction as evidence rather than automatic proof that the current direction is right.",
    image: "/event-gallery/2026-08-25/event-02-01.jpg",
    imageAlt: "StartupA2Z August 25 founder session group photo",
    caption: "Founders, operators, and community members after the August 25 session.",
    galleryUrl: "/gallery/founders-pitch-mix-2026-08-25",
  },
  {
    title: "September 1 · Hands-On Go-to-Market Workshop",
    recapUrl: "/events/founder-networking-workshop-2026-09-01",
    summary:
      "Raj Badarinath guided founders through ideal customers, buying signals, differentiation, category, positioning, messaging, and the path from product to repeatable revenue.",
    takeaway:
      "Diagnose the GTM system first, prove a focused customer wedge, and only then scale activity.",
    image: "/event-gallery/2026-09-01/event-03-01.jpg",
    imageAlt: "StartupA2Z September 1 go-to-market session group photo",
    caption: "StartupA2Z founders and builders at the September 1 GTM workshop.",
    galleryUrl: "/gallery/founder-networking-workshop-2026-09-01",
  },
];

export const eventPageContent: Record<string, EventPageContent> = {
  "founders-pitch-mix-2026-09-22": {
    why: [
      "Too many founders begin building products or services before confirming whether customers have a real, urgent requirement. This free, in-person session starts from the opposite direction: understand the problem, validate demand, and then build the right offering.",
      "Daniel Slayton will walk founders through the business story behind Wiz—how the opportunity emerged, what happened during the company journey, the challenges teams had to overcome, and what founders can learn before committing time and capital.",
      "The primary takeaway is practical: organizations have growing demand for capable partners who can assess risk, implement security platforms, secure cloud and product environments, and help companies become enterprise-ready.",
    ],
    value: [
      { title: "Validate before building", description: "Determine whether a genuine customer requirement exists before investing time and money." },
      { title: "Learn from the Wiz journey", description: "Understand the business story, important decisions, and challenges encountered during growth." },
      { title: "Recognize market opportunities", description: "See where customers need security partners and specialized services." },
      { title: "Convert demand into an offering", description: "Identify partner services founders can realistically develop, position, and sell." },
      { title: "Ask direct questions", description: "Discuss the opportunity with someone who experienced the journey." },
    ],
    speakerHeading: "About Daniel Slayton",
    speaker: [
      "Daniel brings an unusual combination of cybersecurity, technology, and leadership experience. He joined Wiz during its growth journey and now works in cybersecurity at Google. He also serves as a Captain in the U.S. Army—experience that reflects discipline, responsibility, and leadership under pressure.",
      "Daniel will share his background, the Wiz business story, what happened behind the scenes, the challenges encountered, the lessons learned, and where founders and security-service partners may find opportunities today.",
    ],
    speakerLinks: [{ label: "Connect with Daniel on LinkedIn", url: "https://www.linkedin.com/in/daniel-slayton/" }],
    audience:
      "Founders, cybersecurity professionals, consultants, cloud and AI practitioners, technology partners, and operators who want to understand real customer requirements and explore partner-led service opportunities.",
    sessionHeading: "The 80-Minute Wiz Session",
    sessionIntro: "The speaker program runs from 5:40 PM to 7:00 PM in two focused 40-minute segments.",
    sessionSegments: [
      { time: "5:40–6:20 PM", title: "Background and challenges", description: "Daniel's background, how the Wiz journey unfolded, the business story, key challenges, and lessons founders can apply." },
      { time: "6:20–7:00 PM", title: "Partnership opportunities", description: "Demand for partner services, where founders and practitioners can create value, and an open opportunity discussion." },
    ],
  },
  "founders-pitch-mix-2026-09-15": {
    why: [
      "The playbook that helps a startup secure its Seed round can become a liability by Series C. Investors change what they reward as a company moves from possibility to repeatable economics and durable growth.",
      "Vivek Somani will show founders how expectations migrate from TAM and narrative to unit economics, capital allocation, cash flow, Rule of 40, operating leverage, ROIC, and public-market valuation realities.",
      "The value is timing: founders can build the operating discipline required for the next stage before fundraising pressure exposes the gap.",
    ],
    value: [
      { title: "Understand the lifecycle shift", description: "See how investor expectations change from Seed through Series C." },
      { title: "Track the right metrics", description: "Know when burn multiple and acquisition velocity must give way to operating leverage and ROIC." },
      { title: "Avoid the multiple trap", description: "Understand where private venture expectations collide with public-market valuation discipline." },
      { title: "Build for the next stage", description: "Make operating decisions today that preserve later fundraising options." },
      { title: "Ask direct questions", description: "Pressure-test your assumptions with an investor and experienced technology leader." },
    ],
    speakerHeading: "About Vivek Somani",
    speaker: [
      "Vivek is an investor and former customer-focused technology leader who brings a practical perspective on startup economics, capital allocation, and valuation.",
      "He shares investing education through OptionGig and hosts a large Bay Area community for DIY investors.",
    ],
    speakerLinks: [
      { label: "Connect with Vivek on LinkedIn", url: "https://www.linkedin.com/in/meetviveksomani/" },
      { label: "Explore OptionGig and Optalyzer", url: "https://optiongig.com/" },
      { label: "Follow Vivek on X", url: "https://x.com/VivekChirps" },
    ],
    audience:
      "Founders, startup finance leaders, operators, and investors who want to understand how fundraising expectations change from Seed through Series C and public-market readiness.",
    sessionHeading: "The 100-Minute Masterclass",
    sessionIntro: "Vivek's masterclass runs from 5:40 PM to 7:20 PM and connects fundraising narratives to the economics required at later stages.",
    sessionSegments: [
      { time: "5:40–7:20 PM", title: "Business lifecycle economics and valuation realities", description: "Lifecycle shifts, metric migration, capital efficiency, the multiple trap, and practical founder questions." },
    ],
  },
};
