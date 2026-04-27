create extension if not exists "pgcrypto";

create table if not exists public.avocats (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  specialite text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users(id) on delete cascade,
  avocat_id uuid not null references public.avocats(id) on delete restrict,
  date_consultation timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'completed')),
  fichier_url text not null,
  created_at timestamptz not null default now()
);

create index if not exists consultations_client_id_idx on public.consultations (client_id);
create index if not exists consultations_avocat_id_idx on public.consultations (avocat_id);
create index if not exists consultations_date_idx on public.consultations (date_consultation);

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

insert into public.avocats (nom, specialite)
values
  ('Maitre Salma Idrissi', 'Droit des affaires'),
  ('Maitre Youssef Bennani', 'Droit de la famille'),
  ('Maitre Lina El Mansouri', 'Droit immobilier'),
  ('Maitre Karim Chraibi', 'Droit du travail')
on conflict do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'consultation-documents',
  'consultation-documents',
  false,
  10485760,
  array['application/pdf']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users upload own consultation PDFs" on storage.objects;
create policy "Users upload own consultation PDFs"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'consultation-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users read own consultation PDFs" on storage.objects;
create policy "Users read own consultation PDFs"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'consultation-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users update own consultation PDFs" on storage.objects;
create policy "Users update own consultation PDFs"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'consultation-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'consultation-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users delete own consultation PDFs" on storage.objects;
create policy "Users delete own consultation PDFs"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'consultation-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
