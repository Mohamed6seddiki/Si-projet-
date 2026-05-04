create table if not exists public.clients (
  id uuid primary key references auth.users(id) on delete cascade,
  nom text not null,
  created_at timestamptz not null default now()
);

alter table public.clients enable row level security;

drop policy if exists "Clients can read own profile" on public.clients;
create policy "Clients can read own profile"
  on public.clients
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Clients can create own profile" on public.clients;
create policy "Clients can create own profile"
  on public.clients
  for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Clients can update own profile" on public.clients;
create policy "Clients can update own profile"
  on public.clients
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Lawyers can read public avocats" on public.avocats;
create policy "Lawyers can read public avocats"
  on public.avocats
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Lawyers can create own avocat profile" on public.avocats;
create policy "Lawyers can create own avocat profile"
  on public.avocats
  for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Lawyers can update own avocat profile" on public.avocats;
create policy "Lawyers can update own avocat profile"
  on public.avocats
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

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

alter table public.consultations
  drop constraint if exists consultations_client_id_fkey;

alter table public.consultations
  add constraint consultations_client_id_fkey
  foreign key (client_id) references public.clients(id) on delete cascade;

alter table public.consultations
  drop constraint if exists consultations_avocat_user_id_fkey;

alter table public.consultations
  add constraint consultations_avocat_user_id_fkey
  foreign key (avocat_user_id) references auth.users(id) on delete set null;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_role_user();
