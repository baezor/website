---
title: "How I Achieved Perfect Lighthouse Scores (100 Across the Board)"
description: "A walkthrough of the specific fixes I made to push my Astro site from 95/81/92 to 100/100/100 on Lighthouse's Accessibility, Best Practices, and SEO audits."
pubDate: 2026-03-19T00:00:00.000Z
heroImage: ../../assets/pagespeed-100-scores.png
categories:
  - performance
  - accessibility
keywords:
  - lighthouse
  - web performance
  - accessibility
  - SEO
  - WCAG
  - Cloudflare Zaraz
  - Astro
contentType: "technical-tutorial"
faqs:
  - question: "What causes Lighthouse Best Practices to drop below 100?"
    answer: "A common culprit is Partytown, which enumerates all window properties on initialization, triggering Chrome's deprecation tracking for APIs like SharedStorage and AttributionReporting. Removing Partytown and using an edge-based solution like Cloudflare Zaraz eliminates these warnings."
  - question: "How do I fix color contrast issues flagged by Lighthouse?"
    answer: "Use a contrast checker to ensure your text colors meet WCAG AA's 4.5:1 ratio for normal text. Watch out for compounding CSS opacity values and text on tinted backgrounds, where the effective contrast can be much lower than expected."
  - question: "Does removing Partytown hurt performance?"
    answer: "Not necessarily. For static sites with excellent Core Web Vitals, Partytown's overhead (service worker initialization, window enumeration) can actually be more costly than loading analytics directly with async. Edge-based alternatives like Cloudflare Zaraz have near-zero client impact."
---

I recently set out to fix the Lighthouse audit failures on this site. The starting scores were Accessibility 95, Best Practices 81, and SEO 92 — not bad, but not perfect. Here's exactly what I fixed to get all three to 100.

## The Starting Point

The site is built with Astro, deployed on Cloudflare Pages, with Core Web Vitals already in great shape (LCP ~180ms, CLS 0.00). The issues were all in the non-performance categories: color contrast, missing aria attributes, generic link text, and deprecated browser API warnings.

## Fix 1: Color Contrast (Accessibility)

Lighthouse flagged several text elements for insufficient contrast against their backgrounds. WCAG AA requires at least a 4.5:1 contrast ratio for normal-sized text.

**Muted text color** — `#7a786f` on `#faf9f5` was only ~4.2:1. Darkened to `#65635b` (~5.1:1).

**Accent color** — `#d97757` on light backgrounds was ~3.0:1. Darkened to `#b5532f` (~4.7:1).

**Category badges** — This one was subtle. The badge used `color: var(--color-accent)` on a background of `color-mix(in srgb, var(--color-accent) 15%, transparent)`. The text and background were both derived from the same accent color, yielding only 3.85:1 contrast. Fixed by using the main text color instead.

**Footer credit** — The footer used `opacity: 0.8` on the container and `opacity: 0.7` on the credit text. These compound multiplicatively: `0.8 x 0.7 = 0.56` effective opacity, making the text far too light. Replaced with an explicit `color: var(--color-text-muted)`.

The takeaway: **always check computed contrast, not just your CSS variable values.** Opacity stacking and tinted backgrounds can silently break your ratios.

## Fix 2: Aria-Label Mismatches (Accessibility)

WCAG 2.5.3 requires that when an element has both visible text and an `aria-label`, the label must contain the visible text. Two elements failed this:

- **Logo link** — visible text "Angel Baez", aria-label was just "Home". Changed to "Angel Baez - Home".
- **Language switcher** — visible text "ES", aria-label was "Switch to Spanish". Changed to "ES - Switch to Spanish".

## Fix 3: Descriptive Link Text (SEO)

Generic link text like "Read more" and "Learn more" hurts both screen reader usability and SEO. Two fixes:

- **Blog "Read more" links** — Added `aria-label="Read more about {post title}"` to each link.
- **Homepage CTA** — Changed "Learn more" to "Learn more about me".

## Fix 4: Replacing Partytown with Cloudflare Zaraz (Best Practices)

This was the most interesting one. Lighthouse flagged `SharedStorage` and `AttributionReporting` as deprecated APIs, dropping Best Practices to 81. But my code wasn't using those APIs — Partytown was.

Partytown works by running third-party scripts in a web worker. During initialization, it calls `Object.getOwnPropertyNames(window)` to enumerate every browser API and create proxy objects. This enumeration touches deprecated APIs, which Chrome flags even though nobody actually called them.

**The fix:** Remove Partytown entirely and switch to [Cloudflare Zaraz](https://developers.cloudflare.com/zaraz/). Since the site already runs on Cloudflare Pages, Zaraz was a natural fit:

- **Zero client-side code** — Zaraz runs analytics logic on Cloudflare's edge, injecting only a tiny ~2-3 KB loader (vs. gtag.js at ~111 KB + Partytown's service worker).
- **No deprecated API warnings** — No window enumeration, no service worker sandbox.
- **Free tier** — 1 million events/month included.
- **Setup** — Just enable GA4 in the Cloudflare dashboard and delete all analytics code from the codebase.

## The Result

| Category | Before | After |
|---|---|---|
| Performance | 99 | 99 |
| Accessibility | 95 | **100** |
| Best Practices | 81 | **100** |
| SEO | 92 | **100** |

Zero failed audits. The site is faster too — removing Partytown's service worker and gtag.js eliminated ~120 KB of client-side JavaScript.

If you're using Partytown on a Cloudflare-hosted site and wondering why your Best Practices score won't budge, consider Zaraz. It solved the problem with less code, not more.
