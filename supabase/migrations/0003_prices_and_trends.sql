-- 0003_prices_and_trends.sql — commodity_prices, ingestion_logs, search_keywords, search_trends

create table if not exists public.commodity_prices (
  id bigserial primary key,
  commodity_id int not null references public.commodities(id),
  city_id int not null references public.cities(id),
  source_id int not null references public.data_sources(id),
  price numeric not null check (price >= 0),
  price_date date not null,
  fetched_at timestamptz not null default now(),
  unique (commodity_id, city_id, source_id, price_date)
);
create index if not exists idx_commodity_prices_lookup on public.commodity_prices (commodity_id, city_id, price_date desc);
alter table public.commodity_prices enable row level security;
create policy cp_select_authenticated on public.commodity_prices for select to authenticated using (true);
-- insert/update hanya service_role (tidak ada policy untuk authenticated)

create table if not exists public.ingestion_logs (
  id bigserial primary key,
  source_id int not null references public.data_sources(id),
  status text not null check (status in ('success','partial','failed')),
  rows_inserted int not null default 0,
  error_message text,
  run_at timestamptz not null default now()
);
alter table public.ingestion_logs enable row level security;
create policy il_select_authenticated on public.ingestion_logs for select to authenticated using (true);

create table if not exists public.search_keywords (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  keyword text not null
);
alter table public.search_keywords enable row level security;
create policy sk_select_member on public.search_keywords for select using (public.is_business_member(business_id));
create policy sk_modify_member on public.search_keywords for all using (public.is_business_member(business_id)) with check (public.is_business_member(business_id));

create table if not exists public.search_trends (
  id bigserial primary key,
  keyword_id uuid not null references public.search_keywords(id) on delete cascade,
  city_id int not null references public.cities(id),
  interest_score int not null check (interest_score between 0 and 100),
  trend_date date not null
);
create index if not exists idx_search_trends_kw_city_date on public.search_trends (keyword_id, city_id, trend_date desc);
alter table public.search_trends enable row level security;
create policy st_select_authenticated on public.search_trends for select to authenticated using (true);
