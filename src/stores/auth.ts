import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { Session, User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    session: null as Session | null,
    loading: true as boolean,
    initialized: false as boolean,
  }),
  getters: {
    isAuthenticated: (s) => !!s.session,
  },
  actions: {
    async init() {
      if (this.initialized) return
      const { data } = await supabase.auth.getSession()
      this.session = data.session ?? null
      this.user = data.session?.user ?? null
      this.loading = false
      this.initialized = true
      supabase.auth.onAuthStateChange((_e, session) => {
        this.session = session
        this.user = session?.user ?? null
      })
    },
    async signIn(email: string, password: string) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return data
    },
    async signUp(email: string, password: string, fullName?: string) {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: fullName } },
      })
      if (error) throw error
      return data
    },
    async signInWithOtp(email: string) {
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) throw error
    },
    async signOut() {
      await supabase.auth.signOut()
      this.session = null
      this.user = null
    },
  },
})
