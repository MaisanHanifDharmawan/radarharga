<script setup lang="ts">
import { computed } from 'vue'
import { mockCommodityPrices, mockCommodities, mockAlerts, mockBusiness } from '@/mocks'
import { formatIDR, pctChange } from '@/lib/format'
import { useBusinessStore } from '@/stores/business'
import AppCard from '@/components/AppCard.vue'
import AppBadge from '@/components/AppBadge.vue'
import PriceChart from '@/components/PriceChart.vue'

const business = useBusinessStore()
business.ensureMock()

function series(id: number) { return mockCommodityPrices[id] ?? [] }
function latest(id: number) { const s = series(id); return s[s.length-1]?.price ?? 0 }
function avg(id: number, days: number) { const s = series(id); const slice = s.slice(-days); return slice.reduce((a,b)=>a+b.price,0)/ (slice.length||1) }

const cards = computed(() => {
  const ids = [1,2,4,6]
  return ids.map(id => {
    const com = mockCommodities.find(c=>c.id===id)!
    const cur = latest(id)
    const a7 = avg(id, 7)
    const ch7 = pctChange(cur, a7)
    const s = series(id)
    return { com, cur, ch7, labels: s.map(p=>p.date.slice(5)), values: s.map(p=>p.price) }
  })
})
</script>
<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-bold text-slate-900">Dashboard</h1>
      <p class="text-sm text-slate-500">Ringkasan harga di {{ business.current?.city_name ?? mockBusiness.city_name }} — zona Asia/Jakarta</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <AppCard v-for="c in cards" :key="c.com.id">
        <p class="text-xs text-slate-500">{{ c.com.name }} ({{ c.com.unit }})</p>
        <p class="text-lg font-bold text-slate-900 mt-1">{{ formatIDR(c.cur) }}</p>
        <div class="mt-1 flex items-center gap-2">
          <AppBadge :tone="c.ch7>5 ? 'red' : c.ch7<-5 ? 'green' : 'slate'">{{ c.ch7>0?'+':'' }}{{ c.ch7.toFixed(1) }}% /7h</AppBadge>
          <span class="text-xs text-slate-500">vs rata-rata 7 hari</span>
        </div>
      </AppCard>
    </div>

    <AppCard>
      <template #header><h2 class="font-semibold text-slate-900">Tren 30 hari — Cabai Rawit Merah</h2></template>
      <PriceChart :labels="cards[0]?.labels ?? []" :values="cards[0]?.values ?? []" label="Cabai Rawit Merah" />
      <p class="text-xs text-slate-500 mt-2">Lonjakan di 2 hari terakhir memicu alert. Lihat menu terdampak di bawah.</p>
    </AppCard>

    <AppCard>
      <template #header><div class="flex items-center justify-between"><h2 class="font-semibold text-slate-900">Alert terbaru</h2><router-link to="/alerts" class="text-xs underline">Lihat semua</router-link></div></template>
      <div class="space-y-3">
        <div v-for="a in mockAlerts" :key="a.id" class="rounded-lg border border-slate-200 p-3" :class="a.severity==='critical' ? 'bg-red-50/50 border-red-200' : 'bg-white'">
          <div class="flex items-center gap-2">
            <AppBadge :tone="a.severity==='critical'?'red':(a.severity as string)==='info'?'blue':'amber'">{{ a.severity }}</AppBadge>
            <span class="text-xs text-slate-500">{{ a.status }}</span>
          </div>
          <p class="font-medium text-slate-900 mt-1 text-sm">{{ a.title }}</p>
          <p class="text-sm text-slate-600">{{ a.message }}</p>
        </div>
      </div>
    </AppCard>
  </div>
</template>
