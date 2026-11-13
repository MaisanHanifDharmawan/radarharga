<script setup lang="ts">
import { mockCities } from '@/mocks'
</script>
<template>
  <div>
    <h1 class="text-lg font-bold text-slate-900">Kota</h1>
    <p class="text-sm text-slate-500">Master kota (admin only). RLS: tulis hanya is_admin().</p>
    <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4">
      <table class="w-full text-sm">
        <thead class="text-xs text-slate-500"><tr><th class="text-left py-2">Nama</th><th class="text-left">Slug</th><th class="text-left">Provinsi</th></tr></thead>
        <tbody>
          <tr v-for="c in mockCities" :key="c.id" class="border-t border-slate-100"><td class="py-2">{{ c.name }}</td><td class="text-slate-600">{{ c.slug }}</td><td class="text-slate-600">{{ c.province }}</td></tr>
        </tbody>
      </table>
      <p class="text-xs text-slate-400 mt-3">CRUD penuh akan pakai Supabase (anon tidak bisa tulis).</p>
    </div>
  </div>
</template>
