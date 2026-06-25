/**
 * Client-safe metadata for the 7 report steps: id, title, source-document IDs
 * shown as chips, and scripted telemetry lines. The server-side reportAgent.ts
 * builds the actual prompts from these.
 */

export interface ReportStepMeta {
  id: number;
  title: string;
  sourceIds: string[];
  telemetry: string[];
}

export const REPORT_STEP_META: ReportStepMeta[] = [
  {
    id: 1,
    title: "Executive Summary",
    sourceIds: ["IA-TEST-2026-014", "IA-EXC-2026-014", "IA-VAL-2026-014", "REG-2025-118", "ARC-2026-014"],
    telemetry: [
      "Reading IA-TEST-2026-014 - completed test results...",
      "Reading IA-EXC-2026-014 - draft findings...",
      "Reading IA-VAL-2026-014 - validation evidence...",
      "Drafting executive summary...",
    ],
  },
  {
    id: 2,
    title: "Scope & Approach",
    sourceIds: ["IA-SCOPE-2026-007", "IA-PGM-2026-007", "IA-TEST-2026-014"],
    telemetry: [
      "Reading IA-SCOPE-2026-007 - approved scope...",
      "Reading IA-PGM-2026-007 - audit program...",
      "Extracting completed procedures from IA-TEST-2026-014...",
      "Drafting scope and approach...",
    ],
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
  },
  {
    id: 4,
    title: "Key Findings",
    sourceIds: ["IA-EXC-2026-014", "IA-TEST-2026-014", "REG-2025-118"],
    telemetry: [
      "Reading IA-EXC-2026-014 - conditions and causes...",
      "Reading IA-TEST-2026-014 - supporting exceptions...",
      "Linking findings to REG-2025-118...",
      "Drafting key findings...",
    ],
  },
  {
    id: 5,
    title: "Management Action Plans",
    sourceIds: ["IA-MGMT-2026-014", "IA-EXC-2026-014"],
    telemetry: [
      "Reading IA-MGMT-2026-014 - accepted action plans...",
      "Mapping owners and target dates...",
      "Checking consistency with draft findings...",
      "Drafting management action plans...",
    ],
  },
  {
    id: 6,
    title: "Issues Closed & Remediation Validation",
    sourceIds: ["IA-VAL-2026-014", "IA-TEST-2026-014", "REG-2025-118"],
    telemetry: [
      "Reading IA-VAL-2026-014 - validation conclusions...",
      "Reading REG-2025-118 - MRA expectations...",
      "Separating closed items from residual gaps...",
      "Drafting remediation validation...",
    ],
  },
  {
    id: 7,
    title: "Distribution, Timeline & Appendices",
    sourceIds: ["IA-SCOPE-2026-007", "IA-MGMT-2026-014", "ARC-2026-014"],
    telemetry: [
      "Reading ARC-2026-014 - report committee notes...",
      "Reading IA-MGMT-2026-014 - action plan dates...",
      "Building appendix summary data...",
      "Drafting distribution and appendices...",
    ],
  },
];