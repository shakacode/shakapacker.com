# Napkin Runbook

## Curation Rules
- Re-prioritize on every read.
- Keep recurring, high-value notes only.
- Max 10 items per category.
- Each item includes date + "Do instead".

## Execution & Validation (Highest Priority)
1. **[2026-04-01] Confirm UI edits with a production build**
   Do instead: run `npm run build` after layout or component changes to catch static rendering regressions.

## Shell & Command Reliability
1. **[2026-04-01] Use fast file discovery first**
   Do instead: prefer `rg --files` and `rg` for navigation and targeted searches before broader tooling.

## Domain Behavior Guardrails
1. **[2026-04-01] Keep docs chrome stable while iterating**
   Do instead: preserve full-width nav background and constrain only inner content width for consistency across breakpoints.

## User Directives
1. **[2026-04-01] Favor conversion pathways across the site**
   Do instead: add contextual conversion links in high-traffic sections, using React on Rails-style CTA language.
