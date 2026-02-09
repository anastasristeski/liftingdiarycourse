# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Lifting Diary Course — a Next.js 16 web application using the App Router, React 19, TypeScript, and Tailwind CSS v4.

## Commands

- `npm run dev` — start dev server (localhost:3000)
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — run ESLint

## Docs-First Rule

**ALWAYS** read the relevant documentation file(s) in the `/docs` directory before generating any code. Match the task to the appropriate doc (e.g., UI work → `docs/ui.md`) and follow the patterns, conventions, and guidelines defined there. If no matching doc exists, proceed with the project conventions below.

- /docs/ui.md
- /docs/data-fetching.md
- /docs/data-mutations.md
- /docs/auth.md

## Architecture

- **Next.js App Router** (`src/app/`) — all routes and layouts live here, not the Pages Router
- **Path alias**: `@/*` maps to `./src/*`
- **Styling**: Tailwind CSS v4 with CSS variables for theming; dark mode via `prefers-color-scheme`
- **TypeScript**: strict mode enabled
- **No test framework configured yet**
