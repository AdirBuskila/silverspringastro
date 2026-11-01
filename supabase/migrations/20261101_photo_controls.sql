-- Photo controls for the admin page. Safe to run more than once.
--
-- 1. Only listed admins may change anything. Previously any signed-in user could,
--    and sign-ups are open, so a stranger could have registered and edited the site.
-- 2. photo_settings lets the admin hide/show and star any photo, including the ones
--    built into the site's code.
-- 3. Creates the storage bucket for uploads.
--
-- This repo is public, so admin email addresses are NOT stored here. After running
-- this file, add them once in the SQL editor:
--   insert into public.site_admins (email) values ('someone@example.com');

-- ── Admins ──────────────────────────────────────────────────────────────────
create table if not exists public.site_admins (
  email text primary key
);
-- RLS on with no policies: the list is reachable only through is_site_admin().
alter table public.site_admins enable row level security;

create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.site_admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_site_admin() from public;
grant execute on function public.is_site_admin() to anon, authenticated;

-- ── Per-photo settings ──────────────────────────────────────────────────────
-- photo_id matches the id the site uses: the built-in id, or 'db-<uuid>' for uploads.
-- featured: null = keep the photo's default, true/false = the admin's choice.
create table if not exists public.photo_settings (
  photo_id text primary key,
  hidden boolean not null default false,
  featured boolean
);
alter table public.photo_settings enable row level security;

drop policy if exists "Public read access for photo_settings" on public.photo_settings;
create policy "Public read access for photo_settings"
  on public.photo_settings for select
  using (true);

drop policy if exists "Admins can write photo_settings" on public.photo_settings;
create policy "Admins can write photo_settings"
  on public.photo_settings for all
  to authenticated
  using (public.is_site_admin())
  with check (public.is_site_admin());

-- ── Replace "any signed-in user" write policies with admin-only ones ────────
do $$
declare
  t text;
  verb text;
begin
  foreach t in array array['images', 'travel_photos', 'equipment'] loop
    foreach verb in array array['insert', 'update', 'delete'] loop
      execute format('drop policy if exists %I on public.%I',
        'Authenticated users can ' || verb || ' ' || t, t);
    end loop;
    execute format('drop policy if exists %I on public.%I', 'Admins can write ' || t, t);
    execute format(
      'create policy %I on public.%I for all to authenticated
         using (public.is_site_admin()) with check (public.is_site_admin())',
      'Admins can write ' || t, t);
  end loop;
end $$;

-- Old family photos often have only a year ("1971"), which a DATE column can't hold.
alter table public.travel_photos alter column date type text using date::text;

-- ── Storage bucket for uploads ──────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('images', 'images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Names from the old manual setup guide, in case they were created by hand.
drop policy if exists "Public Read" on storage.objects;
drop policy if exists "Auth Upload" on storage.objects;
drop policy if exists "Auth Delete" on storage.objects;

drop policy if exists "Public read of site images" on storage.objects;
create policy "Public read of site images"
  on storage.objects for select
  using (bucket_id = 'images');

drop policy if exists "Admins can upload site images" on storage.objects;
create policy "Admins can upload site images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'images' and public.is_site_admin());

drop policy if exists "Admins can delete site images" on storage.objects;
create policy "Admins can delete site images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'images' and public.is_site_admin());
