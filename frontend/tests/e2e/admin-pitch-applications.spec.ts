import { expect, test } from "@playwright/test";

const application = {
  id: "33333333-3333-4333-8333-333333333333",
  user_id: "11111111-1111-4111-8111-111111111111",
  event_id: null,
  event_slug: null,
  event_title: null,
  startup_name: "Example Labs",
  startup_website: "https://example.com",
  startup_summary: "A workflow product for early-stage startup operators.",
  talk_title: "From manual work to one clear workflow",
  problem: "Startup operators lose time across disconnected tools.",
  solution: "One guided product brings the recurring workflow together.",
  monetization_challenge: null,
  breakthrough: null,
  lessons: [],
  ask_text: "Introductions to design partners",
  offer_text: null,
  milestone: null,
  traction: "Three active pilots and one paying customer.",
  pitch_deck_url: "https://example.com/deck",
  support_needs: ["customers", "staffing", "soc2_compliance"],
  support_timeline: "right_now",
  paid_support_interest: "actively_looking",
  consent_to_review: true,
  status: "submitted",
  submitted_at: "2026-09-16T18:00:00Z",
  created_at: "2026-09-16T17:00:00Z",
  updated_at: "2026-09-16T18:00:00Z",
  email: "founder@example.com",
  full_name: "Founder Example",
  company: "Example Labs",
  job_title: "Founder",
  admin_notes: null,
  reviewed_by: null,
  reviewed_at: null,
};

test("admin reviews and approves a pitch application", async ({ page }) => {
  await page.addInitScript(() => {
    const payload = btoa(JSON.stringify({ sub: "local-admin", email: "admin@example.com", roles: ["admin"], dev_admin: true }))
      .replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
    localStorage.setItem("startupa2z_token", `header.${payload}.signature`);
  });

  await page.route("**/api/admin/submissions", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, data: [] }) }));
  await page.route("**/api/admin/rsvps", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, data: [] }) }));
  await page.route("**/api/events", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, data: [] }) }));
  await page.route("**/api/admin/pitch-applications", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, data: [application] }) }));

  let reviewPayload: Record<string, unknown> | null = null;
  await page.route("**/api/admin/pitch-applications/*", async (route) => {
    reviewPayload = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, data: { ...application, ...reviewPayload, reviewed_at: "2026-09-16T19:00:00Z" } }) });
  });

  await page.goto("/admin/submissions");
  await page.getByRole("button", { name: /Community/ }).click();
  await page.getByRole("button", { name: /Pitch applications/ }).click();
  await expect(page.getByText("Buyer opportunities")).toBeVisible();
  await expect(page.getByText("Waiting for review")).toBeVisible();
  await page.getByLabel("Filter by need").selectOption("soc2_compliance");
  await page.getByLabel("Filter by buyer intent").selectOption("actively_looking");
  await page.getByRole("row", { name: /Founder Example/ }).click();
  await expect(page.getByText("SOC 2 / compliance", { exact: true }).last()).toBeVisible();
  await expect(page.getByText("Right now", { exact: true })).toBeVisible();
  await expect(page.getByText("Actively looking for paid help", { exact: true })).toBeVisible();
  await expect(page.getByText("Three active pilots and one paying customer.")).toBeVisible();
  await page.getByLabel("Internal review notes").fill("Strong fit for the founder feedback segment.");
  await page.getByRole("button", { name: "Approve" }).click();
  await expect(page.getByText("approved", { exact: true }).first()).toBeVisible();
  expect(reviewPayload).toEqual({ status: "approved", admin_notes: "Strong fit for the founder feedback segment." });
});
