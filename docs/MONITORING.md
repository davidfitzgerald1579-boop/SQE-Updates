# Monitoring and completeness controls

## Principle

No system can truthfully guarantee that every legal development will always be
published, detected, and interpreted correctly. The service instead guarantees a
declared coverage scope, overlapping detection paths, visible source health, and
regular reconciliation so that a single failure cannot create a silent gap.

## Source tiers

1. **Primary authority:** legislation, official judgments, procedural rules,
   regulator rules, and official assessment material.
2. **Official explanatory material:** explanatory memoranda, departmental
   guidance, official press releases, and practice guides.
3. **Discovery cross-check:** licensed current-awareness services, practitioner
   commentary, and contributor reports. These can create candidates but cannot by
   themselves verify a public legal proposition.

## Coverage ledger

Every leaf in the versioned SQE syllabus must have one or more active source
assignments. Each assignment records:

- primary and backup source;
- source tier and authority type;
- collection method;
- expected publication cadence;
- monitoring interval;
- last successful heartbeat;
- responsible editorial area; and
- known gaps or licensing limitations.

A syllabus node with no active primary or official source is a coverage failure.

## Detection routes

Use the broadest structured route the source legitimately offers:

1. API or complete publication listing;
2. RSS/Atom feed;
3. official email notification ingested into a dedicated cloud mailbox;
4. stable HTML or document-index comparison;
5. PDF/document hashing and text comparison; and
6. scheduled manual check where automation is not reliable or permitted.

High-risk sources should have two independent routes when terms permit. Keyword
alerts are supplementary because unfamiliar drafting can evade them.

### Do not rely on consolidated legislation alone

The National Archives explains that its editorial team analyses the effects of
new legislation before adding them to the Changes to Legislation facility, and
that this process commonly takes four to eight weeks and can take longer. The
service must therefore monitor newly enacted legislation, statutory instruments,
commencement material, and procedural-rule publications directly. Revised text
and Changes to Legislation are valuable reconciliation routes, not the sole or
necessarily earliest detection route.

Source: [The National Archives, *Our Approach to Editing Legislation*](https://www.legislation.gov.uk/pdfs/GuideToRevisedLegislation_Jan_2012.pdf).

## What established services do

Published product descriptions show a consistent operating pattern rather than a
single magic feed:

- Westlaw describes dedicated attorneys and legal editors monitoring practice
  areas, then delivering editorially curated alerts and citator status alerts.
- Lexis+ describes expert-written and frequently checked material, daily/weekly/
  monthly current-awareness alerts, horizon scanners, legislation trackers, and
  tailored case and legislation alerts.

SQE Updates follows the same broad division of labour at a smaller, transparent
scale: automated collection provides breadth and speed; a syllabus taxonomy makes
coverage measurable; humans verify meaning and applicability; trackers preserve
status and history; and alerts are a delivery layer, not the monitoring system.

Sources: [Westlaw Today](https://legal.thomsonreuters.com/en/products/westlaw-today),
[Westlaw KeyCite](https://legal.thomsonreuters.com/en/insights/articles/20-years-of-excellence-with-keycite-westlaw),
and [Lexis+ Practical Guidance](https://www.lexisnexis.co.uk/products/lexis-psl.html).

## Monitor lifecycle

```text
scheduled -> leased -> fetched -> snapshotted -> parsed -> deduplicated
          -> candidates created -> heartbeat committed -> lease released
```

Each run records counts, cursor positions, hashes, duration, parser version, and a
sanitised error. No-result runs are first-class successful heartbeats. Abnormal
silence is detectable by comparing current counts with the source's history.

## Editorial lifecycle

```text
candidate -> relevance triage -> atomic rule extraction -> authority verification
          -> effective-date review -> impact mapping -> second check -> published
```

Automation may prioritise and draft. It may not publish, decide that a legal change
is operative, or confirm a cross-subject impact without human review.

## Reconciliation

At least monthly, compare the intake database with broader inventories, including:

- all newly published Acts and statutory instruments;
- all available judgments in the covered court inventory;
- amendment indexes for relevant procedural rules;
- changed regulator and government guidance pages;
- SRA/SQE specification, assessment-date, and announcement pages; and
- properly licensed publisher alerts used only as cross-checks.

A full reconciliation also runs before each assessment cutoff. The sitting is then
frozen as an immutable snapshot after all unresolved candidates and source failures
have been reviewed.

## Service metrics

- source heartbeat freshness;
- monitor success and unexpected-zero rate;
- detection latency;
- untriaged and unresolved candidate age;
- percentage of syllabus nodes with active primary coverage;
- reconciliation discrepancies;
- review and correction turnaround; and
- cutoff snapshot readiness.

## Incident handling

If a missed or incorrectly mapped update is identified:

1. preserve the original public record and evidence;
2. create a correction entry;
3. update affected sitting snapshots explicitly;
4. notify users who subscribed to the affected topic or sitting;
5. determine which detection or review control failed; and
6. add a regression fixture or monitoring control before closing the incident.
