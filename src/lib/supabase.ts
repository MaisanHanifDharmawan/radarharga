import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

function createMockClient() {
  const warn = () => console.warn('[Supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY belum diset — pakai mode dummy.')
  const chain = new Proxy({}, {
    get(_t, prop) {
      if (prop === 'then') return undefined
      return (..._args: unknown[]) => {
        warn()
        return chain
      }
    },
  })
  return new Proxy({}, {
    get(_t, prop) {
      if (prop === 'auth') {
        return {
          getSession: async () => ({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
          signInWithPassword: async () => { warn(); return { data: { user: null, session: null }, error: { message: 'Supabase belum dikonfigurasi' } as never } },
          signUp: async () => { warn(); return { data: { user: null, session: null }, error: { message: 'Supabase belum dikonfigurasi' } as never } },
          signInWithOtp: async () => { warn(); return { data: {}, error: { message: 'Supabase belum dikonfigurasi' } as never } },
          signOut: async () => { warn(); return { error: null } },
        }
      }
      if (prop === 'channel' || prop === 'removeChannel') return () => ({ on() { return this }, subscribe() { return this } })
      return () => chain
    },
  }) as never
}

export const supabase = url && anonKey ? createClient(url, anonKey) : createMockClient()
export const isSupabaseConfigured = Boolean(url && anonKey)
