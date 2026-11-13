<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppCard from '@/components/AppCard.vue'
import AppButton from '@/components/AppButton.vue'

const router = useRouter()
const auth = useAuthStore()
const fullName = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const done = ref(false)

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await auth.signUp(email.value, password.value, fullName.value)
    done.value = true
    setTimeout(() => router.push('/login'), 1200)
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Gagal daftar.'
  } finally { loading.value = false }
}
</script>
<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-10 bg-slate-50">
    <div class="w-full max-w-md">
      <h1 class="text-2xl font-bold text-slate-900 text-center">Daftar akun</h1>
      <AppCard class="mt-6">
        <form @submit.prevent="onSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700">Nama lengkap</label>
            <input v-model="fullName" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Nama kamu" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700">Email</label>
            <input v-model="email" type="email" required class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700">Kata sandi</label>
            <input v-model="password" type="password" required class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <p v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{{ error }}</p>
          <p v-if="done" class="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">Berhasil! Cek email untuk verifikasi.</p>
          <AppButton type="submit" :loading="loading" class="w-full">Daftar</AppButton>
          <p class="text-sm text-center text-slate-500"><RouterLink to="/login" class="underline text-slate-900">Kembali ke masuk</RouterLink></p>
        </form>
      </AppCard>
    </div>
  </div>
</template>
