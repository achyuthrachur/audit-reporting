/**
 * Pre-baked 7-section FY2026 audit report used by DEMO_FALLBACK mode and as the
 * per-step parachute if a live OpenAI call fails.
 */

export const FALLBACK_SECTIONS: Record<number, string> = {
  1: `## Executive Summary

Internal Audit completed the FY2026 Capital Planning & Capital Adequacy audit for Meridian National Bank for activity from January 1, 2026 through September 30, 2026, including targeted validation after the Axiom capital platform upgrade went live on August 12, 2026. Based on completed testing, Internal Audit assigns an overall rating of **Needs Improvement**.

Governance routines and most reporting controls operated as designed, and the Axiom upgrade improved the control environment by automating four of seven source feeds. However, source-data lineage and reconciliation evidence remains incomplete for manual feeds, stress scenario challenge evidence is inconsistent, and contingency trigger monitoring frequency was not fully implemented.

The most significant matter is **F-2026-041 - Capital forecast data lineage and reconciliation remain incomplete**. This finding is rated High and reflects incomplete evidence for 7 of 42 sampled source-to-Axiom data elements. It also means prior finding **F-2025-031** is only partially remediated.

Internal Audit does **not** recommend closure of Federal Reserve MRA **REG-2025-118** at this time because end-to-end lineage is not evidenced for all seven source feeds and two automated reconciliation control runs failed after go-live. Management accepted all findings and action plans on October 16, 2026.

The evidence base included 84 completed procedures, 312 reviewed artifacts, 42 source-to-Axiom elements, 18 post-go-live reconciliation runs, 8 governance packages and 27 MRA closure artifacts. Internal Audit did not identify a confirmed capital ratio misstatement, but the evidence gaps prevent reliance on the full reporting process and support the Needs Improvement rating.` ,

  2: `## Scope & Approach

The audit covered the Capital Planning & Capital Adequacy process at Meridian National Bank for the period **January 1, 2026 through September 30, 2026**, with targeted post-implementation validation after the Axiom upgrade went live on **August 12, 2026**.

### In Scope

- Capital forecast input data lineage and reconciliation across seven source systems.
- Axiom automated reconciliation controls implemented during the Q3 2026 upgrade.
- Stress scenario refresh and Capital Management Committee challenge evidence.
- Capital contingency trigger ownership, monitoring frequency and escalation.
- Board Risk Committee and Capital Management Committee reporting packages.
- Follow-up validation for prior finding F-2025-031 and Federal Reserve MRA REG-2025-118.

### Source Systems Reviewed

| Feed | Source / Owner | Control Status at Audit Close |
|------|----------------|-------------------------------|
| GL-CAP-01 | PeopleSoft General Ledger / Finance Controller | Automated feed with Axiom reconciliation |
| RWA-CRE-02 | OFSAA RWA Engine / Credit Risk Analytics | Automated feed with one incomplete tie-out |
| SEC-AOCI-03 | Eagle Investment Accounting / Treasury Operations | Automated feed with Axiom reconciliation |
| QRM-NII-04 | QRM / Balance Sheet Analytics | Automated feed with two mapping exceptions |
| CRE-CONC-05 | CRE Concentration Mart / Commercial Risk | Manual feed; independent reconciliation not yet operating |
| CCAR-ADJ-06 | Capital Adjustments Workbook / Capital Planning | Manual feed; reviewer sign-off retained inconsistently |
| OPLOSS-07 | Operational Loss Database / Operational Risk | Manual feed; source-to-Axiom tie-out incomplete |

### Testing Completed

| Workstream | Procedures Completed | Exceptions | Conclusion |
|------------|----------------------|------------|------------|
| Data lineage and reconciliation | 24 | 7 | Ineffective for manual feeds |
| Automated reconciliation controls | 12 | 2 | Partially effective |
| Stress scenario refresh | 10 | 3 | Needs improvement |
| Contingency trigger monitoring | 14 | 4 | Needs improvement |
| Governance reporting | 16 | 1 | Generally effective |
| Regulatory response | 8 | 2 | Partially effective |

Internal Audit used inquiry, inspection, reperformance and data tracing. Evidence standards required source report parameters, Axiom field mapping, source-to-input tie-out, preparer/reviewer evidence and documented exception disposition. Daily Treasury cash management, liquidity risk management and enterprise-wide model validation were excluded because they are covered by separate audit activities.` ,

  3: `## Overall Rating & Conclusion

Internal Audit assigns an overall rating of **Needs Improvement** for the FY2026 Capital Planning & Capital Adequacy audit.

| Rating Driver | Evidence | Report Impact |
|---------------|----------|---------------|
| Repeat data-lineage issue | 7 of 42 sampled source-to-Axiom data elements lacked complete lineage and reconciliation evidence | Drives High finding F-2026-041 |
| Partial remediation of F-2025-031 | Axiom automated four of seven feeds, but three feeds remain manual and two control runs failed | Prior High finding is not closed |
| Regulatory sensitivity | REG-2025-118 requires documented end-to-end lineage and independent reconciliation controls | MRA not ready for closure |
| Stress scenario challenge | Three of six refreshed scenario assumptions lacked documented CMC challenge | Moderate finding F-2026-042 |
| Trigger monitoring | Four of ten volatile trigger metrics remained on quarterly monitoring | Moderate finding F-2026-043 |

The rating is balanced by observed control improvements from the Axiom upgrade and generally effective governance reporting. However, those improvements do not fully mitigate the residual data-integrity gap. Management cannot yet evidence complete and accurate capital forecast inputs across all seven source feeds, which remains the central report conclusion.

The rating is not Unsatisfactory because governance reporting packages were materially accurate, management accepted the findings, capital ratios remained above internal buffers and the Axiom upgrade demonstrably improved four of seven feeds. The rating cannot be Satisfactory because the repeat data-lineage issue remains open and directly affects the MRA closure decision.` ,

  4: `## Key Findings

### F-2026-041 - Capital Forecast Data Lineage and Reconciliation Remain Incomplete

**Rating:** High

**Condition.** Internal Audit could not obtain complete lineage and reconciliation evidence for **7 of 42** sampled source-to-Axiom data elements. Exceptions were concentrated in three manual feeds that remained outside the initial Axiom automation release.

**Criteria.** Federal Reserve MRA **REG-2025-118** requires documented end-to-end data lineage and independent reconciliation controls over capital stress testing and forecasting inputs.

**Cause.** The Q3 2026 Axiom upgrade automated four of seven feeds. Three feeds remained manual and did not have an independent reconciliation control in production.

**Effect.** Management cannot fully evidence completeness and accuracy of capital forecast inputs, increasing risk of forecast errors and continued supervisory scrutiny.

**Recommendation.** Automate the remaining manual feeds or implement evidenced compensating reconciliation controls with independent review until automation is complete.

| Feed | Elements Tested | Exceptions | Primary Evidence Gap |
|------|-----------------|------------|----------------------|
| RWA-CRE-02 | 7 | 1 | Incomplete tie-out from source mart to Axiom staging |
| QRM-NII-04 | 8 | 2 | Mapping exceptions for QRM-221 and QRM-224 |
| CRE-CONC-05 | 6 | 2 | Source parameters and reviewer evidence not retained |
| CCAR-ADJ-06 | 5 | 1 | Capital action overlay approval not retained |
| OPLOSS-07 | 5 | 1 | Operational loss overlay reconciliation not evidenced |

### F-2026-042 - Stress Scenario Challenge Evidence Is Inconsistent

**Rating:** Moderate

Three of six refreshed stress scenario assumptions lacked documented CMC challenge. The CMC materials template requires approval but does not require management to record challenge questions, alternatives considered or disposition. Management should revise the package to evidence challenge for each key assumption.

The assumptions with incomplete evidence were unemployment path, commercial borrower downgrade rate and operational loss severe event. Internal Audit did not conclude that the assumptions were unreasonable; the finding is focused on the retained evidence of challenge and disposition.

### F-2026-043 - Contingency Trigger Monitoring Frequency Not Fully Implemented

**Rating:** Moderate

Four of ten volatile trigger metrics continued to be monitored quarterly instead of monthly. Management updated the ownership matrix but did not update the monitoring calendar for all metrics. Management should update the calendar and monthly certification workflow.

The affected metrics were CRE concentration limit, criticized CRE trend, deposit runoff stress indicator and operational loss severe event trigger. All four had named owners, but the certification workflow had not been routed for monthly completion.

### F-2026-044 - CMC Minutes Challenge Detail

**Rating:** Low

One of eight governance reporting packages did not retain sufficient CMC challenge detail. Management should re-train minutes preparers and perform monthly quality assurance over challenge documentation.` ,

  5: `## Management Action Plans

Treasury management accepted all four findings on **October 16, 2026** and agreed with the overall rating of **Needs Improvement**.

| Finding | Owner | Committed Action | Target Date |
|---------|-------|------------------|-------------|
| F-2026-041 | Capital Planning Director | Automate the remaining three manual source feeds, implement independent reconciliation for any interim manual feed and evidence reviewer sign-off in Axiom | March 31, 2027 |
| F-2026-042 | Treasurer | Revise the CMC scenario package to document challenge questions, alternatives considered and disposition for each key assumption | January 31, 2027 |
| F-2026-043 | Capital Management Committee Secretary | Update the contingency trigger calendar and monthly certification workflow for all volatile metrics | December 31, 2026 |
| F-2026-044 | CMC Secretary | Re-train minutes preparers and perform monthly QA over challenge documentation | November 30, 2026 |

Management noted that the Axiom upgrade materially improved the control environment by automating four of seven manual feeds. Management also acknowledged that remaining manual feeds require compensating controls until the second automation phase is complete.

### F-2026-041 Milestones

| Milestone | Due Date | Evidence Expected |
|-----------|----------|-------------------|
| Define standard interim reconciliation template | November 15, 2026 | Approved template and control owner sign-off |
| Implement interim reconciliation for remaining manual feeds | December 31, 2026 | Completed reconciliations with reviewer evidence |
| Complete phase-two Axiom feed automation design | January 31, 2027 | Mapping inventory and implementation plan |
| Place three remaining feeds into production automation | March 31, 2027 | Axiom workflow logs and successful parallel-run evidence |` ,

  6: `## Issues Closed & Remediation Validation

Internal Audit validated prior finding remediation and the Federal Reserve MRA package after the Axiom upgrade. The results show meaningful progress, but not enough evidence to close the primary prior-year data-lineage issue.

| Prior Item | Validation Result | Current Conclusion |
|------------|-------------------|--------------------|
| F-2025-031 | Axiom automated four of seven source feeds, but three feeds remain manual and two post-go-live reconciliation runs failed | Partially remediated; residual gap captured in F-2026-041 |
| REG-2025-118 | Remediation package includes workflow evidence, exception reports, sign-offs and phase-two roadmap | Not ready for closure |
| F-2025-032 | Scenario refresh process documented and operating, but challenge evidence remains inconsistent | Superseded by F-2026-042 |
| F-2025-033 | Ownership assigned to all trigger metrics, but monitoring frequency remains incomplete | Superseded by F-2026-043 |
| F-2025-034 | Revised minutes template adopted; one isolated documentation exception noted | Closed with low residual observation F-2026-044 |

Internal Audit does not recommend closure of **REG-2025-118** because end-to-end lineage is not evidenced for all seven source feeds. The final report should be used to support management's remediation roadmap, not to represent full MRA closure.

### Closure Criteria Still Outstanding

| Closure Criterion | FY2026 Result |
|------------------|---------------|
| Reconciliation control operating for each feed | Partially met |
| Reviewer sign-off retained before CMC package finalization | Partially met |
| Exceptions tracked to resolution with documented disposition | Partially met |
| Evidence retained centrally and retrievable | Partially met |
| Operating effectiveness testing passed for sampled items | Not met for 7 of 42 elements |` ,

  7: `## Distribution, Timeline & Appendices

### Distribution

Final report distribution should include the Board Risk Committee, Chief Audit Executive, Treasurer, Chief Risk Officer, Chief Financial Officer, Regulatory Affairs and the Capital Planning Director.

### Timeline

The closing meeting was held on **October 20, 2026**. The final report is targeted for issuance by **October 31, 2026**.

### Appendix A - Finding Summary

The appendix should be read with the evidence base summarized in the KB: 84 completed procedures, 312 reviewed artifacts, 42 source-to-Axiom elements, 18 post-go-live reconciliation runs, 8 governance packages and 27 MRA closure artifacts.


| Finding | Rating | Owner | Target Date | Status |
|---------|--------|-------|-------------|--------|
| F-2026-041 | High | Capital Planning Director | March 31, 2027 | Management accepted |
| F-2026-042 | Moderate | Treasurer | January 31, 2027 | Management accepted |
| F-2026-043 | Moderate | Capital Management Committee Secretary | December 31, 2026 | Management accepted |
| F-2026-044 | Low | CMC Secretary | November 30, 2026 | Management accepted |

### Appendix B - Overall Rating

The final report rating is **Needs Improvement**.

\`\`\`json
{ "overallRating": "Needs Improvement", "targetIssueDate": "October 31, 2026", "findings": [ { "id": "F-2026-041", "rating": "High", "owner": "Capital Planning Director", "targetDate": "March 31, 2027" }, { "id": "F-2026-042", "rating": "Moderate", "owner": "Treasurer", "targetDate": "January 31, 2027" }, { "id": "F-2026-043", "rating": "Moderate", "owner": "Capital Management Committee Secretary", "targetDate": "December 31, 2026" }, { "id": "F-2026-044", "rating": "Low", "owner": "CMC Secretary", "targetDate": "November 30, 2026" } ] }
\`\`\`` ,
};