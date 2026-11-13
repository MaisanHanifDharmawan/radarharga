-- seed.sql — kota, komoditas, sumber, harga dummy, rules, templates, keywords

-- kota (dengan slug)
insert into public.cities (id, name, slug, province, external_code) values
  (1, 'Jakarta', 'jakarta', 'DKI Jakarta', 'JKT'),
  (2, 'Bandung', 'bandung', 'Jawa Barat', 'BDG'),
  (3, 'Surabaya', 'surabaya', 'Jawa Timur', 'SBY'),
  (4, 'Medan', 'medan', 'Sumatera Utara', 'MDN'),
  (5, 'Semarang', 'semarang', 'Jawa Tengah', 'SMG'),
  (6, 'Yogyakarta', 'yogyakarta', 'DI Yogyakarta', 'YOG'),
  (7, 'Makassar', 'makassar', 'Sulawesi Selatan', 'MKS'),
  (8, 'Palembang', 'palembang', 'Sumatera Selatan', 'PLG'),
  (9, 'Denpasar', 'denpasar', 'Bali', 'DPS'),
  (10, 'Balikpapan', 'balikpapan', 'Kalimantan Timur', 'BPN')
on conflict (id) do update set slug = excluded.slug, province = excluded.province, external_code = excluded.external_code;

-- komoditas (dengan slug & is_featured)
insert into public.commodities (id, name, slug, category, unit, is_featured) values
  (1, 'Cabai Rawit Merah', 'cabai-rawit-merah', 'sayur', 'kg', true),
  (2, 'Bawang Merah', 'bawang-merah', 'bumbu', 'kg', true),
  (3, 'Bawang Putih', 'bawang-putih', 'bumbu', 'kg', false),
  (4, 'Telur Ayam Ras', 'telur-ayam-ras', 'protein', 'kg', true),
  (5, 'Daging Ayam Ras', 'daging-ayam-ras', 'protein', 'kg', true),
  (6, 'Minyak Goreng Curah', 'minyak-goreng-curah', 'bumbu', 'liter', true),
  (7, 'Beras Medium', 'beras-medium', 'karbohidrat', 'kg', false),
  (8, 'Gula Pasir', 'gula-pasir', 'bumbu', 'kg', false),
  (9, 'Tomat', 'tomat', 'sayur', 'kg', false),
  (10, 'Kentang', 'kentang', 'sayur', 'kg', false),
  (11, 'Cabai Merah Keriting', 'cabai-merah-keriting', 'sayur', 'kg', true),
  (12, 'Daging Sapi', 'daging-sapi', 'protein', 'kg', false),
  (13, 'Ikan Nila', 'ikan-nila', 'protein', 'kg', false),
  (14, 'Tepung Terigu', 'tepung-terigu', 'karbohidrat', 'kg', false),
  (15, 'Garam', 'garam', 'bumbu', 'kg', false)
on conflict (id) do update set slug = excluded.slug, category = excluded.category, unit = excluded.unit, is_featured = excluded.is_featured;

-- sumber data
insert into public.data_sources (id, name, type, base_url, is_active) values
  (1, 'PIHPS Nasional (BI)', 'api', 'https://hargapangan.id', true),
  (2, 'Panel Harga Badan Pangan', 'api', 'https://panelharga.badanpangan.go.id', true),
  (3, 'Input Manual / CSV', 'manual', null, true)
on conflict (id) do nothing;

-- harga dummy 14 hari untuk Bandung (city 2) + Jakarta (city 1) — untuk demo grafik & evaluator
insert into public.commodity_prices (commodity_id, city_id, source_id, price, price_date)
select
  c.id,
  2 as city_id,
  3 as source_id,
  (case c.id
    when 1 then 62000 + (gs.n - 7) * 900
    when 2 then 35000 + (gs.n::int % 3)*800
    when 4 then 28000 + (gs.n::int % 2)*400
    when 5 then 36000
    when 6 then 16500
    when 11 then 48000 + (gs.n - 7)*300
    else 25000 end)::numeric,
  current_date - (14 - gs.n) * interval '1 day'
from generate_series(1,14) gs(n)
cross join (values (1),(2),(4),(5),(6),(11)) c(id)
on conflict (commodity_id, city_id, source_id, price_date) do nothing;

insert into public.commodity_prices (commodity_id, city_id, source_id, price, price_date)
select
  c.id,
  1 as city_id,
  3 as source_id,
  (case c.id
    when 1 then 64000 + (gs.n - 7) * 500
    when 2 then 36000
    when 4 then 28500
    when 5 then 36500
    when 6 then 16800
    else 26000 end)::numeric,
  current_date - (14 - gs.n) * interval '1 day'
from generate_series(1,14) gs(n)
cross join (values (1),(2),(4),(5),(6)) c(id)
on conflict (commodity_id, city_id, source_id, price_date) do nothing;

-- alert rules global
insert into public.alert_rules (id, rule_type, commodity_id, threshold_pct, window_days, cooldown_hours, is_active) values
  ('00000000-0000-0000-0000-000000000101', 'price_up', 1, 10, 3, 24, true),
  ('00000000-0000-0000-0000-000000000102', 'price_down', 2, 8, 7, 24, true),
  ('00000000-0000-0000-0000-000000000103', 'price_up', 4, 7, 7, 48, true),
  ('00000000-0000-0000-0000-000000000104', 'price_up', 6, 5, 7, 24, true)
on conflict (id) do nothing;

-- search keywords global
insert into public.search_keywords (id, keyword, category, is_active) values
  (1, 'ayam geprek', 'makanan', true),
  (2, 'seblak', 'makanan', true),
  (3, 'nasi goreng', 'makanan', true),
  (4, 'ayam bakar', 'makanan', true),
  (5, 'soto ayam', 'makanan', true)
on conflict (id) do nothing;

-- search_trends dummy 7 hari untuk Bandung
insert into public.search_trends (keyword_id, city_id, interest_score, trend_date)
select k.id, 2, (70 + (random()*30)::int), current_date - gs.n * interval '1 day'
from generate_series(0,6) gs(n)
cross join (values (1),(2),(3)) k(id)
on conflict (keyword_id, city_id, trend_date) do nothing;

-- calculator templates
insert into public.calculator_templates (id, name, description, default_selling_price, is_active) values
  ('00000000-0000-0000-0000-000000000201', 'Ayam Geprek', 'Ayam goreng tepung + sambal cabai rawit, nasi', 20000, true),
  ('00000000-0000-0000-0000-000000000202', 'Seblak', 'Kerupuk basah + topping ayam & telur', 15000, true),
  ('00000000-0000-0000-0000-000000000203', 'Nasi Goreng Pedas', 'Nasi goreng dengan cabai & telur', 18000, true)
on conflict (id) do nothing;

insert into public.calculator_template_items (template_id, commodity_id, quantity) values
  ('00000000-0000-0000-0000-000000000201', 1, 0.05),
  ('00000000-0000-0000-0000-000000000201', 5, 0.20),
  ('00000000-0000-0000-0000-000000000201', 6, 0.03),
  ('00000000-0000-0000-0000-000000000202', 1, 0.04),
  ('00000000-0000-0000-0000-000000000202', 2, 0.05),
  ('00000000-0000-0000-0000-000000000202', 4, 0.06),
  ('00000000-0000-0000-0000-000000000203', 1, 0.03),
  ('00000000-0000-0000-0000-000000000203', 4, 0.08),
  ('00000000-0000-0000-0000-000000000203', 6, 0.02)
on conflict (template_id, commodity_id) do nothing;

-- alert published dummy (untuk homepage)
insert into public.alerts (id, rule_id, commodity_id, city_id, title, message, payload, severity, status, published_at) values
  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000101', 1, 2,
   'Harga Cabai Rawit Merah naik 18% di Bandung',
   'Rp 62.000 → Rp 73.000/kg dalam 3 hari. 3 menu pedas terdampak. Pertimbangkan sesuaikan harga atau takaran.',
   '{"old_price": 62000, "new_price": 73000, "change_pct": 18, "window_days": 3, "impacted_templates": ["Ayam Geprek", "Seblak"]}',
   'critical', 'published', now() - interval '2 hours'),
  ('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000104', 6, 2,
   'Minyak goreng curah naik 5% di Bandung',
   'Kenaikan bertahap dalam 7 hari. Cek HPP gorengan.',
   '{"old_price": 16500, "new_price": 17300, "change_pct": 5}',
   'warning', 'published', now() - interval '1 day')
on conflict (id) do nothing;

-- refresh matview
refresh materialized view public.v_price_changes;
