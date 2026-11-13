<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockCities, mockCommodities } from '@/mocks'
import { useBusinessStore } from '@/stores/business'
import AppCard from '@/components/AppCard.vue'
import AppButton from '@/components/AppButton.vue'

const router = useRouter()
const business = useBusinessStore()

const name = ref('Warung Ayam Geprek Bu Siti')
const type = ref<'restaurant'|'reseller'>('restaurant')
const cityId = ref<number>(2)
const targetMargin = ref<number>(35)
const selected = ref<number[]>([1,2,4,5,6])

const pickedCities = computed(() => mockCities)
const pickedCommodities = computed(() => mockCommodities)

function toggle(id: number) {
  if (selected.value.includes(id)) selected.value = selected.value.filter(x=>x!==id)
  else selected.value = [...selected.value, id]
}

function submit() {
  const city = mockCities.find(c=>c.id===cityId.value)
  business.setBusiness({
    id: crypto.randomUUID(),
    name: name.value,
    type: type.value,
    city_id: cityId.value,
    city_name: city?.name ?? 'Bandung',
    target_margin_pct: targetMargin.value,
  } as never)
  // TODO: simpan ke Supabase businesses + business_commodities + business_members saat sudah connect
  router.push('/')
}
</script>
<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-2xl">
      <h1 class="text-2xl font-bold text-slate-900">Siapkan bisnismu</h1>
      <p class="text-sm text-slate-500 mt-1">Pilih kota & komoditas yang ingin kamu pantau. Bisa diubah nanti di Pengaturan.</p>
      <AppCard class="mt-6">
        <div class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-slate-700">Nama bisnis</label>
            <input v-model="name" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700">Tipe bisnis</label>
              <select v-model="type" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white">
                <option value="restaurant">Restoran / Warung</option>
                <option value="reseller">Reseller / Sembako</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700">Kota</label>
              <select v-model.number="cityId" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white">
                <option v-for="c in pickedCities" :key="c.id" :value="c.id">{{ c.name }} — {{ c.province }}</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700">Target margin (%)</label>
            <input v-model.number="targetMargin" type="number" min="5" max="80" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <p class="text-xs text-slate-500 mt-1">Dipakai untuk saran harga jual: harga = HPP / (1 - margin)</p>
          </div>
          <div>
            <p class="block text-sm font-medium text-slate-700">Komoditas yang dipantau</p>
            <div class="mt-2 flex flex-wrap gap-2">
              <button v-for="c in pickedCommodities" :key="c.id" type="button" @click="toggle(c.id)" class="px-3 py-1.5 rounded-full text-xs font-medium border"
                :class="selected.includes(c.id) ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'">
                {{ c.name }} <span class="opacity-60">({{ c.unit }})</span>
              </button>
            </div>
          </div>
          <AppButton class="w-full" @click="submit">Simpan & lanjut ke Dashboard</AppButton>
          <p class="text-xs text-center text-slate-400">Saat Supabase tersambung, data ini akan disimpan ke tabel businesses & business_commodities.</p>
        </div>
      </AppCard>
    </div>
  </div>
</template>
