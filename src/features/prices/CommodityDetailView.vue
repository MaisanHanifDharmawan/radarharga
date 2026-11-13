<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCityStore } from '@/stores/city'
import { mockCities, mockCommodities, mockCommodityPrices } from '@/mocks'
import { formatIDR, pctChange, formatDateID } from '@/lib/format'
import PriceChart from '@/components/PriceChart.vue'
import AppBadge from '@/components/AppBadge.vue'

const props = defineProps<{ slug?: string; id?: string }>()
const route = useRoute()
const cityStore = useCityStore()
const slug = computed(() => (props.slug as string) || (route.params.slug as string) || (props.id as string) || '')
const commodity = computed(() => mockCommodities.find(c => c.slug === slug.value) ?? mockCommodities.find(c => String(c.id) === slug.value))
const range = ref<7 | 30 | 90>(30)

const series = computed(() => commodity.value ? (mockCommodityPrices[commodity.value.id] ?? []) : [])
const slice = computed(() => series.value.slice(-range.value))
const labels = computed(() => slice.value.map(p => p.date.slice(5)))
const values = computed(() => slice.value.map(p => p.price))
const cur = computed(() => slice.value[slice.value.length - 1]?.price ?? 0)
const ch7 = computed(() => pctChange(cur.value, slice.value.slice(-7).reduce((a,b)=>a+b.price,0)/ (Math.min(7, slice.value.length)||1)))

const compareCities = computed(() => {
  if (!commodity.value) return []
  return mockCities.slice(0, 4).map(c => ({ city: c, price: (mockCommodityPrices[commodity.value!.id]?.[mockCommodityPrices[commodity.value!.id]!.length-1]?.price ?? 0) + (Math.random()-0.5)*2000 }))
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-6">
    <router-link to="/harga" class="text-sm text-slate-600 hover:underline">← Kembali ke daftar</router-link>
    <div v-if="!commodity" class="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">Komoditas tidak ditemukan.</div>
    <template v-else>
      <div class="mt-4">
        <h1 class="text-xl font-bold text-slate-900">{{ commodity.name }}</h1>
        <p class="text-sm text-slate-500">{{ commodity.category }} · per {{ commodity.unit }} · {{ mockCities.find(c=>c.slug===cityStore.selectedSlug)?.name }}</p>
        <div class="mt-2 flex items-center gap-2">
          <span class="text-lg font-bold text-slate-900">{{ formatIDR(cur) }}</span>
          <AppBadge :tone="ch7>5?'red':ch7<-5?'green':'slate'">{{ ch7>0?'+':'' }}{{ ch7.toFixed(1) }}% /7h</AppBadge>
          <span class="text-xs text-slate-400">Terakhir diperbarui {{ formatDateID(new Date().toISOString()) }}</span>
        </div>
      </div>

      <div class="mt-4 flex gap-2">
        <button v-for="r in [7,30,90]" :key="r" @click="range=(r as any)" class="px-3 py-1.5 rounded-full text-xs border" :class="range===r ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200'">{{ r }} hari</button>
      </div>

      <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        <PriceChart :labels="labels" :values="values" :label="commodity.name" />
        <p class="text-xs text-slate-500 mt-2">Sumber: PIHPS & Panel Harga · Zona Asia/Jakarta</p>
      </div>

      <div class="mt-6 rounded-xl border border-slate-200 bg-white p-4">
        <h3 class="font-semibold text-slate-900 text-sm">Perbandingan antar kota (hari ini)</h3>
        <div class="mt-3 grid sm:grid-cols-2 gap-2 text-sm">
          <div v-for="row in compareCities" :key="row.city.id" class="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
            <span class="text-slate-700">{{ row.city.name }}</span>
            <span class="font-semibold text-slate-900">{{ formatIDR(Math.round(row.price)) }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
