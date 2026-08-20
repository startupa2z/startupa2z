export type FounderStory = {
  anchor: string;
  founders: string;
  company: string;
  headline: string;
  challenge: string;
  approach: string;
  lesson: string;
  image: string;
  imageAlt: string;
  website: string;
  directoryPath?: string;
  founderProfiles: Array<{
    name: string;
    url: string;
    internal?: boolean;
  }>;
  sourcePost: string;
};

export type EventSummary = {
  slug: string;
  eventSlug: string;
  title: string;
  eventTitle: string;
  date: string;
  venue: string;
  address: string;
  coverImage: string;
  summary: string;
  program: string[];
  founderStories: FounderStory[];
  keyLessons: string[];
  status: "draft" | "published";
};

export const eventSummaries: EventSummary[] = [
  {
    slug: "hacker-dojo-august-12-2026",
    eventSlug: "startup-a-to-z-hacker-dojo-august-12",
    title: "August 12 at Hacker Dojo: The First StartupA2Z Founder Gathering",
    eventTitle: "Bay Area Founders Pitch & Startup Networking",
    date: "August 12, 2026",
    venue: "Hacker Dojo, Mountain View",
    address: "855 Maude Ave, Mountain View, CA 94043",
    coverImage:
      "https://images.lumacdn.com/event-social/uj/b1008796-76dc-4efd-96b4-b3e35890b79f.png",
    summary:
      "StartupA2Z's first Hacker Dojo Founder Pitch & Mix brought builders together for practical startup fundamentals, founder demonstrations, direct feedback, and community conversation. Four presentations stood out: affordable hands-on computing, easier FPGA deployment for machine-learning teams, continuous application security, and more consistent AI-video production.",
    program: [
      "Startup Basics from A to Z",
      "Founder pitches and live product demonstrations",
      "Audience pitches and direct feedback",
      "Founder and community networking",
    ],
    founderStories: [
      {
        anchor: "keyframe-ai",
        founders: "Digvijay Goswami and Sidharth Raja",
        company: "Keyframe AI",
        headline: "Moving AI video from impressive clips to repeatable production",
        challenge:
          "AI-generated video can be fast and visually striking, but characters, scenes, movement, and creative direction often become inconsistent across a complete story.",
        approach:
          "The Keyframe AI co-founders demonstrated a connected workflow for scripting, visual generation, editing, and iteration, including an unexpected rocket-launch result that made the experimentation challenge memorable.",
        lesson:
          "The durable value is not one impressive clip. It is whether a creative team can repeatedly turn an idea into a coherent, production-ready story while preserving control.",
        image: "/event-media/august-12-2026/keyframe-ai-founders.jpg",
        imageAlt: "Keyframe AI founders Sidharth Raja and Digvijay Goswami presenting at Hacker Dojo",
        website: "https://www.keyframe.art/",
        directoryPath: "/startups/keyframe",
        founderProfiles: [
          {
            name: "Digvijay Goswami",
            url: "/founders/digvijay-goswami",
            internal: true,
          },
          {
            name: "Sidharth Raja",
            url: "/founders/sidharth-raja",
            internal: true,
          },
        ],
        sourcePost:
          "https://www.linkedin.com/feed/update/urn:li:activity:7493757516128907265/",
      },
      {
        anchor: "one-dollar-computer",
        founders: "ClaudIO Olmedo",
        company: "One Dollar Computer",
        headline: "Making hands-on computing accessible for more children",
        challenge:
          "Meaningful technology education often assumes access to expensive laptops, laboratories, and finished applications.",
        approach:
          "ClaudIO demonstrated an open-source, RISC-V-based computer designed to cost about one dollar and help students learn how computers work by experimenting directly with the hardware.",
        lesson:
          "Start with people excluded by the current solution, remove unnecessary complexity, and design for accessibility from the beginning.",
        image: "/event-media/august-12-2026/claudio-olmedo-one-dollar-computer.jpg",
        imageAlt: "ClaudIO Olmedo demonstrating the One Dollar Computer at Hacker Dojo",
        website: "https://claudioolmedo.com/",
        founderProfiles: [
          {
            name: "ClaudIO Olmedo",
            url: "https://www.linkedin.com/in/claudioolmedo-com/",
          },
        ],
        sourcePost:
          "https://www.linkedin.com/feed/update/urn:li:activity:7493761006461120513/",
      },
      {
        anchor: "configai",
        founders: "Ayush Kumar and the ConfigAI team",
        company: "ConfigAI",
        headline: "Reducing the expertise barrier between AI models and FPGAs",
        challenge:
          "Deploying machine-learning models on specialized hardware can take months and traditionally requires deep knowledge of chip design, hardware languages, and optimization tools.",
        approach:
          "ConfigAI is building a compiler that accepts familiar model formats such as ONNX, PyTorch, and Keras, then automates mapping, scheduling, and FPGA hardware generation.",
        lesson:
          "The larger opportunity is to make advanced hardware usable by machine-learning engineers without requiring every engineer to become a chip-design specialist. The team's stated goal is to reduce deployment work from months to minutes.",
        image: "/event-media/august-12-2026/ayush-kumar-configai.jpg",
        imageAlt: "Ayush Kumar presenting ConfigAI to the StartupA2Z audience",
        website: "https://www.configai.co/",
        founderProfiles: [
          {
            name: "Ayush Kumar",
            url: "https://lnkd.in/eiiUhbm8",
          },
        ],
        sourcePost:
          "https://www.linkedin.com/feed/update/urn:li:activity:7493760484869955584/",
      },
      {
        anchor: "purplelens",
        founders: "Divakar Prayaga",
        company: "PurpleLens",
        headline: "Treating application security as a continuous engineering capability",
        challenge:
          "AI-assisted development helps teams ship faster, while increasingly automated attacks make periodic, end-of-cycle security testing harder to rely on.",
        approach:
          "Divakar explained why application testing needs to run continuously through the development lifecycle instead of remaining a final checkpoint before release.",
        lesson:
          "For startups, security problems found after customers arrive can become product, compliance, and reputation problems. Build security into engineering before it becomes an emergency response.",
        image: "/event-media/august-12-2026/divakar-prayaga-purplelens.jpg",
        imageAlt: "Divakar Prayaga presenting PurpleLens at the StartupA2Z event",
        website: "https://purplelens.ai/",
        founderProfiles: [
          {
            name: "Divakar Prayaga",
            url: "https://www.linkedin.com/in/divakarprayaga/",
          },
        ],
        sourcePost:
          "https://www.linkedin.com/feed/update/urn:li:activity:7493759228604510208/",
      },
    ],
    keyLessons: [
      "Accessibility can be a product requirement, not a feature added later.",
      "Good developer tools hide specialized complexity without hiding control.",
      "Security has to move at the same speed as product development.",
      "Repeatability and workflow control matter more than a single impressive AI output.",
      "Founder events are most useful when builders show unfinished work and receive direct feedback.",
    ],
    status: "published",
  },
];

export const getEventSummary = (slug: string) =>
  eventSummaries.find((summary) => summary.slug === slug);

export const getEventSummaryByEventSlug = (eventSlug: string) =>
  eventSummaries.find((summary) => summary.eventSlug === eventSlug);
