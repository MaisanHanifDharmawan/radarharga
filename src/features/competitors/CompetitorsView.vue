<script setup lang="ts">
import { ref } from 'vue'
import { mockCompetitors, mockCompetitorPrices } from '@/mocks'
import { formatIDR, formatDateID } from '@/lib/format'
import AppCard from '@/components/AppCard.vue'
import AppButton from '@/components/AppButton.vue'

const competitors = ref([...mockCompetitors])
const prices = ref([...mockCompetitorPrices])
const newCompName = ref('')
const newCompNote = ref('')
const newPrice = ref({ competitor_id: '', item_name: '', price: 20000, observed_at: new Date().toISOString().slice(0,10) })

function addCompetitor(){
  if (!newCompName.value.trim()) return
  competitors.value.push({ id: 'c'+Date.now(), name: newCompName.value.trim(), note: newCompNote.value.trim() })
  newCompName.value=''; newCompNote.value=''
}
function addPrice(){
  if (!newPrice.value.competitor_id || !newPrice.value.item_name.trim()) return
  prices.value.push({ id: 'cp'+Date.now(), competitor_id: newPrice.value.competitor_id, item_name: newPrice.value.item_name.trim(), price: newPrice.value.price, observed_at: newPrice.value.observed_at })
  newPrice.value.item_name=''; newPrice.value.price=20000
}
function compName(id:string){ return competitors.value.find(c=>c.id===id)?.name ?? id }
</script>
<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-bold text-slate-900">Kompetitor</h1>
      <p class="text-sm text-slate-500">Input manual harga kompetitor (bukan scraping). Bandingkan dengan harga jualmu.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <AppCard>
        <template #header><h2 class="font-semibold text-slate-900 text-sm">Daftar kompetitor</h2></template>
        <div class="space-y-3">
          <div v-for="c in competitors" :key="c.id" class="rounded-lg border border-slate-200 px-3 py-2">
            <p class="text-sm font-medium text-slate-900">{{ c.name }}</p>
            <p class="text-xs text-slate-500">{{ c.note || '—' }}</p>
          </div>
          <div class="pt-2 border-t border-slate-100 space-y-2">
            <input v-model="newCompName" placeholder="Nama kompetitor" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input v-model="newCompNote" placeholder="Catatan (opsional)" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <AppButton class="w-full" @click="addCompetitor">+ Tambah kompetitor</AppButton>
          </div>
        </div>
      </AppCard>

      <AppCard>
        <template #header><h2 class="font-semibold text-slate-900 text-sm">Harga kompetitor</h2></template>
        <div class="space-y-2">
          <div v-for="p in prices" :key="p.id" class="rounded-lg border border-slate-200 px-3 py-2 flex items-center justify-between gap-2">
            <div>
              <p class="text-sm font-medium text-slate-900">{{ p.item_name }}</p>
              <p class="text-xs text-slate-500">{{ compName(p.competitor_id) }} • {{ formatDateID(p.observed_at) }}</p>
            </div>
            <p class="text-sm font-bold text-slate-900">{{ formatIDR(p.price) }}</p>
          </div>
          <div class="pt-3 border-t border-slate-100 space-y-2">
            <select v-model="newPrice.competitor_id" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white">
              <option value="">Pilih kompetitor</option>
              <option v-for="c in competitors" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
            <input v-model="newPrice.item_name" placeholder="Nama item (mis. Ayam Geprek)" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <div class="grid grid-cols-2 gap-2">
              <input v-model.number="newPrice.price" type="number" class="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              <input v-model="newPrice.observed_at" type="date" class="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <AppButton class="w-full" @click="addPrice">+ Tambah harga</AppButton>
          </div>
        </div>
      </AppCard>
    </div>

    <AppCard>
      <template #header><h2 class="font-semibold text-slate-900 text-sm">Perbandingan</h2></template>
      <p class="text-sm text-slate-600">Harga kamu untuk <b>Ayam Geprek Rp 20.000</b> vs rata-rata kompetitor <b>{{ formatIDR(Math.round(prices.filter(p=>p.item_name.toLowerCase().includes('geprek')).reduce((a,b)=>a+b.price,0)/(prices.filter(p=>p.item_name.toLowerCase().includes('geprek')).length||1) || 22000)) }}</b>.</p>
      <p class="text-xs text-slate-500 mt-1">Gunakan ini untuk saran kenaikan harga di Alert.</p>
    </AppCard>
  </div>
</template>
