# Cloud architecture

## Decision

The initial implementation uses:

- **Next.js and TypeScript** for the public application and editorial interface;
- **Vercel** for managed web deployment and preview environments;
- **Supabase PostgreSQL** as the canonical data store;
- **Supabase Auth** for editorial and optional user accounts;
- **Supabase Storage** for immutable raw-source snapshots;
- **Supabase Edge Functions and Cron** for primary collection jobs; and
- **GitHub Actions** for CI and an independent scheduled reconciliation check.

The database schema is kept close to standard PostgreSQL. Provider-specific code
belongs behind small adapters so a future migration does not require rewriting the
domain model.

## Why GitHub Actions is not the primary scheduler

GitHub's own documentation states that scheduled workflows can be delayed under
high load and that sufficiently busy periods can result in dropped jobs. It also
automatically disables scheduled workflows in inactive public repositories. CI is
therefore useful as an independent check, not as the sole legal-update collector.

## Data flow

```text
Source registry
  -> scheduled monitor invocation
  -> fetch official source
  -> store immutable raw artifact in cloud object storage
  -> record content hash and monitor heartbeat in PostgreSQL
  -> deduplicate and create candidate update
  -> editorial legal-status and SQE relevance review
  -> impact mapping and sitting applicability
  -> publication through row-level-secured database reads
  -> public Next.js Server Components
```

## Persistence boundary

The following are cloud-only production records:

- source registry and coverage assignments;
- monitoring cursors and run history;
- downloaded source artifacts and hashes;
- candidate and published updates;
- impact mappings and applicability decisions;
- reviews and correction history;
- user reading state, bookmarks, and subscriptions; and
- security and operational audit events.

The application must not write these records to the Vercel filesystem. Serverless
filesystems are treated as ephemeral. Browser memory may hold temporary interface
state, but browser storage is not a source of truth. Offline legal-content caching
will not be enabled until the product can display snapshot and freshness metadata
unambiguously.

## Security model

- Public users can select only published records and confirmed public impacts.
- Candidate updates, source artifacts, monitor errors, and review notes remain
  private by default.
- Database row-level security is enabled on every exposed table.
- Only server-side service credentials can ingest source material.
- Editorial actions require an authenticated editor role and are audit logged.
- No secret uses a `NEXT_PUBLIC_` prefix.
- Secrets are stored in Supabase Vault, Vercel environment variables, or GitHub
  Actions secrets as appropriate and are never committed.
- Public pull requests must not receive production secrets.

## Reliability controls

- Every monitor run writes a success, no-change, or failure heartbeat.
- Source parsers use content hashes and idempotency keys.
- A failed run never advances its source cursor.
- Jobs use leases to prevent overlapping processing.
- Unexpected zero-item results and stale sources produce alerts.
- Raw artifacts are retained so classification can be replayed.
- Reconciliation jobs compare intake records against broad official inventories.
- Cutoff snapshots are immutable once formally closed, with corrections appended
  rather than silently rewriting history.

## Environments

The intended environments are:

- **Preview:** isolated cloud project or branch database with synthetic data only.
- **Production:** managed database and storage containing reviewed records.

There is deliberately no downloadable production database. Contributors may use
synthetic fixtures or their own disposable cloud project for development.

## Region and personal data

The project should select a UK or suitable European cloud region before collecting
personal data. Public browsing should work without an account. If bookmarks and
notifications are introduced, the service should collect the minimum required
account data and document retention and deletion behavior.
