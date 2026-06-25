export type RiskLevel = "High" | "Moderate" | "Low";
export type Opinion = "Satisfactory" | "Needs Improvement";

export interface AuditEntity {
  id: string;
  name: string;
  unit: string;
  inherentRisk: RiskLevel;
  lastAudit: string;
  opinion: Opinion;
  openFindings: number;
  kbDocuments: number; // 0 = Not loaded
  active: boolean;
}

export const AUDIT_UNIVERSE: AuditEntity[] = [
  {
    id: "capital-planning",
    name: "Capital Planning & Capital Adequacy",
    unit: "Treasury",
    inherentRisk: "High",
    lastAudit: "Q1 2025",
    opinion: "Needs Improvement",
    openFindings: 4,
    kbDocuments: 8,
    active: true,
  },
  {
    id: "commercial-lending",
    name: "Commercial Lending - Credit Administration",
    unit: "Commercial Bank",
    inherentRisk: "High",
    lastAudit: "Q3 2024",
    opinion: "Satisfactory",
    openFindings: 2,
    kbDocuments: 0,
    active: false,
  },
  {
    id: "bsa-aml",
    name: "BSA/AML Transaction Monitoring",
    unit: "Financial Crimes",
    inherentRisk: "High",
    lastAudit: "Q4 2024",
    opinion: "Needs Improvement",
    openFindings: 3,
    kbDocuments: 0,
    active: false,
  },
  {
    id: "liquidity-risk",
    name: "Liquidity Risk Management",
    unit: "Treasury",
    inherentRisk: "Moderate",
    lastAudit: "Q2 2024",
    opinion: "Satisfactory",
    openFindings: 1,
    kbDocuments: 0,
    active: false,
  },
  {
    id: "deposit-operations",
    name: "Deposit Operations",
    unit: "Consumer Bank",
    inherentRisk: "Moderate",
    lastAudit: "Q1 2024",
    opinion: "Satisfactory",
    openFindings: 0,
    kbDocuments: 0,
    active: false,
  },
  {
    id: "model-risk",
    name: "Model Risk Management",
    unit: "Risk",
    inherentRisk: "Moderate",
    lastAudit: "Q3 2024",
    opinion: "Needs Improvement",
    openFindings: 2,
    kbDocuments: 0,
    active: false,
  },
  {
    id: "third-party-risk",
    name: "Third-Party Risk Management",
    unit: "Operational Risk",
    inherentRisk: "Moderate",
    lastAudit: "Q4 2024",
    opinion: "Satisfactory",
    openFindings: 1,
    kbDocuments: 0,
    active: false,
  },
  {
    id: "information-security",
    name: "Information Security - Cyber Resilience",
    unit: "Technology",
    inherentRisk: "High",
    lastAudit: "Q2 2024",
    opinion: "Needs Improvement",
    openFindings: 3,
    kbDocuments: 0,
    active: false,
  },
  {
    id: "mortgage-servicing",
    name: "Mortgage Servicing",
    unit: "Consumer Bank",
    inherentRisk: "Low",
    lastAudit: "Q1 2024",
    opinion: "Satisfactory",
    openFindings: 0,
    kbDocuments: 0,
    active: false,
  },
];

export const getEntityById = (id: string) =>
  AUDIT_UNIVERSE.find((e) => e.id === id);
