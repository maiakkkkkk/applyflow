create extension if not exists pgcrypto;

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company text not null,
  position text not null,
  status text not null check (
    status in ('saved', 'applied', 'test', 'interview', 'offer', 'rejected', 'withdrawn')
  ),
  source text not null check (
    source in ('linkedin', 'gupy', 'company', 'referral', 'other')
  ),
  job_url text,
  location text,
  work_mode text check (work_mode is null or work_mode in ('remote', 'hybrid', 'onsite')),
  employment_type text check (
    employment_type is null or employment_type in ('clt', 'pj', 'internship', 'trainee', 'contract', 'other')
  ),
  salary_min numeric,
  salary_max numeric,
  salary_currency text check (salary_currency is null or salary_currency in ('BRL', 'USD')),
  applied_at date,
  next_action_at date,
  notes text,
  technologies text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index applications_user_id_idx
  on public.applications (user_id);

create index applications_user_updated_at_idx
  on public.applications (user_id, updated_at desc);

alter table public.applications enable row level security;

create policy "Authenticated users can read their applications"
  on public.applications
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Authenticated users can create their applications"
  on public.applications
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Authenticated users can update their applications"
  on public.applications
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Authenticated users can delete their applications"
  on public.applications
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.applications from public, anon;
grant select, insert, update, delete on table public.applications to authenticated;
