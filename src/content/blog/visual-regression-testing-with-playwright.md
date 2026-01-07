---
title: "Visual Regression Testing with Playwright"
description: "Visual testing with Playwright"
pubDate: 2024-07-11T10:00:00.000Z
categories:
  - testing
  - playwright
  - typescript
metaDescription: "Implement visual regression testing with Playwright. Learn to catch UI bugs, configure snapshot testing, and integrate into CI/CD workflows."
keywords:
  - playwright
  - visual regression testing
  - typescript
  - testing
  - snapshot testing
  - UI testing
contentType: "technical-tutorial"
faqs:
  - question: "What is visual regression testing?"
    answer: "Visual regression testing is a quality assurance technique that compares screenshots of your application before and after code changes to detect unintended visual differences. It helps catch UI bugs that traditional unit or integration tests might miss."
  - question: "Why should I use Playwright for visual testing?"
    answer: "Playwright offers built-in screenshot comparison with toMatchSnapshot(), supports all major browsers (Chromium, Firefox, WebKit), provides excellent cross-platform consistency, and integrates seamlessly with CI/CD pipelines. It's also faster than many alternatives."
  - question: "How do I update snapshots when intentional changes are made?"
    answer: "Run your tests with the --update-snapshots flag: npx playwright test --update-snapshots. This will regenerate all baseline screenshots with the current state of your application."
  - question: "Can I test specific components instead of full pages?"
    answer: "Yes, Playwright allows you to capture screenshots of specific elements using locators. Use page.locator() to select a component, then call toHaveScreenshot() on that specific element instead of the full page."
---

## Introduction

In this blog post I'll explain the importance of visual testing and how I implemented it in my development workflow using Playwright.

## What is Playwright?

Playwright is a browser automating and end-to-end integration testing. It has robust configuration options, support for all browsers, a powerful API, and a great community. It is a great tool.

## Why visual testing?

Visual tests value increases as your application grows. It is a great way to ensure that your application looks the same across different browsers and devices.

It is also a great way to catch visual bugs that could be missed by traditional testing.

## First steps with Playwright

First, let's create a project and install Playwright.

```bash
# install dependencies
npm install -d @playwright/test typescript

# install playwright browsers
npx playwright install

# create a new project
mkdir -p tests
touch tests/homepage.spec.ts
```

## Write your first test

```typescript
import { test, expect } from "@playwright/test";

test("home page visual test", async ({ page }) => {
  await page.goto("https://husldigital.com/");
  await expect(page).toMatchSnapshot();
});
```

Then, run the test:

```bash
npx playwright test
```

The first time you run the test it will fail because there is no snapshot to compare, but it will create a snapshot for you. The next time you run the test it will compare the snapshot with the current state of the page.

so you can run the test again:

```bash
npx playwright test
```

And it should pass.

```bash
Running 1 test using 1 worker

  ✓ homepage visual test

  1 passed
```

## Integrating Playwright into our development workflow

I have three use cases where I use visual testing:

1. To ensure that the application looks the same across different browsers.
2. To review responsive design changes.
3. To ensure updates in a component does not impact other parts of the application.

### 1. To ensure that the application looks the same across different browsers

Playwright supports all browsers, so you can run your tests in all of them to ensure that your application looks the same across different browsers.

Here's how you set up Playwright configuration file:

```ts
export default defineConfig({
  // other config here...

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "browser",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
```

### 2. To review responsive design changes

You can use Playwright to test your application in different devices and screen sizes.

```ts
test("element responsiveness", async ({ page }) => {
  const viewportWidths = [960, 760, 480];
  await page.goto("https://husldigital.com/blog/");

  for (const width of viewportWidths) {
    await page.setViewportSize({ width, height: 800 });
    await expect(page).toHaveScreenshot(`post-${width}.png`);
  }
});
```

### 3. To ensure updates in a component does not impact other parts of the application

You can use Playwright to test a specific component in your application.

```ts
test("component visual test", async ({ page }) => {
  await page.goto("https://husldigital.com/blog/");
  const component = await page.$("#case-studies");
  // Make sure the component is visible
  await component?.scrollIntoViewIfNeeded();
  await expect(component).toMatchSnapshot({ threshold: 0.1 });
});
```
