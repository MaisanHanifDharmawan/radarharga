// Dummy harga — AGENTS.md §8 (pakai sampai Supabase tersambung). JANGAN dianggap data nyata.
export type Komoditas = {
  id: number
  slug: string
  nama: string
  unit: string
  kategori: 'sayur' | 'protein' | 'bumbu' | 'pokok'
  harga: number
  ubah_7h: number
  ubah_30h: number
  seri: number[]
  ikon: string
}

export const komoditasDummy: Komoditas[] = [
  { id: 1,  slug: 'cabai-rawit-merah',  nama: 'Cabai rawit merah',   unit: 'kg',    kategori: 'sayur',   harga: 73000, ubah_7h: 18, ubah_30h: 26, seri: [64, 65, 66, 67, 68, 70, 73], ikon: 'cabai' },
  { id: 11, slug: 'cabai-merah-keriting', nama: 'Cabai merah keriting', unit: 'kg',  kategori: 'sayur',   harga: 48000, ubah_7h: 9, ubah_30h: 14,  seri: [45, 45.5, 46, 46, 46.5, 47, 48], ikon: 'cabai' },
  { id: 2,  slug: 'bawang-merah',       nama: 'Bawang merah',        unit: 'kg',    kategori: 'bumbu',   harga: 38000, ubah_7h: 6,  ubah_30h: 11,  seri: [36.5, 36.8, 37, 37, 37.2, 37.6, 38], ikon: 'bawang-merah' },
  { id: 3,  slug: 'bawang-putih',        nama: 'Bawang putih',       unit: 'kg',    kategori: 'bumbu',   harga: 36000, ubah_7h: 3,  ubah_30h: 2,   seri: [35, 35.2, 35.4, 35.4, 35.6, 35.8, 36], ikon: 'bawang-putih' },
  { id: 9,  slug: 'tomat',               nama: 'Tomat',              unit: 'kg',    kategori: 'sayur',   harga: 14000, ubah_7h: -4, ubah_30h: -8,  seri: [14.6, 14.5, 14.4, 14.3, 14.2, 14.1, 14], ikon: 'tomat' },
  { id: 4,  slug: 'telur-ayam-ras',      nama: 'Telur ayam ras',     unit: 'kg',    kategori: 'protein', harga: 29500, ubah_7h: -2, ubah_30h: -5,  seri: [30.1, 30, 29.9, 29.8, 29.7, 29.6, 29.5], ikon: 'telur' },
  { id: 5,  slug: 'daging-ayam-ras',     nama: 'Daging ayam ras',    unit: 'kg',    kategori: 'protein', harga: 36000, ubah_7h: 1,  ubah_30h: 3,   seri: [35.6, 35.7, 35.7, 35.8, 35.9, 36, 36], ikon: 'ayam' },
  { id: 6,  slug: 'minyak-goreng-curah', nama: 'Minyak goreng curah', unit: 'liter', kategori: 'bumbu',  harga: 17500, ubah_7h: 5,  ubah_30h: 7,   seri: [16.7, 16.8, 17, 17.1, 17.2, 17.4, 17.5], ikon: 'minyak' },
  { id: 7,  slug: 'beras-medium',        nama: 'Beras medium',       unit: 'kg',    kategori: 'pokok',   harga: 14000, ubah_7h: 0,  ubah_30h: 2,   seri: [14, 14, 14, 14, 14, 14, 14], ikon: 'beras' },
  { id: 8,  slug: 'gula-pasir',          nama: 'Gula pasir',         unit: 'kg',    kategori: 'pokok',   harga: 18000, ubah_7h: 1,  ubah_30h: 4,   seri: [17.8, 17.8, 17.9, 17.9, 18, 18, 18], ikon: 'gula' },
]

export const kategoriList = ['Semua', 'Sayur', 'Protein', 'Bumbu', 'Pokok'] as const

export const kotaDummy = [
  { slug: 'bandung', nama: 'Bandung' },
  { slug: 'jakarta', nama: 'Jakarta' },
  { slug: 'surabaya', nama: 'Surabaya' },
  { slug: 'semarang', nama: 'Semarang' },
  { slug: 'medan', nama: 'Medan' },
  { slug: 'makassar', nama: 'Makassar' },
  { slug: 'denpasar', nama: 'Denpasar' },
]

// Tren/alert dummy di sini agar homepage tanpa Supabase tetap hidup
export const trenDummy = [
  { keyword: 'ayam geprek', skor: 92 },
  { keyword: 'seblak', skor: 61 },
  { keyword: 'nasi goreng', skor: 54 },
  { keyword: 'soto ayam', skor: 47 },
  { keyword: 'bolu kukus', skor: 33 },
]

export const alertUtamaDummy = {
  id: 'a1',
  judul: 'Cabai rawit merah naik 18% di Bandung dalam 3 hari',
  dampak: 'Kalau menu kamu pakai cabai, HPP naik sekitar Rp 900 per porsi. Pertimbangkan sesuaikan porsi atau harga.',
  komoditas: 'cabai-rawit-merah',
  kota: 'bandung',
  severity: 'critical' as const,
}

export const alertLainDummy = [
  { id: 'a2', judul: 'Minyak goreng naik 5%', kota: 'Bandung', waktu: '2 jam lalu', arah: 'naik' as const },
  { id: 'a3', judul: 'Bawang putih naik 3%', kota: 'Bandung', waktu: '6 jam lalu', arah: 'naik' as const },
  { id: 'a4', judul: 'Telur ayam turun 2%', kota: 'Bandung', waktu: 'kemarin', arah: 'turun' as const },
]

export const AMBANG_ALERT = 10
export const DUMMY_TANDA = 'Data contoh — bukan harga nyata'
