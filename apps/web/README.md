# SQE Updates web application

This directory contains the public Next.js application. The current homepage is
a foundation prototype with fictional, explicitly labelled update records; it is
not revision guidance.

## Run locally

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Local interface state is temporary. Production legal updates, monitoring data,
editorial decisions, and user state must come from managed PostgreSQL and must
never be written to the application filesystem or treated as browser-local data.

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

See the repository-level [README](../../README.md) for the full architecture and
deployment documentation.
