# HANDOFF - Crowe Helix Audit Reporting Agent

## Status

This project is the Audit Reporting fork of the original audit-planning demo. It is intended to live in a separate GitHub repo and Vercel project named `audit-reporting`.

## Current app

Next.js demo: **Crowe Helix - AI Audit Reporting Agent** for **Meridian National Bank** ($280B). The app reads 8 synthetic reporting-phase knowledge-base documents and drafts the FY2026 Capital Planning & Capital Adequacy final audit report through 7 sequential live `gpt-5.5` calls over SSE, with safe-mode fallback.

## Reporting workflow

Demo path: `/login` -> role -> `/audits` -> Capital Planning -> Knowledge Base -> Generate Report -> chat-edit -> Submit -> Director approve/return -> export.

Manager role:
- Generates the report.
- Edits sections through the report chat/editor.
- Submits draft or returned report for director review.

Director role:
- Reviews submitted reports.
- Approves or returns with required notes.
- Cannot generate or edit reports.

## Key implementation points

- Generation endpoint: `/api/generate-report`
- Agent config: `src/lib/agent/reportAgent.ts`
- Prompt rules: `src/lib/agent/prompts.ts`
- Knowledge base: `src/content/documents/index.ts`
- Fallback report: `src/content/fallbackReport.ts`
- Persistence keys:
  - `crowe-helix:report:capital-planning`
  - `crowe-helix:report:capital-planning:return-notes`
  - `crowe-helix-reporting:role`

## Environment

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.5
NEXT_PUBLIC_APP_NAME=Crowe Helix
DEMO_FALLBACK=false
```

## Deployment notes

Do not reuse the source `.git` or `.vercel` metadata from the audit-planning project. This fork should initialize a fresh git repo, create/push a new GitHub repo named `audit-reporting`, and link/deploy a new Vercel project named `audit-reporting`.