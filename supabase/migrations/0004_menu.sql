-- 0004_menu.sql
create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  selling_price numeric not null check (selling_price >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.menu_items enable row level security;
create policy mi_select_member on public.menu_items for select using (public.is_business_member(business_id));
create policy mi_modify_member on public.menu_items for all using (public.is_business_member(business_id)) with check (public.is_business_member(business_id));

create table if not exists public.menu_item_ingredients (
  id uuid primary key default gen_random_uuid(),
  menu_item_id uuid not null references public.menu_items(id) on delete cascade,
  commodity_id int not null references public.commodities(id),
  quantity numeric not null check (quantity > 0)
);
alter table public.menu_item_ingredients enable row level security;
-- akses via kepemilikan menu
create policy mii_select_member on public.menu_item_ingredients for select using (
  exists (select 1 from public.menu_items mi where mi.id = menu_item_id and public.is_business_member(mi.business_id))
);
create policy mii_modify_member on public.menu_item_ingredients for all using (
  exists (select 1 from public.menu_items mi where mi.id = menu_item_id and public.is_business_member(mi.business_id))
) with check (
  exists (select 1 from public.menu_items mi where mi.id = menu_item_id and public.is_business_member(mi.business_id))
);
