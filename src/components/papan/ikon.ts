// Piktogram komoditas 24px, goresan 2px, satu warna (currentColor). DESIGN.md §5.
// Konsisten: grid 24, stroke-linecap round, tanpa fill (kecuali titik kecil).
const p = (d: string) => d

export const ikonPaths: Record<string, string> = {
  // Cabai: badan melengkung + tangkai
  cabai: p('M18.5 7.5c-1 4.5-4.5 10-9.5 11.5-2.8.8-5-.8-4.5-2.5C5 14.5 9 8 13 6.8c2.4-.7 4.6-.5 5.5.7z M13.5 6.5c.5-1.5 2-2.5 3.5-2.5'),
  // Bawang merah: bulat berlapis + akar
  'bawang-merah': p('M12 8c-3.5 0-6 2.3-6 5.5 0 3.4 2.7 5.5 6 5.5s6-2.1 6-5.5C18 10.3 15.5 8 12 8z M12 8c0-1.5.8-2.5 2-3 M12 8c0-1.5-.8-2.5-2-3 M12 19v2'),
  // Bawang putih: siung gerombol
  'bawang-putih': p('M9 10c-2.5.6-4 2.3-4 4.5C5 17.5 7 19 9.5 19h5c2.5 0 4.5-1.5 4.5-4.5 0-2.2-1.5-3.9-4-4.5-.5-1.7-1.6-2.5-3-2.5S9.5 8.3 9 10z M12 7.5V6'),
  // Tomat: bulat + kelopak
  tomat: p('M12 8.5c-4 0-6.5 2.4-6.5 5.6C5.5 17.4 8.3 19 12 19s6.5-1.6 6.5-4.9c0-3.2-2.5-5.6-6.5-5.6z M12 8.5c-.5-1.5.5-2.8 2-3.2M12 8.5c-1.8-1-3.8-.8-4.5.2'),
  // Telur: oval
  telur: p('M12 5.5c-3 0-5.5 4-5.5 8 0 3 2.4 5 5.5 5s5.5-2 5.5-5c0-4-2.5-8-5.5-8z M10.5 11.5c-.9 1-1.3 2.2-1.2 3.3'),
  // Ayam: seekor ayam sederhana (badan+paruh+kaki)
  ayam: p('M6 14c0-3.3 2.7-6 6-6h3c2 0 3.5 1.5 3.5 3.5S17 15 15 15h-1.5V17M7.5 12H5.5M9 15v3M13 17.5v2.5M15 10.5h.01'),
  // Daging sapi: potongan + garis lemak
  'daging-sapi': p('M5 9c0-2.2 3.1-4 7-4s7 1.8 7 4-3.1 4-7 4-7-1.8-7-4z M5 9v5c0 2.2 3.1 4 7 4s7-1.8 7-4V9 M8.5 8.5c1 1 2.5 1.5 3.5 1.5'),
  // Ikan: badan + ekor + mata
  ikan: p('M4 12c2.5-3.5 6-5 8-5s5.5 1.5 8 5c-2.5 3.5-6 5-8 5s-5.5-1.5-8-5z M20 12l2-2.5v5L20 12z M8.5 10.5h.01M10 10.5c1-.8 2.5-.8 3.5 0'),
  // Beras: gabah + tangkai
  beras: p('M8 16c-2 0-3.5-1.5-3.5-3.5S6 9 8 9c0-2 1.5-3.5 3.5-3.5 1.4 0 2.6.8 3.2 2C16.6 7.7 18 9.2 18 11c0 .4-.1.8-.2 1.2C19 12.9 20 14 20 15.5c0 1.9-1.6 3.5-3.5 3.5H8z'),
  // Minyak: galon/gemdung + tutup
  minyak: p('M9 8h6l1.5 3.5c.4.9.5 1.6.5 2.5v4a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-4c0-.9.1-1.6.5-2.5L9 8z M10 8V6.5A1.5 1.5 0 0 1 11.5 5h1A1.5 1.5 0 0 1 14 6.5V8 M9.5 14h5'),
  // Gula: bungkus tetrahedral
  gula: p('M6 10.5 12 5l6 5.5L12 19l-6-8.5z M12 5v14 M6 10.5c2 1 8 1 12 0'),
  // Tepung: karung terbuka
  tepung: p('M8 8c-1.8 1.2-3 3.2-3 5.5C5 17 8 19 12 19s7-2 7-5.5c0-2.3-1.2-4.3-3-5.5H8z M9 8c0-2 1.3-3 3-3s3 1 3 3'),
}

export function ikonSvg(nama: string, cls = 'w-6 h-6') {
  const d = ikonPaths[nama] ?? ikonPaths['beras']
  return `<svg viewBox="0 0 24 24" class="${cls}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}" /></svg>`
}
