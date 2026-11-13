import { supabase } from '@/lib/supabase'
// Dipanggil saat onboarding submit — frontend dummy dulu, ganti ke insert nyata setelah migration dijalankan
export async function createBusiness(payload: { name: string; type: string; city_id: number; target_margin_pct: number }) {
  const { data, error } = await supabase.from('businesses').insert(payload).select().single()
  if (error) throw error
  return data
}
export async function setWatchlist(businessId: string, commodityIds: number[]) {
  const rows = commodityIds.map((commodity_id) => ({ business_id: businessId, commodity_id }))
  const { error } = await supabase.from('business_commodities').insert(rows)
  if (error) throw error
}
