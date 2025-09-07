# CatCV — Job Application Assistant

CatCV is a modern, Next.js + TypeScript web app that helps you manage job applications with AI-powered resume tailoring and cover letter generation. Store resumes, job descriptions, and track application status with a secure, multi-tenant database.

The app features a complete database schema with Drizzle ORM, Supabase integration, and Row Level Security for secure multi-tenant data isolation.

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
- Next.js 15 (App Router) + TypeScript
- Database: Supabase PostgreSQL with Drizzle ORM
- Authentication: Supabase Auth with Row Level Security
- UI: Tailwind CSS + shadcn/ui components
- Icons: lucide-react
- Validation: zod with JSON Resume schema
- ESLint + Prettier for code quality

## App Structure
```
src/
  main.tsx                # Router + layout + providers
  index.css               # Tailwind base + theme tokens
  ai/placeholders.ts      # Future AI stub (no‑op)
  app/routes/             # Pages: /login, /, /jobs/new, /jobs/:id
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

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase recommended)

### Environment Setup
1. Copy `env.example` to `.env.local`
2. Configure your database and Supabase credentials:
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/catcv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here
```

### Database Setup
```bash
# Install dependencies
npm install

# Generate and run migrations
npm run db:generate
npm run db:migrate

# Apply Row Level Security policies (in Supabase SQL editor)
# Copy and paste contents of lib/db/rls-policies.sql
```

### Development
```bash
# Start dev server
npm run dev

# Database tools
npm run db:studio    # Open Drizzle Studio
npm run db:push      # Push schema changes

# Code quality
npm run lint
npm run format
```

Open http://localhost:5173 (default Vite port) after `yarn dev`.

## Usage Walkthrough
1) Navigate to `/login` and click Continue to enter the app.
2) On Home (`/`), click “New Job” to add an entry.
3) In the New Job form, complete required fields. Use “Paste here” to read from the clipboard (browser permission required). Job Link is optional.
4) Click “Analyze” to save. You’ll see a success toast and return to Home.
5) Manage entries from the table: open details, copy link, or delete (confirm dialog).

## Design & Theming
- Tailwind provides theme tokens via CSS variables; dark mode uses the `class` strategy.
- UI primitives (Button, Input, Textarea, Card, Dialog, Badge, Table) are consistent and accessible.
- Header shows your logo from `public/logo.png`; favicons are defined in `index.html`.

## Roadmap
- AI‑powered analysis of job descriptions (wired through `ai/placeholders.ts`)
- Search/filter, import/export, and richer detail views

### 🤖 Agent Rules
This project defines agent workflows in [AGENTS.md](./AGENTS.md).
- Canonical, detailed rules live under `/.cursor/rules` (start with `index.mdc`).
- All AI agents (Codex, etc.) must read those rules before editing files.
- Local rules may exist in subfolders in addition to the global rules.


## License
Proprietary or as defined by the repository owner.
