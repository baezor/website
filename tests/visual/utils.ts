import { Page } from "@playwright/test";

/**
 * Sets the theme by manipulating localStorage and the DOM class.
 */
export async function setTheme(page: Page, theme: "light" | "dark") {
  await page.evaluate((t) => {
    localStorage.setItem("theme", t);
    if (t === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, theme);
}

/**
 * Waits for the page to be fully loaded and stable for screenshots.
 */
export async function waitForPageStable(page: Page) {
  await page.waitForLoadState("networkidle");
  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);
  // Small delay for any CSS transitions to complete
  await page.waitForTimeout(100);
}
