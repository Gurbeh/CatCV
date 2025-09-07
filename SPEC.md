# Build a React Frontend: "Job Application Assistant"

Create a modern React-only frontend (no backend yet) that helps a user paste a job description and save basic job information for later. The app is in **English**. Treat this as production-quality scaffolding written by a senior engineer.

---

## Tech & Tooling
- **Framework**: React 18 with **Vite** (preferred) or Next.js App Router (if easier for shadcn/ui). Choose one and be consistent. If you pick Next.js, use the `app/` directory and client components where needed.
- **UI Library**: **shadcn/ui** + Tailwind CSS. Set up shadcn/ui properly (`npx shadcn@latest init` etc.). Use its components (Button, Textarea, Input, Card, Dialog, DropdownMenu, Badge, Toast/Sonner, etc.).
- **Styling**: Tailwind with sensible config; dark mode supported via `class` strategy.
- **Icons**: `lucide-react`.
- **State**: Local component state + a simple lightweight store (React Context or Zustand) for saved jobs.
- **Routing**: React Router (if Vite) or Next.js routing (if Next). Include routes listed below.
- **Persistence**: `localStorage` for now (encapsulate in a tiny data-access layer with serialization & schema validation).
- **Lint & Format**: ESLint + Prettier preconfigured and runnable with npm scripts. Use recommended React rules and consistent formatting.
- **TypeScript**: Yes. Strongly type components, props, and models.
- **Testing (bonus)**: Minimal setup with Vitest/React Testing Library for 1–2 smoke tests (optional but nice).

---

## Product Overview
The app currently has two core screens:
1. **Login**: a simple landing screen with a single "Continue" button (no real auth yet). Clicking it takes the user into the app.
2. **Home (Dashboard)**: shows the list of saved job applications ("jobs"), with the ability to add a new one.

A third screen handles creating a job entry:
3. **New Job**: a form where the user can paste or type the job description, enter the company name, and the job posting URL, then click **Analyze** (for now, this just saves the entry). No AI is implemented in this milestone—just a clear placeholder.

The future plan (not in scope now) is to generate a resume and cover letter with AI, so leave small, well-labeled placeholders.

---

## Routes & Navigation
- `/login` — Login screen with one primary button: **Continue**. Pressing it navigates to `/`.
- `/` — Home screen showing the list of saved jobs.
- `/jobs/new` — New Job form.
- `/jobs/:id` — (Optional detail view) Displays a single saved job. Nice to have.

Ensure a top-level app layout with a simple header/nav (App name on the left; on the right a link to Home and a subtle placeholder menu for Account). Header is consistent across pages except the minimalist Login page.

---

## Data Model
Create a `Job` model with strong types:
```ts
export type JobId = string; // use nanoid

export interface Job {
  id: JobId;
  companyName: string;
  jobLink: string; // URL string
  jobText: string; // pasted/typed JD
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  status: 'saved' | 'analyzed'; // future-ready
}
```

- Provide `jobsStore` utilities: `getAll()`, `get(id)`, `create(jobInput)`, `update(id, patch)`, `remove(id)`, `clearAll()`.
- Persist to `localStorage` under a single key, e.g. `job-app-assistant:jobs:v1`.
- Add minimal schema validation (e.g., zod) at the boundary.

---

## Screens & UX Details

### 1) Login (`/login`)
- Centered card.
- Title: "Welcome to Job Application Assistant"
- Subtitle: "Paste a job description and save opportunities to revisit later."
- One primary **Continue** button.
- Add a tiny note: "Authentication will be added later."

### 2) Home / Dashboard (`/`)
- Header with app name (left) and a minimal user menu (right) with a disabled sign-out item (placeholder).
- Page title: "Your Saved Applications".
- Primary action button: **New Job** (navigates to `/jobs/new`).
- Jobs list in responsive cards or a compact table using shadcn/ui components.
  - Each row/card shows: **Company**, **Job Link** (as an external link), **Created** date (formatted), **Status** badge.
  - Row actions: **Open** (if you implement detail view), **Delete** (with confirm dialog), and **Copy Link**.
- Empty state: nice illustration/placeholder icon and text: "No applications yet. Click New Job to get started."

### 3) New Job (`/jobs/new`)
- **Form fields** (all labeled):
  - **Company Name** (Input, required)
  - **Job Link** (Input type=url, required; basic URL validation)
  - **Job Description** (Textarea, required). Above it put helper text: "Paste the Job Description below."
  - Next to the Textarea label add a small secondary button **Paste here** that reads from clipboard and inserts text (use `navigator.clipboard.readText()`, with error toast on failure).
- **Analyze** (Primary button) — for now, clicking **Analyze** simply:
  - Creates a new `Job` entry with `status: 'saved'` and timestamps
  - Persists to localStorage
  - Shows a success toast: "Saved. Analysis will come in a future release."
  - Navigates back to Home
- Validation: disable Analyze until required fields are valid; show inline errors with shadcn/ui `Form` components.

---

## Components (suggested)
- `AppHeader`
- `JobCard` / `JobsTable`
- `NewJobForm`
- `ConfirmDialog`
- `ToastProvider` (use Sonner or shadcn/ui toasts)

Keep components small and well-typed. Prefer composition over props bloat.

---

## Accessibility & Quality
- Use semantic HTML and accessible labels for all inputs.
- Keyboard navigation: all interactive elements reachable with tab; focus states visible.
- Announce toasts for screen readers.
- Respect reduced motion preferences for animations.

---

## Visual Style (shadcn/ui)
- Clean, minimal card-based layout.
- Use `Card`, `Button`, `Input`, `Textarea`, `Form`, `Label`, `Badge`, `Table`, `Dialog` from shadcn/ui.
- Use `lucide-react` icons for small affordances (e.g., Clipboard, Plus, Trash, ExternalLink, Check).

---

## Project Structure (example for Vite)
```
src/
  main.tsx
  app/
    routes/
      login.tsx
      home.tsx
      jobs/
        new.tsx
        [id].tsx (optional)
  components/
    AppHeader.tsx
    JobCard.tsx
    JobsTable.tsx
    NewJobForm.tsx
    ConfirmDialog.tsx
  lib/
    storage.ts (localStorage adapter)
    jobsStore.ts (CRUD + zod schemas)
    date.ts (format helpers)
```

---

## ESLint & Prettier
- Add scripts:
  - `lint`: `eslint --ext .ts,.tsx src`
  - `format`: `prettier --write "src/**/*.{ts,tsx,css,md}"`
- Extend: `eslint:recommended`, `plugin:react/recommended`, `plugin:@typescript-eslint/recommended`, `plugin:react-hooks/recommended`.
- Prettier: 100 column width, 2 spaces, single quotes, trailing commas: all.

---

## Empty AI Placeholder (Future)
- Create a module `ai/placeholders.ts` exporting a stub `analyzeJob(job: Job)` that returns a resolved Promise immediately. Wire the New Job screen to call it before saving (no-op now) so adding AI later won’t require refactors.
- Add TODO comment blocks where AI-generated resume/cover letter actions might live.

---

## Success Criteria / Acceptance Tests
- I can open `/login`, click **Continue**, and land on `/`.
- On `/`, I see an empty state. Clicking **New Job** takes me to `/jobs/new`.
- On `/jobs/new`, **Analyze** stays disabled until Company, Job Link, and Job Description are valid.
- The **Paste here** button pastes clipboard text into the Textarea (with permission handling & a toast on success/failure).
- Clicking **Analyze** saves the job to `localStorage`, shows a success toast, and navigates to `/`.
- The home list shows the newly saved job with company, external link, created date, and a **saved** status badge.
- I can delete a job with a confirmation dialog; the list updates and persists after refresh.
- The codebase passes `npm run lint` and `npm run format` with no errors.

---

## Nice-to-Haves (not required)
- Detail page at `/jobs/:id` with read-only view of the job.
- Search/filter on the Home list by company or status.
- Import/Export jobs as JSON.

---

## Deliverables
- A working React app with the routes, components, and behavior above.
- Clean, idiomatic TypeScript React code.
- shadcn/ui and Tailwind configured and used consistently.
- ESLint and Prettier configured with scripts.
- Minimal README with setup instructions (`pnpm i`/`npm i`, dev server command, build command).

