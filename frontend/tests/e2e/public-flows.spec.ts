import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/about",
  "/founders",
  "/investors",
  "/startups",
  "/startups/keyframe",
  "/events",
  "/events/startup-a-to-z-hacker-dojo-august-12",
  "/resources",
  "/gallery",
  "/contact",
  "/sponsorship",
];

test("all public routes render without browser errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  for (const route of publicRoutes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBeLessThan(400);
    await expect(page.locator("main")).toBeVisible();
  }

  expect(errors).toEqual([]);
});

test("header groups expose the expected destinations", async ({ page }) => {
  await page.goto("/");
  const navigation = page.getByRole("navigation");

  await navigation.getByRole("link", { name: "Community", exact: true }).hover();
  await expect(navigation.getByRole("link", { name: "Startups", exact: true })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Founders", exact: true })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Investors", exact: true })).toBeVisible();

  await navigation.getByRole("link", { name: "Resources", exact: true }).hover();
  await expect(navigation.getByRole("link", { name: "Gallery", exact: true })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Founder's Playbook", exact: true })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Pitch Deck Resources", exact: true })).toBeVisible();

  await expect(navigation.getByRole("link", { name: "Sponsor", exact: true })).toHaveAttribute("href", "/sponsorship");
});

test("sign in and community join open the correct authentication modes", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("Welcome back");
  await expect(page.getByRole("button", { name: "Sign in with LinkedIn" })).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();

  await page.getByRole("button", { name: "Join the Community" }).click();
  await expect(page.getByRole("dialog")).toContainText("Create your account");
  await expect(page.getByRole("button", { name: "Sign up with email address" })).toBeVisible();
});

test("event filtering and external registration destination work", async ({ page }) => {
  await page.goto("/events?view=past");
  await expect(page.getByRole("heading", { name: "Past Events" })).toBeVisible();
  await expect(page.getByText("No past events to show yet.")).toBeVisible();

  await page.getByRole("link", { name: "Upcoming", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Upcoming Events" })).toBeVisible();
  await page.goto("/events/startup-a-to-z-hacker-dojo-august-12");
  await expect(page.getByRole("link", { name: "Register on Luma" })).toHaveAttribute(
    "href",
    /^https:\/\/luma\.com\/m0eu7bw9\?utm_source=startupa2z/,
  );
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
});

test("startup cards open dedicated internal profiles", async ({ page }) => {
  await page.goto("/startups");
  await page.getByRole("link", { name: "View Keyframe profile" }).click();
  await expect(page).toHaveURL(/\/startups\/keyframe$/);
  await expect(page.getByRole("heading", { name: "Keyframe", level: 1 })).toBeVisible();
});

test("business submission captures founders and stays pending for review", async ({ page }) => {
  let submittedPayload: Record<string, unknown> | null = null;
  await page.route("**/api/businesses", async (route) => {
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }
    submittedPayload = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, message: "Submitted for review", data: {} }),
    });
  });

  await page.goto("/startups");
  await page.getByRole("button", { name: "Submit Your Business" }).click();
  const dialog = page.getByRole("dialog", { name: "Create Your Startup Profile" });
  await dialog.getByLabel("Business name *").fill("Health Check Labs");
  await dialog.getByLabel("What does your business do? *").fill("A complete startup profile workflow used for automated validation.");
  await dialog.getByLabel("Location *").fill("Mountain View, CA");
  await dialog.getByRole("combobox").nth(0).click();
  await page.getByRole("option", { name: "Seed", exact: true }).click();
  await dialog.getByRole("combobox").nth(1).click();
  await page.getByRole("option", { name: "AI", exact: true }).click();
  await dialog.getByRole("button", { name: "Continue" }).click();

  await dialog.getByLabel("Name *").fill("Test Founder");
  await dialog.getByLabel("Founder journey").fill("The founder encountered this problem directly and built the first solution.");
  await dialog.getByRole("button", { name: "Continue" }).click();
  await dialog.getByLabel("Journey to reach here *").fill("The team validated the problem, built a prototype, and earned its first customer pilot.");
  await dialog.getByRole("button", { name: "Continue" }).click();
  await dialog.getByRole("button", { name: "Continue" }).click();
  await dialog.getByLabel("Your name *").fill("Test Submitter");
  await dialog.getByLabel("Your email *").fill("business-healthcheck@example.com");
  await dialog.getByRole("button", { name: "Submit for Review" }).click();

  await expect(page.getByText("Profile submitted for review", { exact: true })).toBeVisible();
  expect(submittedPayload).toMatchObject({
    name: "Health Check Labs",
    journey: "The team validated the problem, built a prototype, and earned its first customer pilot.",
    founders: [{ name: "Test Founder", role: "Founder" }],
    consent_to_publish: true,
  });
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
  const username = process.env.E2E_ADMIN_USERNAME || "admin";
  const password = process.env.E2E_ADMIN_PASSWORD || "admin";

  await page.goto("/admin/login");
  await page.getByLabel("Username").fill(username);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin\/submissions$/);
  await expect(page.getByRole("navigation", { name: "Admin navigation" })).toBeVisible();
  await expect(page.getByText("Event management", { exact: true }).first()).toBeVisible();
});
