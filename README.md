# Learn Lingo

Learn Lingo is a modern language-learning marketplace built with Next.js and TypeScript. Students can discover teachers, book lessons, save favorites, and view simple usage stats. Authentication and data storage are powered by Firebase.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Environment](#environment)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License & Contact](#license--contact)

---

## Features

- Teachers directory with profile pages
- Booking modal and streamlined booking flow
- Favorites list for students
- Email/password authentication (Firebase)
- Lightweight usage statistics and admin tools
- Responsive UI using CSS Modules

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Firebase (Auth, Firestore)
- React Query for data fetching
- ESLint for linting and code quality

## Quick Start

Prerequisites:

- Node.js 16+ (recommended)
- npm or yarn
- A Firebase project (Auth + Firestore)

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
# Open http://localhost:3000
```

Build for production:

```bash
npm run build
npm run start
```

## Environment

Configure Firebase in `firebase/config.ts` with your project's settings or provide environment variables as you prefer. Ensure Firestore rules and Auth providers are set up for your environment.

Add a `.env.local` (not committed) for any environment variables the app requires.

## Available Scripts

From `package.json`:

- `npm run dev` — Run development server
- `npm run build` — Build production app
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
- `npm run import:teachers` — Import teachers via `scripts/firebase/importTeachers.ts` (requires `ts-node`)

## Project Structure (high level)

- `app/` — Next.js App Router routes and pages
- `components/` — Reusable UI components
- `firebase/` — Firebase init and helpers
- `lib/` — Server-side helpers and API utilities
- `hooks/` — Reusable React hooks
- `public/` — Static assets (images, icons)
- `types/` — TypeScript types

## Contributing

1. Fork the repo and create a branch for your feature
2. Keep changes focused and add tests where appropriate
3. Open a PR with a clear description and screenshots if relevant

If you'd like, I can add a GitHub Actions CI workflow, tests, or a `.env.example` file.

## Design

- Figma mockup: https://www.figma.com/file/dewf5jVviSTuWMMyU3d8Mc/%D0%9F%D0%B5%D1%82-%D0%BF%D1%80%D0%BE%D1%94%D0%BA%D1%82-%D0%B4%D0%BB%D1%8F-%D0%9A%D0%A6?type=design&node-id=0-1&mode=design&t=jCmjSs9PeOjObYSc-0

## License & Contact

- **Author:** Сергій Гаєвой (Serhii Haievoi) — gaevuha@gmail.com

See the `license` field in `package.json`. For issues or feedback, open an issue in the repository.

---

Ready to improve further — I can add a `.env.example`, screenshots, or deployment instructions for Vercel/Docker.
