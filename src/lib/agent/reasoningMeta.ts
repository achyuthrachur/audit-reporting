/**
 * Human-readable instruction strings shown in the Agent Reasoning Log. Keyed by
 * generation step id. These are display-only summaries of what each call was
 * asked to do; reportAgent.ts builds the actual prompts.
 */

export const STEP_INSTRUCTIONS: Record<number, string> = {
  1: "Draft the Executive Summary. Lead with the Needs Improvement rating, F-2026-041, partial remediation of F-2025-031 and the MRA not-ready-for-closure conclusion.",
  2: "Draft Scope & Approach. Summarize scope period, in/out of scope, workstreams, sample sizes, exceptions and completed procedures.",
  3: "Draft Overall Rating & Conclusion. Explain why Needs Improvement is warranted and map rating drivers to evidence.",
  4: "Draft Key Findings. Present F-2026-041 through F-2026-044 with rating, condition, criteria, cause, effect and recommendation.",
  5: "Draft Management Action Plans. Map each finding to the accepted owner, committed action and target date from management responses.",
  6: "Draft Issues Closed & Remediation Validation. Distinguish closed, superseded and partially remediated prior items; state that REG-2025-118 is not ready for closure.",
  7: "Draft Distribution, Timeline & Appendices. Include distribution, October 31 2026 target issuance and finding appendix data for export.",
};

export function editLogId(sectionId: string, editIndex: number): string {
  return `edit-${sectionId}-${editIndex}`;
}