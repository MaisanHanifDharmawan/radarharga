<script setup lang="ts">
import { computed } from 'vue'
import { useCityStore } from '@/stores/city'
import { mockCities, mockTrends } from '@/mocks'

const cityStore = useCityStore()
const citySlug = computed(() => cityStore.selectedSlug)
const cityName = computed(() => mockCities.find(c => c.slug === citySlug.value)?.name ?? 'Bandung')
const trends = computed(() => mockTrends.filter(t => t.city_slug === citySlug.value))
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-6">
    <h1 class="text-xl font-bold text-slate-900">Tren pencarian di {{ cityName }}</h1>
    <p class="text-sm text-slate-500">Skor minat 0–100 per kata kunci. Data diperbarui harian.</p>

    <div class="mt-4 flex items-center gap-2">
      <span class="text-xs text-slate-500">Kota:</span>
      <select :value="citySlug" @change="cityStore.setBySlug(($event.target as HTMLSelectElement).value)" class="rounded-full border border-slate-200 px-3 py-2 text-sm bg-white">
        <option v-for="c in mockCities" :key="c.id" :value="c.slug">{{ c.name }}</option>
      </select>
    </div>

    <div class="mt-6 rounded-xl border border-slate-200 bg-white p-4">
      <div v-if="trends.length===0" class="text-sm text-slate-500">Belum ada data tren untuk kota ini.</div>
      <div v-else class="space-y-4">
        <div v-for="t in trends" :key="t.keyword" class="flex items-center gap-3">
          <span class="text-sm font-medium text-slate-900 w-36 truncate">{{ t.keyword }}</span>
          <div class="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
            <div class="h-full bg-slate-900 rounded-full" :style="{ width: t.interest_score + '%' }"></div>
          </div>
          <span class="text-sm font-bold text-slate-900 w-10 text-right">{{ t.interest_score }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
