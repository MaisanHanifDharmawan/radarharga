<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useCityStore } from '@/stores/city'
import { komoditasDummy, alertUtamaDummy, AMBANG_ALERT } from '@/mocks/prices'
import { ikonSvg } from './ikon'
import { formatRupiah, formatPersen, formatTanggalPapan } from '@/lib/format'
import CityPicker from './CityPicker.vue'

const city = useCityStore()
const tanggal = formatTanggalPapan()
const tanggalISO = new Date().toISOString().slice(0, 10)

// Papan menampilkan 6 komoditas utama; sisanya lewat "Lihat semua harga"
const baris = computed(() => komoditasDummy.slice(0, 6))
const naikTajam = (n: number) => n >= AMBANG_ALERT

/* Animasi flip: sekali saat mount, berurutan antar baris (±600ms total). */
const flipKey = ref(0)
onMounted(() => { flipKey.value++ })

function animDelay(i: number) {
  return { animationDelay: `${i * 90}ms` }
}
</script>

<template>
  <section class="mx-auto w-full max-w-[480px]" aria-label="Papan harga hari ini">
    <div class="origin-top rotate-[0.5deg] bg-karton p-4 sm:p-6 shadow-papan sm:rotate-[-0.5deg]">
      <header class="flex items-end justify-between border-b-2 border-tinta pb-2">
        <CityPicker variansi="papan" @ganti="flipKey++" />
        <time class="font-isi text-sm font-500 text-tinta" :datetime="tanggalISO">{{ tanggal }}</time>
      </header>

      <ul :key="flipKey">
        <li
          v-for="(k, i) in baris"
          :key="k.slug"
          class="relative border-garis/80 py-3"
          :class="i < baris.length - 1 ? 'border-b-[1.5px] border-dashed' : ''"
        >
          <!-- Baris naik tajam: garis tebal kiri Cabai gelap, bukan latar warna -->
          <span v-if="naikTajam(k.ubah_7h)" class="absolute -left-4 sm:-left-6 top-2 bottom-2 w-1.5 bg-cabai-karton" aria-hidden="true"></span>

          <div class="flex items-baseline gap-3">
            <span class="shrink-0 self-center text-tinta" v-html="ikonSvg(k.ikon, 'w-6 h-6')"></span>
            <span class="font-isi font-700 text-[15px] leading-tight text-tinta">{{ k.nama }}</span>
            <span class="font-isi text-xs text-tinta-muda">/{{ k.unit }}</span>
            <span class="ml-auto text-right">
              <span class="angka font-700 block text-[44px] leading-none text-tinta flip-angka" :style="animDelay(i)">{{ formatRupiah(k.harga).replace('Rp ', '') }}</span>
            </span>
          </div>
          <div class="mt-1.5 flex items-center justify-end gap-2">
            <span
              class="angka font-600 text-lg leading-none"
              :class="k.ubah_7h > 0 ? 'naik-di-karton' : k.ubah_7h < 0 ? 'turun-di-karton' : 'text-tinta-muda'"
            >
              {{ k.ubah_7h > 0 ? '▲' : k.ubah_7h < 0 ? '▼' : '' }} {{ formatPersen(k.ubah_7h) }}
            </span>
          </div>
        </li>
      </ul>

      <p class="mt-3 border-t-2 border-tinta pt-2 font-isi text-xs text-tinta">
        <slot name="meta">Pembaruan tiap pagi. Sumber: PIHPS & Panel Harga.</slot>
      </p>
    </div>
  </section>
</template>

<style scoped>
/* Flip papan: satu putaran, berurutan antar baris (DESIGN.md §6) */
.flip-angka {
  animation: flip 0.5s cubic-bezier(0.4, 0, 0.2, 1) 1 backwards;
  transform-origin: center;
}
@keyframes flip {
  0% { transform: rotateX(90deg); opacity: 0; }
  100% { transform: rotateX(0deg); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .flip-angka { animation: none; }
}
</style>
