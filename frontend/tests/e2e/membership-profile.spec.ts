import { expect, test } from "@playwright/test";

const incompleteUser = {
  id: "11111111-1111-4111-8111-111111111111",
  email: "member@example.com",
  full_name: "Member Example",
  company: "Example Startup",
  job_title: null,
  founder_status: null,
  linkedin_connected: false,
  profile_complete: false,
  created_at: "2026-08-07T12:00:00Z",
  roles: [],
};

const session = {
  access_token: "test-token",
  token_type: "bearer",
  expires_in: 2592000,
};

const memberProfileResponse = (user = incompleteUser) => ({
  ok: true,
  user,
  summary: { registered_sessions: 0, attended_sessions: 0 },
  sessions: [],
});

const authenticatedBrowser = async (page: import("@playwright/test").Page, roles: string[] = []) => {
  await page.addInitScript((assignedRoles) => {
    const payload = btoa(JSON.stringify({ sub: "11111111-1111-4111-8111-111111111111", email: "member@example.com", roles: assignedRoles }))
      .replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
    localStorage.setItem("startupa2z_token", `header.${payload}.signature`);
  }, roles);
};

test("email signup continues into the shared prefilled profile form", async ({ page }) => {
  const emailUser = { ...incompleteUser, full_name: null, company: null };
  let signupPayload: Record<string, unknown> | null = null;
  await page.route("**/api/auth/otp/send", async (route) => {
    signupPayload = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, message: "sent" }) });
  });
  await page.route("**/api/auth/otp/verify", async (route) => {
    await route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, session, user: emailUser }) });
  });
  await page.route("**/api/auth/me", async (route) => {
    await route.fulfill({ contentType: "application/json", body: JSON.stringify(memberProfileResponse(emailUser)) });
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Join the Community" }).click();
  await page.getByRole("button", { name: "Sign up with email address" }).click();
  await page.getByLabel("Email address *").fill("member@example.com");
  await page.getByRole("button", { name: "Send verification code" }).click();
  await page.locator("[data-input-otp]").fill("123456");
  await page.getByRole("button", { name: "Verify and sign up" }).click();

  await expect(page).toHaveURL(/\/complete-profile\?returnTo=%2Fwelcome$/);
  await expect(page.getByRole("textbox", { name: "Email", exact: true })).toHaveValue("member@example.com");
  await expect(page.getByLabel("Full name *")).toHaveValue("");
  await expect(page.getByLabel("Company / startup *")).toHaveValue("");
  expect(signupPayload).toMatchObject({
    mode: "signup",
    email: "member@example.com",
  });
});

test("LinkedIn OIDC identity prefills available fields without inventing employment data", async ({ page }) => {
  const linkedinUser = { ...incompleteUser, full_name: "LinkedIn Member", linkedin_connected: true };
  await page.route("**/api/auth/oauth/linkedin/exchange", async (route) => {
    await route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, session, user: linkedinUser }) });
  });
  await page.route("**/api/auth/me", async (route) => {
    await route.fulfill({ contentType: "application/json", body: JSON.stringify(memberProfileResponse(linkedinUser)) });
  });

  await page.goto("/?linkedin_code=one-time-code");

  await expect(page).toHaveURL(/\/complete-profile\?returnTo=%2Fwelcome$/);
  await expect(page.getByRole("textbox", { name: "Email", exact: true })).toHaveValue("member@example.com");
  await expect(page.getByLabel("Full name *")).toHaveValue("LinkedIn Member");
  await expect(page.getByLabel("Company / startup *")).toHaveValue("Example Startup");
  await expect(page.getByLabel("Job title / role *")).toHaveValue("");
});

test("an existing incomplete member completes the profile before an RSVP resumes", async ({ page }) => {
  let completed = false;
  let savedPayload: Record<string, unknown> | null = null;
  let rsvpCalls = 0;
  await page.addInitScript(() => {
    const payload = btoa(JSON.stringify({ sub: "11111111-1111-4111-8111-111111111111", email: "member@example.com", roles: [] }))
      .replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
    localStorage.setItem("startupa2z_token", `header.${payload}.signature`);
  });
  await page.route("**/api/auth/me", async (route) => {
    if (route.request().method() === "PATCH") {
      savedPayload = route.request().postDataJSON() as Record<string, unknown>;
      completed = true;
    }
    const user = completed ? {
      ...incompleteUser,
      job_title: "Not applicable",
      founder_status: "not_founder",
      profile_complete: true,
    } : incompleteUser;
    await route.fulfill({ contentType: "application/json", body: JSON.stringify(memberProfileResponse(user)) });
  });
  await page.route("**/api/rsvp/member", async (route) => {
    rsvpCalls += 1;
    await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ ok: true, message: "RSVP confirmed." }) });
  });

  const eventPath = "/events/startup-a-to-z-hacker-dojo-august-12?rsvp=1";
  await page.goto(eventPath);
  await expect(page).toHaveURL(/\/complete-profile\?returnTo=/);
  await page.getByLabel("Job title / role *").fill("Not applicable");
  await page.getByLabel("Founder status *").click();
  await page.getByRole("option", { name: "Not a founder" }).click();
  await page.getByRole("button", { name: "Save and continue" }).click();

  await expect.poll(() => rsvpCalls).toBe(1);
  expect(savedPayload).toMatchObject({
    full_name: "Member Example",
    company: "Example Startup",
    job_title: "Not applicable",
    founder_status: "not_founder",
  });
});

test("direct profile access without a valid session returns to member sign-in", async ({ page }) => {
  await page.route("**/api/auth/me", async (route) => {
    await route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({ detail: "Missing or invalid Authorization header." }) });
  });

  await page.goto("/complete-profile?returnTo=%2Fresources");

  await expect(page).toHaveURL(/\/welcome$/);
  await expect(page.getByRole("main").getByRole("button", { name: "Sign In" })).toBeVisible();
});

test("an invalid stored session is cleared without trapping a public route", async ({ page }) => {
  await authenticatedBrowser(page);
  await page.route("**/api/auth/me", async (route) => {
    await route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({ detail: "Invalid or expired token." }) });
  });

  await page.goto("/resources");

  await expect(page).toHaveURL(/\/resources\/?$/);
  await expect(page.getByRole("heading", { name: /Resources/i })).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("startupa2z_token"))).toBeNull();
});

test("a completed member can edit every profile field and see the update on welcome", async ({ page }) => {
  await authenticatedBrowser(page);
  let user = {
    ...incompleteUser,
    job_title: "Founder",
    founder_status: "founder" as const,
    profile_complete: true,
  };
  let patchCalls = 0;
  await page.route("**/api/auth/me", async (route) => {
    if (route.request().method() === "PATCH") {
      patchCalls += 1;
      const payload = route.request().postDataJSON() as typeof user;
      user = { ...user, ...payload, profile_complete: true };
      await route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, user }) });
      return;
    }
    await route.fulfill({ contentType: "application/json", body: JSON.stringify(memberProfileResponse(user)) });
  });

  await page.goto("/welcome");
  await expect(page.getByRole("heading", { name: "Welcome, Member Example" })).toBeVisible();
  await page.getByRole("link", { name: "Edit profile" }).click();
  await page.getByLabel("Full name *").fill("Updated Member");
  await page.getByLabel("Company / startup *").fill("Not applicable");
  await page.getByLabel("Job title / role *").fill("Not applicable");
  await page.getByLabel("Founder status *").click();
  await expect(page.getByRole("option", { name: "Founder", exact: true })).toBeVisible();
  await expect(page.getByRole("option", { name: "Co-founder" })).toBeVisible();
  await expect(page.getByRole("option", { name: "Aspiring founder" })).toBeVisible();
  await page.getByRole("option", { name: "Not a founder" }).click();
  await page.getByRole("button", { name: "Save and continue" }).click();

  await expect(page).toHaveURL(/\/welcome$/);
  await expect(page.getByRole("heading", { name: "Welcome, Updated Member" })).toBeVisible();
  await expect(page.getByText("Not applicable", { exact: true })).toHaveCount(2);
  expect(patchCalls).toBe(1);
});

test("profile completion remains usable at a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await authenticatedBrowser(page);
  await page.route("**/api/auth/me", async (route) => {
    await route.fulfill({ contentType: "application/json", body: JSON.stringify(memberProfileResponse()) });
  });

  await page.goto("/complete-profile?returnTo=%2Fwelcome");

  await expect(page.getByRole("heading", { name: "Complete your member profile" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Save and continue" })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test("LinkedIn cancellation and failed one-time exchange leave no authenticated session", async ({ page }) => {
  await page.route("**/api/auth/oauth/linkedin/exchange", async (route) => {
    await route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ detail: "Invalid or expired LinkedIn exchange code." }) });
  });

  await page.goto("/?linkedin_error=cancelled");
  await expect(page.getByText("LinkedIn authentication was not completed", { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/\/$/);

  await page.goto("/?linkedin_code=expired");
  await expect(page.getByText("LinkedIn authentication failed", { exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("startupa2z_token"))).toBeNull();
});

test("admin members UI displays and edits membership fields", async ({ page }) => {
  await authenticatedBrowser(page, ["admin"]);
  const member = {
    ...incompleteUser,
    linkedin_id: null,
    job_title: "Founder",
    founder_status: "founder" as const,
    registered_sessions: 1,
    attended_sessions: 0,
  };
  let updatePayload: Record<string, unknown> | null = null;
  await page.route("**/api/auth/me", async (route) => {
    await route.fulfill({ contentType: "application/json", body: JSON.stringify(memberProfileResponse({ ...member, profile_complete: true })) });
  });
  await page.route("**/api/admin/**", async (route) => {
    const url = route.request().url();
    if (url.endsWith("/api/admin/members") && route.request().method() === "GET") {
      await route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, data: [member] }) });
      return;
    }
    if (url.includes(`/api/admin/members/${member.id}`) && route.request().method() === "PUT") {
      updatePayload = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, data: { ...member, ...updatePayload } }) });
      return;
    }
    await route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, data: [] }) });
  });
  await page.route("**/api/events", async (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, data: [] }) }));

  await page.goto("/admin/submissions");
  await page.getByRole("button", { name: "Members" }).click();
  await expect(page.getByText("Example Startup")).toBeVisible();
  await expect(page.getByText("Founder", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Edit Member Example" }).click();
  await page.getByLabel("Company / startup").fill("Edited Startup");
  await page.getByLabel("Job title / role").fill("Operator");
  await page.getByLabel("Founder status").click();
  await page.getByRole("option", { name: "Not a founder" }).click();
  await page.getByRole("button", { name: "Save changes" }).click();

  expect(updatePayload).toMatchObject({ company: "Edited Startup", job_title: "Operator", founder_status: "not_founder" });
  await expect(page.getByText("Edited Startup")).toBeVisible();
});
