create table if not exists public.lawyer_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nom text not null,
  specialite text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.lawyer_profiles enable row level security;

drop policy if exists "Lawyers read own profile" on public.lawyer_profiles;
create policy "Lawyers read own profile"
  on public.lawyer_profiles
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Lawyers update own profile" on public.lawyer_profiles;
create policy "Lawyers update own profile"
  on public.lawyer_profiles
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Lawyers insert own profile" on public.lawyer_profiles;
create policy "Lawyers insert own profile"
  on public.lawyer_profiles
  for insert
  to authenticated
  with check (auth.uid() = user_id);

alter table public.consultations
  add column if not exists avocat_user_id uuid references auth.users(id);

create index if not exists consultations_avocat_user_id_idx
  on public.consultations (avocat_user_id);

drop policy if exists "Lawyers can read assigned consultations" on public.consultations;
create policy "Lawyers can read assigned consultations"
  on public.consultations
  for select
  to authenticated
  using (auth.uid() = avocat_user_id);

drop policy if exists "Lawyers can update assigned consultations" on public.consultations;
create policy "Lawyers can update assigned consultations"
  on public.consultations
  for update
  to authenticated
  using (auth.uid() = avocat_user_id)
  with check (auth.uid() = avocat_user_id);
