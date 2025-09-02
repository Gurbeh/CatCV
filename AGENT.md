## 🎯 Purpose
Rules and workflows for AI Agents. Agents must follow these instructions, including hierarchical application based on file location.

## 🌳 Scope & Hierarchy
- If `AGENT.md` exists at repository **root**, its rules apply to the **entire project**.
- If `AGENT.md` exists in a **subdirectory** (e.g. `/components/AGENT.md`), those rules apply to that directory and all of its children.
- **Parent rules also apply**. When inside a subdirectory, agents must follow the union of parent `AGENT.md` files (root → … → current). If a child explicitly overrides a parent rule, state it clearly under a heading “Overrides”.

---

## 🔧 Post-Coding Workflow
1. **Run Quality Checks**
   - Run lint.
   - Build the project.
2. **Fix Errors**
   - If lint or build fails, fix issues before proceeding.
3. **Stage Changes**
   - Once everything passes, run:
     ```bash
     git add .
     ```

---

## ✅ TDD Policy (Test-Driven Development)
- Always use **TDD**:
  1) **RED**: Write a failing test that describes the behavior.
  2) **GREEN**: Implement the minimal code to make the test pass.
  3) **REFACTOR**: Improve design while keeping tests green.
- Write **unit tests** for pure functions, **integration tests** for modules/route handlers, and **e2e tests** for flows.
- Testing tools:
  - **Unit/Integration**: Vitest + vite-node.
  - **React/Next.js Components**: @testing-library/react + @testing-library/jest-dom.
  - **API Routes:**: supertest
  - **E2E**: Playwright.
- Keep test files next to code: `*.test.ts(x)` or under `__tests__/`.
- Code is not “done” until **tests exist and pass**.

---

## 🧩 Code Design & Function Decomposition
- Prefer **small, single-responsibility functions** (aim ≤ 30 lines; low cyclomatic complexity).
- Favor **pure functions** for business logic. Side effects isolated at boundaries.
- Use **TypeScript strict**: `"strict": true`, no `any` without justification. Export and reuse types.
- **Naming**: intention-revealing, consistent casing, no abbreviations unless standard.
- **Refactors** welcome when tests are green.
- Avoid duplication (DRY), prefer composition over inheritance.
- Public APIs stable; internal modules can change.

---

## 🧭 Next.js Best Practices (Full-stack: App Router)
### Common
- Use **App Router** (`app/`), **Server Components** by default. Add `"use client"` only when needed.
- Prefer **Server Actions** (where suitable) over ad-hoc API calls.
- Use **route handlers** in `app/api/**/route.ts` for server endpoints.
- **Never expose secrets** to the client. Read secrets only on the server.
- Leverage **Edge** runtime for lightweight, stateless endpoints when beneficial; otherwise Node.js runtime.

### Data & Caching
- Use **fetch** with proper caching:
  - Static data: `export const revalidate = <seconds>` or `fetch(url, { next: { revalidate: n }})`.
  - Dynamic data: `cache: 'no-store'` only when necessary.
- For DB access: prefer **Prisma** or **Drizzle** with typed schemas.
- Validate all inputs with **Zod** (shared types between client/server when safe).

### Error Handling & UX
- Use `error.tsx` and `loading.tsx` per route segment.
- Centralize error mapping, never leak stack traces to clients.
- Add **React Suspense** where async UI boundaries exist.
- Accessibility: semantic HTML, label controls, keyboard nav, `aria-*` where needed.

### Performance
- Use `next/image` and `next/font`.
- Avoid large client bundles; keep heavy logic on server, split code on routes.
- Memoize client components (`useMemo`, `useCallback`) prudently; measure before optimizing.

### Security
- Configure **headers** in `next.config.js` or `middleware.ts` (CSP, X-Frame-Options, etc).
- **Rate limit** sensitive routes (e.g., via middleware with IP-based buckets).
- Validate **CSRF** for mutations initiated from browsers (if not using same-site + server actions).
- Sanitize user content; avoid `dangerouslySetInnerHTML`.

### State & Forms
- Prefer **server mutations** (server actions) and `useFormStatus`/`useFormState` for progressive UX.
- For client state, prefer minimal local state; use **Zustand** or **React Query** only when justified.

### Logging & Observability
- Structured logging on server (e.g., pino) with request IDs.
- Use **instrumentation hooks** (`instrumentation.ts`) for tracing metrics.
- Log only what’s necessary; exclude PII.

### Internationalization
- Use Next.js i18n routing or libraries like `next-intl`.
- Keep copy in message catalogs; avoid hard-coded user-facing strings.

---

## 🧹 Style, Linting, and Formatting
- **ESLint** with Next.js + TypeScript configs; extend with `eslint-plugin-import`, `eslint-plugin-security`, `eslint-plugin-jsx-a11y`.
- **Prettier** for formatting; no manual bikeshedding.
- Enforce via **pre-commit** (lint-staged) and **CI**.

---

## 🧪 Testing Guidelines (Quick Checklist)
- Each new module ships with:
  - Unit tests (core logic)
  - Integration tests (route handlers/server actions)
  - Optional e2e for critical flows
- Mock IO (fs, network, DB) where appropriate; avoid over-mocking.
- Ensure tests are **deterministic** and **fast**.
- Coverage gates in CI (e.g., lines ≥ 80%, critical modules ≥ 90%).

---

## 🔁 Git & CI
- Use conventional commits (e.g., `feat:`, `fix:`, `refactor:`).
- CI pipeline runs: typecheck, lint, tests, build.
- Blocks merge on failures; no skipping unless approved in `Overrides`.

---

## 📌 Notes for Agents
- Do **not** skip lint/build/tests.
- Respect **all parent AGENT.md rules** inside subdirectories.
- Prefer small, well-typed, tested units; refactor with safety nets (tests).

---

### README Update (Append this section to README.md)
Add (or update) a section:

## 🤖 Agent Rules
Agent-specific rules live in [AGENT.md](./AGENT.md).  
- The root `AGENT.md` applies to the entire repository.  
- Subdirectories may include their own `AGENT.md`; those rules apply to that subtree **in addition** to all parent `AGENT.md` files.  
- Agents must follow TDD, write small single-responsibility functions, and adhere to the Next.js full-stack best practices defined in `AGENT.md`.
