# Price Radar — Monitor Harga, Kompetitor & Tren per Kota

Scaffold lengkap sesuai **AGENTS.md** (semua fase). Frontend dulu pakai data dummy, siap sambung Supabase per modul.

## Jalan cepat

```bash
npm install
cp .env.example .env   # isi VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY jika ada project Supabase
npm run dev            # http://localhost:5173
npm run build
```

Tanpa Supabase tetap bisa jelajah (mode dummy).

## Fitur

- **Auth** `/login` `/register` (Supabase Auth + guard)
- **Onboarding** `/onboarding` — tipe bisnis, kota, watchlist komoditas, target margin
- **Dashboard** `/` — ringkasan 4 komoditas, % vs 7 hari, grafik 30 hari, alert terbaru
- **Komoditas** `/commodities` + detail `/commodities/:id` — 1/7/30h + grafik
- **Menu & HPP** `/menu` — CRUD menu + resep, HPP = SUM(qty×harga), margin, saran harga = HPP/(1-target_margin)
- **Kompetitor** `/competitors` — input manual harga kompetitor + perbandingan
- **Tren** `/trends` — adapter `src/lib/trendsAdapter.ts` (mock siap ganti)
- **Alert** `/alerts` — CRUD rule + inbox (pending/sent/acknowledged/dismissed), cooldown idempotent
- **Pengaturan** `/settings` — bisnis + kanal notifikasi (in_app/email/whatsapp)

## Supabase

Migrations di `supabase/migrations/` (6 file, RLS aktif semua tabel, index + helper `is_business_member`).
Seed di `supabase/seed.sql` (10 kota, 15 komoditas, 3 data_sources, harga dummy 14 hari).
Edge Functions di `supabase/functions/{ingest-prices,ingest-trends,evaluate-alerts,dispatch-notifications}/`.
`supabase/config.toml` siap untuk `supabase start`.

## Konvensi

- Vue 3 `<script setup lang="ts">`, Pinia, Vue Router, Tailwind (mobile-first), Chart.js via vue-chartjs
- Teks UI Bahasa Indonesia, kode/tabel Bahasa Inggris, format `IDR` + zona `Asia/Jakarta`
- Akses Supabase via `src/lib/supabase.ts` + `features/*/api.ts`
