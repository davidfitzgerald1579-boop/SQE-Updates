# Cloud deployment

This document describes the intended production setup. Creating provider
accounts, projects, domains, or paid resources remains an owner action.

## 1. Supabase

1. Create separate preview and production projects in a suitable UK or European
   region.
2. Apply the migrations under `supabase/migrations` using the Supabase CLI or a
   connected deployment workflow.
3. Create a private Storage bucket for immutable source artifacts.
4. Keep the service-role key and database credentials server-side. They must not
   use a `NEXT_PUBLIC_` prefix.
5. Give the web application only the project URL and browser-safe publishable
   key. PostgreSQL row-level security remains the enforcement boundary.

The initial migration deliberately gives browser roles read access only to
published material. Monitor configuration, raw artifacts, review notes, and audit
events live in the unexposed `private` schema.

## 2. Vercel

1. Import the GitHub repository and set the project root to `apps/web`.
2. use the detected Next.js framework preset and the repository's pnpm lockfile.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for the appropriate environment.
4. Add server-only credentials only when a server route actually needs them.
5. Enable preview deployments, but connect them only to synthetic preview data.

Vercel's filesystem is treated as ephemeral. No monitor cursor, update, review,
bookmark, or user record may be persisted there.

## 3. Collection and monitoring

Primary collectors will run as Supabase Edge Functions invoked by Supabase Cron.
Each invocation must insert a monitor heartbeat before returning. A separate
GitHub Actions reconciliation workflow should compare expected and observed
coverage only after the first source inventory and alert destination are agreed.

## 4. Release gate

A production release requires:

- lint, type-check, unit tests, and the production build to pass;
- migration review and a preview-environment migration run;
- row-level security checks using anonymous and authenticated test clients;
- source and monitoring health checks;
- accessibility and responsive-interface review; and
- confirmation that only reviewed, source-backed records are public.

## 5. Rollback and correction

Application releases can be rolled back through Vercel. Database migrations must
be forward-corrected unless a tested rollback is explicitly prepared. Published
legal records are corrected through an appended correction entry; they are never
silently rewritten.
