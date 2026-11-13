// Akses Supabase terpusat untuk fitur auth — jangan panggil supabase langsung dari komponen
import { supabase } from '@/lib/supabase'
export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}
