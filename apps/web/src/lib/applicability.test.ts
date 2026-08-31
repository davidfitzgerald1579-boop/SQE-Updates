import { describe, expect, it } from "vitest";
import {
  formatIsoDate,
  getProvisionalApplicability,
} from "./applicability";

describe("getProvisionalApplicability", () => {
  const cutoffDate = "2026-09-11";

  it("includes an update effective before the cutoff", () => {
    expect(getProvisionalApplicability("2026-09-10", cutoffDate)).toBe(
      "included",
    );
  });

  it("includes an update effective on the cutoff date", () => {
    expect(getProvisionalApplicability(cutoffDate, cutoffDate)).toBe(
      "included",
    );
  });

  it("places an update effective after the cutoff outside the snapshot", () => {
    expect(getProvisionalApplicability("2026-09-12", cutoffDate)).toBe(
      "after-cutoff",
    );
  });

  it.each([
    [null, cutoffDate],
    ["not-a-date", cutoffDate],
    ["2026-02-30", cutoffDate],
    ["2026-09-10", "invalid-cutoff"],
  ])("requires review when a date is missing or invalid", (effective, cutoff) => {
    expect(getProvisionalApplicability(effective, cutoff)).toBe("needs-review");
  });
});

describe("formatIsoDate", () => {
  it("formats an ISO date for a UK reader without a timezone shift", () => {
    expect(formatIsoDate("2026-09-11")).toBe("11 September 2026");
  });

  it("does not present an invalid date as reliable", () => {
    expect(formatIsoDate("2026-02-30")).toBe("Date requires review");
  });
});
