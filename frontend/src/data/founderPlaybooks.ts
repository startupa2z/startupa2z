export type PlaybookTakeaway = {
  title: string;
  description: string;
};

export type PlaybookFaq = {
  question: string;
  answer: string;
};

export type CaseStudyChapter = {
  label: string;
  title: string;
  paragraphs: string[];
  points?: string[];
  quote?: string;
};

export type FounderCaseStudy = {
  title: string;
  deck: string;
  visual: string;
  visualAlt: string;
  snapshot: Array<{ label: string; value: string }>;
  metrics: Array<{ value: string; label: string; note: string }>;
  customerRange: {
    minimum: string;
    maximum: string;
    description: string;
  };
  chapters: CaseStudyChapter[];
  operatingDecisions: PlaybookTakeaway[];
};

export type FounderPlaybook = {
  slug: string;
  label: string;
  eventSlug: string;
  storyAnchor: string;
  introductionHeading?: string;
  introductionParagraphs?: string[];
  problemHeading: string;
  problemPoints: string[];
  solutionHeading: string;
  demonstrationHeading: string;
  workflowSteps: string[];
  takeLabel?: string;
  takeHeading: string;
  takeaways: PlaybookTakeaway[];
  problemNarrative?: string;
  solutionNarrative?: string;
  founderJourneyHeading?: string;
  founderJourney?: string[];
  lessonsHeading?: string;
  lessons?: PlaybookTakeaway[];
  takeNarrative?: string;
  faqs?: PlaybookFaq[];
  caseStudy?: FounderCaseStudy;
};

export const founderPlaybooks: FounderPlaybook[] = [
  {
    slug: "neil-fernandes-enrouteai",
    label: "Neil Fernandes · EnrouteAI",
    eventSlug: "founders-pitch-mix-2026-08-25",
    storyAnchor: "enrouteai",
    introductionHeading: "Founder and company introduction",
    introductionParagraphs: [
      "Neil Fernandes built his expertise around transportation, operations research, and the mathematics behind routes, loading, capacity, and delivery economics. Working with an MIT professor also gave him direct exposure to the operational problems transportation companies face.",
      "EnrouteAI is a bootstrapped freight-technology company that helps fleet owners decide what price they should charge for full-truckload capacity. This Playbook captures the customer-discovery and company-building lessons behind that journey.",
    ],
    caseStudy: {
      title: "How EnrouteAI found its market by selling the outcome first",
      deck:
        "A transportation-optimization idea became a freight-pricing business by treating the product as adaptable and following the customer’s most urgent work.",
      visual: "/event-media/august-25-2026/enrouteai-case-study-freight-pricing.png",
      visualAlt: "Semi-truck fleet with freight-capacity, route, and pricing data visualizations",
      snapshot: [
        { label: "Industry", value: "Trucking and freight" },
        { label: "Started with", value: "Delivery optimization" },
        { label: "Found demand in", value: "Full-truckload pricing" },
        { label: "Growth model", value: "Bootstrapped and customer-led" },
      ],
      metrics: [
        { value: "Small", label: "Team", note: "Bootstrapped and customer-led" },
        { value: "$1M", label: "Smallest customer revenue", note: "Approximate company revenue" },
        { value: "Enterprise", label: "Largest customer company", note: "Multi-billion-dollar U.S. enterprise" },
        { value: "2", label: "Early acquisition channels", note: "Trade conferences and cold calling" },
      ],
      customerRange: {
        minimum: "$1M",
        maximum: "Multi-billion-dollar enterprise",
        description: "The reported annual-revenue range of companies served by EnrouteAI—from a small operator to a multi-billion-dollar U.S. enterprise.",
      },
      chapters: [
        {
          label: "The context",
          title: "Domain expertise shaped the starting point",
          paragraphs: [
            "Transportation had interested Neil since childhood. He later studied it during his master’s program and worked with an MIT professor, where he saw the operational problems faced by transportation companies firsthand.",
            "He understood the mathematics behind route planning, loading, capacity, and delivery economics. The opportunity appeared to be bringing capabilities used by companies such as Amazon to smaller operators that could not build large optimization teams.",
          ],
        },
        {
          label: "The original bet",
          title: "Make advanced delivery optimization available to everyone",
          paragraphs: [
            "Neil’s first product helped plan package-delivery routes and determine how a truck should be loaded. It was technically connected to a real industry problem—but that did not automatically make it the right business.",
            "The initial product became a starting point rather than the final destination. The underlying optimization capability was valuable; the market still had to reveal where that capability was most urgently needed.",
          ],
        },
        {
          label: "The challenge",
          title: "Good technology did not remove adoption friction",
          paragraphs: [
            "Fleet operators already had processes, spreadsheets, deadlines, and people responsible for pricing. Asking them to adopt a new product created resistance even when the technology was strong.",
            "Neil realized that a general pain point is not the same as demand. Customers experience many problems, but they act only when important work is blocked and time is running out.",
          ],
          quote: "People do not buy products. They buy a solution to the problem they have.",
        },
        {
          label: "The discovery",
          title: "Demand is a blocked project with a deadline",
          paragraphs: [
            "Truckload carriers must submit prices for their capacity whether EnrouteAI exists or not. That pricing project is the demand. The stronger offer was not ‘buy our pricing software’; it was ‘we will price this bid before your deadline.’",
            "That distinction changed both the message and the way Neil evaluated opportunities.",
          ],
          points: [
            "There is a specific project the customer must complete.",
            "The customer is blocked by current tools, knowledge, or capacity.",
            "The project is urgent and attached to a real deadline.",
          ],
        },
        {
          label: "The action",
          title: "Find one real buyer, show up, and learn by selling",
          paragraphs: [
            "Neil replaced abstract personas with a concrete hypothesis: a specific pricing leader at a specific trucking company. From there, he worked backward to find where those buyers gathered.",
            "Specialized trucking conferences and cold calling helped him reach early prospects. Instead of waiting for a finished product, he recommended showing a mock-up or completing the work manually to learn what customers would actually pay to solve.",
          ],
          points: [
            "Name the exact decision-maker and company.",
            "Go where that buyer already spends time.",
            "Show the outcome with a mock-up before overbuilding.",
            "Use rejection and manual delivery to shorten the learning cycle.",
          ],
        },
        {
          label: "The turning point",
          title: "Customer pull moved the company into truckload pricing",
          paragraphs: [
            "The original delivery product evolved as customers exposed a stronger opportunity. If route optimization could reveal the cost of serving a load, the same foundation could help determine what that truck capacity should be sold for.",
            "EnrouteAI became a pricing engine for full-truckload fleets. The product direction came from repeated market evidence—not from protecting the original idea.",
          ],
        },
        {
          label: "Where it stands",
          title: "A focused, bootstrapped business serving very different fleet operators",
          paragraphs: [
            "EnrouteAI operates with a small team. Its customers range from a business with roughly $1 million in revenue to a multi-billion-dollar U.S. enterprise.",
            "The talk did not present a predetermined five-year expansion plan. Neil’s position was that the next market—whether LTL, ocean freight, air freight, or something else—should be decided by demonstrated customer pull.",
          ],
        },
      ],
      operatingDecisions: [
        {
          title: "Bootstrap unless scale creates a clear reason to raise",
          description: "VC is useful for some companies, but capital cannot repair missing product-market fit. Neil would reconsider only if demand or competition required much faster scaling.",
        },
        {
          title: "Treat the first hire as a company-defining decision",
          description: "A poor first hire can damage a young company. Trust, alignment, and a credible network introduction matter more than making the team look large quickly.",
        },
        {
          title: "Build for a decade, not an overnight outcome",
          description: "Neil described entrepreneurship as a marathon. Realistic expectations help founders preserve energy and avoid making short-term decisions for an imagined quick exit.",
        },
        {
          title: "Let customers decide the roadmap",
          description: "The company should move toward the market that pulls hardest rather than forcing reality to match a founder’s original prediction.",
        },
      ],
    },
    problemHeading: "The freight-pricing problem",
    problemPoints: [
      "Trucking fleets must decide what price to quote for the capacity on their trucks.",
      "Many carriers still price full truckloads using spreadsheets, intuition, and manual analysis.",
      "Routes, capacity, costs, and market conditions make truckload pricing difficult to do consistently.",
      "The pricing work must still be completed by a deadline whether or not a software product exists.",
    ],
    problemNarrative:
      "Airlines use sophisticated systems to price seats dynamically. Trucking fleets sell capacity in a similar way, but many still depend on spreadsheets and experience to decide what a full truckload should cost.",
    solutionHeading: "Build the pricing engine behind the fleet’s decision.",
    solutionNarrative:
      "EnrouteAI applies optimization to help fleet owners determine what price they should charge for full-truckload capacity. Neil’s larger point was that customers buy the completed pricing outcome—not the underlying AI, mathematics, or software.",
    founderJourneyHeading: "From transportation research to EnrouteAI",
    founderJourney: [
      "Neil’s interest in transportation began early and continued through his master’s research.",
      "Working with an MIT professor exposed him to transportation companies and their operational problems firsthand.",
      "His first product focused on package-delivery optimization: route planning, truck loading, and bringing Amazon-like capabilities to smaller operators.",
      "Customer conversations and selling revealed a stronger opportunity in truckload pricing, so the same optimization foundation evolved into EnrouteAI’s current product.",
      "EnrouteAI operates with a small team and serves organizations ranging from roughly $1 million in revenue to a multi-billion-dollar U.S. enterprise.",
    ],
    demonstrationHeading: "A framework for validating demand",
    workflowSteps: [
      "Name a specific buyer—not an abstract persona",
      "Find a project that is blocked, urgent, and deadline-driven",
      "Use a mock-up or deliver the result manually",
      "Iterate until customers pull the solution from you",
    ],
    lessonsHeading: "The operating lessons behind the company",
    lessons: [
      {
        title: "Demand exists before the product",
        description: "Real demand is an important project that must be completed by a deadline, is currently blocked, and is urgent enough for the customer to act.",
      },
      {
        title: "Sell the outcome",
        description: "Offering to complete a customer’s bid is easier to adopt than asking the customer to buy another product and change how the work gets done.",
      },
      {
        title: "Learn by selling",
        description: "A mock-up, a manual service, and direct rejection can teach more than months of isolated product development or theoretical positioning.",
      },
      {
        title: "Let the startup evolve",
        description: "EnrouteAI moved from package-delivery optimization to truckload pricing because customers exposed a stronger market problem.",
      },
      {
        title: "Find the first customer precisely",
        description: "Identify a real decision-maker at a real company, then reverse-engineer where that person can be reached. Neil used industry conferences and cold calling.",
      },
      {
        title: "Look for customer pull",
        description: "Strong sales is less about persuading reluctant prospects and more about finding buyers whose urgent, blocked work makes them ask for the solution.",
      },
      {
        title: "Use venture capital selectively",
        description: "VC fits only some businesses. Raising before product-market fit can amplify the wrong decisions, and money cannot repair missing demand.",
      },
      {
        title: "Prepare for a long journey",
        description: "Neil described entrepreneurship as a decade-long marathon, not an overnight path to wealth. Founders must manage expectations and avoid burnout.",
      },
      {
        title: "Treat the first hire as a founder-level decision",
        description: "A poor first hire can seriously damage a young company. Trust, alignment, and introductions through a credible network matter greatly.",
      },
      {
        title: "Let customers determine the roadmap",
        description: "EnrouteAI may eventually enter LTL, ocean, or air freight, but Neil will follow demonstrated customer pull rather than force a five-year prediction.",
      },
    ],
    takeHeading: "Build toward pull, not persuasion",
    takeNarrative:
      "The shortest path is to identify a specific buyer with urgent, blocked work, deliver the outcome before overbuilding, and let repeated customer pull determine what the startup becomes.",
    takeaways: [
      { title: "Validate urgency", description: "A pain point becomes demand when the customer has a blocked project and a real deadline." },
      { title: "Deliver before scaling", description: "Use mock-ups and manual execution to prove value before investing heavily in the product." },
      { title: "Follow the evidence", description: "Allow customers, sales, and repeated use to shape the product and the company’s direction." },
    ],
    faqs: [
      {
        question: "What does EnrouteAI do?",
        answer: "EnrouteAI makes RFP pricing software for truckload carriers. It helps fleets decide what to charge for full-truckload capacity when responding to freight RFPs.",
      },
      {
        question: "How is EnrouteAI similar to airline pricing?",
        answer: "Airlines dynamically price seats. EnrouteAI applies optimization principles to the capacity that trucking fleets sell.",
      },
      {
        question: "Does EnrouteAI price less-than-truckload shipments?",
        answer: "Not currently. Neil said the company’s present focus is full-truckload pricing.",
      },
      {
        question: "What was Neil’s original product?",
        answer: "It focused on package-delivery optimization, including route planning and deciding how trucks should be loaded.",
      },
      {
        question: "How did the product move into truckload pricing?",
        answer: "Selling and customer conversations revealed a stronger opportunity. The original optimization capability evolved to address that demand.",
      },
      {
        question: "How should founders identify genuine demand?",
        answer: "Find a customer project that is blocked, urgent, and tied to a deadline—not merely a general pain point.",
      },
      {
        question: "Should founders build the complete product before approaching customers?",
        answer: "No. Neil recommended starting with a mock-up or manually delivering the outcome so the founder can learn before overbuilding.",
      },
      {
        question: "How did Neil find early customers?",
        answer: "He showed up at specialized trucking conferences, spoke directly with specific decision-makers, and used cold calling.",
      },
      {
        question: "Why does Neil prefer customer pull over persuasion?",
        answer: "Customers facing urgent, blocked work adopt faster. A prospect who requires heavy convincing may buy temporarily and then churn.",
      },
      {
        question: "Does Neil plan to raise venture capital?",
        answer: "Not presently. He believes VC is suitable for only some companies and cannot compensate for missing product-market fit.",
      },
      {
        question: "How large is the EnrouteAI team?",
        answer: "EnrouteAI operates with a small team.",
      },
      {
        question: "What matters when making the first hire?",
        answer: "Trust, alignment, and a strong personal or network-based reference. Neil considers the first hire a high-impact decision that can harm the company if handled poorly.",
      },
      {
        question: "Where will EnrouteAI expand next?",
        answer: "Neil has not predetermined the answer. The company will follow demonstrated demand, whether that eventually leads to LTL, ocean freight, air freight, or another adjacent market.",
      },
      {
        question: "What resources did Neil recommend?",
        answer: "He explicitly recommended The Mom Test and Paul Graham’s early startup essays.",
      },
    ],
  },
  {
    slug: "achal-pandey-vachi",
    label: "Achal Pandey · Vachi",
    eventSlug: "founders-pitch-mix-2026-08-25",
    storyAnchor: "vachi",
    problemHeading: "What problem was Vachi trying to solve?",
    problemPoints: [
      "People carry unfinished tasks and ideas across disconnected tools.",
      "Capturing intent is easy; turning it into dependable follow-through is harder.",
      "Early user interest did not automatically resolve the long-term product direction.",
    ],
    solutionHeading: "Test the pain through conversations and a focused product experiment.",
    demonstrationHeading: "From customer discovery to a voice-first product",
    workflowSteps: [
      "Interview small-business users",
      "Validate the mental-load problem",
      "Build a voice-first brain-dump experience",
      "Use market evidence to reassess the thesis",
    ],
    takeHeading: "Traction is evidence, not an obligation to continue",
    takeaways: [
      { title: "Separate usage from conviction", description: "A product can attract users without becoming the company a founder wants to build." },
      { title: "Revisit the thesis", description: "Use experiments to test the business direction, not only feature demand." },
      { title: "Know when to stop", description: "Closing a chapter can be disciplined execution when the evidence changes." },
    ],
  },
  {
    slug: "ridham-bhagat-quip-network",
    label: "Ridham Bhagat · Quip Network",
    eventSlug: "founders-pitch-mix-2026-08-25",
    storyAnchor: "quip-network",
    problemHeading: "What security problem did Ridham demonstrate?",
    problemPoints: [
      "Today’s blockchain wallets depend on signatures that are not post-quantum secure.",
      "A capable quantum attacker could forge authorization and move another user’s funds.",
      "Post-quantum signature schemes are still evolving, so a permanent verifier creates migration risk.",
    ],
    solutionHeading: "Protect the funds in a contract and make signature verification replaceable.",
    demonstrationHeading: "A wallet flow with a pluggable verifier",
    workflowSteps: [
      "Hold funds in an on-chain contract",
      "Send the proposed signature to a verifier",
      "Release funds only after verification",
      "Swap the verifier as cryptography improves",
    ],
    takeLabel: "Technical take",
    takeHeading: "Design for cryptographic change without moving customer funds",
    takeaways: [
      { title: "Separate funds from keys", description: "The contract can protect assets even when the signing method must change." },
      { title: "Build replaceable trust", description: "A pluggable verifier avoids locking the system to one immature scheme." },
      { title: "Minimize migration", description: "Security upgrades are easier when users do not have to move funds or recreate keys." },
    ],
  },
  {
    slug: "digvijay-goswami-sidharth-raja-keyframe-ai",
    label: "Digvijay Goswami & Sidharth Raja · Keyframe AI",
    eventSlug: "startup-a-to-z-hacker-dojo-august-12",
    storyAnchor: "keyframe-ai",
    problemHeading: "What creative-production problem did Keyframe AI address?",
    problemPoints: [
      "AI video can generate striking individual clips without maintaining a coherent story.",
      "Characters, scenes, motion, and art direction may change between shots.",
      "Creative teams need iteration and control, not only one impressive output.",
    ],
    solutionHeading: "Connect scripting, generation, editing, and iteration into one controllable workflow.",
    demonstrationHeading: "From an idea to a repeatable AI-video process",
    workflowSteps: [
      "Develop the narrative and script",
      "Generate visual scenes",
      "Review continuity and creative direction",
      "Edit and iterate toward a coherent story",
    ],
    takeHeading: "Repeatability matters more than one impressive clip",
    takeaways: [
      { title: "Own the workflow", description: "Durable value comes from connecting the complete production process." },
      { title: "Preserve creative control", description: "Automation should accelerate iteration without removing the creator’s decisions." },
      { title: "Design for consistency", description: "A production tool must maintain characters, scenes, and direction across outputs." },
    ],
  },
  {
    slug: "claudio-olmedo-one-dollar-computer",
    label: "ClaudIO Olmedo · One Dollar Computer",
    eventSlug: "startup-a-to-z-hacker-dojo-august-12",
    storyAnchor: "one-dollar-computer",
    problemHeading: "Who is excluded by the current cost of computing?",
    problemPoints: [
      "Hands-on technology education often assumes access to expensive laptops and laboratories.",
      "Finished consumer devices can hide how computing works from the learner.",
      "Cost and complexity prevent many children from experimenting directly with hardware.",
    ],
    solutionHeading: "Reduce the computer to an affordable, open platform built for experimentation.",
    demonstrationHeading: "A low-cost path into hands-on computing",
    workflowSteps: [
      "Use an open RISC-V foundation",
      "Remove unnecessary hardware cost",
      "Expose the computer as a learning system",
      "Let students experiment directly",
    ],
    takeHeading: "Accessibility can be the product requirement",
    takeaways: [
      { title: "Start with the excluded user", description: "Design around people the existing solution cannot economically serve." },
      { title: "Remove hidden assumptions", description: "Question which features and costs are actually required for the learning outcome." },
      { title: "Make learning tangible", description: "Direct experimentation can teach more than another finished application." },
    ],
  },
  {
    slug: "ayush-kumar-configai",
    label: "Ayush Kumar · ConfigAI",
    eventSlug: "startup-a-to-z-hacker-dojo-august-12",
    storyAnchor: "configai",
    problemHeading: "Why is deploying AI models on FPGAs still difficult?",
    problemPoints: [
      "Machine-learning engineers and chip-design teams work with different tools and abstractions.",
      "FPGA deployment can require hardware languages, scheduling, mapping, and specialized optimization.",
      "The expertise gap can turn deployment into a months-long engineering project.",
    ],
    solutionHeading: "Translate familiar model formats into FPGA implementations automatically.",
    demonstrationHeading: "A compiler between ML models and specialized hardware",
    workflowSteps: [
      "Accept a familiar model format",
      "Analyze the model and hardware target",
      "Automate mapping and scheduling",
      "Generate the FPGA implementation",
    ],
    takeHeading: "Hide specialized complexity without hiding control",
    takeaways: [
      { title: "Meet developers where they work", description: "Support the model formats and workflows engineers already understand." },
      { title: "Automate the expertise bottleneck", description: "The opportunity sits where scarce specialists slow down otherwise capable teams." },
      { title: "Make advanced hardware usable", description: "A strong developer tool expands access without forcing every user to become a chip expert." },
    ],
  },
  {
    slug: "divakar-prayaga-purplelens",
    label: "Divakar Prayaga · PurpleLens",
    eventSlug: "startup-a-to-z-hacker-dojo-august-12",
    storyAnchor: "purplelens",
    problemHeading: "Why does end-of-cycle security testing fail fast-moving teams?",
    problemPoints: [
      "AI-assisted development helps teams ship code faster.",
      "Attackers increasingly automate discovery and exploitation.",
      "Periodic testing can identify problems only after they have become expensive release blockers.",
    ],
    solutionHeading: "Move application-security testing into the development lifecycle.",
    demonstrationHeading: "Security as a continuous engineering capability",
    workflowSteps: [
      "Test throughout development",
      "Find weaknesses before release",
      "Return findings to engineering quickly",
      "Repeat as the application changes",
    ],
    takeHeading: "Security must move at product-development speed",
    takeaways: [
      { title: "Shift feedback earlier", description: "Security findings are easier to fix before customers and deadlines are involved." },
      { title: "Treat security as engineering", description: "Continuous testing belongs inside the product lifecycle, not outside it." },
      { title: "Prevent business impact", description: "Late security failures can become product, compliance, and reputation problems." },
    ],
  },
];

export const getFounderPlaybook = (slug: string) =>
  founderPlaybooks.find((playbook) => playbook.slug === slug);

export const getFounderPlaybookByStory = (eventSlug: string, storyAnchor: string) =>
  founderPlaybooks.find(
    (playbook) => playbook.eventSlug === eventSlug && playbook.storyAnchor === storyAnchor,
  );

export const getFounderPlaybookPath = (playbook: FounderPlaybook) =>
  `/resources/founder-playbooks/${playbook.slug}`;
