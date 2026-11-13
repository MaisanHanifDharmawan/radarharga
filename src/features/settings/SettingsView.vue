<script setup lang="ts">
import { ref } from 'vue'
import { useBusinessStore } from '@/stores/business'
import { isSupabaseConfigured } from '@/lib/supabase'
import AppCard from '@/components/AppCard.vue'
import AppButton from '@/components/AppButton.vue'

const business = useBusinessStore(); business.ensureMock()
const name = ref(business.current?.name ?? '')
const targetMargin = ref(business.current?.target_margin_pct ?? 35)

const channels = ref([
  { id: '1', channel: 'in_app', destination: '—', is_active: true },
  { id: '2', channel: 'email', destination: 'owner@warung.id', is_active: true },
  { id: '3', channel: 'whatsapp', destination: '+62 812 •••• ••••', is_active: false },
])

function save(){
  if (business.current){
    business.current.name = name.value
    business.current.target_margin_pct = targetMargin.value
  }
}
</script>
<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-bold text-slate-900">Pengaturan</h1>
      <p class="text-sm text-slate-500">Profil, bisnis, dan kanal notifikasi.</p>
    </div>

    <AppCard>
      <template #header><h2 class="font-semibold text-slate-900 text-sm">Bisnis</h2></template>
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-medium text-slate-700">Nama bisnis</label>
          <input v-model="name" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-700">Kota</label>
          <input :value="business.current?.city_name" disabled class="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-700">Target margin (%)</label>
          <input v-model.number="targetMargin" type="number" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <AppButton @click="save" class="w-full">Simpan</AppButton>
      </div>
    </AppCard>

    <AppCard>
      <template #header><h2 class="font-semibold text-slate-900 text-sm">Kanal notifikasi</h2></template>
      <div class="space-y-2">
        <div v-for="c in channels" :key="c.id" class="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
          <div>
            <p class="text-sm font-medium text-slate-900">{{ c.channel }}</p>
            <p class="text-xs text-slate-500">Tujuan: {{ c.destination }} • nomor/token tidak ditampilkan penuh di frontend</p>
          </div>
          <label class="flex items-center gap-2 text-xs">
            <input type="checkbox" v-model="c.is_active" /> Aktif
          </label>
        </div>
        <p class="text-xs text-slate-500">Urutan: in-app (Realtime) → email (Resend) → WhatsApp (Fonnte/WA Business) → web push (tahap lanjut).</p>
      </div>
    </AppCard>

    <AppCard>
      <template #header><h2 class="font-semibold text-slate-900 text-sm">Koneksi Supabase</h2></template>
      <p class="text-sm" :class="isSupabaseConfigured ? 'text-green-700' : 'text-amber-700'">
        {{ isSupabaseConfigured ? 'Terhubung — VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY terdeteksi.' : 'Mode dummy — set .env (lihat .env.example) lalu jalankan migration agar data tersimpan.' }}
      </p>
    </AppCard>
  </div>
</template>
