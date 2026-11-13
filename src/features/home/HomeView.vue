<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCityStore } from '@/stores/city'
import { komoditasDummy, kategoriList, trenDummy, alertUtamaDummy, alertLainDummy, DUMMY_TANDA } from '@/mocks/prices'
import { formatRupiah, formatPersen } from '@/lib/format'
import { ikonSvg } from '@/components/papan/ikon'
import PapanHarga from '@/components/papan/PapanHarga.vue'
import Sparkline from '@/components/papan/Sparkline.vue'
import CityPicker from '@/components/papan/CityPicker.vue'

const city = useCityStore()

/* Tabel harga */
const kategori = ref('Semua')
const terfilter = computed(() => kategori.value === 'Semua' ? komoditasDummy : komoditasDummy.filter(k => k.kategori.toLowerCase() === kategori.value.toLowerCase()))

/* Kalkulator teaser */
const takaran = ref(0.05)
const hargaCabai = computed(() => komoditasDummy.find(k => k.slug === 'cabai-rawit-merah')!.harga)
const hargaLama = computed(() => Math.round(hargaCabai.value / 1.18))
const hppNaik = computed(() => Math.round(takaran.value * (hargaCabai.value - hargaLama.value)))
const saran = computed(() => 20000 + hppNaik.value * 3)

/* Langganan */
const email = ref('')
const kotaForm = ref('bandung')
const statusForm = ref<'' | 'ok' | 'err'>('')
function kirim() {
  statusForm.value = /.+@.+\..+/.test(email.value) ? 'ok' : 'err'
}
</script>

<template>
  <div>
    <!-- HERO -->
    <section class="mx-auto max-w-konten px-4 pb-16 pt-10 md:pb-24 md:pt-16">
      <div class="grid items-start gap-10 md:grid-cols-2">
        <div>
          <h1 class="max-w-[10em] font-isi font-700 text-h1 leading-[1.1]">
            Harga bahan baku hari ini di
            <CityPicker variansi="judul" />
          </h1>
          <p class="mt-5 max-w-[48ch] font-isi text-body text-tinta">
            Cabai, bawang, telur, minyak. Diperbarui tiap pagi supaya kamu tahu kapan harus ubah harga menu.
          </p>
          <div class="mt-7 flex flex-wrap gap-3">
            <a href="#tabel" class="btn-utama">Lihat semua harga</a>
            <router-link to="/kalkulator" class="btn-sekunder">Hitung dampak ke menumu</router-link>
          </div>
          <p class="mt-4 font-isi text-small text-tinta-muda">{{ DUMMY_TANDA }}</p>
        </div>

        <PapanHarga />
      </div>
    </section>

    <!-- ALERT -->
    <section class="border-y border-garis bg-white/60" aria-label="Alert hari ini">
      <div class="mx-auto max-w-konten px-4 py-12 md:py-16">
        <div class="grid gap-8 md:grid-cols-5">
          <article class="md:col-span-3">
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-cabai"></span>
              <h2 class="font-isi font-700 text-h2">Alert hari ini</h2>
            </div>
            <p class="font-isi font-700 text-h2 leading-[1.2]">
              {{ alertUtamaDummy.judul }}
            </p>
            <p class="mt-3 max-w-[60ch] font-isi text-body text-tinta-muda">{{ alertUtamaDummy.dampak }}</p>
            <router-link to="/kalkulator" class="btn-utama mt-6">Hitung dampak ke menumu</router-link>
          </article>

          <ul class="md:col-span-2">
            <li v-for="a in alertLainDummy" :key="a.id" class="border-b border-garis py-3 first:pt-0 last:border-b-0">
              <p class="font-isi font-700 text-[15px]">
                {{ a.judul }}
                <span class="font-angka font-600" :class="a.arah === 'naik' ? 'naik' : 'turun'">
                  {{ a.arah === 'naik' ? '▲' : '▼' }}
                </span>
              </p>
              <p class="font-isi text-small text-tinta-muda">{{ a.kota }}, {{ a.waktu }}</p>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- TABEL HARGA -->
    <section id="tabel" class="mx-auto max-w-konten px-4 py-12 md:py-16" aria-label="Semua harga">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="font-isi font-700 text-h2">Semua harga</h2>
        <nav class="flex flex-wrap gap-1.5" aria-label="Filter kategori">
          <button
            v-for="k in kategoriList"
            :key="k"
            type="button"
            class="rounded-chip border px-3 min-h-[36px] font-isi text-sm font-700 transition-colors"
            :class="kategori === k ? 'border-tinta bg-tinta text-kertas' : 'border-garis text-tinta hover:border-tinta'"
            @click="kategori = k"
          >
            {{ k }}
          </button>
        </nav>
      </div>

      <div class="mt-5 overflow-x-auto">
        <table class="w-full min-w-[560px] border-collapse text-left">
          <thead class="sticky top-14 z-10 bg-kertas">
            <tr class="border-b-2 border-tinta">
              <th scope="col" class="py-2 font-isi font-700 text-small">Komoditas</th>
              <th scope="col" class="py-2 text-right font-isi font-700 text-small">Harga</th>
              <th scope="col" class="py-2 text-right font-isi font-700 text-small">7 hari</th>
              <th scope="col" class="hidden py-2 text-right font-isi font-700 text-small md:table-cell">30 hari</th>
              <th scope="col" class="hidden py-2 text-right font-isi font-700 text-small md:table-cell">Grafik</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="k in terfilter" :key="k.slug" class="group border-b border-garis transition-colors hover:bg-tinta/[0.04]">
              <td class="py-3">
                <span class="flex items-center gap-3">
                  <span class="shrink-0 text-tinta" v-html="ikonSvg(k.ikon)"></span>
                  <router-link :to="`/harga/${k.slug}`" class="font-isi font-700 text-[15px] underline-offset-4 hover:underline">
                    {{ k.nama }}
                  </router-link>
                </span>
              </td>
              <td class="py-3 text-right">
                <span class="angka font-600 text-[22px]">{{ formatRupiah(k.harga).replace('Rp ', '') }}</span>
                <span class="font-isi text-xs text-tinta-muda"> /{{ k.unit }}</span>
              </td>
              <td class="py-3 text-right">
                <span class="angka font-600 text-[15px]" :class="k.ubah_7h > 0 ? 'naik' : k.ubah_7h < 0 ? 'turun' : 'text-tinta-muda'">
                  {{ k.ubah_7h > 0 ? '▲' : k.ubah_7h < 0 ? '▼' : '' }} {{ formatPersen(k.ubah_7h) }}
                </span>
              </td>
              <td class="hidden py-3 text-right md:table-cell">
                <span class="angka font-600 text-[15px]" :class="k.ubah_30h > 0 ? 'naik' : k.ubah_30h < 0 ? 'turun' : 'text-tinta-muda'">
                  {{ k.ubah_30h > 0 ? '▲' : k.ubah_30h < 0 ? '▼' : '' }} {{ formatPersen(k.ubah_30h) }}
                </span>
              </td>
              <td class="hidden py-3 md:table-cell">
                <span class="flex justify-end"><Sparkline :seri="k.seri" /></span>
              </td>
            </tr>
            <tr v-if="terfilter.length === 0">
              <td colspan="5" class="py-8 text-center font-isi text-body text-tinta-muda">Belum ada harga untuk kategori ini.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-3 font-isi text-small text-tinta-muda">Pembaruan tiap pagi, pukul 06.00. Data kemarin belum masuk bila papan belum berubah. Sumber: PIHPS & Panel Harga (detail di halaman Tentang).</p>
    </section>

    <!-- TREN -->
    <section class="border-y border-garis bg-white/60" aria-label="Tren pencarian">
      <div class="mx-auto max-w-konten px-4 py-12 md:py-16">
        <h2 class="font-isi font-700 text-h2">Yang ramai dicari di {{ city.namaKota() }}</h2>
        <ul class="mt-6 max-w-[520px] space-y-4">
          <li v-for="t in trenDummy" :key="t.keyword">
            <div class="flex items-baseline justify-between gap-4">
              <span class="font-isi font-700 text-[15px]">{{ t.keyword }}</span>
              <span class="angka font-600 text-[18px]">{{ t.skor }}</span>
            </div>
            <div class="mt-1 h-3 bg-garis/50">
              <div class="h-full bg-tinta" :style="{ width: t.skor + '%' }"></div>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- KALKULATOR -->
    <section class="mx-auto max-w-konten px-4 py-12 md:py-16" aria-label="Kalkulator dampak harga">
      <h2 class="font-isi font-700 text-h2">Hitung dampak kenaikan harga ke menumu</h2>
      <div class="mt-6 grid gap-8 md:grid-cols-2">
        <form class="space-y-4" @submit.prevent>
          <div>
            <label for="takar" class="font-isi font-700 text-small">Takaran cabai rawit per porsi</label>
            <div class="mt-1 flex items-center gap-2">
              <input id="takar" v-model.number="takaran" type="number" min="0" step="0.005" class="input-kontrol w-28 angka text-[18px]" />
              <span class="font-isi text-body text-tinta-muda">kg</span>
            </div>
          </div>
          <p class="font-isi text-small text-tinta-muda">
            Harga cabai hari ini {{ formatRupiah(hargaCabai) }}, minggu lalu {{ formatRupiah(hargaLama) }}.
          </p>
        </form>
        <div class="rounded-panel border-2 border-tinta p-5">
          <p class="font-isi font-700 text-small text-tinta-muda">Modal naik per porsi</p>
          <p class="angka font-600 text-[28px] leading-tight">+{{ formatRupiah(hppNaik) }}</p>
          <p class="mt-4 font-isi font-700 text-small text-tinta-muda">Saran harga jual (menu Rp 20.000, margin 35%)</p>
          <p class="angka mt-1 inline-block bg-karton px-3 font-700 text-[46px] leading-tight">{{ formatRupiah(saran) }}</p>
          <p class="mt-3 font-isi text-small text-tinta-muda">Estimasi saja, bukan jaminan. Ubah angka di kalkulator lengkap untuk menu kamu.</p>
          <router-link to="/kalkulator" class="btn-sekunder mt-4 inline-block">Buka kalkulator</router-link>
        </div>
      </div>
    </section>

    <!-- LANGGANAN -->
    <section class="border-t border-garis" aria-label="Berlangganan alert">
      <div class="mx-auto max-w-konten px-4 py-12 md:py-16">
        <h2 class="font-isi font-700 text-h2">Dapatkan alert saat harga bergerak</h2>
        <form class="mt-5 flex flex-col gap-3 sm:flex-row" @submit.prevent="kirim">
          <input v-model="email" type="email" placeholder="nama@email.com" class="input-kontrol w-full sm:max-w-[260px]" required />
          <select v-model="kotaForm" class="input-kontrol sm:w-40" aria-label="Kota">
            <option value="bandung">Bandung</option>
            <option value="jakarta">Jakarta</option>
            <option value="surabaya">Surabaya</option>
            <option value="semarang">Semarang</option>
            <option value="medan">Medan</option>
            <option value="makassar">Makassar</option>
            <option value="denpasar">Denpasar</option>
          </select>
          <button type="submit" class="btn-utama shrink-0">Kirim alert ke email saya</button>
        </form>
        <p v-if="statusForm === 'ok'" class="mt-3 font-isi text-small text-daun">Cek email kamu dan klik tautan konfirmasi.</p>
        <p v-else-if="statusForm === 'err'" class="mt-3 font-isi text-small text-cabai">Email belum benar. Tulis lengkap, misal nama@email.com, lalu coba lagi.</p>
      </div>
    </section>
  </div>
</template>
