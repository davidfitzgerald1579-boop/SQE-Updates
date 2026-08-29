export type AssessmentStage = "SQE1" | "SQE2";

export type ImpactKind =
  | "direct"
  | "consequential"
  | "contextual"
  | "not-affected";

export type ApplicabilityStatus =
  | "included"
  | "after-cutoff"
  | "needs-review";

export interface AssessmentSitting {
  id: string;
  stage: AssessmentStage;
  label: string;
  firstAssessmentDate: string;
  cutoffDate: string;
  specificationLabel: string;
  officialDatesUrl: string;
}

export interface UpdateImpact {
  id: string;
  kind: ImpactKind;
  area: string;
  context: string;
  rationale: string;
}

export interface PrototypeUpdate {
  id: string;
  title: string;
  summary: string;
  effectiveDate: string | null;
  sourceLabel: string;
  appliesTo: AssessmentStage[];
  impacts: UpdateImpact[];
}
