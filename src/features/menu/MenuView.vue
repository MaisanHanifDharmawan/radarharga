<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockMenuItems, mockCommodities, mockCommodityPrices, mockBusiness } from '@/mocks'
import { formatIDR } from '@/lib/format'
import { useBusinessStore } from '@/stores/business'
import AppCard from '@/components/AppCard.vue'
import AppButton from '@/components/AppButton.vue'
import AppBadge from '@/components/AppBadge.vue'

const business = useBusinessStore(); business.ensureMock()
const items = ref(JSON.parse(JSON.stringify(mockMenuItems)) as typeof mockMenuItems)
const showAdd = ref(false)
const newName = ref('')
const newPrice = ref<number>(18000)
const newIngredients = ref<{ commodity_id:number; qty:number }[]>([{ commodity_id:1, qty:0.05 }])

function commodityName(id:number){ return mockCommodities.find(c=>c.id===id)?.name ?? `#${id}` }
function commodityPrice(id:number){
  const s = mockCommodityPrices[id]
  return s ? s[s.length-1].price : 30000
}
function hppFor(item: typeof mockMenuItems[number]){
  return item.ingredients.reduce((sum, ing) => sum + ing.qty * commodityPrice(ing.commodity_id), 0)
}
function marginFor(item: typeof mockMenuItems[number]){
  const hpp = hppFor(item)
  return item.selling_price ? ((item.selling_price - hpp)/item.selling_price)*100 : 0
}
function suggestedPrice(item: typeof mockMenuItems[number]){
  const hpp = hppFor(item)
  const target = business.current?.target_margin_pct ?? mockBusiness.target_margin_pct
  if (target >= 90) return hpp*2
  return hpp / (1 - target/100)
}
const commodityOptions = computed(()=> mockCommodities)

function addIngredient(){ newIngredients.value.push({ commodity_id: 1, qty: 0.05 }) }
function removeIngredient(i:number){ newIngredients.value.splice(i,1) }
function addMenu(){
  if (!newName.value.trim()) return
  items.value.push({ id: 'm'+Date.now(), name: newName.value.trim(), selling_price: newPrice.value, is_active: true, ingredients: [...newIngredients.value] })
  newName.value=''; newPrice.value=18000; newIngredients.value=[{ commodity_id:1, qty:0.05 }]; showAdd.value=false
}
function removeMenu(id:string){ items.value = items.value.filter(i=>i.id!==id) }

// dampak kenaikan: simulasi cabai +18%
const spikePct = 18
function hppNaik(item: typeof mockMenuItems[number]){
  // anggap cabai rawit (1) naik spikePct
  const cabaiQty = item.ingredients.find(x=>x.commodity_id===1)?.qty ?? 0
  const cabaiPrice = commodityPrice(1)
  return cabaiQty * cabaiPrice * (spikePct/100)
}
</script>
<template>
  <div class="space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold text-slate-900">Menu & HPP</h1>
        <p class="text-sm text-slate-500">HPP = SUM(takaran × harga bahan). Saran harga = HPP / (1 - target_margin).</p>
      </div>
      <AppButton @click="showAdd=!showAdd">{{ showAdd ? 'Tutup' : '+ Tambah menu' }}</AppButton>
    </div>

    <AppCard v-if="showAdd">
      <div class="space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-slate-700">Nama menu</label>
            <input v-model="newName" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Ayam Geprek" />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700">Harga jual (IDR)</label>
            <input v-model.number="newPrice" type="number" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <p class="text-xs font-medium text-slate-700">Bahan (komoditas → takaran dalam unit)</p>
          <div v-for="(ing, idx) in newIngredients" :key="idx" class="mt-2 flex gap-2">
            <select v-model.number="ing.commodity_id" class="flex-1 rounded-lg border border-slate-200 px-2 py-2 text-sm bg-white">
              <option v-for="c in commodityOptions" :key="c.id" :value="c.id">{{ c.name }} ({{ c.unit }})</option>
            </select>
            <input v-model.number="ing.qty" type="number" step="0.01" class="w-28 rounded-lg border border-slate-200 px-2 py-2 text-sm" />
            <button class="text-xs px-2 text-red-600" @click="removeIngredient(idx)" v-if="newIngredients.length>1">Hapus</button>
          </div>
          <button class="mt-2 text-xs underline text-slate-700" @click="addIngredient">+ Bahan</button>
        </div>
        <AppButton class="w-full" @click="addMenu">Simpan menu</AppButton>
      </div>
    </AppCard>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <AppCard v-for="item in items" :key="item.id">
        <div class="flex items-start justify-between gap-2">
          <div>
            <p class="font-semibold text-slate-900">{{ item.name }}</p>
            <p class="text-xs text-slate-500">Bahan: {{ item.ingredients.map(i=>`${commodityName(i.commodity_id)} ${i.qty}`).join(', ') }}</p>
          </div>
          <button class="text-xs text-red-600 underline" @click="removeMenu(item.id)">Hapus</button>
        </div>
        <div class="mt-3 grid grid-cols-3 gap-2 text-center">
          <div class="rounded-lg bg-slate-50 border border-slate-200 p-2">
            <p class="text-[11px] text-slate-500">HPP</p><p class="text-sm font-bold text-slate-900">{{ formatIDR(Math.round(hppFor(item))) }}</p>
          </div>
          <div class="rounded-lg bg-slate-50 border border-slate-200 p-2">
            <p class="text-[11px] text-slate-500">Harga jual</p><p class="text-sm font-bold text-slate-900">{{ formatIDR(item.selling_price) }}</p>
          </div>
          <div class="rounded-lg border p-2" :class="marginFor(item)<15 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'">
            <p class="text-[11px] text-slate-500">Margin</p><p class="text-sm font-bold">{{ marginFor(item).toFixed(1) }}%</p>
          </div>
        </div>
        <div class="mt-3 flex flex-wrap gap-2 text-xs">
          <AppBadge tone="amber">Saran harga: {{ formatIDR(Math.round(suggestedPrice(item))) }}</AppBadge>
          <AppBadge tone="slate">HPP naik {{ formatIDR(Math.round(hppNaik(item))) }} jika cabai +{{ spikePct }}%</AppBadge>
        </div>
      </AppCard>
    </div>
  </div>
</template>
