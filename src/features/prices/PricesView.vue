<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCityStore } from '@/stores/city'
import { mockCities, mockCommodities, mockCommodityPrices } from '@/mocks'
import { formatIDR, pctChange } from '@/lib/format'
import AppCard from '@/components/AppCard.vue'
import AppBadge from '@/components/AppBadge.vue'

const cityStore = useCityStore()
const q = ref('')
const cat = ref('semua')

const categories = ['semua', 'sayur', 'bumbu', 'protein', 'karbohidrat']

function latest(id: number) { const s = mockCommodityPrices[id] ?? []; return s[s.length - 1]?.price ?? 0 }
function avg(id: number, d: number) { const s = mockCommodityPrices[id] ?? []; const sl = s.slice(-d); return sl.reduce((a, b) => a + b.price, 0) / (sl.length || 1) }

const filtered = computed(() => {
  return mockCommodities.filter(c => {
    if (cat.value !== 'semua' && c.category !== cat.value) return false
    if (q.value && !c.name.toLowerCase().includes(q.value.toLowerCase())) return false
    return true
  }).map(c => {
    const cur = latest(c.id)
    const ch7 = pctChange(cur, avg(c.id, 7))
    return { ...c, cur, ch7 }
  })
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-6">
    <h1 class="text-xl font-bold text-slate-900">Harga bahan baku</h1>
    <p class="text-sm text-slate-500">Kota: {{ mockCities.find(c=>c.slug===cityStore.selectedSlug)?.name }} · pilih kota di navbar untuk ubah.</p>

    <div class="mt-4 flex flex-wrap gap-2">
      <input v-model="q" placeholder="Cari komoditas…" class="rounded-full border border-slate-200 px-4 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-slate-900/10" />
      <select v-model="cat" class="rounded-full border border-slate-200 px-3 py-2 text-sm bg-white">
        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
      </select>
      <select :value="cityStore.selectedSlug" @change="cityStore.setBySlug(($event.target as HTMLSelectElement).value)" class="rounded-full border border-slate-200 px-3 py-2 text-sm bg-white">
        <option v-for="c in mockCities" :key="c.id" :value="c.slug">{{ c.name }}</option>
      </select>
    </div>

    <div class="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <AppCard v-for="c in filtered" :key="c.id">
        <p class="text-sm font-semibold text-slate-900">{{ c.name }}</p>
        <p class="text-xs text-slate-500">{{ c.category }} · per {{ c.unit }}</p>
        <p class="text-lg font-bold text-slate-900 mt-2">{{ formatIDR(c.cur) }}</p>
        <div class="mt-1 flex items-center gap-2">
          <AppBadge :tone="c.ch7>5?'red':c.ch7<-5?'green':'slate'">{{ c.ch7>0?'+':'' }}{{ c.ch7.toFixed(1) }}% /7h</AppBadge>
        </div>
        <router-link :to="`/harga/${c.slug}`" class="mt-3 inline-flex text-xs text-slate-700 hover:underline">Detail →</router-link>
      </AppCard>
    </div>
    <p v-if="filtered.length===0" class="text-sm text-slate-500 mt-6">Tidak ada komoditas sesuai filter.</p>
  </div>
</template>
