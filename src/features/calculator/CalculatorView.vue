<script setup lang="ts">
import { computed, ref } from 'vue'
import { mockCalculatorTemplates, mockCommodities, mockCommodityPrices } from '@/mocks'
import { formatIDR } from '@/lib/format'

type Line = { commodity_id: number; quantity: number; name: string; price: number }

const templates = mockCalculatorTemplates
const selectedId = ref<string>(templates[0]?.id ?? '')
const selling = ref<number>(templates[0]?.default_selling_price ?? 20000)
const targetMargin = ref<number>(30)
const lines = ref<Line[]>([])

function priceFor(id: number): number {
  const s = mockCommodityPrices[id]
  return s?.[s.length - 1]?.price ?? 25000
}

function loadTemplate() {
  const t = templates.find(x => x.id === selectedId.value)
  if (!t) return
  selling.value = t.default_selling_price
  lines.value = t.items.map(it => {
    const com = mockCommodities.find(c => c.id === it.commodity_id)!
    return { commodity_id: it.commodity_id, quantity: it.quantity, name: com.name, price: priceFor(it.commodity_id) }
  })
}
loadTemplate()

function addLine() {
  lines.value.push({ commodity_id: 1, quantity: 0.05, name: 'Cabai Rawit Merah', price: priceFor(1) })
}
function onCommodityChange(idx: number, cid: number) {
  const com = mockCommodities.find(c => c.id === cid)
  if (!com) return
  lines.value[idx].commodity_id = cid
  lines.value[idx].name = com.name
  lines.value[idx].price = priceFor(cid)
}

const hpp = computed(() => lines.value.reduce((a, l) => a + l.quantity * l.price, 0))
const marginPct = computed(() => selling.value ? ((selling.value - hpp.value) / selling.value) * 100 : 0)
const suggested = computed(() => hpp.value / (1 - targetMargin.value / 100))
const kenaikanHpp = computed(() => {
  // simulasi: harga lama = 90% harga sekarang (demo)
  return lines.value.reduce((a, l) => a + l.quantity * (l.price * 0.1), 0)
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-6">
    <h1 class="text-xl font-bold text-slate-900">Kalkulator dampak harga</h1>
    <p class="text-sm text-slate-500">Hitung HPP, margin, dan saran harga jual. Jalan di browser — tanpa akun, tanpa simpan data.</p>

    <div class="mt-4 flex flex-wrap gap-2 items-center">
      <select v-model="selectedId" @change="loadTemplate" class="rounded-full border border-slate-200 px-3 py-2 text-sm bg-white">
        <option v-for="t in templates" :key="t.id" :value="t.id">{{ t.name }}</option>
      </select>
      <button @click="addLine" class="text-sm px-3 py-2 rounded-full border border-slate-200 hover:bg-slate-50">+ Bahan</button>
    </div>

    <div class="mt-6 grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-3">
        <div v-for="(l, i) in lines" :key="i" class="rounded-xl border border-slate-200 p-3 bg-white flex flex-wrap gap-2 items-end">
          <div class="flex-1 min-w-[160px]">
            <label class="text-xs text-slate-500">Bahan</label>
            <select :value="l.commodity_id" @change="onCommodityChange(i, Number(($event.target as HTMLSelectElement).value))" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white">
              <option v-for="c in mockCommodities" :key="c.id" :value="c.id">{{ c.name }} ({{ c.unit }})</option>
            </select>
          </div>
          <div class="w-28">
            <label class="text-xs text-slate-500">Takaran</label>
            <input v-model.number="l.quantity" type="number" step="0.01" min="0" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div class="w-36">
            <label class="text-xs text-slate-500">Harga (IDR)</label>
            <input v-model.number="l.price" type="number" min="0" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <button @click="lines.splice(i,1)" class="text-sm px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">Hapus</button>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-4 grid sm:grid-cols-2 gap-4">
          <div>
            <label class="text-xs text-slate-500">Harga jual sekarang (IDR)</label>
            <input v-model.number="selling" type="number" min="0" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="text-xs text-slate-500">Target margin (%)</label>
            <input v-model.number="targetMargin" type="number" min="0" max="90" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <div class="rounded-xl border border-slate-200 bg-slate-900 text-white p-4">
          <p class="text-xs text-slate-300">HPP saat ini</p>
          <p class="text-2xl font-bold mt-1">{{ formatIDR(Math.round(hpp)) }}</p>
          <p class="text-xs text-slate-400 mt-1">Kenaikan HPP (simulasi +10% bahan): {{ formatIDR(Math.round(kenaikanHpp)) }}</p>
          <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div class="rounded-lg bg-white/10 p-3">
              <p class="text-xs text-slate-300">Margin sekarang</p>
              <p class="font-bold">{{ marginPct.toFixed(1) }}%</p>
            </div>
            <div class="rounded-lg bg-white p-3 text-slate-900">
              <p class="text-xs text-slate-500">Saran harga jual</p>
              <p class="font-bold">{{ formatIDR(Math.round(suggested)) }}</p>
              <p class="text-xs text-slate-500">agar margin {{ targetMargin }}%</p>
            </div>
          </div>
        </div>
        <div class="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          Rumus: <code>perubahan% = (latest - avg_N)/avg_N*100</code> · <code>saran = hpp / (1 - margin)</code>. Estimasi saja — bukan jaminan.
        </div>
      </div>
    </div>
  </div>
</template>
