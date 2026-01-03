import { test, expect } from "@playwright/test";
import { setTheme, waitForPageStable } from "./utils";

test.describe("Run Page (Spanish)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/es/run");
    await waitForPageStable(page);
  });

  test("light mode", async ({ page }) => {
    await setTheme(page, "light");
    await expect(page).toHaveScreenshot("run-es-light.png", {
      fullPage: true,
    });
  });

  test("dark mode", async ({ page }) => {
    await setTheme(page, "dark");
    await expect(page).toHaveScreenshot("run-es-dark.png", {
      fullPage: true,
    });
  });
});
