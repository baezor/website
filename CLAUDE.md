# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Rules

1. **Always start from `develop` branch** - Never branch from or commit to `main` directly
2. **Run `npm run build` before committing** - Verify no build errors
3. **Every change needs a PR** - No direct pushes to `develop` or `main`
4. **Images go in `src/assets/`** - Not `public/`, to enable Astro optimization
5. **Use path aliases** - Import with `@/components/*` not relative paths

## Commands

- `npm run dev` or `npm start` - Start development server
- `npm run build` - Generate production build
- `npm run preview` - Preview production build locally

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
3. Make changes and commit
4. `git push -u origin feature/<name>`
5. `gh pr create --base develop`
6. Lighthouse CI runs and posts Core Web Vitals scores
7. After approval, merge to `develop` and delete branch

**Release workflow**:
1. `git checkout -b release/v1.x.x` from `develop`
2. Final testing and version bumps
3. Merge to `main` (tag with version) and back to `develop`

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
