import type { AssessmentSitting, PrototypeUpdate } from "./domain";

const OFFICIAL_DATES_URL =
  "https://sqe.sra.org.uk/booking/assessment-dates-locations/booking-windows";

export const prototypeSittings: AssessmentSitting[] = [
  {
    id: "sqe2-october-2026",
    stage: "SQE2",
    label: "SQE2 · October 2026",
    firstAssessmentDate: "2026-10-27",
    cutoffDate: "2026-06-27",
    specificationLabel: "Assessment Specification from September 2026",
    officialDatesUrl: OFFICIAL_DATES_URL,
  },
  {
    id: "sqe1-january-2027",
    stage: "SQE1",
    label: "SQE1 · January 2027",
    firstAssessmentDate: "2027-01-11",
    cutoffDate: "2026-09-11",
    specificationLabel: "Assessment Specification from September 2026",
    officialDatesUrl: OFFICIAL_DATES_URL,
  },
  {
    id: "sqe2-january-2027",
    stage: "SQE2",
    label: "SQE2 · January 2027",
    firstAssessmentDate: "2027-01-26",
    cutoffDate: "2026-09-26",
    specificationLabel: "Assessment Specification from September 2026",
    officialDatesUrl: OFFICIAL_DATES_URL,
  },
];

export const prototypeUpdates: PrototypeUpdate[] = [
  {
    id: "illustrative-tax-threshold",
    title: "Illustrative change to a personal tax threshold",
    summary:
      "This fictional record demonstrates how a changed input would be traced through a calculation without implying that every personal tax threshold affects every tax.",
    effectiveDate: "2026-09-01",
    sourceLabel: "Illustrative record — no legal proposition is being published",
    appliesTo: ["SQE1", "SQE2"],
    impacts: [
      {
        id: "income-tax-direct",
        kind: "direct",
        area: "Income tax calculation",
        context: "Business Law and Practice",
        rationale:
          "A calculation using that specific statutory threshold would need the new value.",
      },
      {
        id: "stakeholder-consequence",
        kind: "consequential",
        area: "Taxation of business stakeholders",
        context: "Client outcome",
        rationale:
          "The changed calculation may alter the result of advice where the threshold is an input.",
      },
      {
        id: "iht-not-affected",
        kind: "not-affected",
        area: "Inheritance Tax nil-rate band",
        context: "Wills and the Administration of Estates",
        rationale:
          "A separate IHT threshold does not change merely because an income-tax threshold changes.",
      },
    ],
  },
  {
    id: "illustrative-procedure-rule",
    title: "Illustrative procedural rule affecting civil claims",
    summary:
      "This fictional record shows how a procedural amendment can be primary to Dispute Resolution while appearing in both contract and tort fact patterns.",
    effectiveDate: "2026-05-15",
    sourceLabel: "Illustrative record — no legal proposition is being published",
    appliesTo: ["SQE1", "SQE2"],
    impacts: [
      {
        id: "procedure-direct",
        kind: "direct",
        area: "Civil procedure",
        context: "Dispute Resolution",
        rationale:
          "The fictional rule directly changes the steps applied to the covered civil claim.",
      },
      {
        id: "contract-context",
        kind: "contextual",
        area: "Contract claim",
        context: "Contract Law",
        rationale:
          "A contract dispute can provide the facts in which the procedural rule is applied.",
      },
      {
        id: "tort-context",
        kind: "contextual",
        area: "Tort claim",
        context: "Tort Law",
        rationale:
          "A tort dispute can provide a separate factual context without changing tort doctrine itself.",
      },
    ],
  },
];
