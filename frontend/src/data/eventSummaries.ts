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
  sourcePost?: string;
  storyLabel?: string;
  approachLabel?: string;
  takeawayLabel?: string;
};

export type EventSummary = {
  slug: string;
  eventSlug: string;
  title: string;
  eventTitle: string;
  date: string;
  startDateIso: string;
  endDateIso: string;
  venue: string;
  address: string;
  coverImage: string;
  coverImageAlt: string;
  galleryPath?: string;
  summary: string;
  program: string[];
  founderStories: FounderStory[];
  audiencePhotos?: Array<{
    image: string;
    imageAlt: string;
  }>;
  keyLessons: string[];
  status: "draft" | "published";
};

export const eventSummaries: EventSummary[] = [
  {
    slug: "hacker-dojo-august-25-2026",
    eventSlug: "founders-pitch-mix-2026-08-25",
    title: "August 25 at Hacker Dojo: Freight AI, Vachi, and Quantum Security",
    eventTitle: "Bay Area Founders Pitch & Startup Networking",
    date: "August 25, 2026",
    startDateIso: "2026-08-25T17:00:00-07:00",
    endDateIso: "2026-08-25T20:00:00-07:00",
    venue: "Hacker Dojo, Mountain View",
    address: "855 Maude Ave, Mountain View, CA 94043",
    coverImage: "/event-media/august-25-2026/event-summary-collage.jpg",
    coverImageAlt: "Collage of the StartupA2Z founder presentations and audience pitches at Hacker Dojo on August 25, 2026",
    galleryPath: "/gallery/founders-pitch-mix-2026-08-25",
    summary:
      "StartupA2Z's August 25 Founders Pitch & Mix brought Bay Area builders together for founder stories, live product demonstrations, direct feedback, and networking. Neil Fernandes explained how EnrouteAI moved operations-research thinking into a practical freight-pricing workflow. Achal Pandey shared the harder lesson behind Vachi: traction can be real and still not justify continuing on the same path. Ridham Bhagat demonstrated how Quip Network adds post-quantum protection to an existing blockchain wallet workflow.",
    program: [
      "Founder stories grounded in real operating problems",
      "Live startup and product demonstrations",
      "Audience questions and direct founder feedback",
      "Bay Area founder and builder networking",
    ],
    founderStories: [
      {
        anchor: "enrouteai",
        founders: "Neil Fernandes",
        company: "EnrouteAI",
        headline: "Turning freight-pricing spreadsheet work into a repeatable workflow",
        challenge:
          "Truckload carrier teams receive shipper RFPs in inconsistent spreadsheets and must price hundreds or thousands of lanes under deadline pressure. Market benchmarks, company strategy, cost data, and bid history are often scattered across separate tools and files.",
        approach:
          "Neil connected his operations-research background to a focused industry workflow: accept the bid file as it arrives, validate the lanes, price them using the carrier's own economics and market context, and export the completed bid in the shipper's original format.",
        lesson:
          "A strong vertical product does not ask customers to abandon the workflow around the problem. It removes the slowest, most error-prone work while preserving the inputs and outputs the customer already has to use.",
        image: "/event-media/august-25-2026/neil-fernandes-enrouteai.jpg",
        imageAlt: "Neil Fernandes presenting EnrouteAI's freight-pricing journey at Hacker Dojo",
        website: "https://enrouteai.com/",
        founderProfiles: [
          {
            name: "Neil Fernandes",
            url: "https://www.linkedin.com/in/neilfern/",
          },
        ],
        sourcePost: "https://enrouteai.com/blog/what-does-enrouteai-do",
      },
      {
        anchor: "vachi",
        founders: "Achal Pandey",
        company: "Vachi",
        headline: "Learning when traction is not enough reason to continue",
        challenge:
          "Vachi began with the ambition to build an AI chief of staff that could understand intent and reduce the mental burden of tracking unfinished work. Early small-business users validated the pain, but the broader product direction remained difficult to turn into the right long-term company.",
        approach:
          "Achal and his team tested the problem through direct customer conversations and a voice-first brain-dump application. The product reached more than 100,000 downloads, yet the learning from those experiments led him to close that chapter instead of continuing on momentum alone.",
        lesson:
          "Usage, effort, and affection for a product are not substitutes for founder conviction about the future. Stopping a product with visible traction can be the disciplined decision when the evidence changes the thesis.",
        image: "/event-media/august-25-2026/achal-pandey-vachi.jpg",
        imageAlt: "Achal Pandey sharing the founder journey behind Vachi at Hacker Dojo",
        website: "https://www.linkedin.com/in/achalpandey/",
        founderProfiles: [
          {
            name: "Achal Pandey",
            url: "https://www.linkedin.com/in/achalpandey/",
          },
        ],
      },
      {
        anchor: "quip-network",
        founders: "Ridham Bhagat · Technical presenter",
        company: "Quip Network",
        headline: "Protecting today’s blockchain wallets from future quantum attacks",
        challenge:
          "Today’s wallets are not post-quantum secure, and the blockchain stack is built around how those wallets sign transactions. Once a capable quantum attacker can break those signatures, the attacker could authorize transactions and spend another user’s funds.",
        approach:
          "Instead of keeping funds directly in the wallet, keep them in an on-chain smart contract. A pluggable verifier decides which signatures are valid and when the contract can release the funds.",
        lesson:
          "Post-quantum signature schemes are still maturing. A swappable verifier allows the cryptography to be upgraded without moving the protected funds or forcing users to migrate their keys.",
        image: "/event-media/august-25-2026/ridham-bhagat-quip-network.jpg",
        imageAlt: "Ridham Bhagat demonstrating a Quip Network quantum-resistant smart-contract wallet at Hacker Dojo",
        website: "https://quip.network/",
        founderProfiles: [
          {
            name: "Ridham Bhagat",
            url: "https://www.linkedin.com/in/ridham-bhagat-22a047106/",
          },
        ],
        sourcePost: "https://quip.network/blog/what-is-quip-network",
        storyLabel: "Technical demo",
        approachLabel: "The solution",
        takeawayLabel: "Why it is swappable",
      },
    ],
    audiencePhotos: [
      {
        image: "/event-media/august-25-2026/audience-pitch-1.jpg",
        imageAlt: "An audience speaker sharing a pitch during the StartupA2Z event at Hacker Dojo",
      },
      {
        image: "/event-media/august-25-2026/audience-pitch-2.jpg",
        imageAlt: "Another audience speaker presenting an idea during the StartupA2Z event at Hacker Dojo",
      },
    ],
    keyLessons: [
      "Start with a recurring problem whose current workaround is visibly expensive or slow.",
      "Fit into the customer's real workflow before asking the customer to change it.",
      "Use product experiments to test the business thesis, not only feature demand.",
      "Traction is evidence, but it does not automatically prove the current direction is right.",
      "Reduce adoption friction by strengthening the tools customers already use.",
      "Founder communities become useful when builders share the decisions behind the product, including when they stop or change course.",
    ],
    status: "published",
  },
  {
    slug: "hacker-dojo-august-12-2026",
    eventSlug: "startup-a-to-z-hacker-dojo-august-12",
    title: "August 12 at Hacker Dojo: The First StartupA2Z Founder Gathering",
    eventTitle: "Bay Area Founders Pitch & Startup Networking",
    date: "August 12, 2026",
    startDateIso: "2026-08-12T17:00:00-07:00",
    endDateIso: "2026-08-12T20:00:00-07:00",
    venue: "Hacker Dojo, Mountain View",
    address: "855 Maude Ave, Mountain View, CA 94043",
    coverImage:
      "https://images.lumacdn.com/event-social/uj/b1008796-76dc-4efd-96b4-b3e35890b79f.png",
    coverImageAlt: "StartupA2Z founder gathering at Hacker Dojo on August 12, 2026",
    galleryPath: "/gallery/startup-a-to-z-hacker-dojo-august-12",
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
