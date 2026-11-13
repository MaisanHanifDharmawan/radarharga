<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockCommodities, mockCommodityPrices } from '@/mocks'
import { formatIDR, pctChange } from '@/lib/format'
import AppCard from '@/components/AppCard.vue'
import AppBadge from '@/components/AppBadge.vue'

const q = ref('')
const filtered = computed(() => mockCommodities.filter(c => c.name.toLowerCase().includes(q.value.toLowerCase())))

function latest(id: number) {
  const s = mockCommodityPrices[id]
  if (!s) return { price: 0, d1: 0, d7: 0, d30: 0 }
  const cur = s[s.length-1]?.price ?? 0
  const avg1 = s.slice(-1).reduce((a,b)=>a+b.price,0)/1
  const avg7 = s.slice(-7).reduce((a,b)=>a+b.price,0)/7
  const avg30 = s.slice(-30).reduce((a,b)=>a+b.price,0)/30
  void avg1
  return { price: cur, d1: pctChange(cur, s[s.length-2]?.price ?? cur), d7: pctChange(cur, avg7), d30: pctChange(cur, avg30) }
}
</script>
<template>
  <div class="space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold text-slate-900">Komoditas</h1>
        <p class="text-sm text-slate-500">Harga terkini per kota — perubahan 1/7/30 hari</p>
      </div>
      <input v-model="q" placeholder="Cari komoditas…" class="w-full sm:w-64 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <router-link v-for="c in filtered" :key="c.id" :to="`/commodities/${c.id}`" class="block">
        <AppCard>
          <div class="flex items-center justify-between">
            <p class="font-medium text-slate-900 text-sm">{{ c.name }}</p>
            <AppBadge tone="slate">{{ c.unit }}</AppBadge>
          </div>
          <p class="text-xs text-slate-500">{{ c.category }}</p>
          <p class="text-lg font-bold text-slate-900 mt-2">{{ formatIDR(latest(c.id).price || 28000) }}</p>
          <div class="mt-2 flex flex-wrap gap-1.5">
            <AppBadge :tone="latest(c.id).d1>0?'red':latest(c.id).d1<0?'green':'slate'">1h {{ latest(c.id).d1.toFixed(1) }}%</AppBadge>
            <AppBadge :tone="latest(c.id).d7>0?'red':latest(c.id).d7<0?'green':'slate'">7h {{ latest(c.id).d7.toFixed(1) }}%</AppBadge>
            <AppBadge :tone="latest(c.id).d30>0?'red':latest(c.id).d30<0?'green':'slate'">30h {{ latest(c.id).d30.toFixed(1) }}%</AppBadge>
          </div>
        </AppCard>
      </router-link>
    </div>
  </div>
</template>
