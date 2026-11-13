-- 0007_admin_and_public_schema.sql — migrasi ke homepage publik (AGENTS.md v2)
-- Mengganti model multi-tenant (business) menjadi publik + admin-only

-- ============================================================
-- 1. admin_users + helper is_admin()
-- ============================================================
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null check (role in ('admin','editor')) default 'admin',
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where id = auth.uid());
$$;

-- keep legacy helpers for backward compat (no-op if not used)
-- is_business_member / my_business_ids tetap ada dari 0001

-- ============================================================
-- 2. cities & commodities — tambah slug + is_featured
-- ============================================================
alter table public.cities add column if not exists slug text;
alter table public.cities add column if not exists province text;
-- province sudah ada, tapi pastikan not null default ''
alter table public.commodities add column if not exists slug text;
alter table public.commodities add column if not exists is_featured boolean not null default false;

-- isi slug untuk data lama (jika null)
update public.cities set slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')) where slug is null;
-- trim leading/trailing -
update public.cities set slug = regexp_replace(slug, '^-|-$', '', 'g') where slug like '-%' or slug like '%-';

update public.commodities set slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')) where slug is null;
update public.commodities set slug = regexp_replace(slug, '^-|-$', '', 'g') where slug like '-%' or slug like '%-';

-- unique constraint untuk slug (buat index unique if not exists)
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'cities_slug_unique') then
    alter table public.cities add constraint cities_slug_unique unique (slug);
  end if;
exception when duplicate_object then null;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'commodities_slug_unique') then
    alter table public.commodities add constraint commodities_slug_unique unique (slug);
  end if;
exception when duplicate_object then null;
end $$;

-- ============================================================
-- 3. Drop tabel legacy berbasis business (cascade)
-- ============================================================
-- Urutan: hapus dependent dulu agar tidak error FK
drop table if exists public.notifications cascade;
drop table if exists public.notification_channels cascade;
drop table if exists public.alerts cascade;
drop table if exists public.alert_rules cascade;
drop table if exists public.competitor_prices cascade;
drop table if exists public.competitors cascade;
drop table if exists public.search_trends cascade;
drop table if exists public.search_keywords cascade;
drop table if exists public.menu_item_ingredients cascade;
drop table if exists public.menu_items cascade;
drop table if exists public.business_commodities cascade;
drop table if exists public.business_members cascade;
drop table if exists public.businesses cascade;
-- profiles tetap dipertahankan (untuk kompatibilitas), tidak di-drop

-- juga drop view lama jika ada
drop view if exists public.v_commodity_price_stats cascade;

-- ============================================================
-- 4. Tabel baru sesuai ERD v2
-- ============================================================

-- 4.1 search_keywords global
create table if not exists public.search_keywords (
  id serial primary key,
  keyword text not null unique,
  category text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.search_keywords enable row level security;

-- 4.2 search_trends
create table if not exists public.search_trends (
  id bigserial primary key,
  keyword_id int not null references public.search_keywords(id) on delete cascade,
  city_id int not null references public.cities(id) on delete cascade,
  interest_score int not null check (interest_score between 0 and 100),
  trend_date date not null default current_date,
  unique (keyword_id, city_id, trend_date)
);
create index if not exists idx_search_trends_lookup on public.search_trends (keyword_id, city_id, trend_date desc);
alter table public.search_trends enable row level security;

-- 4.3 competitors (privat, admin only, by city)
create table if not exists public.competitors (
  id uuid primary key default gen_random_uuid(),
  city_id int not null references public.cities(id) on delete cascade,
  name text not null,
  segment text,
  created_at timestamptz not null default now()
);
alter table public.competitors enable row level security;

-- 4.4 competitor_prices
create table if not exists public.competitor_prices (
  id uuid primary key default gen_random_uuid(),
  competitor_id uuid not null references public.competitors(id) on delete cascade,
  item_name text not null,
  item_category text,
  price numeric not null check (price >= 0),
  observed_at date not null default current_date
);
create index if not exists idx_competitor_prices_competitor on public.competitor_prices (competitor_id, observed_at desc);
alter table public.competitor_prices enable row level security;

-- 4.5 alert_rules global
create table if not exists public.alert_rules (
  id uuid primary key default gen_random_uuid(),
  rule_type text not null check (rule_type in ('price_up','price_down','trend_spike')),
  commodity_id int references public.commodities(id) on delete cascade,
  threshold_pct numeric not null check (threshold_pct > 0),
  window_days int not null check (window_days > 0),
  cooldown_hours int not null default 24 check (cooldown_hours >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.alert_rules enable row level security;

-- 4.6 alerts (draft -> published -> archived)
create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  rule_id uuid references public.alert_rules(id) on delete set null,
  commodity_id int references public.commodities(id) on delete set null,
  city_id int references public.cities(id) on delete set null,
  title text not null,
  message text not null,
  payload jsonb not null default '{}'::jsonb,
  severity text not null check (severity in ('info','warning','critical')) default 'warning',
  status text not null check (status in ('draft','published','archived')) default 'draft',
  published_by uuid references public.admin_users(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_alerts_status_published on public.alerts (status, published_at desc);
create index if not exists idx_alerts_city_commodity on public.alerts (city_id, commodity_id);
alter table public.alerts enable row level security;

-- 4.7 calculator_templates
create table if not exists public.calculator_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  default_selling_price numeric check (default_selling_price >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.calculator_templates enable row level security;

-- 4.8 calculator_template_items
create table if not exists public.calculator_template_items (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.calculator_templates(id) on delete cascade,
  commodity_id int not null references public.commodities(id) on delete cascade,
  quantity numeric not null check (quantity > 0),
  unique (template_id, commodity_id)
);
alter table public.calculator_template_items enable row level security;

-- 4.9 subscribers (tanpa auth, double opt-in)
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text,
  whatsapp text,
  verify_token text unique,
  unsubscribe_token text unique,
  verified_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  check (email is not null or whatsapp is not null)
);
create index if not exists idx_subscribers_email on public.subscribers (email);
create index if not exists idx_subscribers_verify on public.subscribers (verify_token);
alter table public.subscribers enable row level security;

-- 4.10 subscriptions
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references public.subscribers(id) on delete cascade,
  city_id int not null references public.cities(id) on delete cascade,
  commodity_id int references public.commodities(id) on delete set null,
  min_change_pct numeric not null default 5 check (min_change_pct >= 0),
  created_at timestamptz not null default now(),
  unique (subscriber_id, city_id, commodity_id)
);
alter table public.subscriptions enable row level security;

-- 4.11 notifications (log pengiriman ke subscriber)
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  alert_id uuid not null references public.alerts(id) on delete cascade,
  subscriber_id uuid not null references public.subscribers(id) on delete cascade,
  channel text not null check (channel in ('email','whatsapp')),
  status text not null check (status in ('sent','failed')) default 'sent',
  error_message text,
  sent_at timestamptz not null default now()
);
create index if not exists idx_notifications_alert on public.notifications (alert_id);
create index if not exists idx_notifications_subscriber on public.notifications (subscriber_id);
alter table public.notifications enable row level security;

-- ============================================================
-- 5. Index performa tambahan (§13)
-- ============================================================
create index if not exists idx_commodity_prices_city_date on public.commodity_prices (city_id, price_date desc);
create index if not exists idx_commodity_prices_lookup2 on public.commodity_prices (commodity_id, city_id, price_date desc);
