<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { mockAlerts } from '@/mocks'
import AppBadge from '@/components/AppBadge.vue'
import { formatDateID, formatIDR } from '@/lib/format'

const route = useRoute()
const id = computed(() => route.params.id as string)
const alert = computed(() => mockAlerts.find(a => a.id === id.value))
function copyLink() {
  const href = typeof window !== 'undefined' ? window.location.href : ''
  if (href) navigator.clipboard?.writeText(href)
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-6">
    <router-link to="/alert" class="text-sm text-slate-600 hover:underline">← Arsip alert</router-link>
    <div v-if="!alert" class="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">Alert tidak ditemukan.</div>
    <template v-else>
      <div class="mt-4 rounded-2xl border p-6" :class="alert.severity==='critical' ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'">
        <div class="flex items-center gap-2">
          <AppBadge :tone="alert.severity==='critical'?'red':alert.severity==='warning'?'amber':'blue'">{{ alert.severity }}</AppBadge>
          <span class="text-xs text-slate-500">{{ formatDateID(alert.published_at) }}</span>
        </div>
        <h1 class="text-xl font-bold text-slate-900 mt-3">{{ alert.title }}</h1>
        <p class="text-sm text-slate-700 mt-2 leading-relaxed">{{ alert.message }}</p>
        <div v-if="(alert.payload as any)?.old_price" class="mt-4 rounded-xl bg-white border border-slate-200 p-3 text-sm">
          <p class="text-slate-600">{{ formatIDR((alert.payload as any).old_price) }} → {{ formatIDR((alert.payload as any).new_price) }} · {{ (alert.payload as any).change_pct }}% dalam {{ (alert.payload as any).window_days ?? 3 }} hari</p>
          <p v-if="(alert.payload as any).impacted_menus" class="text-xs text-slate-500 mt-1">Dampak: {{ ((alert.payload as any).impacted_menus as string[]).join(', ') }}</p>
        </div>
        <div class="mt-6 flex flex-wrap gap-2">
          <router-link to="/kalkulator" class="text-sm px-4 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-800">Hitung menumu →</router-link>
          <button @click="copyLink" class="text-sm px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50">Salin tautan</button>
        </div>
      </div>
      <p class="text-xs text-slate-400 mt-4">Bagikan alert ini — OG meta akan dilengkapi saat deploy.</p>
    </template>
  </div>
</template>
