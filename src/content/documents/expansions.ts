/**
 * Expanded synthetic evidence packs appended to the base KB documents.
 * These details make the reporting demo feel like a real audit workpaper set:
 * deeper populations, source systems, exceptions, management actions and
 * report committee direction while preserving the original core facts.
 */

export const DOCUMENT_PAGE_COUNTS: Record<string, number> = {
  "IA-SCOPE-2026-007": 13,
  "IA-PGM-2026-007": 15,
  "IA-TEST-2026-014": 18,
  "IA-EXC-2026-014": 17,
  "IA-MGMT-2026-014": 13,
  "IA-VAL-2026-014": 14,
  "REG-2025-118": 10,
  "ARC-2026-014": 11,
};

export const DOCUMENT_EXPANSIONS: Record<string, string> = {
  "IA-SCOPE-2026-007": `## Institution and Portfolio Profile

| Profile Element | FY2026 Scope Detail |
|-----------------|---------------------|
| Total assets | Approximately $280 billion as of Q3 2026 |
| Primary legal entity | Meridian National Bank, N.A. |
| Holding company reporting | Consolidated capital ratios and capital plan package |
| Major portfolios | Commercial banking, commercial real estate, consumer lending, wealth and treasury services |
| Highest growth area | Commercial real estate concentration increased 14% year-over-year |
| Capital planning platform | Axiom Capital Planning Suite, upgraded August 12, 2026 |
| Key governance bodies | Capital Management Committee, Board Risk Committee, Asset Liability Committee, Model Risk Committee |

Meridian's capital planning process is owned by Treasury with support from Finance, Risk, Regulatory Affairs, Corporate FP&A, Model Risk Management, Enterprise Data Management and business-line finance teams. The process produces the annual capital plan, baseline and stress capital forecasts, contingency trigger reporting, capital actions analysis and quarterly updates to the Capital Management Committee and Board Risk Committee.

## Engagement Objective Detail

The audit objective was to determine whether management designed and operated controls that provide reasonable assurance that:

- Capital forecast inputs are complete, accurate and traceable from source systems to Axiom.
- Stress assumptions and capital actions are subject to documented challenge and approval.
- Contingency triggers are owned, monitored at the approved frequency and escalated when thresholds are breached.
- CMC and BRC reporting packages are accurate, complete and supported by retained evidence.
- Remediation for prior finding F-2025-031 and Federal Reserve MRA REG-2025-118 is sufficiently evidenced to support closure decisions.

## Source Systems and Feeds in Scope

| Feed | Source / Owner | Primary Data Elements | Control Status at Audit Close |
|------|----------------|-----------------------|-------------------------------|
| GL-CAP-01 | PeopleSoft General Ledger / Finance Controller | Retained earnings, dividend accruals, OCI adjustments | Automated feed with Axiom reconciliation |
| RWA-CRE-02 | OFSAA RWA Engine / Credit Risk Analytics | CRE risk-weighted assets, PD/LGD overlays, exposure at default | Automated feed with Axiom reconciliation |
| SEC-AOCI-03 | Eagle Investment Accounting / Treasury Operations | AOCI, HTM/AFS balances, unrealized gains and losses | Automated feed with Axiom reconciliation |
| QRM-NII-04 | QRM / Balance Sheet Analytics | Net interest income, rate shock outputs, deposit beta assumptions | Automated feed; two mapping exceptions after go-live |
| CRE-CONC-05 | CRE Concentration Mart / Commercial Risk | CRE growth, criticized exposure, concentration threshold metrics | Manual feed; independent reconciliation not yet operating |
| CCAR-ADJ-06 | Capital Adjustments Workbook / Capital Planning | Management overlays, capital action adjustments, tax-effected impacts | Manual feed; reviewer sign-off retained inconsistently |
| OPLOSS-07 | Operational Loss Database / Operational Risk | Operational loss forecast overlays and severe event assumptions | Manual feed; source-to-Axiom tie-out incomplete |

## Reporting-Phase Risk Themes

1. **Residual manual-feed dependency.** The Axiom upgrade improved automation, but three feeds remained spreadsheet or data-mart driven at audit close.
2. **Regulatory sensitivity.** REG-2025-118 requires end-to-end lineage and independent reconciliation evidence, making evidence quality as important as control design.
3. **Commercial real estate concentration.** Growth in CRE exposure increases the importance of stress assumption challenge and capital buffer monitoring.
4. **Committee evidence retention.** Challenge may occur verbally, but final report reliance requires retained minutes, decision logs and disposition of challenge points.
5. **Contingency trigger timeliness.** Quarterly monitoring of volatile metrics may not support timely escalation when capital conditions deteriorate.

## Stakeholders Interviewed

| Stakeholder | Role in Process | Interview Focus |
|-------------|-----------------|-----------------|
| Treasurer | Executive owner of capital planning | Rating expectations, action-plan commitment, CMC governance |
| Capital Planning Director | Process owner | Axiom upgrade, manual feeds, reconciliation workflow |
| CFO Controller Delegate | Finance source-data owner | GL and AOCI feed controls |
| Chief Risk Officer Delegate | Risk oversight | CRE concentration, scenario severity and challenge |
| Regulatory Affairs Director | MRA coordinator | Closure criteria and supervisory evidence expectations |
| CMC Secretary | Governance evidence owner | Minutes retention, challenge logs and trigger calendar |
| Model Risk Liaison | Independent model oversight | QRM mapping, model output handoff and assumption governance |

## Report Quality Requirements

The final audit report must state the overall rating, differentiate between achieved control improvements and residual gaps, link findings to source evidence, provide a defensible MRA closure conclusion and include an appendix with ratings, owners, target dates and status.

## Key Engagement Dates

| Date | Milestone |
|------|-----------|
| January 18, 2026 | Audit scope approved by Internal Audit leadership |
| February 3, 2026 | Audit program approved |
| March 4, 2026 | Opening meeting with Treasury, Finance and Regulatory Affairs |
| May 29, 2026 | Interim data-lineage walkthrough completed |
| August 12, 2026 | Axiom upgrade placed into production |
| September 30, 2026 | Scope period closed |
| October 7, 2026 | Completed test results summarized |
| October 16, 2026 | Management responses received |
| October 20, 2026 | Closing meeting held |
| October 31, 2026 | Target final report issuance date |`,

  "IA-PGM-2026-007": `## Program Risk Assessment

| Risk | Inherent Risk | Control Dependency | Program Response |
|------|---------------|--------------------|------------------|
| Incomplete forecast input data | High | Source-to-Axiom reconciliation, completeness checks, reviewer sign-off | Trace selected data elements from source report to Axiom input and final reporting package |
| Unsupported stress assumption changes | High | CMC challenge log, assumption owner certification, model output handoff | Inspect refreshed assumptions and evidence of challenge |
| Inconsistent contingency trigger escalation | Moderate | Trigger inventory, monthly calendar, breach escalation protocol | Test metric ownership, monitoring frequency and evidence of escalation review |
| Inaccurate committee reporting | Moderate | Tie-out controls, preparer/reviewer evidence, minutes retention | Compare CMC/BRC package values to supporting workpapers |
| Premature regulatory closure | High | MRA closure checklist, evidence inventory, Regulatory Affairs review | Validate whether closure criteria are fully met |

## Population Definitions

| Population | Source | Population Size | Sample Rationale |
|------------|--------|-----------------|------------------|
| Source-to-Axiom forecast elements | Axiom input inventory v2026.09 | 118 mapped elements | Judgmental sample of 42 higher-risk elements across seven feeds |
| Post-go-live reconciliation control runs | Axiom workflow log Aug. 12-Sept. 30 | 18 runs | Full population because the post-go-live period was limited |
| Stress scenario assumptions | CMC scenario refresh deck Q3 2026 | 6 key assumptions | Full population |
| Contingency trigger metrics | Capital contingency trigger matrix | 10 metrics | Full population |
| CMC and BRC reporting packages | Monthly CMC and quarterly BRC packages | 8 packages | Full population for scope period |
| MRA closure evidence artifacts | Regulatory Affairs evidence index | 27 artifacts | Full population against closure checklist |

## Source-to-Axiom Sample Detail

| Feed | Elements Selected | Example Elements | Risk Basis |
|------|-------------------|------------------|------------|
| GL-CAP-01 | 6 | Retained earnings rollforward, dividend accrual, tax-effected OCI | Material impact to CET1 numerator |
| RWA-CRE-02 | 7 | CRE RWA, criticized CRE exposure, unfunded commitment conversion | Portfolio growth and supervisory focus |
| SEC-AOCI-03 | 5 | AFS unrealized loss, HTM fair value disclosure, AOCI filter | Rate volatility sensitivity |
| QRM-NII-04 | 8 | NII forecast, deposit beta, parallel shock output, duration gap | Two mapping issues reported by management |
| CRE-CONC-05 | 6 | CRE concentration ratio, owner-occupied CRE, construction exposure | Manual data mart feed |
| CCAR-ADJ-06 | 5 | Capital action overlay, tax adjustment, dividend scenario | Spreadsheet-based management overlay |
| OPLOSS-07 | 5 | Operational loss forecast, severe event overlay, insurance recovery | Manual feed and judgmental overlay |

## Control Inventory Tested

| Control ID | Control Name | Frequency | Owner | Test Type |
|------------|--------------|-----------|-------|-----------|
| CP-REC-01 | Source-to-Axiom automated reconciliation | Each forecast cycle | Capital Planning Director | Operating effectiveness |
| CP-REV-02 | Forecast input reviewer sign-off | Each forecast cycle | Treasury Forecast Manager | Design and operating effectiveness |
| CP-CHL-03 | CMC scenario challenge and approval | Quarterly or ad hoc refresh | Treasurer | Design and operating effectiveness |
| CP-TRG-04 | Contingency trigger monitoring | Monthly or quarterly by metric | CMC Secretary | Operating effectiveness |
| CP-BRC-05 | BRC package tie-out and review | Quarterly | Capital Reporting Manager | Operating effectiveness |
| CP-MRA-06 | MRA closure evidence checklist | Monthly until closure | Regulatory Affairs Director | Design effectiveness |

## Data Analytics Performed

- Compared Axiom input file record counts to source-system control totals for each feed.
- Recalculated selected forecast input aggregations and compared them to Axiom loaded values.
- Identified late or missing reviewer sign-offs from workflow metadata.
- Compared CMC package ratios to final capital plan tables and BRC materials.
- Searched committee minutes for challenge keywords, disposition language and owner assignments.
- Reviewed all open exceptions in the Axiom reconciliation queue after go-live.

## Evidence Standards

For a test item to pass, evidence needed to show source report name, owner, run date, report parameters, field mapping, source-to-Axiom tie-out, independent preparer/reviewer evidence and exception disposition when applicable. Evidence was not accepted if it consisted only of email affirmation, screenshot without source parameters, unapproved spreadsheet adjustment or a committee deck with no retained support.

## Report Rating Calibration

| Rating | Program Interpretation |
|--------|------------------------|
| Satisfactory | Controls are designed and operating effectively with minor isolated exceptions |
| Needs Improvement | Control weaknesses exist that require management action but do not indicate pervasive process failure |
| Unsatisfactory | Significant control failures impair management's ability to rely on the process or create high regulatory exposure |

The program directed the team to consider a Needs Improvement or Unsatisfactory rating if the MRA closure conclusion could not be supported. The final rating decision was reserved until all exception analysis, remediation validation and closing meeting evidence were complete.`,

  "IA-TEST-2026-014": `## Test Execution Dashboard

| Metric | Result |
|--------|--------|
| Total procedures completed | 84 |
| Evidence artifacts reviewed | 312 |
| Source-to-Axiom elements traced | 42 |
| Automated reconciliation runs tested | 18 |
| Committee packages inspected | 8 |
| Management interviews completed | 17 |
| Findings drafted | 4 |
| Repeat or regulatory-linked findings | 1 High repeat issue linked to REG-2025-118 |

## Detailed Source-to-Axiom Results

| Feed | Elements Tested | Exceptions | Result | Notes |
|------|-----------------|------------|--------|-------|
| GL-CAP-01 | 6 | 0 | Effective | Evidence included source report parameters, Axiom load ID and reviewer sign-off |
| RWA-CRE-02 | 7 | 1 | Partially effective | One CRE criticized exposure element lacked independent tie-out to Axiom staging table |
| SEC-AOCI-03 | 5 | 0 | Effective | AOCI values agreed to Eagle source reports and capital plan table |
| QRM-NII-04 | 8 | 2 | Partially effective | Mapping exceptions impacted QRM feed identifiers QRM-221 and QRM-224 |
| CRE-CONC-05 | 6 | 2 | Ineffective | Manual concentration mart extracts lacked retained source parameters and reviewer evidence |
| CCAR-ADJ-06 | 5 | 1 | Partially effective | Capital action adjustment workbook did not retain reviewer sign-off for one overlay |
| OPLOSS-07 | 5 | 1 | Partially effective | Operational loss forecast overlay lacked documented source-to-Axiom reconciliation |
| **Total** | **42** | **7** | **Ineffective for manual feeds** | Exceptions concentrated in three manual or partially automated feeds |

## Automated Reconciliation Run Results

| Run Window | Runs Tested | Passed | Failed | Failure Detail |
|------------|-------------|--------|--------|----------------|
| Aug. 12-Aug. 31 | 7 | 6 | 1 | QRM-NII-04 mapping exception for deposit beta identifier |
| Sept. 1-Sept. 15 | 5 | 5 | 0 | No exceptions |
| Sept. 16-Sept. 30 | 6 | 5 | 1 | QRM-NII-04 mapping exception for duration gap identifier |
| **Total** | **18** | **16** | **2** | Failures remediated manually but not independently reviewed before CMC package finalization |

## Manual Feed Exception Detail

| Exception ID | Feed | Data Element | Evidence Gap | Report Impact |
|--------------|------|--------------|--------------|---------------|
| EX-01 | RWA-CRE-02 | Criticized CRE exposure | Tie-out from source mart to Axiom staging table incomplete | Supports F-2026-041 |
| EX-02 | QRM-NII-04 | Deposit beta assumption output | Axiom mapping ID did not match QRM output file | Supports F-2026-041 |
| EX-03 | QRM-NII-04 | Duration gap forecast | Mapping exception not independently reviewed | Supports F-2026-041 |
| EX-04 | CRE-CONC-05 | CRE concentration ratio | Source parameters not retained | Supports F-2026-041 |
| EX-05 | CRE-CONC-05 | Construction exposure growth | Reviewer sign-off missing | Supports F-2026-041 |
| EX-06 | CCAR-ADJ-06 | Capital action overlay | Manual adjustment approval not retained | Supports F-2026-041 |
| EX-07 | OPLOSS-07 | Severe event operational loss overlay | Reconciliation from OpRisk database to Axiom not evidenced | Supports F-2026-041 |

## Stress Scenario Challenge Results

| Assumption | Refreshed | CMC Approval Evidence | Challenge Evidence | Result |
|------------|-----------|-----------------------|--------------------|--------|
| CRE price decline severity | Yes | Approved Sept. 14, 2026 | Challenge questions retained | Pass |
| Deposit runoff severity | Yes | Approved Sept. 14, 2026 | Alternatives considered retained | Pass |
| Unemployment path | Yes | Approved Sept. 14, 2026 | Challenge evidence incomplete | Exception |
| Rate shock path | Yes | Approved Sept. 14, 2026 | Challenge evidence retained | Pass |
| Commercial borrower downgrade rate | Yes | Approved Sept. 14, 2026 | Challenge evidence incomplete | Exception |
| Operational loss severe event | Yes | Approved Sept. 14, 2026 | Challenge evidence incomplete | Exception |

The three exceptions did not indicate that the assumptions were unreasonable. The issue is that the retained record did not evidence the challenge, alternatives considered or disposition that management stated occurred during CMC discussion.

## Contingency Trigger Monitoring Results

| Trigger Metric | Approved Frequency | Observed Frequency | Result |
|----------------|--------------------|--------------------|--------|
| CET1 management buffer | Monthly | Monthly | Pass |
| Total capital management buffer | Monthly | Monthly | Pass |
| CRE concentration limit | Monthly | Quarterly | Exception |
| Criticized CRE trend | Monthly | Quarterly | Exception |
| AOCI sensitivity | Monthly | Monthly | Pass |
| Deposit runoff stress indicator | Monthly | Quarterly | Exception |
| Capital actions variance | Quarterly | Quarterly | Pass |
| RWA forecast variance | Monthly | Monthly | Pass |
| Operational loss severe event trigger | Monthly | Quarterly | Exception |
| Market volatility capital trigger | Monthly | Monthly | Pass |

## Governance Reporting Package Results

| Package | Date | Package Type | Result | Exception |
|---------|------|--------------|--------|-----------|
| CMC-2026-03 | March 18, 2026 | Monthly CMC update | Pass | None |
| CMC-2026-04 | April 22, 2026 | Monthly CMC update | Pass | None |
| CMC-2026-05 | May 20, 2026 | Monthly CMC update | Pass | None |
| CMC-2026-06 | June 17, 2026 | Monthly CMC update | Pass | None |
| BRC-2026-Q2 | July 24, 2026 | Quarterly BRC package | Pass | None |
| CMC-2026-08 | August 26, 2026 | Post-go-live update | Pass | None |
| CMC-2026-09 | September 14, 2026 | Scenario refresh approval | Exception | Minutes did not retain sufficient challenge detail |
| BRC-2026-Q3 | September 29, 2026 | Quarterly BRC package | Pass | None |

## Quantitative Impact Assessment

Internal Audit did not identify a confirmed misstatement in final reported regulatory capital ratios. The issue is evidence quality and control reliability. Management's final Q3 capital reporting package showed ratios above internal management buffers, but the lack of complete source-to-Axiom evidence prevents Internal Audit from concluding that all forecast inputs were fully controlled.

| Ratio / Metric | Q3 2026 Reported Position | Internal Buffer Status | Audit Observation |
|----------------|---------------------------|------------------------|-------------------|
| CET1 ratio | Above internal management buffer | Above buffer | No recalculation exception noted |
| Tier 1 capital ratio | Above internal management buffer | Above buffer | No recalculation exception noted |
| Total capital ratio | Above internal management buffer | Above buffer | No recalculation exception noted |
| CRE concentration metric | Increased 14% year-over-year | Within board limit but elevated | Requires stronger assumption challenge |

The rating is not Unsatisfactory because governance reporting packages were materially accurate, management accepted the findings, capital ratios remained above internal buffers and the Axiom upgrade demonstrably improved four of seven feeds. However, the rating cannot be Satisfactory because the repeat data-lineage issue remains open and directly affects the MRA closure decision.`,

  "IA-EXC-2026-014": `## Exception Aging and Ownership

| Exception | Date Identified | Owner | Aging at Draft Report | Disposition |
|-----------|-----------------|-------|-----------------------|-------------|
| EX-01 | May 21, 2026 | Credit Risk Analytics | 142 days | Rolled into F-2026-041 |
| EX-02 | Aug. 19, 2026 | Balance Sheet Analytics | 52 days | Rolled into F-2026-041 |
| EX-03 | Sept. 23, 2026 | Balance Sheet Analytics | 17 days | Rolled into F-2026-041 |
| EX-04 | June 12, 2026 | Commercial Risk Data | 120 days | Rolled into F-2026-041 |
| EX-05 | Sept. 10, 2026 | Commercial Risk Data | 30 days | Rolled into F-2026-041 |
| EX-06 | Sept. 18, 2026 | Capital Planning | 22 days | Rolled into F-2026-041 |
| EX-07 | Sept. 26, 2026 | Operational Risk | 14 days | Rolled into F-2026-041 |
| EX-08 | Sept. 14, 2026 | Treasury | 26 days | Rolled into F-2026-042 |
| EX-09 | Sept. 14, 2026 | Treasury | 26 days | Rolled into F-2026-042 |
| EX-10 | Sept. 14, 2026 | Treasury | 26 days | Rolled into F-2026-042 |
| EX-11 | Sept. 30, 2026 | CMC Secretary | 10 days | Rolled into F-2026-043 |
| EX-12 | Sept. 30, 2026 | CMC Secretary | 10 days | Rolled into F-2026-043 |
| EX-13 | Sept. 30, 2026 | CMC Secretary | 10 days | Rolled into F-2026-043 |
| EX-14 | Sept. 30, 2026 | CMC Secretary | 10 days | Rolled into F-2026-043 |
| EX-15 | Sept. 14, 2026 | CMC Secretary | 26 days | Rolled into F-2026-044 |

## F-2026-041 Additional Evidence

**Affected process points.** Manual source extract preparation, source-to-Axiom field mapping, independent reviewer sign-off, exception disposition before CMC package finalization and the MRA closure evidence file.

**Root-cause analysis.** The Axiom upgrade was scoped to the highest-volume feeds and did not include all manual feeds needed for the final capital plan. Management relied on compensating spreadsheet reviews for the remaining feeds, but those reviews were not standardized and did not require a complete source-parameter, tie-out and reviewer evidence package. The team also lacked a centralized owner for ensuring manual-feed evidence met the same standard as automated-feed evidence.

**Severity rationale.** The finding is rated High because it is a repeat issue, directly tied to REG-2025-118 and affects management's ability to evidence the completeness and accuracy of capital forecast inputs. The rating does not depend on a confirmed capital ratio misstatement; the control issue is the inability to support reliance on the reporting process.

**Expected recommendation.** Management should automate the remaining manual source feeds or implement a documented interim reconciliation control with a defined source owner, Axiom field owner, standard reconciliation template, source report parameters, variance threshold, independent reviewer sign-off and monthly evidence quality review until automation is complete.

## F-2026-042 Additional Evidence

| Assumption | Evidence Gap | Expected Evidence |
|------------|--------------|-------------------|
| Unemployment path | CMC minutes show approval but not challenge questions | Challenge question, response and disposition |
| Commercial borrower downgrade rate | Alternatives considered were not retained | Comparison of base, downside and selected assumption |
| Operational loss severe event | Owner rationale was retained but committee challenge was not | Challenge log and disposition |

Management stated that challenge occurred during the September 14 CMC meeting, but the retained package did not evidence the questions raised, alternatives considered or final disposition. Internal Audit treated this as a documentation and evidence-retention issue rather than a conclusion that the selected assumptions were unreasonable.

## F-2026-043 Additional Evidence

| Metric | Approved Frequency | Observed Frequency | Owner |
|--------|--------------------|--------------------|-------|
| CRE concentration limit | Monthly | Quarterly | Commercial Risk Data |
| Criticized CRE trend | Monthly | Quarterly | Credit Risk Analytics |
| Deposit runoff stress indicator | Monthly | Quarterly | Treasury Forecast Manager |
| Operational loss severe event trigger | Monthly | Quarterly | Operational Risk |

The ownership matrix was complete, but the monitoring calendar and certification workflow were not updated consistently after the revised contingency trigger standard was approved.

## F-2026-044 Additional Evidence

The low-rated observation related to CMC-2026-09. The package retained approval of the scenario refresh, but the minutes did not include enough challenge detail to show what alternatives were considered before approval. Because seven of eight packages retained adequate support and no inaccurate reporting was identified, Internal Audit classified this as Low.

## Finding Cross-Reference

| Finding | Related Prior Item | Related Regulatory Matter | Related Management Action |
|---------|--------------------|---------------------------|---------------------------|
| F-2026-041 | F-2025-031 | REG-2025-118 | Phase-two automation and interim reconciliation |
| F-2026-042 | F-2025-032 | Supervisory scenario challenge theme | Revised CMC package and challenge log |
| F-2026-043 | F-2025-033 | Capital contingency planning expectation | Monthly trigger calendar and owner certification |
| F-2026-044 | F-2025-034 | Governance evidence retention | Minutes preparer training and QA |

## Draft Report Language Guidance

The final report should avoid suggesting that Axiom failed overall. Testing showed meaningful improvement from automation. The final report should state that the automated feeds generally worked, while residual manual-feed controls remained insufficient. This distinction is important for balanced reporting and management acceptance.`,

  "IA-MGMT-2026-014": `## Management Response Meeting Notes

Management responses were discussed with Treasury, Regulatory Affairs and Internal Audit on October 16, 2026. Management agreed with the rating and did not dispute the exception facts. Management asked that the final report distinguish clearly between progress achieved through the Axiom upgrade and the residual manual-feed control gap that remains open.

## Action Plan Milestones

| Finding | Milestone | Due Date | Evidence Expected |
|---------|-----------|----------|-------------------|
| F-2026-041 | Define standard interim reconciliation template | November 15, 2026 | Approved template and control owner sign-off |
| F-2026-041 | Implement interim reconciliation for CRE-CONC-05, CCAR-ADJ-06 and OPLOSS-07 | December 31, 2026 | Completed monthly reconciliations with reviewer evidence |
| F-2026-041 | Complete phase-two Axiom feed automation design | January 31, 2027 | Design document, mapping inventory and implementation plan |
| F-2026-041 | Place three remaining feeds into production automation | March 31, 2027 | Axiom workflow logs and successful parallel run evidence |
| F-2026-042 | Revise CMC scenario package template | November 30, 2026 | Updated template with challenge log section |
| F-2026-042 | Train assumption owners and CMC secretary | December 15, 2026 | Training attendance and procedure acknowledgement |
| F-2026-042 | Complete first refreshed package using new template | January 31, 2027 | Approved package with challenge questions and disposition |
| F-2026-043 | Update trigger calendar and owner certifications | November 30, 2026 | Approved calendar and workflow routing evidence |
| F-2026-043 | Complete first monthly volatile-metric certification | December 31, 2026 | Certifications for all volatile metrics |
| F-2026-044 | Re-train minutes preparers | November 15, 2026 | Training record and updated minutes procedure |
| F-2026-044 | Complete QA over two CMC meeting minute packages | November 30, 2026 | QA checklist and reviewer sign-off |

## Interim Compensating Controls

Until the three manual feeds are automated, management committed to:

- Use a single reconciliation workbook controlled by Treasury.
- Require source report parameters, record counts and extraction date on each feed tab.
- Require independent reviewer sign-off before CMC materials are finalized.
- Retain all support in the Axiom evidence folder rather than local network drives.
- Maintain a monthly open-exception log reviewed by the Capital Planning Director.

## Owner Accountability

| Owner | Accountability |
|-------|----------------|
| Capital Planning Director | Overall remediation owner for F-2026-041 and accountable for Axiom phase-two delivery |
| Treasury Forecast Manager | Interim reconciliation owner for manual feeds |
| Treasurer | Executive sponsor for scenario challenge and capital governance enhancements |
| CMC Secretary | Owner for trigger calendar, certification workflow and minutes QA |
| Regulatory Affairs Director | Owner for MRA evidence packaging and communication with exam management |

## Management Position on Rating

Management accepted the Needs Improvement rating. Management did not request downgrade to Satisfactory because the MRA closure evidence remains incomplete. Management did not agree that Unsatisfactory would be appropriate because automated controls operated for four of seven feeds, capital reporting packages were materially accurate and no capital ratio misstatement was identified.

## Validation Expectations

Internal Audit expects management to provide evidence by milestone rather than waiting until final target dates. Remediation validation should include design review, implementation evidence and operating effectiveness testing for the first production cycle after each control change.`,

  "IA-VAL-2026-014": `## Validation Criteria for F-2025-031

F-2025-031 can be closed only when Internal Audit can verify all of the following:

| Closure Criterion | Evidence Required | FY2026 Result |
|------------------|-------------------|---------------|
| Complete feed inventory | Seven in-scope feeds with owner and Axiom mapping | Met |
| Automated or controlled reconciliation | Reconciliation control operating for each feed | Partially met |
| Independent review | Reviewer sign-off retained before CMC package finalization | Partially met |
| Exception reporting | Variances logged, dispositioned and escalated | Partially met |
| Evidence retention | Support retained centrally and retrievable | Partially met |
| Operating effectiveness | Control passed for sampled items | Not met for 7 of 42 elements |

## Evidence Inventory Reviewed

| Evidence Artifact | Count | Validation Result |
|-------------------|-------|-------------------|
| Axiom workflow logs | 18 | 16 passed, 2 failed due to QRM mapping exceptions |
| Source-to-Axiom field maps | 7 | Complete inventory exists |
| Reviewer sign-off records | 42 | 35 complete, 7 incomplete |
| Manual-feed reconciliation files | 9 | Evidence inconsistent across three feeds |
| Regulatory Affairs closure checklist | 1 | Complete as an inventory but not closure-ready |
| Issue-management updates | 6 | Timely and aligned to management response |

## Post-Go-Live Control Failures

The two failed automated reconciliation runs occurred after the August 12 Axiom go-live. Management corrected the affected values manually before final reporting, but the manual corrections were not independently reviewed before the related CMC package was finalized. Internal Audit therefore treated the failures as remediation evidence gaps rather than isolated technology defects.

## Prior Item Disposition Detail

| Prior Item | Original Theme | FY2026 Validation Detail | Disposition |
|------------|----------------|--------------------------|-------------|
| F-2025-031 | Source-data lineage and reconciliation | Four feeds automated; three feeds manual; two post-go-live failures | Partially remediated |
| F-2025-032 | Scenario refresh governance | Scenario refresh occurred, but three assumptions lacked challenge evidence | Superseded by F-2026-042 |
| F-2025-033 | Contingency trigger ownership | Owners assigned, but four volatile metrics stayed quarterly | Superseded by F-2026-043 |
| F-2025-034 | CMC minutes retention | Seven of eight packages adequate; one isolated exception | Closed with residual low observation |

## MRA Closure Assessment

Internal Audit does not recommend closure of REG-2025-118 because management cannot yet evidence end-to-end lineage and independent reconciliation controls for all seven source feeds. A closure recommendation should wait until the three manual feeds are either automated or subject to a consistent interim reconciliation control that operates effectively for at least one complete capital reporting cycle.

## Regulatory Affairs Coordination

Regulatory Affairs agreed that the FY2026 audit report should be used as support for the remediation roadmap, not as closure evidence. The Regulatory Affairs Director requested that the final report use clear closure language: "not ready for closure" rather than "closure pending," because the latter could imply that only administrative steps remain.

## Validation Evidence Still Needed

- Phase-two Axiom automation evidence for CRE-CONC-05, CCAR-ADJ-06 and OPLOSS-07.
- Interim manual-feed reconciliation packages for each cycle until automation is complete.
- Independent reviewer sign-off before CMC package finalization.
- Updated MRA evidence index with source owner, control owner and evidence location for each feed.
- Successful operating effectiveness testing after the first complete post-remediation reporting cycle.`,

  "REG-2025-118": `## Supervisory Request Items

| Request Item | Supervisory Expectation | Meridian Evidence Provided | Internal Audit Assessment |
|--------------|-------------------------|----------------------------|---------------------------|
| RFI-01 | Complete inventory of capital stress testing data inputs | Seven-feed inventory and Axiom field map | Inventory complete |
| RFI-02 | End-to-end lineage from source to forecast output | Axiom evidence for four feeds; manual evidence for three feeds | Partially complete |
| RFI-03 | Independent reconciliation controls | Automated workflow for four feeds; interim manual reviews for three feeds | Partially complete |
| RFI-04 | Exception reporting and escalation | Axiom exception queue plus Treasury manual exception log | Inconsistent for manual feeds |
| RFI-05 | Governance evidence for capital plan approval | CMC/BRC packages and minutes | Mostly complete with one minutes exception |
| RFI-06 | Closure validation from Internal Audit | FY2026 audit report and validation workpapers | Not closure-ready |

## Supervisory Expectations Interpreted by Regulatory Affairs

Regulatory Affairs documented the following closure expectations after discussion with exam management:

- Every source feed must have a named business owner, control owner and technology owner.
- Lineage must show source report, transformation, Axiom field and final reporting table.
- Reconciliations must be independently reviewed before CMC approval.
- Manual workarounds must have the same evidence standard as automated controls.
- Exceptions must be tracked to resolution with documented risk acceptance when unresolved.
- Internal Audit must provide an independent conclusion, not merely confirm that management submitted evidence.

## Examiner Themes Relevant to FY2026 Reporting

| Theme | Description | Reporting Implication |
|-------|-------------|-----------------------|
| CRE concentration growth | CRE concentration increased 14% year-over-year | Scenario challenge evidence should be explicit |
| Forecast input control | Data quality remains a supervisory focus | Finding F-2026-041 should be prominent |
| MRA closure discipline | Closure should not be recommended without operating evidence | Report should state not ready for closure |
| Governance challenge | Committees must retain evidence of challenge, not just approval | Finding F-2026-042 and F-2026-044 should be linked to evidence retention |
| Sustainable remediation | Temporary fixes are acceptable only when controlled and time-bound | Management action plans should include interim controls and phase-two automation |

## Capital Position Context

The Federal Reserve correspondence acknowledged that Meridian's reported capital ratios remained above regulatory minimums and internal management buffers. The supervisory concern is not current capital adequacy in isolation. The concern is whether management can demonstrate that forecasted capital ratios and capital plan decisions are based on complete, accurate and controlled data.

## Closure Recommendation Guidance

Internal Audit should not use language that implies closure readiness. The recommended wording is: "Internal Audit does not recommend closure of REG-2025-118 at this time because end-to-end lineage and independent reconciliation evidence is not complete for all seven source feeds."

## Regulatory Reporting Sensitivities

The final report should avoid including confidential supervisory examination details beyond the summarized MRA language. The report may reference REG-2025-118, the data-lineage expectation and the closure conclusion, but should not quote non-public examiner commentary or include examination workpaper references.`,

  "ARC-2026-014": `## Closing Meeting Participants

| Participant | Role | Attendance |
|-------------|------|------------|
| Chief Audit Executive delegate | Audit report committee chair | Present |
| Audit Director, Financial Risk | Engagement sponsor | Present |
| Audit Manager, Capital Planning | Engagement manager | Present |
| Treasurer | Management executive owner | Present |
| Capital Planning Director | Process owner | Present |
| Regulatory Affairs Director | MRA coordinator | Present |
| CMC Secretary | Governance evidence owner | Present |
| CFO Controller Delegate | Finance evidence owner | Present |
| Chief Risk Officer Delegate | Risk challenge representative | Present |

## Management Comments Resolved Before Report

| Topic | Management Comment | Resolution |
|-------|--------------------|------------|
| Axiom upgrade language | Management requested acknowledgement that four feeds were automated successfully | Report will state the upgrade improved the control environment |
| MRA conclusion | Management asked whether partial remediation could support conditional closure | Internal Audit will state not ready for closure |
| Finding F-2026-041 severity | Management accepted High after repeat issue and MRA linkage were discussed | High rating retained |
| Scenario challenge finding | Management requested clarification that assumptions were not found unreasonable | Report will distinguish assumption reasonableness from evidence retention |
| Trigger monitoring | Management confirmed the calendar issue and accepted the target date | Moderate rating retained |

## Report Committee Direction Expanded

The Audit Report Committee directed the team to write the final report with a clear board-level story:

1. The capital planning control environment improved because Axiom automated four of seven source feeds.
2. The improvement is not sufficient to close the repeat data-lineage issue or REG-2025-118.
3. The overall rating should be Needs Improvement, not Unsatisfactory, because governance reporting was materially accurate and management accepted remediation.
4. F-2026-041 should lead the findings because it is High, repeat and regulatory-linked.
5. The report should use concise tables for owners, target dates and remediation validation.
6. The appendix should make it easy for the Board Risk Committee to see what remains open and when management committed to resolve it.

## Open Items at Closing

| Open Item | Owner | Due Date | Report Treatment |
|-----------|-------|----------|------------------|
| Confirm exact wording of management response for F-2026-041 | Capital Planning Director | October 22, 2026 | Include in action-plan table |
| Confirm Regulatory Affairs wording for MRA closure conclusion | Regulatory Affairs Director | October 23, 2026 | Use "not ready for closure" |
| Attach final evidence index to workpaper file | Audit Manager | October 24, 2026 | Workpaper support only |
| Complete report quality review | Audit Director | October 27, 2026 | Required before issuance |
| Final CAE delegate approval | CAE delegate | October 30, 2026 | Required before target issue date |

## Distribution Controls

The report is Internal Use Only with CSI references. Distribution should be limited to the approved distribution list. If the report is provided to regulators, Regulatory Affairs must coordinate delivery and confirm whether the CSI legend should be added to the cover communication.

## Final Report Acceptance Notes

Management accepted all four findings and target dates. No management dispute language is required. Internal Audit will retain the closing meeting notes, management response tracker, final report committee approval and distribution evidence in the engagement file.

## Appendix Expectations

The appendix should include:

- Scope period and post-implementation validation date.
- Testing workstreams and procedure counts.
- Finding summary with rating, owner, target date and status.
- Prior item disposition table.
- REG-2025-118 closure conclusion.
- Report distribution and target issuance date.`,
};
