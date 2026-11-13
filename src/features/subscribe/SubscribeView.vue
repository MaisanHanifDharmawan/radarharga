<script setup lang="ts">
import { ref } from 'vue'
import { mockCities, mockCommodities } from '@/mocks'
import AppCard from '@/components/AppCard.vue'
import AppButton from '@/components/AppButton.vue'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

const email = ref('')
const citySlug = ref('bandung')
const commodityId = ref<number | ''>('')
const loading = ref(false)
const msg = ref('')
const err = ref('')

async function onSubmit() {
  err.value = ''; msg.value = ''
  if (!email.value) { err.value = 'Email wajib diisi.'; return }
  loading.value = true
  try {
    if (isSupabaseConfigured) {
      const city = mockCities.find(c => c.slug === citySlug.value)
      const { error } = await supabase.functions.invoke('subscribe', {
        body: { email: email.value, city_id: city?.id, commodity_id: commodityId.value || null },
      })
      if (error) throw error
      msg.value = 'Tautan verifikasi dikirim ke email. Cek inbox/spam.'
    } else {
      msg.value = 'Mode demo: Supabase belum dikonfigurasi. Di produksi akan kirim link verifikasi (double opt-in).'
    }
  } catch (e: unknown) {
    err.value = e instanceof Error ? e.message : 'Gagal berlangganan.'
  } finally { loading.value = false }
}
</script>

<template>
  <div class="max-w-xl mx-auto px-4 py-6">
    <h1 class="text-xl font-bold text-slate-900">Langganan alert</h1>
    <p class="text-sm text-slate-500">Tanpa akun. Kami kirim email saat harga melewati batas. Bisa berhenti kapan saja.</p>
    <AppCard class="mt-6">
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700">Email</label>
          <input v-model="email" type="email" required class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="nama@email.com" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-slate-700">Kota</label>
            <select v-model="citySlug" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white">
              <option v-for="c in mockCities" :key="c.id" :value="c.slug">{{ c.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700">Komoditas (opsional)</label>
            <select v-model="commodityId" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white">
              <option :value="''">Semua</option>
              <option v-for="c in mockCommodities.slice(0,8)" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
        </div>
        <p v-if="err" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{{ err }}</p>
        <p v-if="msg" class="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{{ msg }}</p>
        <AppButton type="submit" :loading="loading" class="w-full">Kirim tautan verifikasi</AppButton>
        <p class="text-xs text-slate-400">Dengan berlangganan, kamu setuju menerima email alert. Lihat /tentang untuk detail.</p>
      </form>
    </AppCard>
  </div>
</template>
