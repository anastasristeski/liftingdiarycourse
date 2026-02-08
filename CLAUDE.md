# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Lifting Diary Course — a Next.js 16 web application using the App Router, React 19, TypeScript, and Tailwind CSS v4.

## Commands

- `npm run dev` — start dev server (localhost:3000)
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — run ESLint

## Architecture

- **Next.js App Router** (`src/app/`) — all routes and layouts live here, not the Pages Router
- **Path alias**: `@/*` maps to `./src/*`
- **Styling**: Tailwind CSS v4 with CSS variables for theming; dark mode via `prefers-color-scheme`
- **TypeScript**: strict mode enabled
- **No test framework configured yet**
