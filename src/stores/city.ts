import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { kotaDummy } from '@/mocks/prices'

const LS_KEY = 'radarharga:city_slug'

export const useCityStore = defineStore('city', () => {
  const fallback = kotaDummy[0]?.slug ?? 'bandung'
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(LS_KEY) : null
  const selectedSlug = ref<string>(stored && kotaDummy.some(k => k.slug === stored) ? stored : fallback)

  watch(selectedSlug, (v) => {
    try { localStorage.setItem(LS_KEY, v) } catch {}
  })

  function setBySlug(slug: string) {
    if (kotaDummy.some(k => k.slug === slug)) selectedSlug.value = slug
  }
  const namaKota = () => kotaDummy.find(k => k.slug === selectedSlug.value)?.nama ?? 'Bandung'

  return { selectedSlug, setBySlug, namaKota }
})
