import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for visual regression testing.
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests/visual",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "html",

  /* Shared settings for all projects */
  use: {
    /* Base URL - uses preview URL in CI, local dev server otherwise */
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:4321",
    trace: "on-first-retry",
  },

  /* Configure snapshot settings for visual regression */
  expect: {
    toHaveScreenshot: {
      /* Allow 0.2% pixel difference to account for anti-aliasing */
      maxDiffPixelRatio: 0.002,
      /* Animation settings */
      animations: "disabled",
    },
  },

  /* Use platform-agnostic snapshots (remove platform suffix) */
  snapshotPathTemplate: "{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}{ext}",

  /* Test projects for different viewports */
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: "tablet-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: "mobile-chromium",
      use: {
        ...devices["Pixel 5"],
      },
    },
  ],

  /* Run local dev server before starting tests (only when not using external URL) */
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run preview",
        url: "http://localhost:4321",
        reuseExistingServer: !process.env.CI,
      },
});
