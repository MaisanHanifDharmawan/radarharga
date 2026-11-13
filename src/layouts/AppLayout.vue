<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBusinessStore } from '@/stores/business'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const business = useBusinessStore()
business.ensureMock()
const mobileOpen = ref(false)

const nav = [
  { to: '/', label: 'Dashboard', icon: '◧' },
  { to: '/commodities', label: 'Komoditas', icon: '◈' },
  { to: '/menu', label: 'Menu & HPP', icon: '≡' },
  { to: '/competitors', label: 'Kompetitor', icon: '◎' },
  { to: '/trends', label: 'Tren', icon: '↗' },
  { to: '/alerts', label: 'Alert', icon: '🔔' },
  { to: '/settings', label: 'Pengaturan', icon: '⚙' },
]

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}

async function logout() {
  await auth.signOut()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <button class="md:hidden p-2 rounded-lg border border-slate-200" @click="mobileOpen = !mobileOpen" aria-label="Menu">
            ☰
          </button>
          <router-link to="/" class="font-bold text-slate-900">Price Radar</router-link>
          <span v-if="business.current" class="hidden sm:inline text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {{ business.current.name }} • {{ business.current.city_name }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <router-link to="/alerts" class="text-sm px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50">Alert</router-link>
          <button class="text-sm px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800" @click="logout">Keluar</button>
        </div>
      </div>
      <nav v-if="mobileOpen" class="md:hidden border-t border-slate-200 bg-white px-2 py-2 grid grid-cols-2 gap-2">
        <router-link v-for="n in nav" :key="n.to" :to="n.to" class="text-sm px-3 py-2 rounded-lg border" :class="isActive(n.to) ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200'" @click="mobileOpen=false">
          {{ n.icon }} {{ n.label }}
        </router-link>
      </nav>
    </header>

    <div class="flex-1 max-w-6xl w-full mx-auto flex">
      <aside class="hidden md:block w-56 shrink-0 border-r border-slate-200 bg-white">
        <nav class="p-3 space-y-1 sticky top-14">
          <router-link v-for="n in nav" :key="n.to" :to="n.to" class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border" :class="isActive(n.to) ? 'bg-slate-900 text-white border-slate-900' : 'border-transparent hover:bg-slate-50 text-slate-700'">
            <span class="w-6 text-center">{{ n.icon }}</span>{{ n.label }}
          </router-link>
          <div class="pt-4 text-xs text-slate-500">
            <p>Zona waktu: Asia/Jakarta</p>
            <p class="mt-1">Format: IDR</p>
          </div>
        </nav>
      </aside>
      <main class="flex-1 min-w-0 p-4 md:p-6 bg-slate-50">
        <router-view />
      </main>
    </div>
  </div>
</template>
