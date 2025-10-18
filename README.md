# Fineart & Modeling Club — Website

Welcome! This repository contains the frontend for the Fineart & Modeling Club website — a Next.js application used to publish announcements, events, showcase paintings, and provide account-based features for members and admins.

This README covers the project overview, local setup, development commands, and a Contribution Guide that explains how to contribute, test, and submit changes.

## Table of contents

- Project overview
- Features
- Tech stack
- Getting started (dev & build)
- Environment & configuration
- Contributing (branching, commits, PRs, code style, tests)

## Project overview

### Cloudinary setup

To enable image upload on the My Paintings page, set these env vars (e.g., in `.env.local`):

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — your Cloud name
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` — an unsigned upload preset that allows client uploads
- `NEXT_PUBLIC_CLOUDINARY_FOLDER` — optional folder name to organize assets (e.g. `fineart/paintings`)

Also ensure `next.config.ts` allows images from `res.cloudinary.com` (already configured).
The Fineart & Modeling Club website is a modern, server-rendered React app (Next.js) used by the club to:

- Share announcements and events
- Display member profiles and galleries of paintings
- Provide authenticated areas (sign-in, sign-up, settings)
- Admin dashboard for content management

The frontend lives in this repository and communicates with a separate backend (see the monorepo `server/` folder) for auth and data.

## Features

- Public landing and announcements pages
- Event listings
- Paintings gallery with user uploads and personal collections
- Authentication flow (sign in/up, password reset, email verification)
- Admin and user dashboards with role-based access

## Tech stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS (via PostCSS)
- Bun or npm for scripts (project supports multiple package managers)
- TanStack Query (for server communication) — see `src/components/providers/query-provider.tsx`

## Getting started

Prerequisites

- Node.js 18+ or Bun (if you use Bun, commands below show the Bun equivalents)
- pnpm, npm, yarn, or bun (optional)

Install dependencies

```bash
# Using npm
npm install

# Or with bun
bun install
```

Run development server

```bash
# npm
npm run dev

# bun
bun dev
```

Open http://localhost:3000 in your browser. The app uses the Next.js App Router; edit files under `src/app` to change pages.

Build for production

```bash
npm run build
npm run start

# or with bun
bun build
bun start
```

Linting & formatting

```bash
npm run lint
npm run format
```

Run tests (skip this for now)

```bash
npm test
```

## Environment & configuration

- Copy `.env.example` (if present) to `.env.local` and fill in API endpoints, auth client IDs, and any third-party keys. The frontend expects a running backend (see the `server/` folder in the repo root).
- Typical variables:
  - NEXT_PUBLIC_API_URL — backend API base URL
  - NEXT_PUBLIC_SENTRY_DSN — optional error tracking

## Contribution guide

Thank you for contributing — we welcome fixes, features, and docs improvements. The steps below explain the workflow we prefer.

1. Open an issue first

   - If it's a bug, include reproduction steps and any console/network errors.
   - If it's a feature, include use cases and proposed UI changes.

2. Branching

   - Base off `main`.
   - Branch name format: `type/short-description` where `type` is one of `fix`, `feat`, `chore`, `docs`, `refactor`.
     - Example: `feat/gallery-infinite-scroll` or `fix/signin-redirect`

3. Commits

   - Use clear, present-tense messages.
   - Recommended format: `<type>(<scope>): short description`
     - types: feat, fix, docs, style, refactor, test, chore
     - example: `feat(auth): add email verification flow`

4. Pull requests

   - Open a PR against `main` with a clear description and screenshots when applicable.
   - Include testing steps and any migrations or backend changes required.
   - Add relevant labels and reviewers.

5. Code style

   - Follow existing TypeScript and React patterns in the project.
   - Run linters and formatters before submitting: `npm run lint` and `npm run format`.
   - Keep component logic small and prefer extracting hooks for complex logic.

6. Testing ( You can skip this for now ...)

   - Add unit tests for new logic and integration tests for key flows when possible.
   - If you add a new UI page or component, include a simple test that mounts it and checks for expected output.

7. Accessibility & performance

   - Use semantic HTML and proper ARIA attributes for interactive controls.
   - Keep images optimized and use Next.js Image where helpful.

8. Updating docs

   - If your change affects setup, environment variables, or deployment, update this README and xyz.md in documentation folder.

9. Ownership & follow-ups

   - After the PR is merged, update any related issues and notify maintainers if a follow-up is required.

## Code of Conduct

Be respectful and constructive. Report abusive behavior to the maintainers. We aim for an inclusive community.

## Troubleshooting

- If you get CORS or auth errors, confirm `NEXT_PUBLIC_API_URL` points to a running backend and your session cookies/tokens are set.
- For build failures, run `npm run build` locally and fix lint/type errors reported by TypeScript.

## Acknowledgements

This project was scaffolded with Next.js and extended to fit the Fineart & Modeling Club's needs.
