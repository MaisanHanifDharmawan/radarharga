export const formatIDR = (n: number | null | undefined) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n ?? 0)

export const formatNumber = (n: number | null | undefined, digits = 0) =>
  new Intl.NumberFormat('id-ID', { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n ?? 0)

export const formatDateID = (iso: string | Date | null | undefined) => {
  if (!iso) return '-'
  const d = typeof iso === 'string' ? new Date(iso) : iso
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeZone: 'Asia/Jakarta' }).format(d)
}

export const formatDateTimeID = (iso: string | Date | null | undefined) => {
  if (!iso) return '-'
  const d = typeof iso === 'string' ? new Date(iso) : iso
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' }).format(d)
}

export function pctChange(latest: number, avg: number): number {
  if (!avg) return 0
  return ((latest - avg) / avg) * 100
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/** Rp 73.000 — tanpa desimal */
export function formatRupiah(n: number | null | undefined): string {
  const v = Math.round(n ?? 0)
  const tanda = v < 0 ? '−' : ''
  return `Rp ${tanda}${new Intl.NumberFormat('id-ID').format(Math.abs(v))}`
}

/** +18% / −4% / +9,5% — koma desimal, selalu dengan tanda */
export function formatPersen(n: number, digits = 0): string {
  const tanda = n > 0 ? '+' : n < 0 ? '−' : ''
  return `${tanda}${new Intl.NumberFormat('id-ID', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(Math.abs(n))}%`
}

/** Arah: naik ▲ turun ▼ datar — */
export function arah(n: number): 'naik' | 'turun' | 'datar' {
  return n > 0 ? 'naik' : n < 0 ? 'turun' : 'datar'
}

/** Rab, 14 Okt 2026 */
export function formatTanggalPapan(d: Date = new Date()): string {
  return new Intl.DateTimeFormat('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' }).format(d)
}
