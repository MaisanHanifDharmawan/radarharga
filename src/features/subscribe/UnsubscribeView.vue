<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

const route = useRoute()
const status = ref<'loading'|'ok'|'err'>('loading')
const msg = ref('')

onMounted(async () => {
  const token = route.query.token as string | undefined
  if (!token) { status.value = 'err'; msg.value = 'Token tidak ada.'; return }
  if (!isSupabaseConfigured) { status.value = 'ok'; msg.value = 'Mode demo: berhenti berlangganan disimulasikan.'; return }
  const { error } = await supabase.functions.invoke('unsubscribe', { body: { token } })
  if (error) { status.value = 'err'; msg.value = error.message ?? 'Gagal berhenti.' }
  else { status.value = 'ok'; msg.value = 'Kamu sudah berhenti berlangganan. Tidak akan ada email lagi.' }
})
</script>

<template>
  <div class="max-w-xl mx-auto px-4 py-10 text-center">
    <h1 class="text-xl font-bold text-slate-900">Berhenti berlangganan</h1>
    <p v-if="status==='loading'" class="text-sm text-slate-500 mt-3">Memproses…</p>
    <p v-else-if="status==='ok'" class="text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mt-4">{{ msg }}</p>
    <p v-else class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mt-4">{{ msg }}</p>
    <router-link to="/" class="inline-flex mt-6 text-sm px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50">Kembali ke beranda</router-link>
  </div>
</template>
