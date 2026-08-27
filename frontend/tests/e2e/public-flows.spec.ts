import { expect, test } from "@playwright/test";

const founderPlaybookRoutes = [
  "/resources/founder-playbooks/neil-fernandes-enrouteai",
  "/resources/founder-playbooks/achal-pandey-vachi",
  "/resources/founder-playbooks/ridham-bhagat-quip-network",
  "/resources/founder-playbooks/digvijay-goswami-sidharth-raja-keyframe-ai",
  "/resources/founder-playbooks/claudio-olmedo-one-dollar-computer",
  "/resources/founder-playbooks/ayush-kumar-configai",
  "/resources/founder-playbooks/divakar-prayaga-purplelens",
];

const publicRoutes = [
  "/",
  "/about",
  "/founders",
  "/founders/digvijay-goswami",
  "/investors",
  "/startups",
  "/startups/keyframe",
  "/events",
  "/events/startup-a-to-z-hacker-dojo-august-12",
  "/resources",
  "/resources/founder-playbooks",
  ...founderPlaybookRoutes,
  "/resources/case-studies",
  "/resources/case-studies/neil-fernandes-enrouteai",
  "/gallery",
  "/gallery/founders-pitch-mix-2026-08-25",
  "/contact",
  "/sponsorship",
  "/apply-to-pitch",
  "/pitch-application",
];

test("all public routes render without browser errors", async ({ page }) => {
  const errors: string[] = [];
  let currentRoute = "before navigation";
  page.on("pageerror", (error) => errors.push(`${currentRoute}: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`${currentRoute}: ${message.text()}`);
  });

  for (const route of publicRoutes) {
    currentRoute = route;
    const response = await page.goto(route);
    expect(response?.status(), route).toBeLessThan(400);
    await expect(page.locator("main").first()).toBeVisible();
  }

  expect(errors).toEqual([]);
});

test("header groups expose the expected destinations", async ({ page }) => {
  await page.goto("/");
  const navigation = page.getByRole("navigation");

  await navigation.getByRole("link", { name: "Community", exact: true }).hover();
  await expect(navigation.getByRole("link", { name: "Startup Directory", exact: true })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Founder Directory", exact: true })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Investor Network", exact: true })).toBeVisible();

  await navigation.getByRole("link", { name: "Resources", exact: true }).hover();
  await expect(navigation.getByRole("link", { name: "Gallery", exact: true })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Founder’s Playbook", exact: true })).toHaveAttribute("href", "/resources/founder-playbooks");
  await expect(navigation.getByRole("link", { name: "Pitch Deck Resources", exact: true })).toBeVisible();

  await expect(navigation.getByRole("link", { name: "Sponsor", exact: true })).toHaveAttribute("href", "/sponsorship");
});

test("homepage gallery moves between dated events and opens the selected gallery", async ({ page }) => {
  await page.goto("/");

  const august25Gallery = page.getByRole("link", { name: "Open gallery for August 25, 2026" });
  await expect(august25Gallery).toBeVisible();
  await expect(august25Gallery).toHaveAttribute("href", "/gallery/founders-pitch-mix-2026-08-25");

  await page.getByRole("button", { name: "Previous gallery: August 12, 2026" }).click();
  const august12Gallery = page.getByRole("link", { name: "Open gallery for August 12, 2026" });
  await expect(august12Gallery).toBeVisible();
  await expect(august12Gallery).toHaveAttribute("href", "/gallery/startup-a-to-z-hacker-dojo-august-12");

  await page.getByRole("button", { name: "Next gallery: August 25, 2026" }).click();
  await expect(august25Gallery).toBeVisible();
  await august25Gallery.click();
  await expect(page).toHaveURL(/\/gallery\/founders-pitch-mix-2026-08-25$/);
});

test("sign in and apply to pitch open the correct authentication modes", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("Welcome back");
  await expect(page.getByRole("button", { name: "Sign in with LinkedIn" })).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();

  await page.getByRole("link", { name: "Apply to Pitch" }).click();
  await page.getByRole("button", { name: "Create member account" }).click();
  await expect(page.getByRole("dialog")).toContainText("Create your account");
  await expect(page.getByRole("button", { name: "Sign up with email address" })).toBeVisible();
});

test("event filtering and completed event detail work", async ({ page }) => {
  await page.goto("/events?view=past");
  await expect(page.getByRole("heading", { name: "Past Events" })).toBeVisible();

  await page.getByRole("link", { name: "Upcoming", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Upcoming Events" })).toBeVisible();
  await page.goto("/events/startup-a-to-z-hacker-dojo-august-12");
  await expect(page.getByText("Completed event", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: /August 12 at Hacker Dojo/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Moving AI video from impressive clips to repeatable production", exact: true })).toHaveAttribute("href", "/resources/founder-playbooks/digvijay-goswami-sidharth-raja-keyframe-ai");
  await expect(page.getByRole("link", { name: "Making hands-on computing accessible for more children", exact: true })).toHaveAttribute("href", "/resources/founder-playbooks/claudio-olmedo-one-dollar-computer");
  await expect(page.getByRole("link", { name: "Reducing the expertise barrier between AI models and FPGAs", exact: true })).toHaveAttribute("href", "/resources/founder-playbooks/ayush-kumar-configai");
  await expect(page.getByRole("link", { name: "Treating application security as a continuous engineering capability", exact: true })).toHaveAttribute("href", "/resources/founder-playbooks/divakar-prayaga-purplelens");
});

test("August 25 event opens the local evidence-backed founder recap", async ({ page }) => {
  await page.goto("/events/founders-pitch-mix-2026-08-25");
  await expect(page.getByText("Local draft", { exact: true })).not.toBeVisible();
  await expect(page.getByRole("heading", { name: /Freight AI, Vachi, and Quantum Security/ })).toBeVisible();
  await expect(page.getByAltText("Collage of the StartupA2Z founder presentations and audience pitches at Hacker Dojo on August 25, 2026")).toBeVisible();
  const neilPlaybook = page.getByRole("link", { name: "Turning freight-pricing spreadsheet work into a repeatable workflow", exact: true });
  await expect(neilPlaybook).toHaveAttribute("href", "/resources/founder-playbooks/neil-fernandes-enrouteai");
  await expect(page.getByRole("link", { name: "EnrouteAI website" })).toHaveAttribute("href", "https://enrouteai.com/");
  await expect(page.getByRole("link", { name: "Neil Fernandes on LinkedIn" })).toHaveAttribute("href", "https://www.linkedin.com/in/neilfern/");
  await expect(page.getByRole("heading", { name: "The problem", exact: true }).first()).toBeVisible();
  await expect(page.getByText("Inconsistent shipper RFP spreadsheets", { exact: true })).toBeVisible();
  await expect(page.getByText("Upload the bid file as received", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Founder takeaway preview")).not.toHaveClass(/blur/);
  await expect(page.getByText("Fit into the customer’s existing workflow", { exact: true })).toBeVisible();
  await expect(page.getByText("For the detailed problem, demonstration, and founder takeaway, open Founder’s Playbook.", { exact: true })).toHaveCount(0);
  await expect(page.locator("#founder-enrouteai").getByRole("link", { name: "Read the full Founder’s Playbook" })).toHaveAttribute("href", "/resources/founder-playbooks/neil-fernandes-enrouteai");
  await expect(page.getByRole("heading", { name: "Learning when traction is not enough reason to continue" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Protecting today’s blockchain wallets from future quantum attacks" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Learning when traction is not enough reason to continue", exact: true })).toHaveAttribute("href", "/resources/founder-playbooks/achal-pandey-vachi");
  await expect(page.getByRole("link", { name: "Protecting today’s blockchain wallets from future quantum attacks", exact: true })).toHaveAttribute("href", "/resources/founder-playbooks/ridham-bhagat-quip-network");
  await expect(page.getByText("Neil Fernandes", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Achal Pandey", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Ridham Bhagat · Technical presenter", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Audience pitches" })).toBeVisible();
  await expect(page.getByAltText("An audience speaker sharing a pitch during the StartupA2Z event at Hacker Dojo")).toBeVisible();
  await expect(page.getByAltText("Another audience speaker presenting an idea during the StartupA2Z event at Hacker Dojo")).toBeVisible();
  await expect(page.getByRole("link", { name: "View photo gallery" })).toHaveAttribute("href", "/gallery/founders-pitch-mix-2026-08-25");
});

test("Neil's event highlight opens the Founder’s Playbook detail page", async ({ page }) => {
  await page.goto("/events/founders-pitch-mix-2026-08-25");
  await page.getByRole("link", { name: "Turning freight-pricing spreadsheet work into a repeatable workflow", exact: true }).click();
  await expect(page).toHaveURL(/\/resources\/founder-playbooks\/neil-fernandes-enrouteai$/);
  await expect(page.locator("section.gradient-hero-solid").getByText("Founder’s Playbook", { exact: true })).toBeVisible();
  await expect(page.locator("section.gradient-hero-solid").getByRole("link", { name: "View Case Study" })).toHaveAttribute("href", "/resources/case-studies/neil-fernandes-enrouteai");
  await expect(page.getByRole("heading", { name: "Founder and company introduction" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "The business behind the playbook" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "From small operators to major enterprises" })).toBeVisible();
  await expect(page.getByText("Multi-billion-dollar enterprise", { exact: true })).toBeVisible();
  await expect(page.getByText("Freight RFP pricing", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "The freight-pricing problem" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Build the pricing engine behind the fleet’s decision." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "From transportation research to EnrouteAI" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "The operating lessons behind the company" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Build toward pull, not persuasion" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Questions from the talk" })).toBeVisible();
  await expect(page.locator("#faqs summary").first()).toContainText("What does EnrouteAI do?");
  await page.locator("#faqs summary").first().click();
  await expect(page.locator("#faqs details").first()).toContainText("RFP pricing software for truckload carriers");
  await expect(page.locator("#faqs details").first()).toContainText("responding to freight RFPs");
  await expect(page.getByRole("link", { name: "Supporting source" })).toHaveAttribute("href", "https://enrouteai.com/blog/what-does-enrouteai-do");
  await expect(page.getByRole("link", { name: "August 25, 2026 event gallery" })).toHaveAttribute("href", "/gallery/founders-pitch-mix-2026-08-25");
});

test("every published talk has a structured Founder’s Playbook", async ({ page }) => {
  for (const route of founderPlaybookRoutes) {
    await page.goto(route);
    await expect(page.locator("section.gradient-hero-solid").getByText("Founder’s Playbook", { exact: true })).toBeVisible();
    await expect(page.locator("#problem")).toBeVisible();
    await expect(page.locator("#solution")).toBeVisible();
    await expect(page.locator("#demonstration")).toBeVisible();
    await expect(page.locator("#founder-take")).toBeVisible();
    await expect(page.locator("#founder-take")).not.toHaveClass(/bg-primary/);
    await expect(page.locator("#links")).toBeVisible();
  }
});

test("EnrouteAI case study explains the business through visual models", async ({ page }) => {
  await page.goto("/resources/case-studies/neil-fernandes-enrouteai");
  await expect(page.locator("section.gradient-hero-solid").getByText("Startup Case Study", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "How EnrouteAI found its market by selling the outcome first" })).toBeVisible();
  await expect(page.getByAltText("Semi-truck fleet with freight-capacity, route, and pricing data visualizations")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Operating context" })).toBeVisible();
  await expect(page.getByText("Small", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Multi-billion-dollar U.S. enterprise", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Logarithmic visual scale.", { exact: false })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Four models explain what changed" })).toBeVisible();
  await expect(page.getByText("Optimize package-delivery routes", { exact: true })).toBeVisible();
  await expect(page.locator("#visual-models").getByText("Customer pull", { exact: true })).toBeVisible();
  await expect(page.getByText("Product push", { exact: true })).toBeVisible();
  await expect(page.locator("#visual-models").getByText("The learn-by-selling loop", { exact: false })).toBeVisible();
  await expect(page.getByText("Founder’s operating playbook", { exact: true })).not.toBeVisible();
  await expect(page.getByText("FAQs from Neil’s talk", { exact: true })).not.toBeVisible();
  await expect(page.getByRole("link", { name: "Read Founder’s Playbook" })).toHaveAttribute("href", "/resources/founder-playbooks/neil-fernandes-enrouteai");
  await expect(page.getByText("Evidence from the talk", { exact: true })).not.toBeVisible();
});

test("August 25 gallery highlights the community group photo and opens the viewer", async ({ page }) => {
  await page.goto("/gallery");
  const eventCard = page.getByRole("article").filter({ hasText: "Event 02" });
  await expect(eventCard.getByText("12 photos", { exact: true })).toBeVisible();

  await page.goto("/gallery/founders-pitch-mix-2026-08-25");
  await expect(page.getByText("Event 02 · August 25, 2026")).not.toBeVisible();
  await expect(page.getByAltText("StartupA2Z founders and community members together at Hacker Dojo after the August 25 event").first()).toBeVisible();
  await expect(page.getByText("12 photographs", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Read the August 25, 2026 event recap from the gallery hero image" })).toHaveAttribute("href", "/events/founders-pitch-mix-2026-08-25");
  await expect(page.getByRole("link", { name: "Read the August 25, 2026 event recap with founder stories, demos, and lessons" })).toHaveAttribute("href", "/events/founders-pitch-mix-2026-08-25");

  await page.getByRole("button", { name: "Open photo 12 of 12" }).scrollIntoViewIfNeeded();
  await expect.poll(() => page.getByRole("button", { name: /Open photo/ }).locator("img").evaluateAll((images) =>
    images.every((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0),
  )).toBe(true);
  const photoBrightness = await page.getByRole("button", { name: /Open photo/ }).locator("img").evaluateAll((images) =>
    images.map((image) => {
      const canvas = document.createElement("canvas");
      canvas.width = 24;
      canvas.height = 24;
      const context = canvas.getContext("2d");
      if (!context) return 0;
      context.drawImage(image as HTMLImageElement, 0, 0, canvas.width, canvas.height);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let total = 0;
      for (let index = 0; index < pixels.length; index += 4) {
        total += pixels[index] + pixels[index + 1] + pixels[index + 2];
      }
      return total / (canvas.width * canvas.height * 3);
    }),
  );
  expect(photoBrightness).toHaveLength(12);
  for (const brightness of photoBrightness) expect(brightness).toBeGreaterThan(10);

  await page.getByRole("button", { name: "Open photo 1 of 12" }).click();
  await expect(page.getByRole("dialog", { name: /Bay Area Founders Pitch/ })).toBeVisible();
  await expect(page.getByText("1 / 12", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Close photo viewer" }).click();
  await expect(page.getByRole("dialog", { name: /Bay Area Founders Pitch/ })).not.toBeVisible();
});

test("upcoming featured section never promotes a past event", async ({ page }) => {
  await page.route("**/api/events", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        data: [
          {
            id: "past",
            slug: "past-featured",
            title: "Past Featured Event",
            date: "January 1, 2000",
            time: "5:00 PM - 7:00 PM",
            venue: "Past Venue",
            address: "",
            type: "Meetup",
            description: "Past event",
            long_description: "Past event",
            agenda: [],
            speakers: [],
            spots: 10,
            capacity: 10,
            price: "Free",
            featured: true,
            image_url: null,
          },
          {
            id: "future",
            slug: "future-event",
            title: "Future Event",
            date: "January 1, 2099",
            time: "5:00 PM - 7:00 PM",
            venue: "Future Venue",
            address: "",
            type: "Meetup",
            description: "Future event",
            long_description: "Future event",
            agenda: [],
            speakers: [],
            spots: 10,
            capacity: 10,
            price: "Free",
            featured: false,
            image_url: null,
          },
        ],
      }),
    });
  });

  await page.goto("/events?view=upcoming");
  await expect(page.getByRole("heading", { name: "Future Event" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Past Featured Event" })).toHaveCount(0);
});

test("resource shortcuts land on the intended sections", async ({ page }) => {
  await page.goto("/resources#founder-playbooks");
  await expect(page.locator("#founder-playbooks")).toContainText("Founder Playbooks");

  await page.goto("/resources#pitch-deck-resources");
  await expect(page.locator("#pitch-deck-resources")).toContainText("Pitch Deck Resources");

  await page.goto("/resources#case-studies");
  await expect(page.locator("#case-studies")).toContainText("Case Studies");
});

test("Case Studies resource link opens the case-study library", async ({ page }) => {
  await page.goto("/resources");
  await page.getByRole("link", { name: "View case studies" }).click();
  await expect(page).toHaveURL(/\/resources\/case-studies$/);
  await expect(page.getByRole("heading", { name: "Company journeys explained visually" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open case study" })).toHaveAttribute("href", "/resources/case-studies/neil-fernandes-enrouteai");
});

test("Founder’s Playbook resource link opens the complete library", async ({ page }) => {
  await page.goto("/resources");
  await page.getByRole("link", { name: "View all playbooks" }).click();
  await expect(page).toHaveURL(/\/resources\/founder-playbooks$/);
  await expect(page.getByRole("heading", { name: "All founder and builder talks" })).toBeVisible();
  await expect(page.getByText("7 playbooks", { exact: true })).toBeVisible();
  for (const route of founderPlaybookRoutes) {
    await expect(page.locator(`a[href="${route}"]`).first()).toBeVisible();
  }
});

test("startup cards open dedicated internal profiles", async ({ page }) => {
  await page.goto("/startups");
  await page.getByRole("link", { name: "View keyframe.art profile" }).click();
  await expect(page).toHaveURL(/\/startups\/keyframe$/);
  await expect(page.getByRole("heading", { name: "keyframe.art", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "About keyframe.art" })).toBeVisible();
  await expect(page.getByText("Founded", { exact: true })).toBeVisible();
  await expect(page.getByText("2025", { exact: true })).toBeVisible();
  await expect(page.getByText("Team size", { exact: true })).toBeVisible();
  await expect(page.getByText("Founder & CEO", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Our ask", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Our story", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "keyframe.art website" })).toHaveAttribute("href", "https://www.keyframe.art/");
  await expect(page.getByRole("link", { name: "Open Playbook" })).toHaveAttribute("href", "/resources/founder-playbooks/digvijay-goswami-sidharth-raja-keyframe-ai");
});

test("startup directory opens company profiles independently from founder playbooks", async ({ page }) => {
  await page.goto("/startups");
  const expectedLinks = [
    ["EnrouteAI", "/startups/enrouteai"],
    ["Vachi", "/startups/vachi"],
    ["One Dollar Computer", "/startups/one-dollar-computer"],
    ["ConfigAI", "/startups/configai"],
    ["PurpleLens", "/startups/purplelens"],
  ];

  for (const [name, href] of expectedLinks) {
    await expect(page.getByRole("link", { name: `View ${name} profile` })).toHaveAttribute("href", href);
  }
  await expect(page.getByRole("link", { name: "View keyframe.art profile" })).toHaveAttribute("href", "/startups/keyframe");
  await expect(page.getByRole("link", { name: "View Quip Network profile" })).toHaveCount(0);
});

test("EnrouteAI directory card opens a company profile", async ({ page }) => {
  await page.goto("/startups");
  await page.getByRole("link", { name: "View EnrouteAI profile" }).click();
  await expect(page).toHaveURL(/\/startups\/enrouteai$/);
  await expect(page.getByRole("heading", { name: "EnrouteAI", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "About EnrouteAI" })).toBeVisible();
  await expect(page.getByRole("link", { name: "EnrouteAI website" })).toHaveAttribute("href", "https://enrouteai.com/");
  await expect(page.getByRole("link", { name: "Open Playbook" })).toHaveAttribute("href", "/resources/founder-playbooks/neil-fernandes-enrouteai");
  await expect(page.getByText("Our ask", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Our story", { exact: true })).toHaveCount(0);
});

test("founder directory opens a founder profile linked to the startup story", async ({ page }) => {
  await page.goto("/founders");
  await expect(page.getByRole("heading", { name: "Founder Directory", level: 1 })).toBeVisible();
  await page.getByRole("link", { name: /Digvijay Goswami/ }).click();
  await expect(page).toHaveURL(/\/founders\/digvijay-goswami$/);
  await expect(page.getByRole("heading", { name: "Digvijay Goswami", level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /View startup story/ })).toHaveAttribute("href", "/startups/keyframe");
  await expect(page.getByRole("heading", { name: "What keyframe.art is looking for" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What keyframe.art provides" })).toBeVisible();
});

test("startup directory opens the intentionally short add-business prototype", async ({ page }) => {
  await page.goto("/startups");
  await page.getByRole("button", { name: "Add Startup/Business" }).first().click();
  const dialog = page.getByRole("dialog", { name: "Add Startup/Business" });
  await expect(dialog.getByLabel("Startup/business name *")).toBeVisible();
  await expect(dialog.getByLabel("Website")).toBeVisible();
  await expect(dialog.getByLabel("What does your startup/business do? *")).toBeVisible();
  await expect(dialog.getByText(/You can add founders, your journey/)).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Add Startup/Business" })).toBeDisabled();
});

test("footer email action continues into a prefilled signup", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Email address").fill("healthcheck@example.com");
  await page.getByRole("button", { name: "Join with email" }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("Create your account");
  await expect(dialog.getByLabel("Email address")).toHaveValue("healthcheck@example.com");
});

test("contact form submits the message and resets after success", async ({ page }) => {
  let submittedPayload: Record<string, unknown> | null = null;

  await page.route("**/api/contact", async (route) => {
    submittedPayload = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, message: "Message sent successfully." }),
    });
  });

  await page.goto("/contact");
  await page.getByPlaceholder("First name *").fill("Health");
  await page.getByPlaceholder("Last name *").fill("Check");
  await page.getByPlaceholder("Email address *").fill("healthcheck@example.com");
  await page.getByRole("combobox").nth(1).click();
  await page.getByRole("option", { name: "Other", exact: true }).click();
  await page.getByPlaceholder("Your message").fill("Contact flow verification");
  await page.getByRole("button", { name: "Send Message", exact: true }).click();

  await expect(page.getByText("Message sent!", { exact: true })).toBeVisible();
  expect(submittedPayload).toMatchObject({
    first_name: "Health",
    last_name: "Check",
    email: "healthcheck@example.com",
    inquiry_type: "other",
    message: "Contact flow verification",
  });
  await expect(page.getByPlaceholder("First name *")).toHaveValue("");
  await expect(page.getByPlaceholder("Email address *")).toHaveValue("");
});

test("public API health and authorization boundaries are correct", async ({ request }) => {
  const health = await request.get("/health");
  expect(health.ok()).toBeTruthy();
  expect(await health.json()).toMatchObject({ ok: true, service: "startupa2z-backend" });

  const events = await request.get("/api/events");
  expect(events.ok()).toBeTruthy();
  const eventBody = await events.json();
  expect(eventBody.ok).toBe(true);
  expect(eventBody.data.length).toBeGreaterThan(0);

  const admin = await request.get("/api/admin/submissions");
  expect(admin.status()).toBe(401);

  const memberRsvp = await request.post("/api/rsvp/member", {
    data: { event_slug: "startup-a-to-z-hacker-dojo-august-12", event_title: "Health check" },
  });
  expect(memberRsvp.status()).toBe(401);

  const invalidOtp = await request.post("/api/auth/otp/send", {
    data: { email: "healthcheck@example.com", mode: "invalid" },
  });
  expect(invalidOtp.status()).toBe(400);

  const missingEvent = await request.get("/api/events/not-a-real-event");
  expect(missingEvent.status()).toBe(404);
});

test("local admin login reaches the dashboard", async ({ page }) => {
  const payload = Buffer.from(JSON.stringify({ sub: "local-admin", email: "admin@local", roles: ["admin"] })).toString("base64url");
  const token = `header.${payload}.signature`;
  await page.route("**/api/auth/admin/login", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, session: { access_token: token, token_type: "bearer", expires_in: 3600 } }) }));
  await page.route("**/api/admin/**", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, data: [] }) }));
  await page.route("**/api/events", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, data: [] }) }));

  await page.goto("/admin/login");
  await page.getByLabel("Username").fill("admin");
  await page.getByLabel("Password").fill("test-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin\/submissions$/);
  await expect(page.getByRole("navigation", { name: "Admin navigation" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
});
