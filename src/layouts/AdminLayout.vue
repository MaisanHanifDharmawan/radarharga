<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const mobileOpen = ref(false)

const nav = [
  { to: '/admin', label: 'Ringkasan', icon: '◧' },
  { to: '/admin/commodities', label: 'Komoditas', icon: '◈' },
  { to: '/admin/cities', label: 'Kota', icon: '◎' },
  { to: '/admin/prices', label: 'Harga', icon: '₿' },
  { to: '/admin/competitors', label: 'Kompetitor', icon: '◎' },
  { to: '/admin/keywords', label: 'Keywords', icon: '#' },
  { to: '/admin/alerts', label: 'Alerts', icon: '🔔' },
  { to: '/admin/rules', label: 'Rules', icon: '⚙' },
  { to: '/admin/templates', label: 'Template', icon: '≡' },
  { to: '/admin/subscribers', label: 'Pelanggan', icon: '✉' },
  { to: '/admin/sources', label: 'Sumber', icon: '◉' },
]

async function logout() {
  await auth.signOut()
  router.push('/admin/login')
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <button class="md:hidden p-2 rounded-lg border border-slate-200" @click="mobileOpen = !mobileOpen" aria-label="Menu">☰</button>
          <router-link to="/admin" class="font-bold text-slate-900">RadarHarga — Admin</router-link>
          <router-link to="/" class="hidden sm:inline text-xs px-2 py-1 rounded-full border border-slate-200 hover:bg-slate-50">Lihat situs</router-link>
        </div>
        <button class="text-sm px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800" @click="logout">Keluar</button>
      </div>
      <nav v-if="mobileOpen" class="md:hidden border-t border-slate-200 bg-white px-2 py-2 grid grid-cols-2 gap-2">
        <router-link v-for="n in nav" :key="n.to" :to="n.to" class="text-sm px-3 py-2 rounded-lg border bg-white border-slate-200" @click="mobileOpen=false">{{ n.icon }} {{ n.label }}</router-link>
      </nav>
    </header>
    <div class="flex-1 max-w-6xl w-full mx-auto flex">
      <aside class="hidden md:block w-56 shrink-0 border-r border-slate-200 bg-white">
        <nav class="p-3 space-y-1 sticky top-14">
          <router-link v-for="n in nav" :key="n.to" :to="n.to" class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-transparent hover:bg-slate-50 text-slate-700">
            <span class="w-6 text-center">{{ n.icon }}</span>{{ n.label }}
          </router-link>
        </nav>
      </aside>
      <main class="flex-1 min-w-0 p-4 md:p-6 bg-slate-50">
        <router-view />
      </main>
    </div>
  </div>
</template>
