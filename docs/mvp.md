# MVP from Key Assumptions - AI-tailored Resume & Cover Letters

## Target User (Primary Persona)
- Individual tech job seeker (Dev/PM/DS/Design) applying to 10-50 roles per month
- Familiar with JSON Resume or willing to import/build a base resume once

## Key Assumptions (Testable Hypotheses)
- Value: schema-safe tailoring plus auto cover letter saves >= 60% time vs manual
- Quality: tailored resume matches JD keywords better, lowering ATS rejections
- UX: users can complete JD -> tailored JSON -> PDF export in < 5 minutes on first try
- Channel: dev communities + LinkedIn groups yield initial engaged users at low/no CAC
- Payment (later): some users will pay for model upgrade/themes (not in MVP build)

## Critical Scenarios
1) Create application from base resume + JD -> get tailored JSON + cover letter -> export PDF
2) Track application status (Draft -> Applied -> Interview -> Offer/Rejected) with minimal friction
3) Re-run tailoring after small JD edits without paying latency/price again (cache-friendly)

## Critical Workflows (1-2)
- Workflow A: Tailor Resume + Cover Letter
  1. Import/build base JSON Resume (validated with AJV)
  2. Paste JD + site name
  3. Generate tailored JSON (schema-bound, safe fields only) and an editable cover letter
  4. Review minimal diff, accept, export PDF; autosave versions

- Workflow B: Manage Application
  1. Create application record tied to a base resume
  2. Store tailored JSON, cover letter text, generated PDF in Storage
  3. Update status (Draft/Applied/Interview/Offer/Rejected); optional notes

## Only What’s Needed (Scope for MVP)
- Auth via Supabase + simple dashboard
- Base resume upload/build (JSON Resume v1) with strict AJV validation
- JD input + site field; generate tailored JSON (Vercel AI SDK with gpt-5-mini) and cover letter
- Minimal PDF exporter (@react-pdf/renderer) with a clean default template
- Storage of JSON/PDF/cover letter; download links
- Application tracker with status filter
- Basic rate limiting and error handling

## Explicit Non-Goals (for MVP)
- Advanced HTML theme parity (deferred)
- Multiple tone presets, custom templates, bulk tailoring
- Payments/subscriptions
- Collaboration/sharing links

## Success Metrics (for MVP)
- Activation: % of new users who generate both tailored resume and cover letter >= 60%
- Time-to-value: median time JD -> export PDF <= 5 minutes; p95 <= 10 minutes
- Retention: D7 retention >= 25% among active seekers
- Edit rate: <= 30% of cover letters need heavy edits (>30% changes) post-generation
- Cost: average AI cost per application within target budget (e.g., $0.05-$0.15)

## Technical Guardrails
- Models: default gpt-5-mini; gpt-5 upgrade toggled via pro=true (not required in MVP)
- Safety: sanitize JD, bound outputs with Zod + generateObject, reject schema-violations
- Caching: hash of (JD + base resume) to skip recomputation for minor retries
- RLS: all tables scoped to user_id with explicit policies

## Risks & Mitigations
- Hallucinated fields -> schema-bound generation + AJV validation + clear error messages
- Poor PDF aesthetics -> neutral, readable default; advanced themes deferred
- Latency/cost spikes -> rate limit, simple caching, stream cover letter text

## Timeline to Define & Build (Small Scope)
- Define (this doc): 1-2 days
- Build MVP: 3-5 focused days (solo) for a functional prototype
