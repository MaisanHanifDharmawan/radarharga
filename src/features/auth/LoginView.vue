<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppCard from '@/components/AppCard.vue'
import AppButton from '@/components/AppButton.vue'

const router = useRouter()
const auth = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await auth.signIn(email.value, password.value)
    router.push('/admin')
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Gagal masuk. Cek Supabase env atau kredensial.'
  } finally { loading.value = false }
}
</script>
<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-10 bg-slate-50">
    <div class="w-full max-w-md">
      <h1 class="text-2xl font-bold text-slate-900 text-center">Masuk Admin — RadarHarga</h1>
      <p class="text-sm text-slate-500 text-center mt-2">Khusus admin (invite manual). Pengunjung tidak perlu login.</p>
      <AppCard class="mt-6">
        <form @submit.prevent="onSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700">Email</label>
            <input v-model="email" type="email" required class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10" placeholder="nama@email.com" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700">Kata sandi</label>
            <input v-model="password" type="password" required class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="••••••••" />
          </div>
          <p v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{{ error }}</p>
          <AppButton type="submit" :loading="loading" class="w-full">Masuk</AppButton>
          <p class="text-sm text-center text-slate-500"><router-link to="/" class="text-slate-900 underline">← Kembali ke situs publik</router-link></p>
          <p class="text-xs text-center text-slate-400">Mode demo: tanpa Supabase tetap bisa jelajah (data dummy).</p>
        </form>
      </AppCard>
    </div>
  </div>
</template>
