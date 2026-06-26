# Crowe Helix - AI Audit Reporting Agent

> Report clearly. Audit continuously.

A demo for **Meridian National Bank** ($280B regional bank). An AI reporting agent reads a synthetic knowledge base of 8 audit-reporting documents and drafts the **FY2026 Capital Planning & Capital Adequacy** final audit report through **7 sequential, live `gpt-5.5` calls** streamed to the browser over Server-Sent Events.

All data is synthetic. (c) 2026 Crowe LLP.

## Quick start

```bash
npm install
# set OPENAI_API_KEY in .env.local for live generation
npm run dev
```

Open the URL printed at startup and follow:

`/login` -> choose a role -> **Audit Universe** -> open **Capital Planning** -> **Knowledge Base** (8 documents) -> **Generate FY2026 Audit Report** -> **Run Reporting Agent** -> review/edit -> submit -> director approval -> **Export** (Word / Excel / PDF).

## Environment

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.5
NEXT_PUBLIC_APP_NAME=Crowe Helix
DEMO_FALLBACK=false
```

## Demo safe-mode

The live path is primary. For unreliable networks:

- set `DEMO_FALLBACK=true`, or
- press **Shift+F** on the report screen before running.

Safe-mode replays 7 pre-written report sections through the same SSE and telemetry pipeline. If a live call fails mid-run, that single section silently falls back and the run continues.

## Architecture

- `src/app/api/generate-report/route.ts` - SSE reporting-agent orchestrator
- `src/lib/agent/reportAgent.ts` - step definitions: label, source docs, prompt builder
- `src/lib/agent/prompts.ts` - system prompt and per-section reporting instructions
- `src/content/documents/` - 8 synthetic reporting-phase knowledge-base documents
- `src/content/fallbackReport.ts` - pre-baked 7-section report fallback
- `src/store/appStore.ts` - Zustand state for role, KB status, report sections and lifecycle