<script setup lang="ts">
import { ref } from 'vue'
import CityPicker from '@/components/papan/CityPicker.vue'

const mobileOpen = ref(false)

const nav = [
  { to: '/harga', label: 'Harga' },
  { to: '/tren', label: 'Tren' },
  { to: '/alert', label: 'Alert' },
  { to: '/kalkulator', label: 'Kalkulator' },
]
</script>

<template>
  <div class="flex min-h-screen flex-col bg-kertas text-tinta">
    <header class="sticky top-0 z-30 border-b border-garis bg-kertas">
      <div class="mx-auto flex h-14 max-w-konten items-center justify-between gap-3 px-4">
        <div class="flex items-center gap-4">
          <button class="min-h-[44px] rounded-kontrol px-2 text-xl md:hidden" aria-label="Buka menu" @click="mobileOpen = !mobileOpen">☰</button>
          <router-link to="/" class="font-angka font-700 text-[22px] uppercase tracking-wide">Price Radar</router-link>
          <nav class="hidden items-center gap-1 md:flex" aria-label="Utama">
            <router-link
              v-for="n in nav" :key="n.to" :to="n.to"
              class="font-isi font-700 text-[15px] px-3 py-2 min-h-[44px] inline-flex items-center underline-offset-4 hover:underline"
            >{{ n.label }}</router-link>
          </nav>
        </div>
        <div class="hidden items-center gap-3 sm:flex">
          <CityPicker variansi="papan" class="text-[15px]" />
          <router-link to="/langganan" class="btn-utama !min-h-[40px] px-4">Berlangganan</router-link>
        </div>
        <router-link to="/langganan" class="btn-utama !min-h-[40px] px-4 sm:hidden">Berlangganan</router-link>
      </div>
      <nav v-if="mobileOpen" class="border-t border-garis bg-kertas px-4 py-3 md:hidden" aria-label="Menu seluler">
        <router-link
          v-for="n in nav" :key="n.to" :to="n.to"
          class="flex min-h-[44px] items-center border-b border-garis font-isi font-700 text-[15px] last:border-b-0"
          @click="mobileOpen = false"
        >{{ n.label }}</router-link>
      </nav>
    </header>

    <main class="flex-1">
      <router-view />
    </main>

    <footer class="border-t-2 border-tinta bg-kertas">
      <div class="mx-auto max-w-konten px-4 py-10">
        <div class="grid gap-8 md:grid-cols-3">
          <div>
            <p class="font-angka font-700 text-[20px] uppercase tracking-wide">Price Radar</p>
            <p class="mt-2 max-w-[36ch] font-isi text-small text-tinta-muda">Harga bahan baku harian per kota untuk pemilik warung, restoran, dan reseller.</p>
          </div>
          <nav class="font-isi text-[15px]" aria-label="Footer">
            <router-link to="/harga" class="block min-h-[32px] py-1 hover:underline">Harga</router-link>
            <router-link to="/tren" class="block min-h-[32px] py-1 hover:underline">Tren pencarian</router-link>
            <router-link to="/alert" class="block min-h-[32px] py-1 hover:underline">Alert</router-link>
            <router-link to="/kalkulator" class="block min-h-[32px] py-1 hover:underline">Kalkulator</router-link>
            <router-link to="/langganan" class="block min-h-[32px] py-1 hover:underline">Berlangganan</router-link>
          </nav>
          <div class="font-isi text-small text-tinta-muda">
            <p>Sumber: PIHPS Nasional (BI) dan Panel Harga Badan Pangan Nasional.</p>
            <p class="mt-2">Pembaruan tiap pagi pukul 06.00 WIB.</p>
            <p class="mt-2">
              <router-link to="/tentang" class="underline underline-offset-4">Tentang</router-link>
              dan
              <router-link to="/admin/login" class="underline underline-offset-4">Admin</router-link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
