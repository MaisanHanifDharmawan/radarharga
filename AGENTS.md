1. Brief Desain

Subjek: informasi harga bahan baku harian per kota di Indonesia (cabai, bawang, telur, minyak, dll.), plus alert dan kalkulator dampak harga.

Audiens: pemilik warung/restoran dan reseller. Mayoritas membuka dari HP, sering sambil sibuk (di dapur, di pasar, di kendaraan), sinyal tidak selalu bagus.

Tugas utama halaman: dalam 5 detik pengunjung tahu harga hari ini di kotanya dan apakah ada yang naik tajam. Sisanya (tren, kalkulator, langganan) mendukung dua hal itu.

Rasa yang dituju: jelas, cepat dibaca, dan tepercaya seperti papan harga di pasar, bukan seperti startup SaaS. Tegas, bukan ramai.

Dunia visual yang dipakai (ambil dari sini, jangan dari template): papan harga pasar dari karton kuning, tulisan spidol tebal, label harga di kantong plastik, struk timbangan, daftar harga di dinding warung. Semua ini berisi angka besar, garis pemisah tulisan tangan, dan hierarki yang langsung terbaca.

Satu hal yang harus diingat orang: Papan Harga di hero. Semua bagian lain sengaja tenang supaya papan ini menonjol.

2. Yang Harus Dihindari (Penanda "Buatan AI")

Kalau hasil akhir terlihat seperti salah satu di bawah ini, ulangi:

Latar krem hangat + serif tinggi kontras + aksen terakota/oranye tanah.
Latar hitam pekat + satu aksen hijau neon/merah menyala.
Gaya koran: garis tipis di mana-mana, sudut siku, kolom padat.
Kartu SaaS: semua konten dipotong jadi kartu identik, radius sama di semua elemen, bayangan abu-abu sama, gradient sebagai hiasan.
Label kecil huruf kapital berjarak di atas setiap judul.
Teks meta dengan titik tengah ("A · B · C"), label bergaya "KATA — keterangan", font monospace untuk semua label kecil.
Tanda panah → di belakang setiap tombol atau tautan.
Setiap section masuk dengan fade-and-slide-up, setiap kartu punya hover naik.
Satu kata di judul dibuat miring/berwarna beda sebagai "aksen".
Penomoran 01 / 02 / 03 padahal isinya bukan urutan.
Emoji sebagai ikon UI. Pakai ikon SVG yang konsisten.
Foto stok orang tersenyum atau ilustrasi 3D generik.
Font bawaan yang dipakai di semua proyek (Inter, Roboto, system-ui sebagai tampilan utama).
3. Token Desain
3.1 Warna
Nama	Hex	Peran
Kertas	
#F8FAF7	Latar halaman (putih sedikit kehijauan, bukan krem)
Tinta	
#12233B	Teks utama, garis tebal, tombol utama (biru tinta pulpen)
Karton	
#FFD84D	Papan Harga, sorotan penting (kuning karton pasar)
Cabai	
#C4122F	Harga naik
Daun	
#12703F	Harga turun
Garis	
#D5DBD3	Pemisah, border halus
Tinta Muda	
#4B5B6E	Teks sekunder

Aturan pakai:

Karton hanya untuk Papan Harga dan sorotan kecil (mis. highlight angka di kalkulator). Jangan dipakai sebagai warna tombol di semua tempat.
Di atas Karton, pakai versi lebih gelap: Cabai 
#A50F28, Daun 
#0F6B3A. Cek kontras minimal 4.5:1 dengan alat contrast checker sebelum dipakai.
Merah/hijau hanya menandai arah (naik/turun), bukan baik/buruk. Selalu sertakan tanda ▲ ▼ dan angka dengan tanda +/−, jangan mengandalkan warna saja.
Tidak ada gradient dekoratif. Tidak ada warna ungu/biru-ungu.
Mode gelap: tidak wajib di MVP.
3.2 Tipografi
Peran	Font	Catatan
Angka & judul papan	Barlow Condensed (600, 700)	Terasa seperti papan penunjuk/signage. Dipakai untuk harga, persentase, dan judul besar
Judul section & isi	Plus Jakarta Sans (400, 500, 700)	Typeface karya desainer Indonesia, ramah dibaca di layar kecil
Dua font saja, jelas berbeda karakter (padat vs. lega).
Semua angka harga: font-variant-numeric: tabular-nums supaya kolom rata.
Self-host font (WOFF2, subset Latin) dan font-display: swap agar cepat di sinyal lemah.

Skala (rasio ±1.25, dasar 16px):

Token	Ukuran (mobile → desktop)	Pakai untuk
price-xl	56 → 96px, Barlow 700	Harga utama di Papan Harga
h1	32 → 52px, Plus Jakarta 700, line-height 1.1	Judul hero
h2	24 → 32px, 700, line-height 1.2	Judul section
h3	18 → 20px, 700	Judul item
body	16px, 400, line-height 1.6	Isi
small	14px, 500	Keterangan, tanggal, sumber

Aturan: panjang baris isi maks 65 karakter. Rata kiri. Hindari huruf kapital semua untuk label; pakai sentence case dengan bobot 700 atau ukuran berbeda.

3.3 Spasi, Bentuk, Bayangan
Basis 4px. Jarak antar section: 64px (mobile), 96px (desktop). Lebar konten maks 1120px.
Radius punya hierarki (bukan satu angka untuk semua):
Papan Harga: 0px (karton persegi, sedikit miring 0.5° saja di desktop, opsional)
Chip & label harga: 2px
Input & tombol: 8px
Panel kalkulator: 12px
Bayangan: hampir tidak ada. Pemisahan lewat garis dan jarak. Satu-satunya bayangan: Papan Harga (offset keras 6px 6px 0 Tinta, gaya cetak, bukan blur).
Border: 1px Garis untuk pemisah biasa, 2px Tinta untuk struktur penting (garis bawah header papan, tombol sekunder).
4. Konsep Layout

Prinsip: baris, bukan kartu. Daftar harga dibaca seperti daftar di dinding warung: satu baris satu komoditas, angka besar di kanan, garis tipis di antaranya. Kartu hanya dipakai bila benar-benar objek mandiri.

4.1 Homepage (desktop)
┌────────────────────────────────────────────────────────────────┐
│ Price Radar         Harga   Tren   Alert   Kalkulator [Berlangganan] │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ Harga bahan baku                    ┌─── PAPAN HARGA ────────┐ │
│ hari ini di                         │ Bandung ▾   Rab 14 Okt │ │
│ [ Bandung ▾ ]                       ├────────────────────────┤ │
│                                     │ Cabai rawit merah      │ │
│ Cabai, bawang, telur, minyak.       │   73.000  /kg   ▲ 18%  │ │
│ Diperbarui tiap pagi, supaya kamu   │ ───────────────────────│ │
│ tahu kapan harus ubah harga menu.   │ Bawang merah           │ │
│                                     │   38.000  /kg   ▲ 6%   │ │
│ [Lihat semua harga] [Hitung HPP]    │ ───────────────────────│ │
│                                     │ Telur ayam ras         │ │
│                                     │   29.500  /kg   ▼ 2%   │ │
│                                     │  ...6 baris...         │ │
│                                     └────────────────────────┘ │
├────────────────────────────────────────────────────────────────┤
│ Alert hari ini                                                 │
│ ┌──────────────────────────────┐ Minyak goreng naik 5%         │
│ │ Cabai rawit naik 18% di      │ ─────────────────────────     │
│ │ Bandung dalam 3 hari         │ Bawang putih naik 3%          │
│ │ (alert utama, lebih besar)   │ ─────────────────────────     │
│ │ [Hitung dampak ke menumu]    │ Telur turun 2%                │
│ └──────────────────────────────┘                               │
├────────────────────────────────────────────────────────────────┤
│ Semua harga           [Semua][Sayur][Protein][Bumbu][Pokok]    │
│ Komoditas        Harga     7 hari   30 hari   Grafik mini      │
│ ──────────────────────────────────────────────────────────     │
│ (tabel baris, header menempel saat scroll)                     │
├────────────────────────────────────────────────────────────────┤
│ Yang ramai dicari di Bandung                                   │
│ ayam geprek  ██████████████ 92                                 │
│ seblak       █████████ 61                                      │
├────────────────────────────────────────────────────────────────┤
│ Hitung dampak kenaikan harga ke menumu   (2 kolom: input|hasil)│
├────────────────────────────────────────────────────────────────┤
│ Dapatkan alert saat harga bergerak:  [email____] [kota▾] [Kirim]│
├────────────────────────────────────────────────────────────────┤
│ Footer: sumber data · terakhir diperbarui · Tentang · Admin    │
└────────────────────────────────────────────────────────────────┘
4.2 Homepage (mobile, 375px)

Urutan: header ringkas → judul + pilih kota → Papan Harga (lebar penuh, 5–6 baris, sisanya lewat "Lihat semua") → alert utama → daftar alert lain → tabel harga (jadi daftar baris, tanpa kolom 30 hari) → tren → kalkulator → langganan. Navigasi: menu ringkas; tombol "Berlangganan" tetap terlihat. Target sentuh minimal 44×44px.

4.3 Keselarasan
Konten teks: rata kiri. Angka dalam tabel: rata kanan.
Tidak ada hero teks rata tengah.
Papan Harga berada di kanan (desktop) dan di bawah judul (mobile).
5. Spesifikasi Komponen
Papan Harga (komponen utama, tempat "keberanian" desain)
Latar Karton, teks Tinta, tanpa radius, bayangan cetak 6px 6px 0 Tinta.
Header papan: nama kota (dropdown) dan tanggal, garis bawah 2px Tinta.
Tiap baris: nama komoditas (Plus Jakarta 700), harga (Barlow price-xl untuk baris utama, ukuran lebih kecil untuk baris lain), satuan kecil, perubahan dengan ▲/▼ + persen.
Pemisah antar baris: garis putus-putus tipis seperti tulisan tangan di karton (border-bottom: 1.5px dashed).
Baris yang naik tajam (≥ ambang alert) diberi penanda: garis tebal di kiri warna Cabai gelap, bukan latar berwarna.
Ikon komoditas: piktogram SVG satu warna Tinta, grid 24px, goresan 2px, konsisten satu gaya. Buat ±12 ikon (cabai, bawang merah, bawang putih, tomat, telur, ayam, daging sapi, ikan, beras, minyak, gula, tepung).
Baris Harga (daftar/tabel)
Satu baris per komoditas; tidak dibungkus kartu. Hover cukup ganti latar jadi tint sangat tipis.
Grafik mini (sparkline) satu warna Tinta; hanya titik terakhir berwarna Cabai/Daun sesuai arah.
Alert
Satu alert utama lebih besar (judul h2, satu kalimat dampak, satu tombol). Alert lain berupa baris biasa: judul, kota, waktu relatif.
Jangan semuanya dibuat kartu sama besar. Hierarki ukuran adalah informasinya.
Grafik (halaman detail)
Satu garis, warna Tinta; area di bawah garis tanpa isian.
Label langsung di ujung garis, bukan legend terpisah. Gridline horizontal tipis saja.
Rentang 7 / 30 / 90 hari lewat kontrol segmen sederhana.
Tooltip menampilkan tanggal dan harga dengan format rupiah.
Pilih Kota
Berupa kalimat yang bisa diklik di judul ("hari ini di Bandung ▾") dan di header papan. Simpan pilihan di localStorage.
Daftar kota bisa dicari (ketik untuk filter), terbuka sebagai bottom sheet di mobile.
Tren Pencarian
Daftar horizontal bar sederhana, terurut, satu warna Tinta, angka di ujung. Tanpa donut/pie.
Kalkulator
Dua kolom (desktop) atau bertumpuk (mobile). Kiri: pilih template menu (atau tambah bahan), takaran, harga jual. Kanan: HPP baru, margin baru, saran harga jual dengan angka besar Barlow.
Satu-satunya tempat lain yang boleh memakai sorotan Karton: angka saran harga jual.
Hasil berubah saat input berubah (tanpa tombol "Hitung"). Sertakan disclaimer satu kalimat.
Form Langganan
Satu baris: email, kota, tombol. Tombol berlabel "Kirim alert ke email saya" (bukan "Submit").
Keadaan sukses: "Cek email kamu dan klik tautan konfirmasi." Keadaan error menjelaskan masalah dan cara memperbaikinya.
Tombol
Utama: latar Tinta, teks Kertas, radius 8px, tinggi 48px.
Sekunder: border 2px Tinta, latar transparan.
Tidak ada → di label. Fokus keyboard: outline 3px Tinta dengan offset 2px.
6. Gerak (Motion)
Satu momen terkoordinasi: saat halaman pertama dimuat, angka di Papan Harga "membalik" sekali seperti papan angka (flip/roll, ±600ms, berurutan antar baris).
Saat kota diganti: angka di papan ikut berganti dengan animasi singkat yang sama (respons terhadap aksi pengguna).
Selain itu: tidak ada animasi masuk di setiap section, tidak ada hover mengambang di setiap elemen.
Hormati prefers-reduced-motion: tanpa animasi, angka langsung tampil.
7. Tulisan (Copy)
Bahasa Indonesia sehari-hari, kalimat pendek, sentence case, kata kerja aktif. Gunakan "kamu".
Beri nama sesuai yang dipahami pengguna: "harga", "alert", "menu", "HPP (modal per porsi)". Hindari istilah teknis internal.
Satu aksi, satu nama, di seluruh alur. Tombol "Berlangganan" menghasilkan pesan "Berlangganan berhasil".
Contoh:
H1: "Harga bahan baku hari ini di Bandung."
Sub: "Cabai, bawang, telur, minyak. Diperbarui tiap pagi supaya kamu tahu kapan harus ubah harga menu."
Tombol: "Lihat semua harga", "Hitung dampak ke menumu", "Kirim alert ke email saya"
Keadaan kosong (belum ada alert): "Belum ada alert hari ini. Harga masih stabil."
Data lama: "Data terakhir diperbarui kemarin 06.00. Pembaruan hari ini belum masuk."
Error: "Harga belum bisa dimuat. Periksa koneksi, lalu muat ulang halaman."
Selalu tampilkan sumber dan waktu pembaruan di dekat angka.
Jangan menulis klaim berlebihan ("terlengkap", "akurat 100%").
8. Data Dummy yang Realistis

Jangan pakai lorem ipsum atau angka bulat asal. Gunakan data contoh ini sampai data nyata tersambung, dan tandai di kode sebagai dummy (src/mocks/prices.ts):

Komoditas	Satuan	Harga (Rp)	7 hari
Cabai rawit merah	kg	73.000	+18%
Cabai merah keriting	kg	48.000	+9%
Bawang merah	kg	38.000	+6%
Bawang putih	kg	36.000	+3%
Tomat	kg	14.000	−4%
Telur ayam ras	kg	29.500	−2%
Daging ayam ras	kg	36.000	+1%
Minyak goreng curah	liter	17.500	+5%
Beras medium	kg	14.000	0%
Gula pasir	kg	18.000	+1%

Format: Rp 73.000 (titik ribuan), persen dengan tanda dan koma desimal (+18,2%), tanggal Rab, 14 Okt 2026, zona waktu Asia/Jakarta.

9. Standar Kualitas (Wajib)
Responsif: diuji di 375px, 768px, 1280px. Tidak ada scroll horizontal pada body.
Kontras teks ≥ 4.5:1 (cek khususnya merah/hijau di atas Karton).
Fokus keyboard selalu terlihat; semua kontrol bisa dioperasikan keyboard.
Warna tidak jadi satu-satunya penanda (ada ▲▼ dan tanda +/−).
prefers-reduced-motion dihormati.
Ada keadaan loading (skeleton baris, bukan spinner penuh), kosong, error, dan data basi.
Halaman awal ringan: tanpa gambar besar, font di-subset, grafik dimuat setelah konten utama.
Meta tag dan judul halaman tiap route (untuk SEO dan berbagi tautan).
10. Proses Kerja Agent (Urutan Wajib)
Rencana desain dulu, sebelum kode. Tulis ringkas: palet, font, layout (wireframe ASCII), prinsip.
Tinjau rencana terhadap bagian 2 (daftar hindari). Jika ada bagian yang terasa seperti default, revisi dan sebutkan apa yang diubah dan alasannya.
Bangun homepage statis dengan data dummy (bagian 8). Belum menyambung Supabase.
Tinjau hasil: screenshot di 375, 768, 1280px. Daftar tiga hal yang masih terasa generik atau berantakan, lalu perbaiki.
Kurangi satu hiasan sebelum selesai. Keberanian hanya di Papan Harga.
Baru sambungkan ke data Supabase.
11. Token CSS (Salin ke src/styles/tokens.css)
css
:root {
  --kertas: #F8FAF7;
  --tinta: #12233B;
  --tinta-muda: #4B5B6E;
  --karton: #FFD84D;
  --cabai: #C4122F;
  --cabai-di-karton: #A50F28;
  --daun: #12703F;
  --daun-di-karton: #0F6B3A;
  --garis: #D5DBD3;

  --font-angka: "Barlow Condensed", "Arial Narrow", sans-serif;
  --font-isi: "Plus Jakarta Sans", system-ui, sans-serif;

  --radius-chip: 2px;
  --radius-kontrol: 8px;
  --radius-panel: 12px;

  --bayangan-papan: 6px 6px 0 var(--tinta);
}

body {
  background: var(--kertas);
  color: var(--tinta);
  font-family: var(--font-isi);
  font-size: 16px;
  line-height: 1.6;
}

.angka { font-family: var(--font-angka); font-variant-numeric: tabular-nums; }

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}

Petakan token di atas ke theme.extend Tailwind (warna, fontFamily, borderRadius) supaya kelas utilitas konsisten dan agent tidak memakai warna/radius bebas.

12. Prompt Siap Tempel untuk Agent
Baca AGENTS.md dan DESIGN.md di root proyek. DESIGN.md adalah aturan
desain yang mengikat.

Tugas: bangun ulang homepage Price Radar sesuai DESIGN.md.

Urutan kerja:
1) Tulis rencana desain singkat (palet, font, wireframe ASCII, prinsip)
   dan tinjau terhadap daftar "Yang Harus Dihindari". Sebutkan apa yang
   kamu revisi.
2) Bangun homepage statis dengan data dummy dari bagian 8 (belum Supabase).
   Mulai dari Papan Harga, lalu Alert, tabel harga, tren, kalkulator,
   langganan, footer.
3) Ambil screenshot di 375px, 768px, dan 1280px. Kritik hasilmu sendiri,
   tulis tiga masalah terbesar, lalu perbaiki.
4) Buang satu elemen dekoratif sebelum selesai.

Larangan keras: kartu identik di mana-mana, gradient dekoratif, emoji
sebagai ikon, label huruf kapital kecil di atas judul, tanda panah di
tombol, animasi masuk di setiap section, font Inter/Roboto.
Keberanian visual hanya di Papan Harga; bagian lain tenang.