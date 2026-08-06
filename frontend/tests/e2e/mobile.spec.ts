import { expect, test } from "@playwright/test";

test("mobile navigation keeps every primary destination accessible", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.locator("div.fixed.inset-0");

  await expect(menu.getByRole("link", { name: "Home", exact: true })).toBeVisible();
  await expect(menu.getByRole("link", { name: "Events", exact: true })).toBeVisible();
  await expect(menu.getByRole("link", { name: "Community", exact: true })).toBeVisible();
  await expect(menu.getByRole("link", { name: "Resources", exact: true })).toBeVisible();
  await expect(menu.getByRole("link", { name: "Sponsor", exact: true })).toBeVisible();
  await expect(menu.getByRole("button", { name: "WhatsApp" })).toBeVisible();
  await expect(menu.getByRole("button", { name: "Sign In", exact: true })).toBeVisible();
});

test("core mobile pages do not overflow horizontally", async ({ page }) => {
  for (const route of ["/", "/events", "/startups", "/resources", "/sponsorship"]) {
    await page.goto(route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, route).toBeLessThanOrEqual(1);
  }
});
