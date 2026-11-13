-- 0008_rls_and_views.sql — RLS ketat + view publik (AGENTS.md v2 §11 & §10.2)

-- ============================================================
-- Helper: pastikan RLS aktif di semua tabel public
-- ============================================================
alter table public.cities enable row level security;
alter table public.commodities enable row level security;
alter table public.data_sources enable row level security;
alter table public.commodity_prices enable row level security;
alter table public.ingestion_logs enable row level security;
alter table public.search_keywords enable row level security;
alter table public.search_trends enable row level security;
alter table public.competitors enable row level security;
alter table public.competitor_prices enable row level security;
alter table public.alert_rules enable row level security;
alter table public.alerts enable row level security;
alter table public.calculator_templates enable row level security;
alter table public.calculator_template_items enable row level security;
alter table public.subscribers enable row level security;
alter table public.subscriptions enable row level security;
alter table public.notifications enable row level security;
alter table public.admin_users enable row level security;
alter table public.profiles enable row level security;

-- ============================================================
-- Drop legacy policies (dari 0002-0006) agar tidak duplikat
-- ============================================================
do $$ declare r record; begin
  for r in (
    select polname, polrelid::regclass as tbl from pg_policy
    where polrelid in (
      'public.cities'::regclass,'public.commodities'::regclass,'public.data_sources'::regclass,
      'public.commodity_prices'::regclass,'public.ingestion_logs'::regclass,
      'public.profiles'::regclass,'public.admin_users'::regclass
    )
  ) loop
    execute format('drop policy if exists %I on %s', r.polname, r.tbl);
  end loop;
end $$;

-- Drop kebijakan sisa di tabel yang baru (jika ada duplikat dari create sebelumnya)
drop policy if exists cities_select_public on public.cities;
drop policy if exists cities_select_anon on public.cities;
drop policy if exists cities_admin_write on public.cities;
drop policy if exists commodities_select_public on public.commodities;
drop policy if exists commodities_admin_write on public.commodities;
drop policy if exists commodity_prices_select_public on public.commodity_prices;
drop policy if exists commodity_prices_admin_write on public.commodity_prices;
drop policy if exists search_keywords_select_public on public.search_keywords;
drop policy if exists search_keywords_admin_write on public.search_keywords;
drop policy if exists search_trends_select_public on public.search_trends;
drop policy if exists search_trends_admin_write on public.search_trends;
drop policy if exists calc_templates_select_public on public.calculator_templates;
drop policy if exists calc_templates_admin_write on public.calculator_templates;
drop policy if exists calc_items_select_public on public.calculator_template_items;
drop policy if exists calc_items_admin_write on public.calculator_template_items;
drop policy if exists alerts_select_published on public.alerts;
drop policy if exists alerts_admin_all on public.alerts;
drop policy if exists data_sources_admin_only on public.data_sources;
drop policy if exists ingestion_logs_admin_only on public.ingestion_logs;
drop policy if exists competitors_admin_only on public.competitors;
drop policy if exists competitor_prices_admin_only on public.competitor_prices;
drop policy if exists alert_rules_admin_only on public.alert_rules;
drop policy if exists subscribers_admin_only on public.subscribers;
drop policy if exists subscriptions_admin_only on public.subscriptions;
drop policy if exists notifications_admin_only on public.notifications;
drop policy if exists admin_users_self_or_admin on public.admin_users;

-- ============================================================
-- RLS Policies (AGENTS.md §11)
-- ============================================================

-- cities & commodities: SELECT untuk anon + authenticated, tulis hanya admin
create policy cities_select_public on public.cities for select to anon, authenticated using (true);
create policy cities_admin_write on public.cities for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy commodities_select_public on public.commodities for select to anon, authenticated using (true);
create policy commodities_admin_write on public.commodities for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- commodity_prices: baca publik via view, tapi izinkan SELECT anon juga (DoD: anon hanya baca data publik)
create policy commodity_prices_select_public on public.commodity_prices for select to anon, authenticated using (true);
create policy commodity_prices_admin_write on public.commodity_prices for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- search_keywords & search_trends: publik baca
create policy search_keywords_select_public on public.search_keywords for select to anon, authenticated using (true);
create policy search_keywords_admin_write on public.search_keywords for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy search_trends_select_public on public.search_trends for select to anon, authenticated using (true);
create policy search_trends_admin_write on public.search_trends for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- calculator templates: publik baca
create policy calc_templates_select_public on public.calculator_templates for select to anon, authenticated using (true);
create policy calc_templates_admin_write on public.calculator_templates for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy calc_items_select_public on public.calculator_template_items for select to anon, authenticated using (true);
create policy calc_items_admin_write on public.calculator_template_items for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- alerts: anon hanya published
create policy alerts_select_published on public.alerts for select to anon, authenticated using (status = 'published');
create policy alerts_admin_all on public.alerts for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- tabel privat: tidak ada policy untuk anon, hanya admin (service_role bypass RLS)
create policy data_sources_admin_only on public.data_sources for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy ingestion_logs_admin_only on public.ingestion_logs for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy competitors_admin_only on public.competitors for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy competitor_prices_admin_only on public.competitor_prices for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy alert_rules_admin_only on public.alert_rules for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy subscribers_admin_only on public.subscribers for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy subscriptions_admin_only on public.subscriptions for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy notifications_admin_only on public.notifications for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- admin_users: user bisa lihat dirinya sendiri, admin bisa lihat semua
create policy admin_users_self_or_admin on public.admin_users for select to authenticated using (id = auth.uid() or public.is_admin());
create policy admin_users_admin_write on public.admin_users for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- VIEW PUBLIK (§10.2) — semua dengan security_invoker = true
-- ============================================================

-- helper: pastikan extension untuk security_invoker tersedia (PG15+)
-- view akan dibuat dengan security_invoker flag

-- 1. v_latest_prices — harga terbaru per komoditas & kota
drop view if exists public.v_latest_prices cascade;
create view public.v_latest_prices
with (security_invoker = true) as
select distinct on (cp.commodity_id, cp.city_id)
  cp.commodity_id,
  com.name as commodity_name,
  com.slug as commodity_slug,
  com.category,
  com.unit,
  cp.city_id,
  ci.name as city_name,
  ci.slug as city_slug,
  cp.price,
  cp.price_date,
  cp.fetched_at,
  cp.source_id
from public.commodity_prices cp
join public.commodities com on com.id = cp.commodity_id
join public.cities ci on ci.id = cp.city_id
order by cp.commodity_id, cp.city_id, cp.price_date desc, cp.fetched_at desc;

-- 2. v_price_changes — perubahan 1/7/30 hari (materialized)
drop materialized view if exists public.v_price_changes cascade;
create materialized view public.v_price_changes as
select
  lp.commodity_id,
  lp.city_id,
  lp.commodity_name,
  lp.commodity_slug,
  lp.city_name,
  lp.city_slug,
  lp.price as latest_price,
  lp.price_date as latest_date,
  -- rata-rata 7 & 30 hari
  (select avg(price) from public.commodity_prices where commodity_id = lp.commodity_id and city_id = lp.city_id and price_date >= lp.price_date - interval '7 days') as avg_7d,
  (select avg(price) from public.commodity_prices where commodity_id = lp.commodity_id and city_id = lp.city_id and price_date >= lp.price_date - interval '30 days') as avg_30d,
  -- harga 1 hari lalu
  (select price from public.commodity_prices where commodity_id = lp.commodity_id and city_id = lp.city_id and price_date = lp.price_date - interval '1 day' order by fetched_at desc limit 1) as price_1d_ago
from public.v_latest_prices lp;

create unique index if not exists idx_v_price_changes_pk on public.v_price_changes (commodity_id, city_id);
-- grant select untuk anon/authenticated (view security_invoker tetap cek RLS underlying)
grant select on public.v_latest_prices to anon, authenticated;
grant select on public.v_price_changes to anon, authenticated;

-- 3. v_top_movers — naik/turun terbesar per kota (berdasarkan 7 hari)
drop view if exists public.v_top_movers cascade;
create view public.v_top_movers
with (security_invoker = true) as
select
  pc.*,
  case when pc.avg_7d is not null and pc.avg_7d <> 0 then ((pc.latest_price - pc.avg_7d) / pc.avg_7d * 100) else 0 end as change_7d_pct,
  case when pc.avg_30d is not null and pc.avg_30d <> 0 then ((pc.latest_price - pc.avg_30d) / pc.avg_30d * 100) else 0 end as change_30d_pct
from public.v_price_changes pc;

grant select on public.v_top_movers to anon, authenticated;

-- 4. v_published_alerts
drop view if exists public.v_published_alerts cascade;
create view public.v_published_alerts
with (security_invoker = true) as
select
  a.id,
  a.title,
  a.message,
  a.payload,
  a.severity,
  a.status,
  a.commodity_id,
  com.name as commodity_name,
  com.slug as commodity_slug,
  a.city_id,
  ci.name as city_name,
  ci.slug as city_slug,
  a.published_at,
  a.created_at
from public.alerts a
left join public.commodities com on com.id = a.commodity_id
left join public.cities ci on ci.id = a.city_id
where a.status = 'published'
order by a.published_at desc, a.created_at desc;

grant select on public.v_published_alerts to anon, authenticated;

-- 5. v_trend_latest — skor tren terbaru per kota & keyword
drop view if exists public.v_trend_latest cascade;
create view public.v_trend_latest
with (security_invoker = true) as
select distinct on (st.keyword_id, st.city_id)
  st.keyword_id,
  sk.keyword,
  sk.category as keyword_category,
  st.city_id,
  ci.name as city_name,
  ci.slug as city_slug,
  st.interest_score,
  st.trend_date
from public.search_trends st
join public.search_keywords sk on sk.id = st.keyword_id
join public.cities ci on ci.id = st.city_id
where sk.is_active = true
order by st.keyword_id, st.city_id, st.trend_date desc;

grant select on public.v_trend_latest to anon, authenticated;

-- 6. v_market_price_index — agregat kompetitor, hanya jika sampel >= 3
drop view if exists public.v_market_price_index cascade;
create view public.v_market_price_index
with (security_invoker = true) as
select
  c.city_id,
  ci.name as city_name,
  ci.slug as city_slug,
  coalesce(cp.item_category, c.segment, 'umum') as segment,
  count(*) as sample_count,
  avg(cp.price) as avg_price,
  min(cp.price) as min_price,
  max(cp.price) as max_price,
  max(cp.observed_at) as last_observed
from public.competitor_prices cp
join public.competitors c on c.id = cp.competitor_id
join public.cities ci on ci.id = c.city_id
group by c.city_id, ci.name, ci.slug, coalesce(cp.item_category, c.segment, 'umum')
having count(*) >= 3;

-- tidak di-grant ke anon (privat, tapi view agregat aman — tetap admin only sesuai RLS)
-- agar publik bisa baca agregat, grant ke anon juga boleh karena sudah privasi-aman
grant select on public.v_market_price_index to anon, authenticated;

-- 7. v_last_updated
drop view if exists public.v_last_updated cascade;
create view public.v_last_updated
with (security_invoker = true) as
select
  (select max(fetched_at) from public.commodity_prices) as last_price_update,
  (select max(run_at) from public.ingestion_logs) as last_ingestion_run,
  greatest(
    coalesce((select max(fetched_at) from public.commodity_prices), 'epoch'::timestamptz),
    coalesce((select max(run_at) from public.ingestion_logs), 'epoch'::timestamptz)
  ) as last_updated;

grant select on public.v_last_updated to anon, authenticated;

-- ============================================================
-- Index tambahan untuk performa homepage (hanya baca view ringkasan)
-- ============================================================
create index if not exists idx_alerts_published_at on public.alerts (status, published_at desc) where status = 'published';
