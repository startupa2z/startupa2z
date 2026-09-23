import { test, expect } from "@playwright/test";

for (const width of [1440, 390]) {
  test(`September 22 gallery and recap load at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/gallery/founders-pitch-mix-2026-09-22");
    await expect(page.getByText("12 photographs", { exact: true })).toBeVisible();
    const photos = page.getByRole("button", { name: /Open photo \d+ of 12/ });
    await expect(photos).toHaveCount(12);
    await photos.last().scrollIntoViewIfNeeded();
    await expect.poll(() => photos.locator("img").evaluateAll(images => images.every(image => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    await photos.first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("1 / 12", { exact: true })).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByText("2 / 12", { exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();

    await page.goto("/gallery");
    await expect(page.getByRole("article").first()).toContainText("September 22, 2026");
    await page.goto("/events/founders-pitch-mix-2026-09-22");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("The Wiz Story and Product Pitches");
    await expect(page.getByRole("heading", { name: "Qualify the customer before spending founder time" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Insomnia brings security testing into one platform" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "A product built for the automotive industry" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "One final founder story from the community stage" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Sidhdharth Sivasubramanian/ })).toHaveAttribute("href", "https://www.linkedin.com/in/sidhdharthsivasubramanian/");
    await expect(page.getByRole("link", { name: /Insomnia by Bogdan Barchuk/ })).toHaveAttribute("href", "https://insom.ai/en/about");
    await expect(page.getByRole("link", { name: /View photo gallery/ })).toHaveAttribute("href", "/gallery/founders-pitch-mix-2026-09-22");
  });
}
