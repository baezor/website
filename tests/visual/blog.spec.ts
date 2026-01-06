import { test, expect } from "@playwright/test";
import { setTheme, waitForPageStable, blockAnalytics } from "./utils";

test.describe("Blog Post Layout", () => {
  test.beforeEach(async ({ page }) => {
    await blockAnalytics(page);
    await page.goto("/blog/visual-regression-testing-with-playwright");
    await waitForPageStable(page);
  });

  test("light mode", async ({ page }) => {
    await setTheme(page, "light");
    await expect(page).toHaveScreenshot("blog-light.png", {
      fullPage: true,
    });
  });

  test("dark mode", async ({ page }) => {
    await setTheme(page, "dark");
    await expect(page).toHaveScreenshot("blog-dark.png", {
      fullPage: true,
    });
  });
});
