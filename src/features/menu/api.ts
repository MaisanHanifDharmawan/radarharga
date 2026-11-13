import { supabase } from '@/lib/supabase'
export async function listMenu(businessId: string){
  const { data, error } = await supabase.from('menu_items').select('*, menu_item_ingredients(*)').eq('business_id', businessId)
  if (error) throw error
  return data
}
export async function createMenu(payload: { business_id: string; name: string; selling_price: number }){
  const { data, error } = await supabase.from('menu_items').insert(payload).select().single()
  if (error) throw error
  return data
}
