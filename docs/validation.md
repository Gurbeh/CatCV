# Fast Validation Plan — AI-tailored Resume & Cover Letters

## Objectives (1 week)
- Validate value: smart tailoring + cover letter reduces time and improves fit.
- Validate channels: can we reach 100+ relevant visitors quickly?
- Collect signal for v1 friction and must-have features.

## Methods
- Customer interviews (5–10 conversations)
- Landing page smoke test (100+ unique visits)
- Prototype usage test (MVP flow): JD -> tailored JSON -> cover letter -> PDF
- Optional: “Pro” waitlist (no payments yet) to test upgrade intent

## Success Criteria
- Interviews: ≥70% say it saves meaningful time; 3 recurring pains.
- Landing: CTR to demo ≥3%, email capture ≥5% of uniques.
- Product: activation ≥60% (tailored resume + cover letter generated), median time-to-export ≤5 min.
- Upgrade intent: ≥10% of signups opt-in to “Pro waitlist”.

## Interview Plan (script)
- Context: last 3 applications, current workflow/tools.
- Pain: what’s slow/error-prone? JD matching, ATS, versions?
- Solution fit: react to a 60s demo; what’s missing to use today?
- Willingness: would you use this weekly? price anchor for model/theme upgrades?
- Close: ask for permission to follow up + get a real JD to test.

## Landing Page (copy)
- H1: Tailor your JSON Resume to any JD — plus an editable cover letter
- Sub: Generate schema-safe updates and export PDF in minutes
- CTA primary: Try the demo (no signup)
- CTA secondary: Join Pro waitlist (model upgrade & themes)
- Social proof: GitHub stars / privacy-first / JSON Resume compatible

## Traffic Channels
- Dev communities (Reddit r/resumes, r/cscareerquestions, HN Show), LinkedIn posts, X/Twitter.
- Personal network + targeted DMs with demo link.

## Prototype Test (instrumented)
- Flow: upload/build base JSON -> paste JD -> generate -> review diff -> export PDF.
- Guardrails: AJV strict validation; reject non-schema fields; clear error paths.
- Caching: hash(base resume + JD) to avoid duplicate costs during tests.

## Metrics & Instrumentation
- Analytics: Plausible (privacy-friendly)
- Core events
  - app_open
  - resume_base_created | resume_base_uploaded
  - jd_pasted
  - tailored_generated
  - cover_letter_generated
  - pdf_exported
  - activation_completed (both tailored + cover letter)
  - pro_waitlist_joined
- Timing: measure JD -> activation_completed (ms)

## Ops Checklist
- Rate limit AI endpoints (per-IP + per-user) with Upstash.
- Error boundaries and user-facing messages for AJV failures.
- Log anonymized failures (schema violations, model errors).

## Data Collection
- Store anonymized counts + timings; do not store JD text without consent.
- If consented, save JD snippets for prompt tuning.

## Risks & Mitigations
- Low traffic: seed via network + cross-post; add simple shareable demo GIF.
- Poor PDF fidelity: keep theme simple; document known limitations.
- High cost: apply small max-length on JD; cache repeats; cap free usage.

## Timeline
- Day 1: landing + analytics + waitlist, interview outreach; instrument prototype.
- Days 2–5: run interviews (1–2/day), drive traffic, iterate copy.
- Day 6–7: synthesize findings; decide v1 scope changes.
