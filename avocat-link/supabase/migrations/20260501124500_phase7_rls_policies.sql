alter table public.avocats enable row level security;
alter table public.consultations enable row level security;

drop policy if exists "Authenticated users can read avocats" on public.avocats;
create policy "Authenticated users can read avocats"
  on public.avocats
  for select
  to authenticated
  using (true);

drop policy if exists "Clients can read own consultations" on public.consultations;
create policy "Clients can read own consultations"
  on public.consultations
  for select
  to authenticated
  using (auth.uid() = client_id);

drop policy if exists "Clients can create own consultations" on public.consultations;
create policy "Clients can create own consultations"
  on public.consultations
  for insert
  to authenticated
  with check (auth.uid() = client_id);

drop policy if exists "Clients can update own consultations" on public.consultations;
create policy "Clients can update own consultations"
  on public.consultations
  for update
  to authenticated
  using (auth.uid() = client_id)
  with check (auth.uid() = client_id);

drop policy if exists "Clients can delete own consultations" on public.consultations;
create policy "Clients can delete own consultations"
  on public.consultations
  for delete
  to authenticated
  using (auth.uid() = client_id);
