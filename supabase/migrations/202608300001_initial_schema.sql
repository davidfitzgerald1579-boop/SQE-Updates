-- SQE Updates: cloud-first domain schema
-- Production data belongs in managed PostgreSQL and object storage, never in
-- repository fixtures, a serverless filesystem, SQLite, or browser storage.

create extension if not exists pgcrypto;

create schema if not exists private;
revoke all on schema private from public;
revoke all on schema private from anon, authenticated;

create type public.assessment_stage as enum ('sqe1', 'sqe2');
create type public.source_tier as enum (
  'primary',
  'authoritative_secondary',
  'discovery_only'
);
create type public.acquisition_method as enum (
  'rss',
  'atom',
  'api',
  'html',
  'sitemap',
  'email',
  'manual'
);
create type public.monitor_run_status as enum (
  'running',
  'success',
  'no_change',
  'partial',
  'failed'
);
create type public.legal_status as enum (
  'proposed',
  'enacted_not_in_force',
  'in_force',
  'reversed',
  'superseded',
  'withdrawn'
);
create type public.publication_status as enum (
  'candidate',
  'in_review',
  'approved',
  'published',
  'rejected'
);
create type public.impact_kind as enum (
  'direct',
  'consequential',
  'contextual',
  'not_affected'
);
create type public.applicability_status as enum (
  'included',
  'after_cutoff',
  'uncertain',
  'not_in_scope'
);
create type public.review_decision as enum (
  'approved',
  'changes_requested',
  'rejected'
);

create table public.assessment_specifications (
  id uuid primary key default gen_random_uuid(),
  stage public.assessment_stage not null,
  label text not null,
  version text not null,
  valid_from date not null,
  valid_to date,
  source_url text not null,
  source_hash text,
  verified_at timestamptz not null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (stage, version),
  check (valid_to is null or valid_to >= valid_from),
  check (source_url ~ '^https://')
);

create table public.assessment_sittings (
  id uuid primary key default gen_random_uuid(),
  stage public.assessment_stage not null,
  slug text not null unique,
  label text not null,
  first_assessment_date date not null,
  last_assessment_date date,
  cutoff_date date not null,
  specification_id uuid not null
    references public.assessment_specifications (id),
  official_dates_url text not null,
  verified_at timestamptz not null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (cutoff_date <= first_assessment_date),
  check (
    last_assessment_date is null
    or last_assessment_date >= first_assessment_date
  ),
  check (official_dates_url ~ '^https://')
);

create table public.syllabus_nodes (
  id uuid primary key default gen_random_uuid(),
  specification_id uuid not null
    references public.assessment_specifications (id) on delete cascade,
  parent_id uuid references public.syllabus_nodes (id),
  stage public.assessment_stage not null,
  code text not null,
  label text not null,
  node_kind text not null
    check (node_kind in ('area', 'topic', 'subtopic', 'skill', 'context')),
  description text,
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (specification_id, code)
);

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  publisher text not null,
  jurisdiction text not null default 'England and Wales',
  tier public.source_tier not null,
  source_kind text not null,
  canonical_url text not null unique,
  description text,
  is_public boolean not null default false,
  verified_at timestamptz not null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (canonical_url ~ '^https://')
);

create table public.source_syllabus_coverage (
  source_id uuid not null references public.sources (id) on delete cascade,
  syllabus_node_id uuid not null
    references public.syllabus_nodes (id) on delete cascade,
  coverage_role text not null
    check (coverage_role in ('direct', 'watch', 'supporting')),
  public_explanation text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (source_id, syllabus_node_id)
);

create table private.source_monitors (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null unique
    references public.sources (id) on delete cascade,
  acquisition_method public.acquisition_method not null,
  endpoint_url text not null,
  schedule_expression text not null,
  expected_interval interval not null,
  parser_key text not null,
  cursor jsonb not null default '{}'::jsonb,
  enabled boolean not null default true,
  lease_until timestamptz,
  last_attempt_at timestamptz,
  last_success_at timestamptz,
  consecutive_failures integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (endpoint_url ~ '^https://'),
  check (expected_interval > interval '0 seconds'),
  check (consecutive_failures >= 0)
);

create table private.monitor_runs (
  id uuid primary key default gen_random_uuid(),
  source_monitor_id uuid not null
    references private.source_monitors (id) on delete cascade,
  run_key text not null unique,
  status public.monitor_run_status not null default 'running',
  scheduled_for timestamptz,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  observed_item_count integer,
  new_artifact_count integer,
  http_status integer,
  cursor_before jsonb,
  cursor_after jsonb,
  error_code text,
  error_summary text,
  created_at timestamptz not null default now(),
  check (observed_item_count is null or observed_item_count >= 0),
  check (new_artifact_count is null or new_artifact_count >= 0),
  check (finished_at is null or finished_at >= started_at)
);

create table private.source_artifacts (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.sources (id),
  monitor_run_id uuid references private.monitor_runs (id),
  original_url text not null,
  storage_bucket text not null,
  storage_path text not null,
  content_type text,
  content_hash text not null,
  size_bytes bigint,
  source_published_at timestamptz,
  fetched_at timestamptz not null default now(),
  response_metadata jsonb not null default '{}'::jsonb,
  unique (source_id, content_hash),
  unique (storage_bucket, storage_path),
  check (original_url ~ '^https://'),
  check (size_bytes is null or size_bytes >= 0)
);

create table public.legal_change_sets (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  source_published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.legal_updates (
  id uuid primary key default gen_random_uuid(),
  change_set_id uuid references public.legal_change_sets (id),
  slug text not null unique,
  title text not null,
  plain_english_summary text not null,
  previous_rule text,
  changed_rule text not null,
  practical_effect text not null,
  jurisdiction text not null default 'England and Wales',
  announcement_date date,
  effective_from date,
  effective_to date,
  effective_date_basis text,
  transitional_note text,
  commencement_uncertain boolean not null default false,
  legal_status public.legal_status not null,
  publication_status public.publication_status not null default 'candidate',
  editorial_version integer not null default 1,
  last_verified_at timestamptz,
  approved_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (effective_to is null or effective_from is not null),
  check (
    effective_to is null
    or effective_from is null
    or effective_to >= effective_from
  ),
  check (editorial_version > 0),
  check (
    publication_status <> 'published'
    or (
      published_at is not null
      and approved_at is not null
      and last_verified_at is not null
    )
  )
);

create table public.update_sources (
  update_id uuid not null
    references public.legal_updates (id) on delete cascade,
  source_id uuid not null references public.sources (id),
  source_role text not null
    check (source_role in ('authority', 'commencement', 'scope', 'corroboration')),
  citation_label text not null,
  pinpoint text,
  source_url text not null,
  is_primary_authority boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (update_id, source_id, source_role),
  check (source_url ~ '^https://')
);

create table public.update_impacts (
  id uuid primary key default gen_random_uuid(),
  update_id uuid not null
    references public.legal_updates (id) on delete cascade,
  syllabus_node_id uuid not null references public.syllabus_nodes (id),
  kind public.impact_kind not null,
  rationale text not null,
  confirmed_at timestamptz,
  published_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (update_id, syllabus_node_id, kind),
  check (published_at is null or confirmed_at is not null)
);

create table public.update_sitting_applicability (
  id uuid primary key default gen_random_uuid(),
  update_id uuid not null
    references public.legal_updates (id) on delete cascade,
  sitting_id uuid not null
    references public.assessment_sittings (id) on delete cascade,
  provisional_status public.applicability_status not null,
  final_status public.applicability_status not null,
  effective_date_used date,
  cutoff_date_snapshot date not null,
  rationale text not null,
  is_editorial_override boolean not null default false,
  decided_at timestamptz not null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (update_id, sitting_id),
  check (published_at is null or final_status <> 'uncertain')
);

create table private.reviews (
  id uuid primary key default gen_random_uuid(),
  update_id uuid not null
    references public.legal_updates (id) on delete cascade,
  reviewer_id uuid references auth.users (id) on delete set null,
  review_scope text not null
    check (review_scope in ('authority', 'effective_date', 'impact', 'publication')),
  decision public.review_decision not null,
  notes text not null,
  created_at timestamptz not null default now()
);

create table public.corrections (
  id uuid primary key default gen_random_uuid(),
  update_id uuid not null
    references public.legal_updates (id) on delete cascade,
  summary text not null,
  reason text not null,
  corrected_at timestamptz not null,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.user_update_state (
  user_id uuid not null references auth.users (id) on delete cascade,
  update_id uuid not null
    references public.legal_updates (id) on delete cascade,
  is_read boolean not null default false,
  is_bookmarked boolean not null default false,
  notifications_enabled boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, update_id)
);

create table private.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users (id) on delete set null,
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index assessment_sittings_stage_cutoff_idx
  on public.assessment_sittings (stage, cutoff_date desc);
create index syllabus_nodes_parent_idx
  on public.syllabus_nodes (parent_id, sort_order);
create index monitor_runs_source_started_idx
  on private.monitor_runs (source_monitor_id, started_at desc);
create index source_artifacts_fetched_idx
  on private.source_artifacts (source_id, fetched_at desc);
create index legal_updates_publication_idx
  on public.legal_updates (publication_status, published_at desc);
create index legal_updates_effective_idx
  on public.legal_updates (effective_from, effective_to);
create index update_impacts_update_order_idx
  on public.update_impacts (update_id, sort_order);
create index applicability_sitting_status_idx
  on public.update_sitting_applicability (sitting_id, final_status);
create index corrections_update_idx
  on public.corrections (update_id, corrected_at desc);

create function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger assessment_specifications_set_updated_at
before update on public.assessment_specifications
for each row execute function private.set_updated_at();
create trigger assessment_sittings_set_updated_at
before update on public.assessment_sittings
for each row execute function private.set_updated_at();
create trigger syllabus_nodes_set_updated_at
before update on public.syllabus_nodes
for each row execute function private.set_updated_at();
create trigger sources_set_updated_at
before update on public.sources
for each row execute function private.set_updated_at();
create trigger source_monitors_set_updated_at
before update on private.source_monitors
for each row execute function private.set_updated_at();
create trigger legal_change_sets_set_updated_at
before update on public.legal_change_sets
for each row execute function private.set_updated_at();
create trigger legal_updates_set_updated_at
before update on public.legal_updates
for each row execute function private.set_updated_at();
create trigger update_impacts_set_updated_at
before update on public.update_impacts
for each row execute function private.set_updated_at();
create trigger update_sitting_applicability_set_updated_at
before update on public.update_sitting_applicability
for each row execute function private.set_updated_at();
create trigger user_update_state_set_updated_at
before update on public.user_update_state
for each row execute function private.set_updated_at();

-- Row-level security is deny-by-default. Ingestion and editorial writes use a
-- server-side service role; browsers never receive that credential.
alter table public.assessment_specifications enable row level security;
alter table public.assessment_sittings enable row level security;
alter table public.syllabus_nodes enable row level security;
alter table public.sources enable row level security;
alter table public.source_syllabus_coverage enable row level security;
alter table public.legal_change_sets enable row level security;
alter table public.legal_updates enable row level security;
alter table public.update_sources enable row level security;
alter table public.update_impacts enable row level security;
alter table public.update_sitting_applicability enable row level security;
alter table public.corrections enable row level security;
alter table public.user_update_state enable row level security;
alter table private.source_monitors enable row level security;
alter table private.monitor_runs enable row level security;
alter table private.source_artifacts enable row level security;
alter table private.reviews enable row level security;
alter table private.audit_events enable row level security;

create policy "Published specifications are public"
on public.assessment_specifications
for select
to anon, authenticated
using (published_at is not null and published_at <= now());

create policy "Published sittings are public"
on public.assessment_sittings
for select
to anon, authenticated
using (published_at is not null and published_at <= now());

create policy "Published syllabus nodes are public"
on public.syllabus_nodes
for select
to anon, authenticated
using (published_at is not null and published_at <= now());

create policy "Published sources are public"
on public.sources
for select
to anon, authenticated
using (
  is_public
  and published_at is not null
  and published_at <= now()
);

create policy "Published source coverage is public"
on public.source_syllabus_coverage
for select
to anon, authenticated
using (
  is_public
  and exists (
    select 1
    from public.sources
    where sources.id = source_syllabus_coverage.source_id
      and sources.is_public
      and sources.published_at is not null
      and sources.published_at <= now()
  )
  and exists (
    select 1
    from public.syllabus_nodes
    where syllabus_nodes.id = source_syllabus_coverage.syllabus_node_id
      and syllabus_nodes.published_at is not null
      and syllabus_nodes.published_at <= now()
  )
);

create policy "Published updates are public"
on public.legal_updates
for select
to anon, authenticated
using (
  publication_status = 'published'
  and published_at is not null
  and published_at <= now()
);

create policy "Change sets with published updates are public"
on public.legal_change_sets
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.legal_updates
    where legal_updates.change_set_id = legal_change_sets.id
      and legal_updates.publication_status = 'published'
      and legal_updates.published_at is not null
      and legal_updates.published_at <= now()
  )
);

create policy "Published update citations are public"
on public.update_sources
for select
to anon, authenticated
using (
  published_at is not null
  and published_at <= now()
  and exists (
    select 1
    from public.legal_updates
    where legal_updates.id = update_sources.update_id
      and legal_updates.publication_status = 'published'
      and legal_updates.published_at is not null
      and legal_updates.published_at <= now()
  )
  and exists (
    select 1
    from public.sources
    where sources.id = update_sources.source_id
      and sources.is_public
      and sources.published_at is not null
      and sources.published_at <= now()
  )
);

create policy "Confirmed published impacts are public"
on public.update_impacts
for select
to anon, authenticated
using (
  confirmed_at is not null
  and published_at is not null
  and published_at <= now()
  and exists (
    select 1
    from public.legal_updates
    where legal_updates.id = update_impacts.update_id
      and legal_updates.publication_status = 'published'
      and legal_updates.published_at is not null
      and legal_updates.published_at <= now()
  )
  and exists (
    select 1
    from public.syllabus_nodes
    where syllabus_nodes.id = update_impacts.syllabus_node_id
      and syllabus_nodes.published_at is not null
      and syllabus_nodes.published_at <= now()
  )
);

create policy "Decided published applicability is public"
on public.update_sitting_applicability
for select
to anon, authenticated
using (
  final_status <> 'uncertain'
  and published_at is not null
  and published_at <= now()
  and exists (
    select 1
    from public.legal_updates
    where legal_updates.id = update_sitting_applicability.update_id
      and legal_updates.publication_status = 'published'
      and legal_updates.published_at is not null
      and legal_updates.published_at <= now()
  )
  and exists (
    select 1
    from public.assessment_sittings
    where assessment_sittings.id = update_sitting_applicability.sitting_id
      and assessment_sittings.published_at is not null
      and assessment_sittings.published_at <= now()
  )
);

create policy "Published corrections are public"
on public.corrections
for select
to anon, authenticated
using (
  published_at is not null
  and published_at <= now()
  and exists (
    select 1
    from public.legal_updates
    where legal_updates.id = corrections.update_id
      and legal_updates.publication_status = 'published'
      and legal_updates.published_at is not null
      and legal_updates.published_at <= now()
  )
);

create policy "Users can read their own update state"
on public.user_update_state
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own update state"
on public.user_update_state
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.legal_updates
    where legal_updates.id = user_update_state.update_id
      and legal_updates.publication_status = 'published'
      and legal_updates.published_at is not null
      and legal_updates.published_at <= now()
  )
);

create policy "Users can update their own update state"
on public.user_update_state
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own update state"
on public.user_update_state
for delete
to authenticated
using ((select auth.uid()) = user_id);

revoke all on all tables in schema public from anon, authenticated;
grant select on table
  public.assessment_specifications,
  public.assessment_sittings,
  public.syllabus_nodes,
  public.sources,
  public.source_syllabus_coverage,
  public.legal_change_sets,
  public.legal_updates,
  public.update_sources,
  public.update_impacts,
  public.update_sitting_applicability,
  public.corrections
to anon, authenticated;

grant select, insert, update, delete
on table public.user_update_state
to authenticated;

revoke all on all tables in schema private from anon, authenticated;
revoke all on all functions in schema private from anon, authenticated;

grant usage on schema private to service_role;
grant all on all tables in schema private to service_role;
grant execute on all functions in schema private to service_role;
grant all on all tables in schema public to service_role;

alter default privileges in schema private
revoke all on tables from anon, authenticated;
alter default privileges in schema private
revoke all on functions from anon, authenticated;
alter default privileges in schema private
grant all on tables to service_role;
alter default privileges in schema private
grant execute on functions to service_role;

comment on schema private is
  'Operational, raw-source, review and audit data. Never exposed to browsers.';
comment on table public.update_impacts is
  'Human-confirmed direct, consequential, contextual and not-affected syllabus mappings.';
comment on table public.update_sitting_applicability is
  'Cutoff decisions pinned to the sitting cutoff date used when reviewed.';
