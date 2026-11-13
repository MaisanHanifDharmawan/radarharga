-- 0006_alerts.sql — alert_rules, alerts, notification_channels, notifications + view

create table if not exists public.alert_rules (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  rule_type text not null check (rule_type in ('price_up','price_down','competitor_cheaper','trend_spike')),
  commodity_id int references public.commodities(id),
  keyword_id uuid references public.search_keywords(id),
  threshold_pct numeric not null check (threshold_pct > 0),
  window_days int not null check (window_days > 0),
  cooldown_hours int not null default 24 check (cooldown_hours >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.alert_rules enable row level security;
create policy ar_select_member on public.alert_rules for select using (public.is_business_member(business_id));
create policy ar_modify_member on public.alert_rules for all using (public.is_business_member(business_id)) with check (public.is_business_member(business_id));

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  rule_id uuid references public.alert_rules(id) on delete set null,
  title text not null,
  message text not null,
  payload jsonb not null default '{}'::jsonb,
  severity text not null check (severity in ('info','warning','critical')),
  status text not null check (status in ('pending','sent','acknowledged','dismissed')) default 'pending',
  created_at timestamptz not null default now()
);
create index if not exists idx_alerts_business_status_created on public.alerts (business_id, status, created_at desc);
alter table public.alerts enable row level security;
create policy al_select_member on public.alerts for select using (public.is_business_member(business_id));
create policy al_modify_member on public.alerts for all using (public.is_business_member(business_id)) with check (public.is_business_member(business_id));

create table if not exists public.notification_channels (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  channel text not null check (channel in ('in_app','email','whatsapp')),
  destination text not null,
  is_active boolean not null default true
);
alter table public.notification_channels enable row level security;
create policy nc_select_member on public.notification_channels for select using (public.is_business_member(business_id));
create policy nc_modify_member on public.notification_channels for all using (public.is_business_member(business_id)) with check (public.is_business_member(business_id));

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  alert_id uuid not null references public.alerts(id) on delete cascade,
  channel_id uuid not null references public.notification_channels(id) on delete cascade,
  status text not null check (status in ('sent','failed')),
  error_message text,
  sent_at timestamptz not null default now()
);
alter table public.notifications enable row level security;
create policy n_select_member on public.notifications for select using (
  exists (select 1 from public.alerts a where a.id = alert_id and public.is_business_member(a.business_id))
);

-- helper view untuk evaluator: harga terbaru & rata-rata window
create or replace view public.v_commodity_price_stats as
select
  cp.commodity_id,
  cp.city_id,
  (select price from public.commodity_prices where commodity_id = cp.commodity_id and city_id = cp.city_id order by price_date desc limit 1) as latest_price,
  (select avg(price) from public.commodity_prices where commodity_id = cp.commodity_id and city_id = cp.city_id and price_date >= current_date - interval '7 days') as avg_7d,
  (select avg(price) from public.commodity_prices where commodity_id = cp.commodity_id and city_id = cp.city_id and price_date >= current_date - interval '30 days') as avg_30d
from (select distinct commodity_id, city_id from public.commodity_prices) cp;

-- HPP per menu (dipakai untuk hitung dampak)
create or replace function public.calc_menu_hpp(p_menu_id uuid)
returns numeric language sql stable as $$
  select coalesce(sum(mii.quantity * (
    select price from public.commodity_prices
    where commodity_id = mii.commodity_id
      and city_id = (select city_id from public.businesses where id = (select business_id from public.menu_items where id = p_menu_id))
    order by price_date desc limit 1
  )), 0)
  from public.menu_item_ingredients mii where mii.menu_item_id = p_menu_id;
$$;
