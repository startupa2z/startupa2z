export type PlaybookTakeaway = {
  title: string;
  description: string;
};

export type FounderPlaybook = {
  slug: string;
  label: string;
  eventSlug: string;
  storyAnchor: string;
  problemHeading: string;
  problemPoints: string[];
  solutionHeading: string;
  demonstrationHeading: string;
  workflowSteps: string[];
  takeLabel?: string;
  takeHeading: string;
  takeaways: PlaybookTakeaway[];
};

export const founderPlaybooks: FounderPlaybook[] = [
  {
    slug: "neil-fernandes-enrouteai",
    label: "Neil Fernandes · EnrouteAI",
    eventSlug: "founders-pitch-mix-2026-08-25",
    storyAnchor: "enrouteai",
    problemHeading: "What problem did Neil speak about?",
    problemPoints: [
      "Every shipper can send a different spreadsheet structure.",
      "Teams may need to price hundreds or thousands of lanes against a fixed deadline.",
      "Costs, market benchmarks, customer strategy, and bid history often live in separate systems.",
      "Manual cleanup and validation consume time before pricing even begins.",
    ],
    solutionHeading: "Keep the customer’s workflow. Replace the difficult middle.",
    demonstrationHeading: "A repeatable freight-pricing workflow",
    workflowSteps: [
      "Upload the RFP as received",
      "Validate lanes and inputs",
      "Price with carrier economics and market context",
      "Export in the shipper’s original format",
    ],
    takeHeading: "Adoption friction is part of the product",
    takeaways: [
      { title: "Choose the right wedge", description: "Start with recurring work that is visibly expensive, slow, or error-prone." },
      { title: "Preserve what works", description: "Keep the customer’s familiar inputs and required outputs whenever possible." },
      { title: "Sell the operational value", description: "Lead with faster decisions and fewer mistakes, not the technology alone." },
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
