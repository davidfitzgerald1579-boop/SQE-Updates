# Product model

## Purpose

SQE Updates helps a candidate understand the law and practice applicable to one
assessment sitting. It is not a general legal-news service and does not predict
which questions will appear.

## Core user journey

1. The user selects SQE1 or SQE2 and an official assessment sitting.
2. The service pins the sitting's first assessment date, examinable-law cutoff,
   and applicable Assessment Specification edition.
3. The service shows verified changes as included, after-cutoff, or needing review.
4. Each change explains the rule-level effect and its direct, consequential, and
   contextual syllabus impacts.
5. The user can inspect supporting primary sources, editorial reasoning, review
   date, and corrections.

## The atomic update rule

A publication is not necessarily one update. A Finance Act, judgment, procedural
rule update, or regulatory announcement can contain several distinct legal
changes. Each independently applicable rule change must be stored as an atomic
update so that it can have its own:

- effective and transitional dates;
- legal status;
- syllabus impacts;
- assessment applicability;
- verification evidence; and
- correction history.

Several atomic updates can remain linked to the same source change set.

## Impact relationships

Every published syllabus relationship must be classified and explained.

| Relationship | Meaning |
| --- | --- |
| Direct | The changed authority expressly alters the rule, test, procedure, or calculation. |
| Consequential | Applying another in-scope rule produces a different outcome because of the change. |
| Contextual | The rule can arise in this practice or problem context without changing that subject's substantive doctrine. |
| Not affected | A closely related area that candidates could reasonably but incorrectly assume has changed. |

An automated model may propose a relationship. It may not confirm or publish one.

## Applicability

Applicability is based on the date the change is legally operative, not merely its
announcement, Royal Assent, judgment-publication, or consolidation date. A change
effective on the cutoff date is treated as within the cutoff, subject to human
review of commencement and transitional provisions.

The applicability engine produces a provisional result only. Reviewers can mark a
record uncertain or override the calculated result with a written rationale.

## SQE2 mapping

SQE2 records may map to both a practice area and one or more potential assessment
contexts, such as client interview and attendance note, advocacy, case and matter
analysis, legal research, legal writing, or legal drafting. These mappings mean
"may be relevant in this context" and must never be presented as an assessment
prediction.

## Publication standard

A public record must have:

- at least one authoritative source;
- an identified atomic rule change;
- effective-date analysis;
- a current legal-status decision;
- at least one confirmed syllabus impact or an explicit explanation of why the
  change is relevant;
- a named or internally accountable reviewer;
- a verification timestamp; and
- a sitting-applicability result.

## Initial non-goals

- Publishing automatically generated legal conclusions.
- Reproducing a commercial legal-research database.
- Predicting the content of a particular assessment.
- Publishing every legal development outside the official SQE scope.
- Storing production data in repository fixtures, a local file, or SQLite.
- Generating unreviewed revision questions from new developments.
