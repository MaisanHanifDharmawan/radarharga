-- 0002_core_master.sql — profiles, cities, commodities, data_sources, businesses, business_members

-- profiles (1:1 dengan auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy profiles_self_select on public.profiles for select using (auth.uid() = id);
create policy profiles_self_upsert on public.profiles for insert with check (auth.uid() = id);
create policy profiles_self_update on public.profiles for update using (auth.uid() = id);

-- trigger auto-create profile
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table if not exists public.cities (
  id serial primary key,
  name text not null,
  province text not null,
  external_code text
);
alter table public.cities enable row level security;
-- master read-only untuk authenticated, write hanya service_role (no policy = deny)
create policy cities_select_authenticated on public.cities for select to authenticated using (true);

create table if not exists public.commodities (
  id serial primary key,
  name text not null unique,
  category text not null,
  unit text not null
);
alter table public.commodities enable row level security;
create policy commodities_select_authenticated on public.commodities for select to authenticated using (true);

create table if not exists public.data_sources (
  id serial primary key,
  name text not null,
  type text not null check (type in ('api','csv','manual')),
  base_url text,
  is_active boolean not null default true
);
alter table public.data_sources enable row level security;
create policy data_sources_select_authenticated on public.data_sources for select to authenticated using (true);

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('restaurant','reseller')),
  city_id int not null references public.cities(id),
  target_margin_pct numeric not null default 30 check (target_margin_pct >= 0 and target_margin_pct < 90),
  created_at timestamptz not null default now()
);
alter table public.businesses enable row level security;
create policy businesses_member_select on public.businesses for select using (public.is_business_member(id));
create policy businesses_insert_authenticated on public.businesses for insert to authenticated with check (true);
create policy businesses_member_update on public.businesses for update using (public.is_business_member(id));

create table if not exists public.business_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','staff')),
  unique (business_id, user_id)
);
alter table public.business_members enable row level security;
create policy bm_select_own on public.business_members for select using (user_id = auth.uid() or public.is_business_member(business_id));
create policy bm_insert_owner on public.business_members for insert to authenticated with check (true);
create policy bm_update_owner on public.business_members for update using (public.is_business_member(business_id));

create table if not exists public.business_commodities (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  commodity_id int not null references public.commodities(id) on delete cascade,
  unique (business_id, commodity_id)
);
alter table public.business_commodities enable row level security;
create policy bc_select_member on public.business_commodities for select using (public.is_business_member(business_id));
create policy bc_modify_member on public.business_commodities for all using (public.is_business_member(business_id)) with check (public.is_business_member(business_id));
