import { defineStore } from 'pinia'
import { mockBusiness } from '@/mocks'

export type Business = typeof mockBusiness

export const useBusinessStore = defineStore('business', {
  state: () => ({
    current: null as Business | null,
    loading: false,
  }),
  actions: {
    // dummy-first: pakai mock; nanti ganti query Supabase di features/onboarding/api.ts
    ensureMock() {
      if (!this.current) this.current = mockBusiness
    },
    setBusiness(b: Business) {
      this.current = b
    },
  },
})
