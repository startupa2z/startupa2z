import { expect, test } from "@playwright/test";

const liveEmail = process.env.LIVE_PITCH_EMAIL;

test("real local OTP member completes and submits a pitch application", async ({ page, request }) => {
  test.skip(!liveEmail, "Set LIVE_PITCH_EMAIL to run the local Docker + Mailpit integration test.");

  await page.goto("/");
  await page.getByRole("link", { name: "Apply to Pitch" }).click();
  await page.getByRole("button", { name: "Create member account" }).click();
  await page.getByRole("button", { name: "Sign up with email address" }).click();
  await page.getByLabel("Email address *").fill(liveEmail!);
  await page.getByRole("button", { name: "Send verification code" }).click();

  let code = "";
  await expect.poll(async () => {
    const response = await request.get("http://127.0.0.1:8025/api/v1/messages");
    const body = await response.json() as { messages: Array<{ To: Array<{ Address: string }>; Snippet: string }> };
    const message = body.messages.find((item) => item.To.some((recipient) => recipient.Address === liveEmail));
    code = message?.Snippet.match(/\b(\d{6})\b/)?.[1] ?? "";
    return code.length;
  }, { timeout: 10_000 }).toBe(6);

  await page.locator("[data-input-otp]").fill(code);
  await page.getByRole("button", { name: "Verify and sign up" }).click();
  await expect(page).toHaveURL(/\/complete-profile\?returnTo=%2Fwelcome%3Fintent%3Dpitch$/);

  await page.getByLabel("Full name *").fill("Pitch Integration Test");
  await page.getByLabel("Company / startup *").fill("Integration Test Labs");
  await page.getByLabel("Job title / role *").fill("Founder");
  await page.getByLabel("Founder status *").click();
  await page.getByRole("option", { name: "Founder", exact: true }).click();
  await page.getByRole("button", { name: "Save and continue" }).click();
  await expect(page).toHaveURL(/\/welcome\?intent=pitch$/);

  await page.getByText("Select an upcoming event").click();
  await page.getByRole("option").first().click();
  await page.getByLabel("Startup name *").fill("Integration Test Labs");
  await page.getByLabel("Website").fill("https://example.com");
  await page.getByLabel("What does the startup do? *").fill("We validate the complete local pitch application integration path.");
  await page.getByLabel("Proposed talk title").fill("A real end-to-end integration test");
  await page.getByRole("button", { name: /Continue/ }).click();

  await page.getByLabel("What problem did you identify? *").fill("The pitch workflow needed verification across the actual browser, API, email, and database.");
  await page.getByLabel("What did you build and validate? *").fill("We built a guided application flow with autosaved drafts and verified submissions.");
  await page.getByLabel("What made monetization difficult? *").fill("The original process required too much manual follow-up and inconsistent information.");
  await page.getByLabel("What was the breakthrough? *").fill("A member-first form connected the full journey and removed repeated data entry.");
  await page.getByRole("button", { name: /Continue/ }).click();

  const lessons = page.getByPlaceholder(/One practical lesson/);
  await lessons.nth(0).fill("Test the real integration");
  await lessons.nth(1).fill("Save progress early");
  await lessons.nth(2).fill("Prevent duplicates");
  await page.getByLabel("Your ask *").fill("Review this test application");
  await page.getByLabel("Your offer *").fill("A verified founder intake workflow");
  await page.getByLabel("Current stage and next milestone").fill("Local end-to-end verification complete");
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByText(/I confirm that StartupA2Z.org may review/).click();
  await page.getByRole("button", { name: "Submit pitch application" }).click();

  await expect(page.getByRole("heading", { name: "Pitch application submitted" })).toBeVisible();
  await expect(page.getByText("submitted", { exact: true })).toBeVisible();

  const token = await page.evaluate(() => localStorage.getItem("startupa2z_token"));
  const headers = { Authorization: `Bearer ${token}` };
  const listResponse = await request.get("http://127.0.0.1:8081/api/pitch-applications", { headers });
  expect(listResponse.ok()).toBeTruthy();
  const listBody = await listResponse.json() as { data: Array<{ id: string; event_id: string; status: string }> };
  expect(listBody.data[0]).toMatchObject({ status: "submitted" });

  const duplicateResponse = await request.post("http://127.0.0.1:8081/api/pitch-applications/submit", {
    headers,
    data: {
      event_id: listBody.data[0].event_id,
      startup_name: "Integration Test Labs",
      startup_website: "https://example.com",
      startup_summary: "We validate the complete local pitch application integration path.",
      talk_title: "A real end-to-end integration test",
      problem: "The pitch workflow needed verification across the actual browser, API, email, and database.",
      solution: "We built a guided application flow with autosaved drafts and verified submissions.",
      monetization_challenge: "The original process required too much manual follow-up and inconsistent information.",
      breakthrough: "A member-first form connected the full journey and removed repeated data entry.",
      lessons: ["Test the real integration", "Save progress early", "Prevent duplicates"],
      ask_text: "Review this test application",
      offer_text: "A verified founder intake workflow",
      milestone: "Local end-to-end verification complete",
      consent_to_review: true,
    },
  });
  expect(duplicateResponse.status()).toBe(409);
  await expect(duplicateResponse.json()).resolves.toMatchObject({ detail: "You already submitted a pitch application for this event." });
});
