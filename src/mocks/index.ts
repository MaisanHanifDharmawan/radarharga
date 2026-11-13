export const mockCities = [
  { id: 1, name: 'Jakarta', slug: 'jakarta', province: 'DKI Jakarta', external_code: 'JKT' },
  { id: 2, name: 'Bandung', slug: 'bandung', province: 'Jawa Barat', external_code: 'BDG' },
  { id: 3, name: 'Surabaya', slug: 'surabaya', province: 'Jawa Timur', external_code: 'SBY' },
  { id: 4, name: 'Medan', slug: 'medan', province: 'Sumatera Utara', external_code: 'MDN' },
  { id: 5, name: 'Semarang', slug: 'semarang', province: 'Jawa Tengah', external_code: 'SMG' },
  { id: 6, name: 'Yogyakarta', slug: 'yogyakarta', province: 'DI Yogyakarta', external_code: 'YOG' },
  { id: 7, name: 'Makassar', slug: 'makassar', province: 'Sulawesi Selatan', external_code: 'MKS' },
  { id: 8, name: 'Palembang', slug: 'palembang', province: 'Sumatera Selatan', external_code: 'PLG' },
  { id: 9, name: 'Denpasar', slug: 'denpasar', province: 'Bali', external_code: 'DPS' },
  { id: 10, name: 'Balikpapan', slug: 'balikpapan', province: 'Kalimantan Timur', external_code: 'BPN' },
]

export const mockCommodities = [
  { id: 1, name: 'Cabai Rawit Merah', slug: 'cabai-rawit-merah', category: 'sayur', unit: 'kg', is_featured: true },
  { id: 2, name: 'Bawang Merah', slug: 'bawang-merah', category: 'bumbu', unit: 'kg', is_featured: true },
  { id: 3, name: 'Bawang Putih', slug: 'bawang-putih', category: 'bumbu', unit: 'kg', is_featured: false },
  { id: 4, name: 'Telur Ayam Ras', slug: 'telur-ayam-ras', category: 'protein', unit: 'kg', is_featured: true },
  { id: 5, name: 'Daging Ayam Ras', slug: 'daging-ayam-ras', category: 'protein', unit: 'kg', is_featured: true },
  { id: 6, name: 'Minyak Goreng Curah', slug: 'minyak-goreng-curah', category: 'bumbu', unit: 'liter', is_featured: true },
  { id: 7, name: 'Beras Medium', slug: 'beras-medium', category: 'karbohidrat', unit: 'kg', is_featured: false },
  { id: 8, name: 'Gula Pasir', slug: 'gula-pasir', category: 'bumbu', unit: 'kg', is_featured: false },
  { id: 9, name: 'Tomat', slug: 'tomat', category: 'sayur', unit: 'kg', is_featured: false },
  { id: 10, name: 'Kentang', slug: 'kentang', category: 'sayur', unit: 'kg', is_featured: false },
  { id: 11, name: 'Cabai Merah Keriting', slug: 'cabai-merah-keriting', category: 'sayur', unit: 'kg', is_featured: true },
  { id: 12, name: 'Daging Sapi', slug: 'daging-sapi', category: 'protein', unit: 'kg', is_featured: false },
  { id: 13, name: 'Ikan Nila', slug: 'ikan-nila', category: 'protein', unit: 'kg', is_featured: false },
  { id: 14, name: 'Tepung Terigu', slug: 'tepung-terigu', category: 'karbohidrat', unit: 'kg', is_featured: false },
  { id: 15, name: 'Garam', slug: 'garam', category: 'bumbu', unit: 'kg', is_featured: false },
]

export type PricePoint = { date: string; price: number }

export function makePriceSeries(basePrice: number, days = 30): PricePoint[] {
  const out: PricePoint[] = []
  let p = basePrice
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const delta = (Math.random() - 0.5) * 0.06
    p = Math.max(5000, Math.round(p * (1 + delta)))
    out.push({ date: d.toISOString().slice(0, 10), price: p })
  }
  if (out.length >= 3) out[out.length - 2].price = Math.round(out[out.length - 2].price * 1.18)
  return out
}

export const mockCommodityPrices: Record<number, PricePoint[]> = {
  1: makePriceSeries(62000, 30),
  2: makePriceSeries(35000, 30),
  3: makePriceSeries(32000, 30),
  4: makePriceSeries(28000, 30),
  5: makePriceSeries(36000, 30),
  6: makePriceSeries(16500, 30),
}

// legacy compat: bisnis dummy (dipakai file lama, jangan dihapus mendadak)
export const mockBusiness = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Warung Ayam Geprek Bu Siti',
  type: 'restaurant' as const,
  city_id: 2,
  city_name: 'Bandung',
  target_margin_pct: 35,
}

export const mockMenuItems = [
  { id: 'm1', name: 'Ayam Geprek', selling_price: 20000, is_active: true, ingredients: [{ commodity_id: 1, qty: 0.05 }, { commodity_id: 5, qty: 0.2 }] },
  { id: 'm2', name: 'Nasi Goreng Pedas', selling_price: 18000, is_active: true, ingredients: [{ commodity_id: 1, qty: 0.03 }, { commodity_id: 4, qty: 0.08 }] },
  { id: 'm3', name: 'Seblak', selling_price: 15000, is_active: true, ingredients: [{ commodity_id: 1, qty: 0.04 }, { commodity_id: 2, qty: 0.05 }] },
]

export const mockCompetitors = [
  { id: 'c1', name: 'Ayam Geprek Mas Eko', note: 'Jl. Braga' },
  { id: 'c2', name: 'Warung Seblak Teh Ima', note: 'Jl. Dago' },
]

export const mockCompetitorPrices = [
  { id: 'cp1', competitor_id: 'c1', item_name: 'Ayam Geprek', price: 22000, observed_at: new Date().toISOString().slice(0, 10) },
  { id: 'cp2', competitor_id: 'c1', item_name: 'Nasi Goreng', price: 17000, observed_at: new Date().toISOString().slice(0, 10) },
  { id: 'cp3', competitor_id: 'c2', item_name: 'Seblak', price: 16000, observed_at: new Date().toISOString().slice(0, 10) },
]

export const mockAlerts = [
  {
    id: 'a1',
    title: 'Harga Cabai Rawit Merah naik 18% di Bandung',
    message: 'Rp 62.000 → Rp 73.000/kg dalam 3 hari. 3 menu terdampak.',
    severity: 'critical' as const,
    status: 'published' as const,
    city_slug: 'bandung',
    commodity_slug: 'cabai-rawit-merah',
    created_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    payload: { commodity: 'Cabai Rawit Merah', change_pct: 18, old_price: 62000, new_price: 73000, impacted_menus: ['Ayam Geprek', 'Seblak'] },
  },
  {
    id: 'a2',
    title: 'Minyak goreng curah naik 5% di Bandung',
    message: 'Kenaikan bertahap 7 hari. Cek HPP gorengan.',
    severity: 'warning' as const,
    status: 'published' as const,
    city_slug: 'bandung',
    commodity_slug: 'minyak-goreng-curah',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    published_at: new Date(Date.now() - 86400000).toISOString(),
    payload: { commodity: 'Minyak Goreng Curah', change_pct: 5 },
  },
]

export const mockAlertRules = [
  { id: 'r1', rule_type: 'price_up', commodity_id: 1, threshold_pct: 10, window_days: 3, cooldown_hours: 24, is_active: true },
  { id: 'r2', rule_type: 'price_down', commodity_id: 2, threshold_pct: 8, window_days: 7, cooldown_hours: 24, is_active: true },
]

export const mockKeywords = [
  { id: 1, keyword: 'ayam geprek', category: 'makanan', is_active: true },
  { id: 2, keyword: 'seblak', category: 'makanan', is_active: true },
  { id: 3, keyword: 'nasi goreng', category: 'makanan', is_active: true },
]

export const mockTrends = [
  { keyword: 'ayam geprek', interest_score: 92, city_slug: 'bandung' },
  { keyword: 'seblak', interest_score: 61, city_slug: 'bandung' },
  { keyword: 'nasi goreng', interest_score: 54, city_slug: 'bandung' },
]

export const mockCalculatorTemplates = [
  { id: 't1', name: 'Ayam Geprek', description: 'Ayam goreng tepung + sambal', default_selling_price: 20000, items: [{ commodity_id: 1, quantity: 0.05 }, { commodity_id: 5, quantity: 0.2 }, { commodity_id: 6, quantity: 0.03 }] },
  { id: 't2', name: 'Seblak', description: 'Kerupuk basah + topping', default_selling_price: 15000, items: [{ commodity_id: 1, quantity: 0.04 }, { commodity_id: 2, quantity: 0.05 }, { commodity_id: 4, quantity: 0.06 }] },
  { id: 't3', name: 'Nasi Goreng Pedas', description: 'Nasi goreng cabai & telur', default_selling_price: 18000, items: [{ commodity_id: 1, quantity: 0.03 }, { commodity_id: 4, quantity: 0.08 }, { commodity_id: 6, quantity: 0.02 }] },
]

export const mockMarketIndex = [
  { city_slug: 'bandung', segment: 'ayam geprek', avg_price: 21000, min_price: 18000, max_price: 25000, sample_count: 5 },
]
