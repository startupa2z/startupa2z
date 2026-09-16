import { test, expect } from "@playwright/test";

for (const width of [1440, 390]) {
  test(`September 15 gallery loads and navigates at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/gallery/founders-pitch-mix-2026-09-15");
    await expect(page.getByText("4 photographs", { exact: true })).toBeVisible();
    const photos = page.getByRole("button", { name: /Open photo \d of 4/ });
    await expect(photos).toHaveCount(4);
    await photos.last().scrollIntoViewIfNeeded();
    await expect.poll(() => photos.locator("img").evaluateAll(images => images.every(image => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await photos.first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("1 / 4", { exact: true })).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByText("2 / 4", { exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(photos.first()).toBeFocused();
    await page.goto("/gallery");
    await expect(page.getByRole("article").first()).toContainText("September 15, 2026");
    await page.goto("/events/founders-pitch-mix-2026-09-15");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("From Startup Story to Business Fundamentals");
    await expect(page.getByRole("heading", { name: "Growth needs retention and unit economics" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Watch the recording & read the transcript" })).toHaveAttribute("href", /videotobe\.com\/play\/collection\//);
    await expect(page.getByText("GTM Blueprint", { exact: true })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /View photo gallery/ })).toHaveAttribute("href", "/gallery/founders-pitch-mix-2026-09-15");
  });
}
