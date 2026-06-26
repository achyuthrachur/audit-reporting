# PRD - Crowe Helix: AI Audit Reporting Agent

## Purpose

Create a Crowe Helix demo that drafts a final internal audit report for Meridian National Bank's FY2026 Capital Planning & Capital Adequacy audit.

## Workflow

The demo path is: login, select the Capital Planning audit, review the reporting-phase knowledge base, generate the report, refine sections through chat, submit for director review and export Word, Excel or PDF.

## Agent behavior

The reporting agent uses seven sequential GPT-5.5 calls over Server-Sent Events:

1. Executive Summary
2. Scope & Approach
3. Overall Rating & Conclusion
4. Key Findings
5. Management Action Plans
6. Issues Closed & Remediation Validation
7. Distribution, Timeline & Appendices

The agent must ground every statement in the 8 synthetic source documents and preserve finding IDs, ratings, owners, target dates and regulatory references exactly.

## Deployment

This fork must deploy as a separate GitHub and Vercel project named `audit-reporting`. Do not reuse the audit-planning repo or Vercel project metadata.