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
  if (!isSupabaseConfigured) { status.value = 'ok'; msg.value = 'Mode demo: verifikasi disimulasikan berhasil.'; return }
  const { error } = await supabase.functions.invoke('verify-subscription', { body: { token } })
  if (error) { status.value = 'err'; msg.value = error.message ?? 'Verifikasi gagal.' }
  else { status.value = 'ok'; msg.value = 'Email terverifikasi. Kamu akan menerima alert sesuai preferensi.' }
})
</script>

<template>
  <div class="max-w-xl mx-auto px-4 py-10 text-center">
    <h1 class="text-xl font-bold text-slate-900">Verifikasi langganan</h1>
    <p v-if="status==='loading'" class="text-sm text-slate-500 mt-3">Memverifikasi…</p>
    <p v-else-if="status==='ok'" class="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 mt-4">{{ msg }}</p>
    <p v-else class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mt-4">{{ msg }}</p>
    <router-link to="/" class="inline-flex mt-6 text-sm px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50">Kembali ke beranda</router-link>
  </div>
</template>
