import { supabase } from '@/lib/supabase'
export async function listCommodityPrices(commodityId: number, cityId: number, days = 30) {
  const since = new Date(); since.setDate(since.getDate()-days)
  const { data, error } = await supabase.from('commodity_prices')
    .select('*').eq('commodity_id', commodityId).eq('city_id', cityId)
    .gte('price_date', since.toISOString().slice(0,10)).order('price_date', { ascending: true })
  if (error) throw error
  return data
}
