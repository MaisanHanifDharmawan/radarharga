# DESIGN.md — Price Radar (mengikat)

Rasa: papan harga pasar (karton kuning, spidol tebal), tegas dan cepat dibaca.
Keberanian visual HANYA di Papan Harga. Bagian lain tenang: baris, garis, jarak.

## Palet
- Kertas #F8FAF7 — latar halaman
- Tinta #12233B — teks, garis tebal, tombol utama (biru tinta pulpen)
- Karton #FFD84D — Papan Harga + sorotan angka saran kalkulator
- Cabai #C4122F (naik) · Daun #12703F (turun) — di karton pakai #A50F28 / #0F6B3A
- Garis #D5DBD3 · Tinta Muda #4B5B6E

## Font
- Barlow Condensed 600/700 — angka, judul papan (tabular-nums)
- Plus Jakarta Sans 400/500/700 — judul section & isi
- Self-host WOFF2 subset latin, font-display: swap

## Layout homepage (desktop)
- Navbar: brand kiri, 4 tautan, tombol Berlangganan (Tinta)
- Hero 2 kolom: kiri H1 + pilih kota (kalimat klik) + 2 tombol; kanan PAPAN HARGA
- Alert: 1 alert utama besar (karton tidak dipakai; garis tebal Cabai bila kritis) + baris alert kecil di kanan
- Semua harga: tabel baris (bukan kartu), header sticky, filter kategori, sparkline Tinta
- Tren: horizontal bar Tinta, angka di ujung
- Kalkulator: teaser 2 kolom (input | hasil), saran harga di sorot Karton
- Langganan: satu baris email + kota + "Kirim alert ke email saya"
- Footer: sumber data · terakhir diperbarui · Tentang · Admin

## Papan Harga
Kartu karton no-radius, miring 0.5°, bayangan cetak 6px 6px 0 Tinta.
Header: kota (dropdown) + tanggal, garis bawah 2px Tinta. Baris ikon SVG tinta,
nama PJS 700, harga Barlow besar kanan, ▲/▼ + persen; pemisah dashed 1.5px.
Baris naik tajam: garis kiri tebal Cabai gelap. Animasi: flip angka sekali.

## Prinsip
1. Baris, bukan kartu. 2. Hierarki ukuran = informasi. 3. Karton hanya papan + saran HPP.
4. Garis & jarak, bukan bayangan/blur. 5. Satu momen gerak (flip papan). 6. Rata kiri; angka rata kanan.

## Tinjauan daftar hindari (§2) — revisi dari implementasi lama
1. Kartu SaaS grid identik (slate-900, radius sama, hover naik) → diganti baris + garis; hover tint tipis saja.
2. Emoji 🔔 sebagai ikon UI → diganti ikon SVG goresan 2px satu gaya.
3. Panah "→" di semua tombol/tautan → dihapus; tombol hanya teks.
4. Label kapital berjarak di atas judul ("HARGA TERKINI") → sentence case Plus Jakarta 700.
5. Meta "A · B · C" titik tengah → meta ditulis sebagai kalimat pendek atau baris sendiri.
6. Fokus keyboard: outline 3px Tinta offset 2px; sentuh ≥44px; tabular-nums; prefer-reduced-motion dihormati.
