alter table public.avocats
add column if not exists avatar_url text;

update public.avocats
set avatar_url = '/avocats/maitre-salma-idrissi.png'
where nom = 'Maitre Salma Idrissi'
  and avatar_url is null;

update public.avocats
set avatar_url = '/avocats/maitre-lina-el-mansouri.png'
where nom = 'Maitre Lina El Mansouri'
  and avatar_url is null;
