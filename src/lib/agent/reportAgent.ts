/**
 * Reporting-agent orchestration config: the explicit 7-step array that the SSE
 * route iterates over. Each step declares its label, source documents,
 * scripted telemetry lines, and prompt builder.
 *
 * The sequential, document-grounded loop is what qualifies this as an agent:
 * each call is grounded in specific KB documents plus the report sections
 * generated so far.
 */

import { getDocById } from "@/content/documents";
import { SECTION_6_INSTRUCTION, SECTION_7_INSTRUCTION } from "./prompts";

export interface ReportStep {
  id: number;
  title: string;
  sourceIds: string[];
  telemetry: string[];
  includePriorSections: boolean;
  buildUserPrompt: (priorSections: { title: string; content: string }[]) => string;
}

function docContext(ids: string[]): string {
  return ids
    .map((id) => {
      const d = getDocById(id);
      if (!d) return "";
      return `\n===== SOURCE DOCUMENT: ${d.title} (${d.id}) - ${d.docType}, dated ${d.date} =====\n${d.body}\n===== END ${d.id} =====\n`;
    })
    .join("\n");
}

function priorContext(priorSections: { title: string; content: string }[]): string {
  if (priorSections.length === 0) return "";
  return (
    "\n\n----- PREVIOUSLY GENERATED REPORT SECTIONS (for coherence; do not repeat verbatim) -----\n" +
    priorSections.map((s) => `### ${s.title}\n${s.content}`).join("\n\n") +
    "\n----- END PRIOR SECTIONS -----\n"
  );
}

export const REPORT_STEPS: ReportStep[] = [
  {
    id: 1,
    title: "Executive Summary",
    sourceIds: ["IA-TEST-2026-014", "IA-EXC-2026-014", "IA-VAL-2026-014", "REG-2025-118", "ARC-2026-014"],
    telemetry: [
      "Reading IA-TEST-2026-014 - completed test results...",
      "Reading IA-EXC-2026-014 - exception log and draft findings...",
      "Reading IA-VAL-2026-014 - prior finding and MRA validation evidence...",
      "Drafting executive summary...",
    ],
    includePriorSections: false,
    buildUserPrompt: (prior) =>
      `Draft Section 1 - Executive Summary - of the FY2026 Capital Planning & Capital Adequacy audit report.

Write a board-ready executive summary. State the overall rating as Needs Improvement, explain that governance routines were generally operating but data-lineage and reconciliation weaknesses remain, and identify the most significant matter: F-2026-041 and partial remediation of prior finding F-2025-031. State that the Federal Reserve MRA REG-2025-118 is not ready for closure. Keep the tone balanced by acknowledging the Axiom upgrade improved four of seven feeds.

${docContext(["IA-TEST-2026-014", "IA-EXC-2026-014", "IA-VAL-2026-014", "REG-2025-118", "ARC-2026-014"])}${priorContext(prior)}`,
  },
  {
    id: 2,
    title: "Scope & Approach",
    sourceIds: ["IA-SCOPE-2026-007", "IA-PGM-2026-007", "IA-TEST-2026-014"],
    telemetry: [
      "Reading IA-SCOPE-2026-007 - approved audit scope...",
      "Reading IA-PGM-2026-007 - audit program and testing approach...",
      "Extracting completed procedures from IA-TEST-2026-014...",
      "Drafting scope and approach...",
    ],
    includePriorSections: true,
    buildUserPrompt: (prior) =>
      `Draft Section 2 - Scope & Approach - of the FY2026 Capital Planning & Capital Adequacy audit report.

Describe the scope period, in-scope areas, out-of-scope areas, testing approach, and procedures completed. Include a concise table of testing workstreams, sample sizes, exceptions, and conclusions. Make clear the report covers January 1, 2026 through September 30, 2026 with targeted post-implementation validation after the August 12, 2026 Axiom go-live.

${docContext(["IA-SCOPE-2026-007", "IA-PGM-2026-007", "IA-TEST-2026-014"])}${priorContext(prior)}`,
  },
  {
    id: 3,
    title: "Overall Rating & Conclusion",
    sourceIds: ["IA-TEST-2026-014", "IA-EXC-2026-014", "IA-VAL-2026-014", "ARC-2026-014"],
    telemetry: [
      "Reading test exception rates and conclusions...",
      "Correlating findings to report committee direction...",
      "Assessing MRA closure readiness...",
      "Drafting overall rating and conclusion...",
    ],
    includePriorSections: true,
    buildUserPrompt: (prior) =>
      `Draft Section 3 - Overall Rating & Conclusion - of the FY2026 Capital Planning & Capital Adequacy audit report.

Assign the overall rating of Needs Improvement and explain why. Tie the rating to the High finding F-2026-041, the partially remediated prior finding F-2025-031, the two Moderate findings, and the not-ready-for-closure conclusion on REG-2025-118. Include a rating rationale table that maps rating drivers to evidence.

${docContext(["IA-TEST-2026-014", "IA-EXC-2026-014", "IA-VAL-2026-014", "ARC-2026-014"])}${priorContext(prior)}`,
  },
  {
    id: 4,
    title: "Key Findings",
    sourceIds: ["IA-EXC-2026-014", "IA-TEST-2026-014", "REG-2025-118"],
    telemetry: [
      "Reading IA-EXC-2026-014 - finding conditions and causes...",
      "Reading IA-TEST-2026-014 - supporting test exceptions...",
      "Linking findings to REG-2025-118 supervisory expectations...",
      "Drafting key findings...",
    ],
    includePriorSections: true,
    buildUserPrompt: (prior) =>
      `Draft Section 4 - Key Findings - of the FY2026 Capital Planning & Capital Adequacy audit report.

Present the four findings F-2026-041 through F-2026-044. For each finding, include rating, condition, criteria, cause, effect, and report-ready recommendation. Emphasize that F-2026-041 is High and directly tied to the Federal Reserve MRA. Keep the section concise but complete enough for a final audit report.

${docContext(["IA-EXC-2026-014", "IA-TEST-2026-014", "REG-2025-118"])}${priorContext(prior)}`,
  },
  {
    id: 5,
    title: "Management Action Plans",
    sourceIds: ["IA-MGMT-2026-014", "IA-EXC-2026-014"],
    telemetry: [
      "Reading IA-MGMT-2026-014 - accepted action plans...",
      "Mapping action owners and target dates to findings...",
      "Checking consistency with draft findings...",
      "Drafting management action plan section...",
    ],
    includePriorSections: true,
    buildUserPrompt: (prior) =>
      `Draft Section 5 - Management Action Plans - of the FY2026 Capital Planning & Capital Adequacy audit report.

Summarize management acceptance and provide a table with finding, owner, committed action, and target date. Make clear that management accepted all findings on October 16, 2026 and agreed with the Needs Improvement rating. Do not invent owners or dates.

${docContext(["IA-MGMT-2026-014", "IA-EXC-2026-014"])}${priorContext(prior)}`,
  },
  {
    id: 6,
    title: "Issues Closed & Remediation Validation",
    sourceIds: ["IA-VAL-2026-014", "IA-TEST-2026-014", "REG-2025-118"],
    telemetry: [
      "Reading IA-VAL-2026-014 - validation conclusions...",
      "Reading REG-2025-118 - MRA closure expectations...",
      "Separating closed items from residual gaps...",
      "Drafting remediation validation section...",
    ],
    includePriorSections: true,
    buildUserPrompt: (prior) =>
      `Draft Section 6 - Issues Closed & Remediation Validation - of the FY2026 Capital Planning & Capital Adequacy audit report.

Explain what Internal Audit validated, which prior items are closed or superseded, and why F-2025-031 is only partially remediated. State that the Federal Reserve MRA REG-2025-118 is not ready for closure. Include a table of prior items and current validation conclusion.${SECTION_6_INSTRUCTION}

${docContext(["IA-VAL-2026-014", "IA-TEST-2026-014", "REG-2025-118"])}${priorContext(prior)}`,
  },
  {
    id: 7,
    title: "Distribution, Timeline & Appendices",
    sourceIds: ["IA-SCOPE-2026-007", "IA-MGMT-2026-014", "ARC-2026-014"],
    telemetry: [
      "Reading ARC-2026-014 - distribution and issuance direction...",
      "Reading IA-MGMT-2026-014 - owners and target dates...",
      "Building appendix summary data...",
      "Drafting final distribution and appendices...",
    ],
    includePriorSections: true,
    buildUserPrompt: (prior) =>
      `Draft Section 7 - Distribution, Timeline & Appendices - of the FY2026 Capital Planning & Capital Adequacy audit report.

List report distribution, target issuance date, and a concise appendix table summarizing finding ratings, owners, target dates, and status. Include the final report date target of October 31, 2026. After the visible report content, append the structured JSON requested in the section instruction for export support.${SECTION_7_INSTRUCTION}

${docContext(["IA-SCOPE-2026-007", "IA-MGMT-2026-014", "ARC-2026-014"])}${priorContext(prior)}`,
  },
];