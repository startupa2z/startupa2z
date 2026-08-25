import { expect, test, type Page } from "@playwright/test";

const userId = "11111111-1111-4111-8111-111111111111";
const eventId = "22222222-2222-4222-8222-222222222222";
const draftId = "33333333-3333-4333-8333-333333333333";
const now = "2026-08-24T12:00:00Z";

const profile = {
  ok: true,
  user: {
    id: userId,
    email: "founder@example.com",
    full_name: "Founder Example",
    company: "Example Labs",
    job_title: "Founder",
    founder_status: "active_founder",
    linkedin_connected: false,
    profile_complete: true,
    created_at: now,
    roles: [],
  },
  summary: { registered_sessions: 0, attended_sessions: 0 },
  sessions: [],
};

const event = {
  id: eventId,
  slug: "future-founder-pitch",
  title: "Future Founder Pitch",
  date: "January 1, 2099",
  time: "5:00 PM - 8:00 PM",
  venue: "Hacker Dojo",
  address: "Mountain View, CA",
  type: "Pitch",
  description: "Founder pitch event",
  long_description: "Founder pitch event",
  agenda: [], speakers: [], spots: 24, capacity: 30, price: "Free",
  featured: true, image_url: null, created_at: now, updated_at: now,
};

const application = (overrides: Record<string, unknown> = {}) => ({
  id: draftId,
  user_id: userId,
  event_id: eventId,
  event_slug: event.slug,
  event_title: event.title,
  startup_name: "Example Labs",
  startup_website: "https://example.com",
  startup_summary: "We solve a meaningful founder problem with a validated product.",
  talk_title: "From founder problem to traction",
  problem: "Customers struggled with a fragmented workflow that wasted time every day.",
  solution: "We built one focused workflow and validated it through customer pilots.",
  monetization_challenge: "Early users liked the product but resisted our original pricing model.",
  breakthrough: "We narrowed the buyer and changed packaging based on paid pilot evidence.",
  lessons: ["Validate the buyer", "Test pricing early", "Measure paid behavior"],
  ask_text: "Introductions to design partners",
  offer_text: "Product validation lessons",
  milestone: "Convert three pilots into annual customers",
  consent_to_review: false,
  status: "draft",
  submitted_at: null,
  created_at: now,
  updated_at: now,
  ...overrides,
});

async function authenticate(page: Page) {
  await page.addInitScript(({ id }) => {
    const payload = btoa(JSON.stringify({ sub: id, email: "founder@example.com", roles: [] }))
      .replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
    localStorage.setItem("startupa2z_token", `header.${payload}.signature`);
  }, { id: userId });
}

async function mockBase(page: Page, current: ReturnType<typeof application> | null = null) {
  await authenticate(page);
  await page.route("**/api/auth/me", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify(profile) }));
  await page.route("**/api/events", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, data: [event] }) }));
  await page.route("**/api/pitch-applications/current", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, data: current }) }));
  await page.route("**/api/pitch-applications", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, data: [] }) }));
}

async function chooseEvent(page: Page) {
  await page.getByText("Select an upcoming event").click();
  await page.getByRole("option", { name: /Future Founder Pitch/ }).click();
}

test("member completes the pitch application from draft through submission", async ({ page }) => {
  await mockBase(page);
  const draftPayloads: Record<string, unknown>[] = [];
  let submittedPayload: Record<string, unknown> | null = null;
  await page.route("**/api/pitch-applications/draft", async (route) => {
    const payload = route.request().postDataJSON() as Record<string, unknown>;
    draftPayloads.push(payload);
    await route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, message: "saved", data: application({ ...payload, id: draftId }) }) });
  });
  await page.route("**/api/pitch-applications/submit", async (route) => {
    submittedPayload = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ ok: true, message: "submitted", data: application({ ...submittedPayload, status: "submitted", consent_to_review: true, submitted_at: now }) }) });
  });

  await page.goto("/welcome?intent=pitch");
  await chooseEvent(page);
  await page.getByLabel("Startup name *").fill("Example Labs");
  await page.getByLabel("Website").fill("https://example.com");
  await page.getByLabel("What does the startup do? *").fill("We solve a meaningful founder problem with a validated product.");
  await page.getByLabel("Proposed talk title").fill("From founder problem to traction");
  await page.getByRole("button", { name: /Continue/ }).click();
  await expect(page.getByText("Draft saved")).toBeVisible();

  await page.getByLabel("What problem did you identify? *").fill("Customers struggled with a fragmented workflow that wasted time every day.");
  await page.getByLabel("What did you build and validate? *").fill("We built one focused workflow and validated it through customer pilots.");
  await page.getByLabel("What made monetization difficult? *").fill("Early users liked the product but resisted our original pricing model.");
  await page.getByLabel("What was the breakthrough? *").fill("We narrowed the buyer and changed packaging based on paid pilot evidence.");
  await page.getByRole("button", { name: /Continue/ }).click();

  const lessons = page.getByPlaceholder(/One practical lesson/);
  await lessons.nth(0).fill("Validate the buyer");
  await lessons.nth(1).fill("Test pricing early");
  await lessons.nth(2).fill("Measure paid behavior");
  await page.getByLabel("Your ask *").fill("Introductions to design partners");
  await page.getByLabel("Your offer *").fill("Product validation lessons");
  await page.getByLabel("Current stage and next milestone").fill("Convert three pilots into annual customers");
  await page.getByRole("button", { name: /Continue/ }).click();

  await page.getByText(/I confirm that StartupA2Z.org may review/).click();
  await page.getByRole("button", { name: "Submit pitch application" }).click();
  await expect(page.getByRole("heading", { name: "Pitch application submitted" })).toBeVisible();
  await expect(page.getByText("submitted", { exact: true })).toBeVisible();
  expect(draftPayloads).toHaveLength(3);
  expect(draftPayloads[1]).toMatchObject({ id: draftId, problem: expect.stringContaining("fragmented workflow") });
  expect(submittedPayload).toMatchObject({ id: draftId, event_id: eventId, consent_to_review: true });
});

test("pitch form blocks incomplete and malformed entries before saving", async ({ page }) => {
  await mockBase(page);
  let draftCalls = 0;
  await page.route("**/api/pitch-applications/draft", async (route) => {
    draftCalls += 1;
    await route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, data: application() }) });
  });
  await page.goto("/welcome?intent=pitch");
  await page.getByRole("button", { name: /Continue/ }).click();
  await expect(page.getByRole("alert")).toHaveText("Select an event.");
  await chooseEvent(page);
  await page.getByLabel("Startup name *").fill("X");
  await page.getByLabel("What does the startup do? *").fill("too short");
  await page.getByRole("button", { name: /Continue/ }).click();
  await expect(page.getByRole("alert")).toHaveText("Enter your startup name.");
  await page.getByLabel("Startup name *").fill("Example Labs");
  await page.getByLabel("What does the startup do? *").fill("A sufficiently complete description of this startup.");
  await page.getByLabel("Website").fill("example.com");
  await page.getByRole("button", { name: /Continue/ }).click();
  await expect(page.getByRole("alert")).toContainText("complete website URL");
  expect(draftCalls).toBe(0);
});

test("saved draft resumes with all prior answers", async ({ page }) => {
  await mockBase(page, application());
  await page.goto("/welcome?intent=pitch");
  await expect(page.getByText(/Future Founder Pitch/).first()).toBeVisible();
  await expect(page.getByLabel("Startup name *")).toHaveValue("Example Labs");
  await expect(page.getByLabel("Website")).toHaveValue("https://example.com");
  await expect(page.getByLabel("What does the startup do? *")).toContainText("meaningful founder problem");
});

test("duplicate submission error remains visible and does not show false success", async ({ page }) => {
  await mockBase(page, application());
  await page.route("**/api/pitch-applications/draft", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, data: application() }) }));
  await page.route("**/api/pitch-applications/submit", (route) => route.fulfill({ status: 409, contentType: "application/json", body: JSON.stringify({ detail: "You already submitted a pitch application for this event." }) }));
  await page.goto("/welcome?intent=pitch");
  for (let step = 0; step < 3; step += 1) await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByText(/I confirm that StartupA2Z.org may review/).click();
  await page.getByRole("button", { name: "Submit pitch application" }).click();
  await expect(page.getByRole("alert")).toHaveText("You already submitted a pitch application for this event.");
  await expect(page.getByRole("heading", { name: "Pitch application submitted" })).toHaveCount(0);
});
