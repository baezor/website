# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Rules

1. **Always start from `develop` branch** - Never branch from or commit to `main` directly
2. **Run `npm run build` before committing** - Verify no build errors
3. **Run `npm run test:visual` before committing UI changes** - Update snapshots if changes are intentional
4. **Every change needs a PR** - No direct pushes to `develop` or `main`
5. **Images go in `src/assets/`** - Not `public/`, to enable Astro optimization
6. **Use path aliases** - Import with `@/components/*` not relative paths

## Commands

- `npm run dev` or `npm start` - Start development server
- `npm run build` - Generate production build
- `npm run preview` - Preview production build locally
- `npm test` - Run unit tests once
- `npm run test:watch` - Run unit tests in watch mode
- `npm run test:ui` - Interactive Vitest UI mode
- `npm run test:coverage` - Generate coverage report
- `npm run test:visual` - Run visual regression tests
- `npm run test:visual:update` - Update baseline snapshots
- `npm run test:visual:ui` - Interactive Playwright UI mode

## Architecture

This is an Astro-based personal website with React integration, featuring a blog and social links page.

**Integrations**: React, astro-icon (with MDI and Simple Icons), Partytown (for Google Analytics)

**Path aliases** (configured in tsconfig.json):
- `@/components/*` → `./src/components/*`
- `@/layouts/*` → `./src/layouts/*`
- `@/pages/*` → `./src/pages/*`
- `@/data/*` → `./src/data/*`
- `@/css/*` → `./src/css/*`
- `@/const` → `./src/const.ts`

**Key files**:
- `src/const.ts` - Site metadata (title, description, URL)
- `src/data/index.ts` - User profile data, links, and social links arrays
- `src/content/config.ts` - Blog collection schema (title, description, pubDate, updatedDate, heroImage)

**Blog posts**: Add markdown files to `src/content/blog/` with required frontmatter (title, description, pubDate)

## Workflow (GitFlow)

This project uses GitFlow branching model.

**Branches**:
- `main` - Production-ready code, deployed to live site
- `develop` - Integration branch for features, PRs target this branch

**Branch types**:
- `feature/*` - New features, branch from `develop`, merge back to `develop`
- `release/*` - Release prep, branch from `develop`, merge to `main` and `develop`
- `hotfix/*` - Urgent production fixes, branch from `main`, merge to `main` and `develop`

**Feature workflow**:
1. `git checkout develop && git pull`
2. `git checkout -b feature/<name>`
3. Make changes
4. Run `npm run build` to verify no build errors
5. Run `npm run test:visual` - if intentional visual changes, run `npm run test:visual:update`
6. Commit changes (include updated snapshots if any)
7. `git push -u origin feature/<name>`
8. `gh pr create --base develop`
9. Lighthouse CI and Visual Regression tests run on PR
10. After approval, merge to `develop` and delete branch

**Release workflow**:
1. `git checkout -b release/v1.x.x` from `develop`
2. Final testing and version bumps
3. Merge to `main` (tag with version) and back to `develop`

## Visual Regression Testing

Visual tests run automatically on every PR to catch UI regressions.

**Test Coverage:**
- 6 pages × 2 viewports (desktop 1280×720, mobile Pixel 5) × 2 themes = 32 snapshots
- **Pages tested:**
  1. Homepage (`/`)
  2. Contact page (`/contact`)
  3. Run page - English (`/run`)
  4. Run page - Spanish (`/es/run`)
  5. Blog post example (`/blog/visual-regression-testing-with-playwright`)
  6. Header component (desktop navigation, mobile menu closed/open)

**When CI visual tests fail:**

1. **Review changes:**
   - Go to PR → Actions → Visual Regression Tests → Artifacts
   - Download `screenshot-diffs` artifact
   - Extract and review visual differences

2. **If changes are intentional** (e.g., you updated styles):
   ```bash
   # Update snapshots locally
   npm run build
   npm run dev  # In separate terminal
   npm run test:visual:update

   # Review updated snapshots
   git status  # Should show modified .png files in tests/visual/

   # Commit updated baselines
   git add tests/visual
   git commit -m "test: update visual regression baselines after [describe change]"
   git push
   ```

3. **If changes are unintentional:**
   - Fix the CSS/component causing regression
   - Push fix (snapshots don't need updating)

**Local testing:**
```bash
npm run test:visual          # Run all tests
npm run test:visual:update   # Update snapshots
npm run test:visual:ui       # Interactive debugging
```

**Configuration:**
- Config: `playwright.config.ts`
- Threshold: 0.2% max pixel difference
- CI: Sequential execution (1 worker) for consistency
- Retries: 2 (handles transient failures)

## Commit Convention

Commits are validated using commitlint. Format: `<type>: <description>`

**Types**:
- `feat` - New feature
- `fix` - Bug fix
- `hotfix` - Urgent production fix
- `release` - Release commit
- `docs` - Documentation
- `style` - Formatting (no code change)
- `refactor` - Code restructuring
- `perf` - Performance improvement
- `test` - Adding tests
- `chore` - Maintenance
- `ci` - CI/CD changes
- `build` - Build system

## Astro Patterns

- **Images**: Use `import` + Astro's `<Image>` component for automatic optimization (AVIF, WebP)
- **Icons**: Use `astro-icon` with `simple-icons` or `mdi` collections: `<Icon name="simple-icons:github" />`
- **Styling**: Scoped `<style>` in `.astro` files; use `:global()` for dark mode selectors
- **Dark mode**: Toggle via `.dark` class on `<html>`, check `DarkLightThemeSwitch.astro`

## CI/CD

- **Hosting**: Cloudflare Pages (auto-deploys on push)
- **Lighthouse CI**: Runs on PRs, posts scores as comment
- **Visual Regression**: Playwright tests run on PRs, posts results as comment
- **Preview URLs**: Each PR gets a preview deployment

## Common Tasks

**Add a new page**: Create `src/pages/pagename.astro`, use `Layout` component

**Add a blog post**: Create `src/content/blog/post-slug.md` with frontmatter:
```yaml
---
title: "Post Title"
description: "Description"
pubDate: 2025-01-01
---
```

**Add a social link**: Edit `src/data/index.ts`, add to `socialLinks` array
