import type { ApplicabilityStatus } from "./domain";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
}

export function getProvisionalApplicability(
  effectiveDate: string | null,
  cutoffDate: string,
): ApplicabilityStatus {
  if (
    effectiveDate === null ||
    !isIsoDate(effectiveDate) ||
    !isIsoDate(cutoffDate)
  ) {
    return "needs-review";
  }

  return effectiveDate <= cutoffDate ? "included" : "after-cutoff";
}

export function formatIsoDate(value: string): string {
  if (!isIsoDate(value)) {
    return "Date requires review";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}
