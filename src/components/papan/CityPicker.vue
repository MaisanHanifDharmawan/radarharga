<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { kotaDummy } from '@/mocks/prices'
import { useCityStore } from '@/stores/city'

const props = withDefaults(defineProps<{ variansi?: 'judul' | 'papan' }>(), { variansi: 'papan' })
const emit = defineEmits<{ (e: 'ganti'): void }>()
const city = useCityStore()

const terbuka = ref(false)
const cari = ref('')
const rootEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)

const namaKota = computed(() => kotaDummy.find(k => k.slug === city.selectedSlug)?.nama ?? 'Bandung')
const hasil = computed(() => {
  const q = cari.value.trim().toLowerCase()
  return q ? kotaDummy.filter(k => k.nama.toLowerCase().includes(q)) : kotaDummy
})

function buka() { terbuka.value = true; cari.value = ''; requestAnimationFrame(() => inputEl.value?.focus()) }
function tutup() { terbuka.value = false }
function pilih(slug: string) { city.setBySlug(slug); tutup(); emit('ganti') }
function onKeydown(e: KeyboardEvent) { if (e.key === 'Escape') tutup() }
function onClickLuar(e: MouseEvent) { if (terbuka.value && rootEl.value && !rootEl.value.contains(e.target as Node)) tutup() }
onMounted(() => document.addEventListener('click', onClickLuar))
onBeforeUnmount(() => document.removeEventListener('click', onClickLuar))
</script>

<template>
  <div ref="rootEl" class="relative inline-block">
    <button
      type="button"
      class="inline-flex items-baseline gap-1 rounded-kontrol text-left"
      :class="variansi === 'judul'
        ? 'font-isi font-700 text-h1 underline decoration-dashed decoration-2 underline-offset-8 hover:decoration-solid'
        : 'font-isi font-700 text-lg border-b-2 border-tinta pb-1 px-1'"
      :aria-expanded="terbuka"
      aria-haspopup="listbox"
      @click="terbuka ? tutup() : buka()"
    >
      {{ namaKota }} <span class="text-sm" aria-hidden="true">▾</span>
    </button>

    <!-- Desktop / panel -->
    <div
      v-if="terbuka"
      class="hidden sm:block absolute z-40 mt-2 w-64 rounded-kontrol border-2 border-tinta bg-kertas p-2 shadow-papan"
      role="listbox"
      aria-label="Pilih kota"
    >
      <input
        ref="inputEl"
        v-model="cari"
        type="text"
        placeholder="Cari kota…"
        class="w-full rounded-kontrol border border-garis bg-white px-3 py-2 text-sm"
        @keydown="onKeydown"
      />
      <ul class="mt-2 max-h-56 overflow-auto">
        <li v-for="k in hasil" :key="k.slug">
          <button
            type="button"
            class="w-full px-3 py-2.5 text-left text-sm hover:bg-karton/40"
            :class="k.slug === city.selectedSlug ? 'font-700' : ''"
            @click="pilih(k.slug)"
          >
            {{ k.nama }}
          </button>
        </li>
        <li v-if="hasil.length === 0" class="px-3 py-2 text-sm text-tinta-muda">Tidak ada kota bernama itu.</li>
      </ul>
    </div>

    <!-- Mobile: bottom sheet -->
    <Teleport to="body">
      <div v-if="terbuka" class="sm:hidden fixed inset-0 z-50">
        <div class="absolute inset-0 bg-tinta/40" @click="tutup"></div>
        <div class="absolute inset-x-0 bottom-0 rounded-t-panel border-t-2 border-tinta bg-kertas p-4 pb-8" role="dialog" aria-label="Pilih kota">
          <div class="mx-auto mb-3 h-1.5 w-12 rounded-full bg-garis"></div>
          <input
            ref="inputEl"
            v-model="cari"
            type="text"
            placeholder="Cari kota…"
            class="w-full rounded-kontrol border border-garis bg-white px-3 py-3 text-base"
            @keydown="onKeydown"
          />
          <ul class="mt-3 max-h-[50vh] overflow-auto">
            <li v-for="k in hasil" :key="k.slug">
              <button
                type="button"
                class="min-h-[44px] w-full px-3 py-2 text-left text-base"
                :class="k.slug === city.selectedSlug ? 'font-700' : ''"
                @click="pilih(k.slug)"
              >
                {{ k.nama }}
              </button>
            </li>
            <li v-if="hasil.length === 0" class="px-3 py-2 text-sm text-tinta-muda">Tidak ada kota bernama itu.</li>
          </ul>
        </div>
      </div>
    </Teleport>
  </div>
</template>
