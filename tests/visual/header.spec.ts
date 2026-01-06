import { test, expect } from "@playwright/test";
import { setTheme, waitForPageStable, blockAnalytics } from "./utils";

// Use a specific locator for the navigation header (contains nav element)
const navHeaderSelector = "header:has(nav)";

test.describe("Header Component", () => {
  test.beforeEach(async ({ page }) => {
    await blockAnalytics(page);
    await page.goto("/");
    await waitForPageStable(page);
  });

  test("desktop navigation - light mode", async ({ page }) => {
    await setTheme(page, "light");
    const header = page.locator(navHeaderSelector);
    await expect(header).toHaveScreenshot("header-desktop-light.png");
  });

  test("desktop navigation - dark mode", async ({ page }) => {
    await setTheme(page, "dark");
    const header = page.locator(navHeaderSelector);
    await expect(header).toHaveScreenshot("header-desktop-dark.png");
  });
});

test.describe("Mobile Navigation", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await blockAnalytics(page);
    await page.goto("/");
    await waitForPageStable(page);
  });

  test("mobile menu closed - light mode", async ({ page }) => {
    await setTheme(page, "light");
    const header = page.locator(navHeaderSelector);
    await expect(header).toHaveScreenshot("header-mobile-closed-light.png");
  });

  test("mobile menu closed - dark mode", async ({ page }) => {
    await setTheme(page, "dark");
    const header = page.locator(navHeaderSelector);
    await expect(header).toHaveScreenshot("header-mobile-closed-dark.png");
  });

  test("mobile menu open - light mode", async ({ page }) => {
    await setTheme(page, "light");
    // Click hamburger menu to open
    await page.click('button[aria-label="Toggle menu"]');
    await page.waitForTimeout(100); // Wait for animation
    await expect(page).toHaveScreenshot("header-mobile-open-light.png", {
      fullPage: true,
    });
  });

  test("mobile menu open - dark mode", async ({ page }) => {
    await setTheme(page, "dark");
    // Click hamburger menu to open
    await page.click('button[aria-label="Toggle menu"]');
    await page.waitForTimeout(100); // Wait for animation
    await expect(page).toHaveScreenshot("header-mobile-open-dark.png", {
      fullPage: true,
    });
  });
});
