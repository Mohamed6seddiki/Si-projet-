create extension if not exists "pgcrypto";

alter table public.avocats
  alter column id set default gen_random_uuid(),
  alter column nom set not null,
  alter column specialite set not null,
  alter column created_at set default now(),
  alter column created_at set not null;

alter table public.consultations
  alter column id set default gen_random_uuid(),
  alter column client_id set not null,
  alter column avocat_id set not null,
  alter column date_consultation set not null,
  alter column status set default 'pending',
  alter column status set not null,
  alter column fichier_url set not null,
  alter column created_at set default now(),
  alter column created_at set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.avocats'::regclass
      and contype = 'p'
  ) then
    alter table public.avocats
      add constraint avocats_pkey primary key (id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.consultations'::regclass
      and contype = 'p'
  ) then
    alter table public.consultations
      add constraint consultations_pkey primary key (id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.consultations'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%status%'
      and pg_get_constraintdef(oid) ilike '%pending%'
      and pg_get_constraintdef(oid) ilike '%accepted%'
      and pg_get_constraintdef(oid) ilike '%completed%'
  ) then
    alter table public.consultations
      add constraint consultations_status_check
      check (status in ('pending', 'accepted', 'completed'));
  end if;
end
$$;
