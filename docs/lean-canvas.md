# One-page Lean Canvas — AI-tailored Resume & Cover Letters

## Problem
- Tailoring resumes/cover letters per job is time-consuming and error-prone.
- Inconsistent matching to JD keywords causes ATS rejection.
- Manual versioning for each application is messy.

## Target Customer
- Individual job seekers in tech (Dev/PM/DS/Design) applying to 10–50 roles/month.

## Unique Value Proposition
- Smart, schema-safe tailoring of JSON Resume plus auto-generated, editable cover letters, with tidy job application management and one-click PDF export.

## Solution
- Import/build base JSON Resume; validate strictly (AJV).
- Input JD + site name; generate tailored resume (schema-bound) and a cover letter; export PDF.
- Manage applications with status tracking and version history.

## Channels
- Dev communities (Reddit/HN/Twitter/X), LinkedIn groups, personal network, GitHub readme demo, Product Hunt.

## Revenue Streams
- Free personal use MVP.
- Later: Pro plan (model upgrade to gpt-5, HTML-to-PDF parity themes, bulk tailoring, custom templates).

## Key Costs
- AI API usage, hosting (Vercel/Supabase), Upstash rate limit, time for support and iteration.

## Unfair Advantage
- Schema-bound AI generation preventing junk JSON; versioned prompts + typed outputs; fast iteration on Next.js Server Actions.

## Key Metrics
- Activation: first tailored resume + cover letter generated.
- Core: applications created per user per week, D7 retention.
- Quality: edit rate after generation, time-to-export PDF.


