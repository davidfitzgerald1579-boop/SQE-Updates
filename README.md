# SQE Updates

SQE Updates is an open, cloud-native service for tracking changes in the law and
showing how each verified change may affect a particular SQE1 or SQE2 sitting.

The product is designed around three questions:

1. Is this law or practice examinable for my sitting?
2. Which legal rules, calculations, syllabus topics, and practical contexts does it affect?
3. Why does the service believe that, and which primary sources support it?

This repository is at the foundation stage. The current web interface contains
clearly labelled prototype records; it must not be treated as revision guidance.

## Product principles

- **Sitting-first:** every result is evaluated against a fixed assessment cutoff and specification edition.
- **Impact-first:** one source document can produce several atomic rule changes, each mapped to direct, consequential, contextual, and explicitly unaffected areas.
- **Primary-source led:** secondary services can identify candidates, but publication requires verification against an authoritative source.
- **Human reviewed:** automation detects and prioritises; a reviewer decides legal meaning and SQE relevance.
- **No silent gaps:** every monitored source emits a heartbeat and is reconciled against broader inventories.
- **Cloud source of truth:** production data is never stored in a server-local file, SQLite database, or checked-in JSON database.
- **Auditable:** source snapshots, monitor runs, review decisions, corrections, and publication history are retained.

## Planned cloud architecture

```text
Official sources
      |
Supabase scheduled Edge Functions
      |
Cloud object snapshots + PostgreSQL intake records
      |
Human editorial review and impact mapping
      |
Published PostgreSQL records protected by row-level security
      |
Next.js web app on Vercel

GitHub Actions: tests, security checks, and independent reconciliation only
```

Supabase is the initial managed PostgreSQL, authentication, storage, and scheduler
provider. The schema remains standard PostgreSQL wherever possible so the project
can be migrated or self-hosted. Vercel is the initial Next.js deployment target.
No provider account or paid resource is created by this repository.

## Repository layout

```text
apps/web/                  Public Next.js application
design-system/sqe-updates/ Product design tokens and interaction guidance
docs/                      Product, architecture, and monitoring decisions
supabase/migrations/       Versioned PostgreSQL schema and security policies
```

## Development

The application requires Node.js 20.9 or newer and pnpm.

```bash
cd apps/web
pnpm install --frozen-lockfile
pnpm dev
```

Local development may use temporary fixtures and an application process, but it
must never contain the production database or become a persistence layer. Cloud
credentials belong in uncommitted environment variables. See
[`apps/web/.env.example`](apps/web/.env.example).

Run the quality checks with:

```bash
cd apps/web
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Documentation

- [Product model](docs/PRODUCT_MODEL.md)
- [Cloud architecture](docs/ARCHITECTURE.md)
- [Monitoring and completeness controls](docs/MONITORING.md)
- [Open decisions](docs/OPEN_DECISIONS.md)

## Important disclaimer

SQE Updates is an independent educational project. It is not affiliated with or
endorsed by the Solicitors Regulation Authority or the SQE assessment provider.
It does not provide legal advice and cannot replace the official SQE Assessment
Specifications or source law.

## Licence

No open-source licence has yet been selected. Until one is added, copyright law
applies by default. The code and original editorial content may ultimately need
different licences; this is recorded as an open decision.
