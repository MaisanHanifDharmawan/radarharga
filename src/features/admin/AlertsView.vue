<script setup lang="ts">
import { mockAlerts } from '@/mocks'
import AppBadge from '@/components/AppBadge.vue'
</script>
<template>
  <div>
    <h1 class="text-lg font-bold text-slate-900">Alerts — review draft</h1>
    <p class="text-sm text-slate-500">Evaluator buat draft → admin terbitkan/arsipkan. Idempotent + cooldown.</p>
    <div class="mt-4 space-y-3">
      <div v-for="a in mockAlerts" :key="a.id" class="rounded-xl border p-4 bg-white">
        <div class="flex items-center gap-2"><AppBadge :tone="a.severity==='critical'?'red':'amber'">{{ a.severity }}</AppBadge><span class="text-xs text-slate-500">{{ a.status }}</span></div>
        <p class="font-medium text-slate-900 text-sm mt-1">{{ a.title }}</p>
        <p class="text-sm text-slate-600">{{ a.message }}</p>
        <div class="mt-3 flex gap-2">
          <button class="text-xs px-3 py-1.5 rounded-full bg-slate-900 text-white">Terbitkan</button>
          <button class="text-xs px-3 py-1.5 rounded-full border border-slate-200">Arsipkan</button>
        </div>
      </div>
    </div>
  </div>
</template>
