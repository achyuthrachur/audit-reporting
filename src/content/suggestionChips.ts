/**
 * Per-section suggestion chips. Keyed by section id ("1".."7"). Clicking a chip
 * fires its text immediately as a user message.
 */

export const SUGGESTION_CHIPS: Record<string, string[]> = {
  "1": [
    "Sharpen the rating rationale",
    "Make it more concise",
    "Emphasize the MRA is not ready for closure",
  ],
  "2": [
    "Add more detail on testing completed",
    "Simplify the scope description",
    "Highlight the Axiom go-live date",
  ],
  "3": [
    "Strengthen the Needs Improvement conclusion",
    "Make the rating table more concise",
    "Balance the conclusion with Axiom progress",
  ],
  "4": [
    "Make F-2026-041 the lead finding",
    "Tighten the recommendations",
    "Add clearer criteria language",
  ],
  "5": [
    "Reorder by target date",
    "Add management acceptance language",
    "Make owners more prominent",
  ],
  "6": [
    "Clarify partial remediation of F-2025-031",
    "Emphasize REG-2025-118 closure readiness",
    "Add a closed-versus-superseded table",
  ],
  "7": [
    "Tighten the appendix",
    "Add distribution detail",
    "Make the timeline more explicit",
  ],
};

export const editKey = (sectionId: string, chip: string) =>
  `${sectionId}::${chip}`;