-- 0005_competitors.sql
create table if not exists public.competitors (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  note text
);
alter table public.competitors enable row level security;
create policy comp_select_member on public.competitors for select using (public.is_business_member(business_id));
create policy comp_modify_member on public.competitors for all using (public.is_business_member(business_id)) with check (public.is_business_member(business_id));

create table if not exists public.competitor_prices (
  id uuid primary key default gen_random_uuid(),
  competitor_id uuid not null references public.competitors(id) on delete cascade,
  item_name text not null,
  price numeric not null check (price >= 0),
  observed_at date not null
);
alter table public.competitor_prices enable row level security;
create policy cp2_select_member on public.competitor_prices for select using (
  exists (select 1 from public.competitors c where c.id = competitor_id and public.is_business_member(c.business_id))
);
create policy cp2_modify_member on public.competitor_prices for all using (
  exists (select 1 from public.competitors c where c.id = competitor_id and public.is_business_member(c.business_id))
) with check (
  exists (select 1 from public.competitors c where c.id = competitor_id and public.is_business_member(c.business_id))
);
