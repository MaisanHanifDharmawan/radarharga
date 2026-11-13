<script setup lang="ts">
import { computed } from 'vue'
import { mockAlerts } from '@/mocks'
import AppBadge from '@/components/AppBadge.vue'
import { formatDateID } from '@/lib/format'

const alerts = computed(() => mockAlerts.filter(a => a.status === 'published'))
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-6">
    <h1 class="text-xl font-bold text-slate-900">Arsip alert</h1>
    <p class="text-sm text-slate-500">Alert yang sudah diterbitkan admin. Bisa dibagikan.</p>
    <div class="mt-6 grid md:grid-cols-2 gap-4">
      <router-link v-for="a in alerts" :key="a.id" :to="`/alert/${a.id}`" class="rounded-xl border p-4 hover:shadow-sm transition bg-white" :class="a.severity==='critical' ? 'border-red-200 bg-red-50/40' : 'border-slate-200'">
        <div class="flex items-center gap-2">
          <AppBadge :tone="a.severity==='critical'?'red':a.severity==='warning'?'amber':'blue'">{{ a.severity }}</AppBadge>
          <span class="text-xs text-slate-500">{{ formatDateID(a.published_at) }}</span>
        </div>
        <p class="font-semibold text-slate-900 mt-2 text-sm">{{ a.title }}</p>
        <p class="text-sm text-slate-600 mt-1">{{ a.message }}</p>
        <span class="text-xs text-slate-500 mt-2 inline-flex">Detail →</span>
      </router-link>
    </div>
    <p v-if="alerts.length===0" class="text-sm text-slate-500 mt-6">Belum ada alert.</p>
  </div>
</template>
