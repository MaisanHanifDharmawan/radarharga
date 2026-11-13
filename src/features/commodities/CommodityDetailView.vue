<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mockCommodities, mockCommodityPrices } from '@/mocks'
import { formatIDR, pctChange } from '@/lib/format'
import AppCard from '@/components/AppCard.vue'
import AppButton from '@/components/AppButton.vue'
import PriceChart from '@/components/PriceChart.vue'

const route = useRoute()
const router = useRouter()
const id = computed(() => Number(route.params.id))
const com = computed(() => mockCommodities.find(c=>c.id===id.value))
const series = computed(() => mockCommodityPrices[id.value] ?? mockCommodityPrices[1] ?? [])
const cur = computed(() => series.value[series.value.length-1]?.price ?? 0)
const avg7 = computed(() => series.value.slice(-7).reduce((a,b)=>a+b.price,0)/7)
const avg30 = computed(() => series.value.slice(-30).reduce((a,b)=>a+b.price,0)/30)
</script>
<template>
  <div class="space-y-4">
    <AppButton variant="secondary" @click="router.back()">← Kembali</AppButton>
    <div v-if="!com" class="text-sm text-slate-500">Komoditas tidak ditemukan.</div>
    <template v-else>
      <div>
        <h1 class="text-xl font-bold text-slate-900">{{ com.name }}</h1>
        <p class="text-sm text-slate-500">{{ com.category }} • satuan {{ com.unit }} • zona Asia/Jakarta</p>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <AppCard class="text-center"><p class="text-xs text-slate-500">Harga terkini</p><p class="font-bold text-slate-900">{{ formatIDR(cur) }}</p></AppCard>
        <AppCard class="text-center"><p class="text-xs text-slate-500">Perubahan 7h</p><p class="font-bold" :class="pctChange(cur,avg7)>0?'text-red-600':'text-green-600'">{{ pctChange(cur,avg7).toFixed(1) }}%</p></AppCard>
        <AppCard class="text-center"><p class="text-xs text-slate-500">Perubahan 30h</p><p class="font-bold" :class="pctChange(cur,avg30)>0?'text-red-600':'text-green-600'">{{ pctChange(cur,avg30).toFixed(1) }}%</p></AppCard>
      </div>
      <AppCard>
        <template #header><h2 class="font-semibold text-slate-900">Grafik 30 hari</h2></template>
        <PriceChart :labels="series.map(s=>s.date.slice(5))" :values="series.map(s=>s.price)" :label="com.name" />
      </AppCard>
      <AppCard>
        <template #header><h2 class="font-semibold text-slate-900">Rumus</h2></template>
        <code class="text-xs bg-slate-100 rounded px-2 py-1">perubahan_pct = (harga_terbaru - rata2_N_hari)/rata2_N_hari * 100</code>
      </AppCard>
    </template>
  </div>
</template>
