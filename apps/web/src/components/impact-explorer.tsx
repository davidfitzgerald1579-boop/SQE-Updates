"use client";

import { useMemo, useState } from "react";
import styles from "@/app/home.module.css";
import {
  formatIsoDate,
  getProvisionalApplicability,
} from "@/lib/applicability";
import { prototypeSittings, prototypeUpdates } from "@/lib/prototype-data";
import type { ApplicabilityStatus, ImpactKind } from "@/lib/domain";

const statusCopy: Record<
  ApplicabilityStatus,
  { label: string; detail: string }
> = {
  included: {
    label: "Within this cutoff",
    detail: "The illustrative effective date is on or before the selected cutoff.",
  },
  "after-cutoff": {
    label: "After this cutoff",
    detail: "The illustrative effective date falls after the selected cutoff.",
  },
  "needs-review": {
    label: "Needs date review",
    detail: "No reliable operative date is available for an automatic comparison.",
  },
};

const impactLabels: Record<ImpactKind, string> = {
  direct: "Direct impact",
  consequential: "Consequential impact",
  contextual: "Practice context",
  "not-affected": "Not affected",
};

export function ImpactExplorer() {
  const [selectedSittingId, setSelectedSittingId] = useState(
    prototypeSittings[1].id,
  );

  const sitting = useMemo(
    () =>
      prototypeSittings.find((item) => item.id === selectedSittingId) ??
      prototypeSittings[0],
    [selectedSittingId],
  );

  return (
    <div className={styles.explorer}>
      <div className={styles.sittingPanel}>
        <div>
          <p className={styles.controlEyebrow}>Your assessment snapshot</p>
          <label htmlFor="sitting">Choose a sitting</label>
          <select
            id="sitting"
            value={selectedSittingId}
            onChange={(event) => setSelectedSittingId(event.target.value)}
          >
            {prototypeSittings.map((item) => (
              <option value={item.id} key={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <dl className={styles.sittingFacts} aria-live="polite">
          <div>
            <dt>Examinable-law cutoff</dt>
            <dd>{formatIsoDate(sitting.cutoffDate)}</dd>
          </div>
          <div>
            <dt>First assessment date</dt>
            <dd>{formatIsoDate(sitting.firstAssessmentDate)}</dd>
          </div>
          <div>
            <dt>Specification</dt>
            <dd>{sitting.specificationLabel}</dd>
          </div>
        </dl>

        <a href={sitting.officialDatesUrl}>
          Check the official dates
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className={styles.updateList}>
        {prototypeUpdates.map((update) => {
          const status = getProvisionalApplicability(
            update.effectiveDate,
            sitting.cutoffDate,
          );
          const copy = statusCopy[status];

          return (
            <article className={styles.updateCard} key={update.id}>
              <div className={styles.updateCardHeader}>
                <div>
                  <span className={styles.prototypeBadge}>Illustrative only</span>
                  <h3>{update.title}</h3>
                </div>
                <div className={styles.statusBadge} data-status={status}>
                  <span aria-hidden="true" />
                  {copy.label}
                </div>
              </div>

              <p className={styles.updateSummary}>{update.summary}</p>
              <p className={styles.statusDetail}>{copy.detail}</p>

              <dl className={styles.updateFacts}>
                <div>
                  <dt>Illustrative effective date</dt>
                  <dd>
                    {update.effectiveDate
                      ? formatIsoDate(update.effectiveDate)
                      : "Not established"}
                  </dd>
                </div>
                <div>
                  <dt>Evidence status</dt>
                  <dd>{update.sourceLabel}</dd>
                </div>
              </dl>

              <div className={styles.impactHeading}>
                <h4>Impact map</h4>
                <span>{update.impacts.length} explained relationships</span>
              </div>

              <ul className={styles.impactList}>
                {update.impacts.map((impact) => (
                  <li key={impact.id} data-kind={impact.kind}>
                    <div className={styles.impactTopline}>
                      <span>{impactLabels[impact.kind]}</span>
                      <small>{impact.context}</small>
                    </div>
                    <strong>{impact.area}</strong>
                    <p>{impact.rationale}</p>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}
