import { test, expect } from "@playwright/test";
import { setTheme, waitForPageStable, blockAnalytics } from "./utils";

test.describe("Contact Page", () => {
  test.beforeEach(async ({ page }) => {
    await blockAnalytics(page);
    await page.goto("/contact");
    await waitForPageStable(page);
  });

  test("light mode", async ({ page }) => {
    await setTheme(page, "light");
    await expect(page).toHaveScreenshot("contact-light.png", {
      fullPage: true,
    });
  });

  test("dark mode", async ({ page }) => {
    await setTheme(page, "dark");
    await expect(page).toHaveScreenshot("contact-dark.png", {
      fullPage: true,
    });
  });
});
