import { test, expect } from "@playwright/test";
import { setTheme, waitForPageStable, blockAnalytics } from "./utils";

test.describe("About Page - English", () => {
  test.beforeEach(async ({ page }) => {
    await blockAnalytics(page);
    await page.goto("/about");
    await waitForPageStable(page);
  });

  test("light mode", async ({ page }) => {
    await setTheme(page, "light");
    await expect(page).toHaveScreenshot("about-light.png", {
      fullPage: true,
    });
  });

  test("dark mode", async ({ page }) => {
    await setTheme(page, "dark");
    await expect(page).toHaveScreenshot("about-dark.png", {
      fullPage: true,
    });
  });
});

test.describe("About Page - Spanish", () => {
  test.beforeEach(async ({ page }) => {
    await blockAnalytics(page);
    await page.goto("/es/about");
    await waitForPageStable(page);
  });

  test("light mode", async ({ page }) => {
    await setTheme(page, "light");
    await expect(page).toHaveScreenshot("about-es-light.png", {
      fullPage: true,
    });
  });

  test("dark mode", async ({ page }) => {
    await setTheme(page, "dark");
    await expect(page).toHaveScreenshot("about-es-dark.png", {
      fullPage: true,
    });
  });
});
