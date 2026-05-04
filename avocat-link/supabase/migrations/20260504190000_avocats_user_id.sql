alter table public.avocats
  add column if not exists user_id uuid references auth.users(id);

create unique index if not exists avocats_user_id_idx
  on public.avocats (user_id);

drop policy if exists "Lawyers can update own avocat profile" on public.avocats;
create policy "Lawyers can update own avocat profile"
  on public.avocats
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Lawyers can read own avocat profile" on public.avocats;
create policy "Lawyers can read own avocat profile"
  on public.avocats
  for select
  to authenticated
  using (auth.uid() = user_id);

update public.avocats
set user_id = id
where user_id is null
  and exists (
    select 1
    from auth.users u
    where u.id = avocats.id
  );

create or replace function public.handle_new_role_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  new_role text := coalesce(new.raw_user_meta_data ->> 'role', 'client');
  new_name text := coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(coalesce(new.email, ''), '@', 1));
begin
  if new_role in ('avocat', 'lawyer') then
    insert into public.avocats (id, user_id, nom, specialite)
    values (new.id, new.id, new_name, 'Spécialité à compléter')
    on conflict (id) do update
      set user_id = excluded.user_id;
  else
    insert into public.clients (id, nom)
    values (new.id, new_name)
    on conflict (id) do nothing;
  end if;

  return new;
end;
$$;
drop policy if exists "Lawyers can create own avocat profile" on public.avocats;
create policy "Lawyers can create own avocat profile"
  on public.avocats
  for insert
  to authenticated
  with check (auth.uid() = user_id);
