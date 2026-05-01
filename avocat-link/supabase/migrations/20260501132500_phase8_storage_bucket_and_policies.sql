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
    and (storage.foldername(name))[2] = 'consultations'
    and lower(name) like '%.pdf'
  );

drop policy if exists "Users read own consultation PDFs" on storage.objects;
create policy "Users read own consultation PDFs"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'consultation-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
    and (storage.foldername(name))[2] = 'consultations'
  );

drop policy if exists "Users update own consultation PDFs" on storage.objects;
create policy "Users update own consultation PDFs"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'consultation-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
    and (storage.foldername(name))[2] = 'consultations'
  )
  with check (
    bucket_id = 'consultation-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
    and (storage.foldername(name))[2] = 'consultations'
    and lower(name) like '%.pdf'
  );

drop policy if exists "Users delete own consultation PDFs" on storage.objects;
create policy "Users delete own consultation PDFs"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'consultation-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
    and (storage.foldername(name))[2] = 'consultations'
  );
