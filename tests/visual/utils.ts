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
 * Blocks external analytics scripts for test consistency.
 *
 * Prevents timing variability caused by third-party analytics services
 * during visual regression testing.
 *
 * Blocked domains:
 * - Google Tag Manager
 * - Google Analytics
 * - (Add more analytics domains here as needed)
 */
export async function blockAnalytics(page: Page) {
  const analyticsPatterns = [
    '**/*googletagmanager.com/**',
    '**/*google-analytics.com/**',
    '**/*analytics.google.com/**',
  ];

  for (const pattern of analyticsPatterns) {
    await page.route(pattern, route => route.abort());
  }
}

/**
 * Waits for the page to be fully loaded and stable for screenshots.
 *
 * Note: The 50ms timeout was reduced from 100ms for speed optimization.
 * Monitor CI for flakiness - if unstable, increase back to 100ms.
 */
export async function waitForPageStable(page: Page) {
  await page.waitForLoadState("networkidle");
  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);
  // Small delay for any CSS transitions to complete
  await page.waitForTimeout(50);
}
