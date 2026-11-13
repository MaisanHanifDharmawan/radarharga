-- 0001_extensions_and_helpers.sql
-- Extensions & helper is_business_member

create extension if not exists "pgcrypto";

-- helper untuk RLS: cek apakah auth.uid() anggota business
create or replace function public.is_business_member(bid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.business_members
    where business_id = bid and user_id = auth.uid()
  );
$$;

-- helper: business ids milik user saat ini
create or replace function public.my_business_ids()
returns setof uuid
language sql
security definer
set search_path = public
as $$
  select business_id from public.business_members where user_id = auth.uid();
$$;
