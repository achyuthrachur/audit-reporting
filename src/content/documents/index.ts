import { DOCUMENT_EXPANSIONS, DOCUMENT_PAGE_COUNTS } from "./expansions";

/**
 * The 8 synthetic Knowledge Base documents for the FY2026 Capital Planning &
 * Capital Adequacy audit report. All figures reflect Meridian National Bank, a
 * $280B regional bank holding company. Finding IDs, system names, dates, and
 * management action owners are intentionally consistent across documents.
 */

export type DocIconType = "FileText" | "Table" | "Mail";

export interface KbDocument {
  id: string;
  title: string;
  docType: string;
  date: string;
  pages: number;
  icon: DocIconType;
  classification: string;
  /** markdown body rendered as a paper page */
  body: string;
}

const DOC_SCOPE: KbDocument = {
  id: "IA-SCOPE-2026-007",
  title: "FY2026 Approved Audit Scope - Capital Planning",
  docType: "Approved Scope Memo",
  date: "January 18, 2026",
  pages: 4,
  icon: "FileText",
  classification: "Internal Use Only",
  body: `# FY2026 Approved Audit Scope - Capital Planning & Capital Adequacy

## Engagement Overview

Internal Audit approved the FY2026 Capital Planning & Capital Adequacy engagement for Meridian National Bank ("Meridian," "the Bank"), a regional bank holding company with approximately **$280 billion** in total assets. The engagement was designed to provide assurance over controls supporting the annual capital plan, capital stress testing, regulatory capital reporting, and related governance.

## Scope Period

The audit covered activity from **January 1, 2026 through September 30, 2026**, with targeted post-implementation validation after the Axiom capital platform upgrade went live on **August 12, 2026**.

## In Scope

- Capital forecast input data lineage and reconciliation across seven source systems.
- Axiom automated reconciliation controls implemented during the Q3 2026 upgrade.
- Stress scenario refresh and Capital Management Committee challenge evidence.
- Capital contingency trigger ownership, monitoring frequency, and escalation.
- Board Risk Committee and Capital Management Committee reporting packages.
- Follow-up validation for prior finding **F-2025-031** and the Federal Reserve MRA **REG-2025-118**.

## Out of Scope

Daily Treasury cash management, liquidity risk management, and enterprise-wide model validation were excluded and remain covered by separate audit activities.

## Planned Deliverables

The engagement deliverable is a final internal audit report for the Board Risk Committee and senior management. The report should include an overall rating, detailed findings, management action plans, remediation validation conclusions, and appendices summarizing testing performed.`,
};

const DOC_PROGRAM: KbDocument = {
  id: "IA-PGM-2026-007",
  title: "FY2026 Audit Program and Testing Approach",
  docType: "Audit Program",
  date: "February 3, 2026",
  pages: 5,
  icon: "Table",
  classification: "Internal Use Only",
  body: `# FY2026 Audit Program and Testing Approach

## Testing Workstreams

| Workstream | Procedure Summary | Planned Sample |
|------------|-------------------|----------------|
| Data lineage and reconciliation | Trace capital forecast inputs from source systems to Axiom and verify reconciliation evidence | 42 source-to-Axiom data elements |
| Automated reconciliation controls | Test the design and operating effectiveness of the new Axiom reconciliation workflow | 18 control runs after go-live |
| Stress scenario refresh | Evaluate scenario refresh documentation and challenge evidence | 6 scenario assumptions |
| Contingency trigger monitoring | Verify ownership and monitoring frequency for contingency triggers | 10 trigger metrics |
| Governance reporting | Inspect CMC and Board Risk Committee materials for accuracy and challenge evidence | 8 reporting packages |
| Regulatory response | Validate evidence supporting the Federal Reserve MRA remediation package | 1 remediation package |

## Methodology

Internal Audit used inquiry, inspection, reperformance, and data tracing. Sampling emphasized higher-risk source feeds, including commercial real estate concentration data, AOCI inputs from securities systems, and QRM model feeds.

## Rating Method

Findings are rated High, Moderate, or Low based on likelihood, impact, regulatory sensitivity, and repeat-issue status. Overall report rating is determined by the severity of findings and whether open control gaps impair management's ability to rely on the process.`,
};

const DOC_TEST_RESULTS: KbDocument = {
  id: "IA-TEST-2026-014",
  title: "Completed Test Results Summary",
  docType: "Test Results",
  date: "October 7, 2026",
  pages: 7,
  icon: "Table",
  classification: "Internal Use Only - Workpaper Summary",
  body: `# Completed Test Results Summary - Capital Planning & Capital Adequacy

## Overall Testing Summary

Internal Audit completed **84 testing procedures** across six workstreams. Testing confirmed that governance routines and most reporting controls operated as designed, but deficiencies remain in source-data reconciliation, stress scenario challenge evidence, and contingency trigger monitoring.

| Workstream | Procedures Completed | Exceptions | Conclusion |
|------------|----------------------|------------|------------|
| Data lineage and reconciliation | 24 | 7 | Ineffective for manual feeds |
| Automated reconciliation controls | 12 | 2 | Partially effective |
| Stress scenario refresh | 10 | 3 | Needs improvement |
| Contingency trigger monitoring | 14 | 4 | Needs improvement |
| Governance reporting | 16 | 1 | Generally effective |
| Regulatory response | 8 | 2 | Partially effective |

## Key Test Results

- For **7 of 42** source-to-Axiom data elements, Internal Audit could not obtain complete evidence linking the source extract to the final Axiom input file.
- The Axiom automated reconciliation workflow operated for **16 of 18** post-go-live control runs. Two runs failed due to mapping exceptions affecting QRM feed identifiers.
- Stress scenario refresh documentation existed for all six assumptions, but **three assumptions lacked documented CMC challenge**.
- Ownership was assigned for all contingency triggers, but **4 of 10 trigger metrics** were still monitored quarterly despite the approved move to monthly monitoring for volatile metrics.
- CMC and Board reporting packages were materially accurate, with one low-rated documentation exception related to minutes retaining challenge evidence.

## Report Rating Recommendation

Based on testing results, Internal Audit recommends an overall report rating of **Needs Improvement**. The rating is driven by repeat data-lineage issues, incomplete remediation evidence for prior finding **F-2025-031**, and two new Moderate findings in stress scenario challenge and contingency trigger monitoring.`,
};

const DOC_EXCEPTIONS: KbDocument = {
  id: "IA-EXC-2026-014",
  title: "Exception Log and Draft Findings",
  docType: "Exception Log",
  date: "October 10, 2026",
  pages: 6,
  icon: "Table",
  classification: "Internal Use Only - Draft",
  body: `# Exception Log and Draft Findings

## Finding Summary

| Finding | Rating | Title | Status |
|---------|--------|-------|--------|
| **F-2026-041** | High | Capital forecast data lineage and reconciliation remain incomplete | Draft finding accepted |
| **F-2026-042** | Moderate | Stress scenario challenge evidence is inconsistent | Draft finding accepted |
| **F-2026-043** | Moderate | Contingency trigger monitoring frequency not fully implemented | Draft finding accepted |
| **F-2026-044** | Low | CMC minutes do not consistently retain challenge detail | Draft observation accepted |

## F-2026-041 - Capital Forecast Data Lineage and Reconciliation Remain Incomplete

**Condition.** Internal Audit could not obtain complete lineage and reconciliation evidence for **7 of 42** sampled source-to-Axiom data elements. The exceptions were concentrated in three manual feeds that remained outside the initial Axiom automation release.

**Criteria.** The Federal Reserve MRA **REG-2025-118** requires documented end-to-end data lineage and independent reconciliation controls over capital stress testing and forecasting inputs.

**Cause.** The Q3 2026 Axiom upgrade automated four of seven feeds. Three feeds remained manual and did not have an independent reconciliation control in production.

**Effect.** Management cannot fully evidence completeness and accuracy of capital forecast inputs, increasing risk of forecast errors and continued supervisory scrutiny.

## F-2026-042 - Stress Scenario Challenge Evidence Is Inconsistent

**Condition.** Three of six refreshed stress scenario assumptions lacked documented CMC challenge.

**Cause.** The CMC materials template requires approval but does not require management to record challenge questions, alternatives considered, or disposition.

**Effect.** The Bank may be unable to demonstrate robust challenge over scenario severity, particularly given CRE concentration growth of 14% year-over-year.

## F-2026-043 - Contingency Trigger Monitoring Frequency Not Fully Implemented

**Condition.** Four of ten volatile trigger metrics continued to be monitored quarterly instead of monthly.

**Cause.** The ownership matrix was updated, but the monitoring calendar was not updated for all metrics.

**Effect.** Breaches may not be identified and escalated promptly.

## F-2026-044 - CMC Minutes Challenge Detail

**Condition.** One of eight governance reporting packages did not retain sufficient detail of CMC challenge.

**Cause.** Minutes preparers applied the revised template inconsistently.

**Effect.** Governance evidence is incomplete, though the issue is isolated and low impact.`,
};

const DOC_MGMT: KbDocument = {
  id: "IA-MGMT-2026-014",
  title: "Management Responses and Action Plans",
  docType: "Management Response Tracker",
  date: "October 16, 2026",
  pages: 4,
  icon: "FileText",
  classification: "Internal Use Only",
  body: `# Management Responses and Action Plans

## Management Acceptance

Treasury management accepted all four draft findings on **October 16, 2026**. Management agreed with the report rating of **Needs Improvement** and provided action plans for each finding.

| Finding | Owner | Action Plan | Target Date |
|---------|-------|-------------|-------------|
| **F-2026-041** | Capital Planning Director | Automate the remaining three manual source feeds, implement independent reconciliation for any interim manual feed and evidence reviewer sign-off in Axiom | **March 31, 2027** |
| **F-2026-042** | Treasurer | Revise the CMC scenario package to document challenge questions, alternatives considered and disposition for each key assumption | **January 31, 2027** |
| **F-2026-043** | Capital Management Committee Secretary | Update the contingency trigger calendar and monthly certification workflow for all volatile metrics | **December 31, 2026** |
| **F-2026-044** | CMC Secretary | Re-train minutes preparers and perform monthly QA over challenge documentation | **November 30, 2026** |

## Management Comments

Management noted that the Axiom upgrade materially improved the control environment by automating four of seven manual feeds, but acknowledged that the remaining manual feeds require compensating controls until the second automation phase is complete.

Management requested that the final report distinguish between remediation progress on the prior-year issue and the residual gap that remains open after go-live.`,
};

const DOC_VALIDATION: KbDocument = {
  id: "IA-VAL-2026-014",
  title: "Prior Finding and MRA Validation Evidence",
  docType: "Remediation Validation",
  date: "October 12, 2026",
  pages: 5,
  icon: "FileText",
  classification: "Confidential Supervisory Information - Internal Use Only",
  body: `# Prior Finding and MRA Validation Evidence

## Prior Finding F-2025-031

Prior-year finding **F-2025-031** required automated, evidenced reconciliation between each source system and the aggregated forecast input file, with exception reporting and independent review before CMC submission.

## Validation Performed

Internal Audit validated the Q3 2026 Axiom upgrade and performed post-go-live testing over **18 automated reconciliation control runs**. The automated workflow operated for 16 runs. Two runs failed due to mapping exceptions affecting QRM feed identifiers.

## Validation Conclusion

Internal Audit concludes that **F-2025-031 is partially remediated**. The Axiom upgrade automated four of seven source feeds and improved control evidence, but three feeds remain manual and two post-go-live control failures require remediation. The residual gap is captured in new finding **F-2026-041**.

## Federal Reserve MRA REG-2025-118

The remediation package for **REG-2025-118** includes Axiom workflow evidence, reconciliation exception reports, reviewer sign-offs, and management's phase-two automation roadmap. Internal Audit does not recommend closure of the MRA at this time because end-to-end lineage is not evidenced for all seven source feeds.

## Closed Items

| Prior Item | Validation Result | Conclusion |
|------------|-------------------|------------|
| F-2025-032 | Scenario refresh process documented and operating, but challenge evidence remains inconsistent | Superseded by F-2026-042 |
| F-2025-033 | Ownership assigned to all trigger metrics, but monitoring frequency remains incomplete | Superseded by F-2026-043 |
| F-2025-034 | Revised minutes template adopted; one isolated documentation exception noted | Closed with low residual observation F-2026-044 |`,
};

const DOC_REG: KbDocument = {
  id: "REG-2025-118",
  title: "Regulatory Correspondence Summary - Federal Reserve",
  docType: "Regulatory Correspondence",
  date: "November 18, 2025",
  pages: 2,
  icon: "Mail",
  classification: "Confidential Supervisory Information - Internal Use Only",
  body: `# Regulatory Correspondence Summary - Federal Reserve

**Reference:** REG-2025-118

## Matter Requiring Attention

The Federal Reserve issued one Matter Requiring Attention arising from the most recent examination of the Bank's capital planning process:

> **MRA - Capital Stress Testing Data Lineage and Reconciliation.** The Bank must establish documented end-to-end data lineage and independent reconciliation controls over data inputs to its capital stress testing and forecasting processes.

The MRA aligns directly with prior Internal Audit finding **F-2025-031**. Supervisory expectations require remediation evidence during 2026, with emphasis on the Axiom platform upgrade and the quality of post-go-live evidence.

## Supervisory Themes

- Examiners remain focused on the Bank's **commercial real estate concentration**, which increased 14% year-over-year.
- Examiners acknowledged that the Bank's regulatory capital ratios remain above minimums and internal buffers.
- Examiners emphasized that data-integrity weaknesses undermine confidence in forecasted capital ratios, even where the capital position is strong.

## Reporting Implication

The final audit report should explicitly state whether Internal Audit believes the MRA is ready for closure. If not ready for closure, the report should identify the residual gaps and link them to management action plans.`,
};

const DOC_CLOSING: KbDocument = {
  id: "ARC-2026-014",
  title: "Closing Meeting and Audit Report Committee Notes",
  docType: "Closing Meeting Notes",
  date: "October 20, 2026",
  pages: 3,
  icon: "Mail",
  classification: "Internal Use Only",
  body: `# Closing Meeting and Audit Report Committee Notes

## Closing Meeting

Internal Audit held the closing meeting with Treasury management, Regulatory Affairs and the Capital Management Committee Secretary on **October 20, 2026**. Management accepted all findings and action plans.

## Report Committee Direction

The Audit Report Committee directed the audit team to:

- Use an overall rating of **Needs Improvement**.
- Lead the executive summary with the repeat data-lineage issue and partial remediation of **F-2025-031**.
- Make clear that the Federal Reserve MRA **REG-2025-118** is **not ready for closure** because three source feeds remain manual and two automated reconciliation runs failed.
- Acknowledge meaningful control improvement from the Axiom upgrade so the report is balanced.
- Include a concise appendix listing scope, testing completed, finding ratings, owners and target dates.

## Distribution

Final report distribution should include the Board Risk Committee, Chief Audit Executive, Treasurer, Chief Risk Officer, Chief Financial Officer, Regulatory Affairs and the Capital Planning Director.

## Target Issuance

The final report is targeted for issuance by **October 31, 2026**.`,
};

const enrichDocument = (doc: KbDocument): KbDocument => ({
  ...doc,
  pages: DOCUMENT_PAGE_COUNTS[doc.id] ?? doc.pages,
  body: DOCUMENT_EXPANSIONS[doc.id]
    ? `${doc.body}\n\n${DOCUMENT_EXPANSIONS[doc.id]}`
    : doc.body,
});

export const KB_DOCUMENTS: KbDocument[] = [
  DOC_SCOPE,
  DOC_PROGRAM,
  DOC_TEST_RESULTS,
  DOC_EXCEPTIONS,
  DOC_MGMT,
  DOC_VALIDATION,
  DOC_REG,
  DOC_CLOSING,
].map(enrichDocument);

export const getDocById = (id: string): KbDocument | undefined =>
  KB_DOCUMENTS.find((d) => d.id === id);