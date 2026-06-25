/**
 * Pre-baked fallback content for suggestion-chip edits. Unknown free-form edits
 * use GENERIC_EDIT so safe mode still behaves predictably.
 */

export interface EditFallback {
  reasoning: string;
  note: string;
  summary: string;
}

const make = (reasoning: string, note: string, summary: string): EditFallback => ({
  reasoning,
  note,
  summary,
});

export const EDIT_FALLBACK: Record<string, EditFallback> = {
  "1::Sharpen the rating rationale": make(
    "Instruction: sharpen the rating rationale. The strongest evidence is the Needs Improvement rating, High finding F-2026-041, partial remediation of F-2025-031 and the MRA not-ready-for-closure conclusion.",
    `> **Rating rationale.** The Needs Improvement rating is driven by incomplete source-to-Axiom lineage evidence for 7 of 42 sampled data elements, partial remediation of prior finding F-2025-031 and Internal Audit's conclusion that REG-2025-118 is not ready for closure.`,
    "Sharpened the rating rationale around F-2026-041, F-2025-031 and REG-2025-118."
  ),
  "1::Make it more concise": make(
    "Instruction: make the executive summary more concise. Preserve the rating, lead finding and MRA conclusion while adding a short bottom-line statement.",
    `> **Bottom line.** Controls improved after the Axiom upgrade, but the report remains Needs Improvement because complete data-lineage evidence is still missing for manual feeds and the Fed MRA is not ready for closure.`,
    "Added a concise bottom-line summary."
  ),
  "1::Emphasize the MRA is not ready for closure": make(
    "Instruction: emphasize MRA closure readiness. REG-2025-118 requires end-to-end lineage and independent reconciliation; IA-VAL-2026-014 says this is not fully evidenced.",
    `> **MRA closure conclusion.** Internal Audit does not recommend closure of REG-2025-118 because end-to-end lineage is not evidenced for all seven source feeds and two automated reconciliation runs failed after go-live.`,
    "Emphasized that REG-2025-118 is not ready for closure."
  ),
  "2::Add more detail on testing completed": make(
    "Instruction: add more testing detail. IA-TEST-2026-014 documents 84 procedures across six workstreams.",
    `### Testing Detail\n\nInternal Audit completed 84 procedures: 24 over data lineage and reconciliation, 12 over automated reconciliation controls, 10 over stress scenario refresh, 14 over contingency trigger monitoring, 16 over governance reporting and 8 over regulatory response.`,
    "Added completed testing detail by workstream."
  ),
  "2::Simplify the scope description": make(
    "Instruction: simplify scope. Keep period, scope and exclusions while reducing narrative density.",
    `> **Scope in brief.** The audit covered January 1, 2026 through September 30, 2026 and focused on capital forecast data controls, Axiom reconciliation, stress scenario challenge, trigger monitoring, governance reporting and MRA validation.`,
    "Added a simplified scope summary."
  ),
  "2::Highlight the Axiom go-live date": make(
    "Instruction: highlight Axiom go-live. IA-SCOPE-2026-007 states targeted post-implementation validation after August 12, 2026.",
    `> **Axiom milestone.** Internal Audit performed targeted post-implementation validation after the Axiom capital platform upgrade went live on August 12, 2026.`,
    "Highlighted the August 12, 2026 Axiom go-live date."
  ),
  "3::Strengthen the Needs Improvement conclusion": make(
    "Instruction: strengthen rating conclusion. Use the High finding and MRA evidence without overstating beyond sources.",
    `> **Conclusion.** Needs Improvement is warranted because the residual data-integrity gap affects management's ability to evidence completeness and accuracy of capital forecast inputs and prevents Internal Audit from recommending closure of REG-2025-118.`,
    "Strengthened the Needs Improvement conclusion."
  ),
  "3::Make the rating table more concise": make(
    "Instruction: make rating table concise. Add a compact summary of the rating drivers.",
    `| Driver | Conclusion |\n|---|---|\n| F-2026-041 | High-rated repeat data-lineage issue |\n| REG-2025-118 | Not ready for closure |\n| F-2026-042 / F-2026-043 | Moderate control gaps remain |\n| Axiom upgrade | Improvement noted, but not full remediation |`,
    "Added a concise rating-driver table."
  ),
  "3::Balance the conclusion with Axiom progress": make(
    "Instruction: balance conclusion. Acknowledge four automated feeds while retaining Needs Improvement.",
    `> **Balance.** The Axiom upgrade automated four of seven source feeds and improved control evidence; however, three manual feeds and two failed reconciliation runs leave a material residual gap.`,
    "Balanced the conclusion with Axiom progress."
  ),
  "4::Make F-2026-041 the lead finding": make(
    "Instruction: lead with F-2026-041. It is the only High finding and ties to the MRA.",
    `> **Lead finding.** F-2026-041 is the lead report finding because it is High-rated, repeat in nature and directly tied to REG-2025-118.`,
    "Made F-2026-041 the explicit lead finding."
  ),
  "4::Tighten the recommendations": make(
    "Instruction: tighten recommendations. Recommendations should be action-oriented and source-grounded.",
    `> **Recommendation focus.** Recommendations should require automation of remaining manual feeds or evidenced compensating reconciliation, documented CMC challenge, updated monthly trigger certifications and QA over minutes documentation.`,
    "Tightened the recommendations into action-oriented language."
  ),
  "4::Add clearer criteria language": make(
    "Instruction: add criteria. Criteria should reference REG-2025-118 and expected governance evidence.",
    `> **Criteria.** Capital forecast inputs should have documented end-to-end lineage, independent reconciliation evidence and reviewer sign-off sufficient to support regulatory capital reporting and the expectations in REG-2025-118.`,
    "Added clearer criteria language."
  ),
  "5::Reorder by target date": make(
    "Instruction: reorder by target date. Add a date-ordered view without changing owners or dates.",
    `### Action Plans by Target Date\n\n| Target Date | Finding | Owner |\n|---|---|---|\n| November 30, 2026 | F-2026-044 | CMC Secretary |\n| December 31, 2026 | F-2026-043 | Capital Management Committee Secretary |\n| January 31, 2027 | F-2026-042 | Treasurer |\n| March 31, 2027 | F-2026-041 | Capital Planning Director |`,
    "Added a target-date ordered action plan view."
  ),
  "5::Add management acceptance language": make(
    "Instruction: add management acceptance language. IA-MGMT-2026-014 states management accepted all findings on October 16, 2026.",
    `> **Management acceptance.** Treasury management accepted all four findings and agreed with the Needs Improvement rating on October 16, 2026.`,
    "Added management acceptance language."
  ),
  "5::Make owners more prominent": make(
    "Instruction: make owners prominent. Add an owner callout from IA-MGMT-2026-014.",
    `> **Primary owners.** The Capital Planning Director owns F-2026-041, the Treasurer owns F-2026-042 and the Capital Management Committee Secretary owns F-2026-043.`,
    "Made action plan owners more prominent."
  ),
  "6::Clarify partial remediation of F-2025-031": make(
    "Instruction: clarify partial remediation. IA-VAL-2026-014 says F-2025-031 is partially remediated because residual gaps remain.",
    `> **F-2025-031 conclusion.** F-2025-031 is partially remediated, not closed: four feeds were automated, but three feeds remain manual and two post-go-live reconciliation runs failed.`,
    "Clarified why F-2025-031 is only partially remediated."
  ),
  "6::Emphasize REG-2025-118 closure readiness": make(
    "Instruction: emphasize closure readiness. The validation evidence does not support MRA closure.",
    `> **REG-2025-118 readiness.** Internal Audit does not recommend MRA closure until all seven source feeds have evidenced end-to-end lineage and independent reconciliation controls operating effectively.`,
    "Emphasized REG-2025-118 closure readiness."
  ),
  "6::Add a closed-versus-superseded table": make(
    "Instruction: add closed-versus-superseded table. Use IA-VAL-2026-014 conclusions.",
    `| Prior Item | Current Treatment |\n|---|---|\n| F-2025-031 | Partially remediated; residual gap in F-2026-041 |\n| F-2025-032 | Superseded by F-2026-042 |\n| F-2025-033 | Superseded by F-2026-043 |\n| F-2025-034 | Closed with low residual observation F-2026-044 |`,
    "Added a closed-versus-superseded table."
  ),
  "7::Tighten the appendix": make(
    "Instruction: tighten appendix. Add a compact appendix summary.",
    `> **Appendix summary.** Appendix A lists final finding ID, rating, owner, target date and management-accepted status for all FY2026 findings.`,
    "Tightened the appendix summary."
  ),
  "7::Add distribution detail": make(
    "Instruction: add distribution detail. ARC-2026-014 lists the final report distribution.",
    `> **Distribution detail.** Distribution includes the Board Risk Committee, Chief Audit Executive, Treasurer, Chief Risk Officer, Chief Financial Officer, Regulatory Affairs and the Capital Planning Director.`,
    "Added report distribution detail."
  ),
  "7::Make the timeline more explicit": make(
    "Instruction: make timeline explicit. ARC-2026-014 states closing meeting and target issuance dates.",
    `> **Timeline.** Closing meeting: October 20, 2026. Final report target issuance: October 31, 2026.`,
    "Made the report timeline explicit."
  ),
};

const GENERIC_EDIT: EditFallback = {
  reasoning: `Instruction received. Reviewing the current report section against the grounded source documents. Decision: apply the requested refinement while preserving finding IDs, ratings, owners, dates, source-system names and the REG-2025-118 closure conclusion exactly as supported.`,
  note: `> *Note: revision applied in demo safe-mode while preserving grounded report references, owners, target dates and finding IDs.*`,
  summary: "Applied the requested report refinement while preserving grounded references.",
};

export function getEditFallback(key: string): EditFallback {
  return EDIT_FALLBACK[key] ?? GENERIC_EDIT;
}