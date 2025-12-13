# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

## Workflow

All changes should go through a pull request:

1. Create a feature branch: `git checkout -b <type>/<description>` (e.g., `feat/new-feature`, `fix/bug-name`, `perf/optimization`)
2. Make changes and commit
3. Push and create PR: `git push -u origin <branch>` then `gh pr create`
4. Lighthouse CI runs automatically on PRs and posts Core Web Vitals scores as a comment
5. After approval, merge and delete the branch

**Branch naming**: `feat/`, `fix/`, `perf/`, `chore/`, `ci/`
