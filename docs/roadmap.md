# Roadmap v1/v2 — AI-tailored Resume & Cover Letters

## Principles
- Minimize friction from MVP; keep JSON Resume as source of truth.
- Safe-by-default AI (schema-bound); no surprises in stored data.
- Prefer simple, reliable tooling: `resume-cli` for PDF export.

## v1 (post-validation): Remove friction + minimal automation
- Onboarding & Base Resume
  - Inline JSON Resume editor with AJV errors shown inline (path-based).
  - Import helpers: paste JSON, upload file; simple sample resume.
- Tailoring Experience
  - JD paste with live token count and length guard.
  - Schema-bound generation with diff viewer (added/changed fields highlighted).
  - Learning/meta suggestions placed under `meta` safely.
- Cover Letter
  - Generate neutral tone; small editor with autosave.
  - One-click copy/download as `.txt`.
- PDF Export (JSON Resume tools)
  - Theme selector (dropdown of curated themes).
  - Server action: `resume-cli` render → store PDF in Supabase Storage → return URL.
  - Persist selected theme per job application.
- Job Tracker
  - Status chips (Draft/Applied/Interview/Offer/Rejected), notes, quick filters.
- Reliability & Cost
  - Rate limits (per-IP + per-user) on AI endpoints.
  - Caching: hash(base resume + JD) to skip repeated generations.
  - Metrics: activation funnel, time-to-export, edit rate.
- Security & Data
  - RLS policies for all tables; enforce user_id on inserts.
  - Consent gate for storing JD text; otherwise store hashes only.

## v2: Differentiators & Scalability
- Tailoring Power-Ups
  - ATS keyword coverage score with suggestions (explain deltas).
  - JD highlights → mapped to resume sections (visibility of coverage).
  - Tone presets for cover letters (neutral/warm/direct) and short templates.
- Themes & Customization
  - Theme gallery with live preview; easy theme config in `meta`.
  - Custom theme support guidelines (how to plug any NPM theme).
- Productivity & Integrations
  - Chrome/Edge extension: capture JD from job sites, send to app.
  - Batch tailoring (list of JDs run sequentially with caps and queue).
  - Export packs: ZIP with tailored JSON + PDF + cover letter.txt.
- Account & Payments (optional)
  - Pro plan: model upgrade to `gpt-5`, higher limits, batch runs, custom themes.
  - Quotas, usage dashboard, soft caps with upsell.
- Reliability at Scale
  - Background jobs/queue for heavy tasks; retries + dead-letter.
  - Observability (Sentry), cost dashboards, anomaly alerts.
  - Backups and migration hygiene for Supabase + Storage.

## Technical Tasks (Grouped)
- Data & RLS
  - Finalize Drizzle schema; add strict RLS policies for all tables.
  - Write fixtures and an optional seed for local dev.
- AI & Validation
  - Zod schemas for typed generation; `generateObject` wrappers.
  - Prompt versioning; include model env selection (`gpt-5-mini`, `gpt-5`).
- PDF Pipeline
  - Server action wrapper around `resume-cli` execution with theme param.
  - Store PDFs in `pdfs/` bucket; maintain links in `attachment` table.
- UX & DX
  - Diff viewer for JSON (added/changed/removed).
  - Form state with `react-hook-form`; zod resolver.
  - Minimal E2E smoke for JD → export.

## Milestones & Checks
- v1
  - Reduce median time JD → PDF export by 25–35% from MVP baseline.
  - Activation ≥ 70%; p95 ≤ 8 min.
- v2
  - Retention uplift ≥ +10% (D7) with ATS coverage + themes.
  - Cost per application within budget after batching and caching.

## Risks & Mitigations
- Theme rendering inconsistencies
  - Keep curated theme list; document supported versions.
- AI drift
  - Lock prompts by version; run schema validation; reject non-conformant.
- Cost spikes
  - Strict input caps; cache; quotas; fallbacks on failure.
