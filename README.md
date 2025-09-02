# CatCV — Job Application Assistant (Frontend)

CatCV is a modern, React + TypeScript web app that helps you quickly save and revisit job opportunities. Paste a job description, add basic details, and manage a list of saved applications locally in your browser.

No backend or AI is required in this version. The codebase is production‑ready scaffolding with strong typing, consistent UI primitives, and clean data boundaries that make future AI features easy to add.

## Features
- Login screen with a single Continue action (no auth yet)
- Home dashboard listing saved jobs in a compact table
  - Shows Company, external Job Link (if provided), Created date, and Status badge
  - Row actions: Open (detail), Copy Link, Delete (with confirmation)
- New Job form
  - Fields: Company (required), Job Link (optional), Job Description (required)
  - “Paste here” helper reads text from the clipboard and inserts it into the description
  - Analyze button validates and saves the job locally, shows a success toast, and navigates Home
- Optional job detail page (`/jobs/:id`) for a read‑only view
- Local persistence via `localStorage` with zod validation
- Class‑based dark mode (Tailwind) and accessible UI components

## Tech Stack
- Next.js 14 (React 18 + TypeScript)
- Tailwind CSS (class dark mode) + shadcn‑style UI primitives
- Radix UI: Dialog, Dropdown Menu
- Sonner for toasts; lucide‑react icons
- Next.js App Router for routing
- zod for data validation
- ESLint + Prettier for code quality

## App Structure
```
src/
  app/                    # Next.js App Router pages
    globals.css           # Tailwind base + theme tokens
    page.tsx              # Landing page
    login/page.tsx        # /login
    dashboard/page.tsx    # /dashboard
    jobs/                 # nested job routes
  ai/placeholders.ts      # Future AI stub (no‑op)
  components/             # UI pieces (Header, Table, Form, Dialog, primitives)
  lib/                    # Types, store, storage, utils, date format
public/
  logo.png                # Header logo
  favicon.ico             # Favicon + platform icons
  favicon-16x16.png
  favicon-32x32.png
  apple-touch-icon.png
  android-chrome-192x192.png
  android-chrome-512x512.png
```

## Data Model
```ts
export interface Job {
  id: string
  companyName: string
  jobLink?: string     // optional
  jobText: string
  createdAt: string    // ISO
  updatedAt: string    // ISO
  status: 'saved' | 'analyzed'
}
```

Storage details:
- Persisted under `localStorage` key: `job-app-assistant:jobs:v1`
- CRUD utilities: `getAll()`, `get(id)`, `create(input)`, `update(id, patch)`, `remove(id)`, `clearAll()`
- All data is validated with zod at the boundaries

## Accessibility
- Semantic labels for inputs; keyboard focus states visible
- Dialogs and menus use Radix primitives
- Toasts are screen‑reader friendly (Sonner)
- Respects `prefers-reduced-motion`

## Getting Started
Prerequisites: Node.js 18+

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Lint
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

Open http://localhost:3000 after `npm run dev`.

## Usage Walkthrough
1) Navigate to `/login` and click Continue to enter the app.
2) On Home (`/`), click “New Job” to add an entry.
3) In the New Job form, complete required fields. Use “Paste here” to read from the clipboard (browser permission required). Job Link is optional.
4) Click “Analyze” to save. You’ll see a success toast and return to Home.
5) Manage entries from the table: open details, copy link, or delete (confirm dialog).

## Design & Theming
- Tailwind provides theme tokens via CSS variables; dark mode uses the `class` strategy.
- UI primitives (Button, Input, Textarea, Card, Dialog, Badge, Table) are consistent and accessible.
- Header shows your logo from `public/logo.png`; favicons live in `public/`.

## Roadmap
- AI‑powered analysis of job descriptions (wired through `ai/placeholders.ts`)
- Search/filter, import/export, and richer detail views

## License
Proprietary or as defined by the repository owner.

