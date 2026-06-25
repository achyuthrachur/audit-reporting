/**
 * Pre-baked reasoning traces for DEMO_FALLBACK mode.
 */

export const GENERATION_REASONING: Record<number, string> = {
  1: `Sources reviewed: IA-TEST-2026-014, IA-EXC-2026-014, IA-VAL-2026-014, REG-2025-118 and ARC-2026-014.

Key signals identified:
- Completed testing recommends a Needs Improvement rating.
- F-2026-041 is High and reflects incomplete lineage for 7 of 42 source-to-Axiom data elements.
- F-2025-031 is only partially remediated and REG-2025-118 is not ready for closure.
- The Axiom upgrade improved four of seven source feeds, so the summary should be balanced.

Drafting decision: Lead with the rating and principal issue, then acknowledge improvement from the Axiom upgrade. State the MRA closure conclusion plainly because it is the board-level decision point.`,

  2: `Sources reviewed: IA-SCOPE-2026-007, IA-PGM-2026-007 and IA-TEST-2026-014.

Key signals identified:
- Scope period is January 1, 2026 through September 30, 2026.
- Post-implementation validation occurred after the August 12, 2026 Axiom go-live.
- Internal Audit completed 84 procedures across six workstreams.

Drafting decision: Present scope and methodology as report facts, not future work. Include a workstream table with procedure counts, exceptions and conclusions so readers can see how the rating was supported.`,

  3: `Sources reviewed: IA-TEST-2026-014, IA-EXC-2026-014, IA-VAL-2026-014 and ARC-2026-014.

Key signals identified:
- Report committee directed a Needs Improvement rating.
- The High finding and partial remediation of F-2025-031 are the strongest rating drivers.
- Moderate findings F-2026-042 and F-2026-043 reinforce the rating.

Drafting decision: Explain the rating through a rationale table. Keep the conclusion balanced by naming effective governance reporting while making clear that the residual data-integrity gap drives the final opinion.`,

  4: `Sources reviewed: IA-EXC-2026-014, IA-TEST-2026-014 and REG-2025-118.

Key signals identified:
- F-2026-041 is High and maps directly to the Federal Reserve MRA.
- F-2026-042 and F-2026-043 are Moderate and supported by specific exception counts.
- F-2026-044 is Low and isolated to one governance package.

Drafting decision: Use final-report finding structure for each item: rating, condition, criteria, cause, effect and recommendation. Put the High finding first.`,

  5: `Sources reviewed: IA-MGMT-2026-014 and IA-EXC-2026-014.

Key signals identified:
- Management accepted all findings on October 16, 2026.
- Owners and target dates are explicit for all four findings.
- Management requested balanced language distinguishing Axiom progress from residual gaps.

Drafting decision: Use a table to preserve owner/date accuracy. Include management's acknowledgement that remaining manual feeds need compensating controls.`,

  6: `Sources reviewed: IA-VAL-2026-014, IA-TEST-2026-014 and REG-2025-118.

Key signals identified:
- F-2025-031 is partially remediated, not closed.
- REG-2025-118 is not ready for closure.
- Prior items F-2025-032 and F-2025-033 are superseded by new FY2026 findings.
- F-2025-034 is closed with a low residual observation.

Drafting decision: Separate remediation progress from closure conclusions. Use a table so the reader can see which prior items are closed, superseded or still open.`,

  7: `Sources reviewed: IA-SCOPE-2026-007, IA-MGMT-2026-014 and ARC-2026-014.

Key signals identified:
- Final report target issue date is October 31, 2026.
- Distribution includes Board Risk Committee, CAE, Treasurer, CRO, CFO, Regulatory Affairs and Capital Planning Director.
- Management action owners and dates are fixed.

Drafting decision: Close the report with distribution, timeline and an appendix table. Append the structured JSON sidecar so the export flow can reuse the rating and finding metadata.`,
};