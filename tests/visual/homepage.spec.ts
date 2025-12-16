import { test, expect } from "@playwright/test";
import { setTheme, waitForPageStable } from "./utils";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForPageStable(page);
  });

  test("light mode", async ({ page }) => {
    await setTheme(page, "light");
    await expect(page).toHaveScreenshot("homepage-light.png", {
      fullPage: true,
    });
  });

  test("dark mode", async ({ page }) => {
    await setTheme(page, "dark");
    await expect(page).toHaveScreenshot("homepage-dark.png", {
      fullPage: true,
    });
  });
});
