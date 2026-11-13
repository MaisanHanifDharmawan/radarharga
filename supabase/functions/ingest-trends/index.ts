// Edge Function: ingest-trends — adapter global (tanpa business_id)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (_req) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { data: keywords } = await supabase.from('search_keywords').select('id').eq('is_active', true)
  const { data: cities } = await supabase.from('cities').select('id').limit(10)
  const today = new Date().toISOString().slice(0, 10)
  const rows: Array<{ keyword_id: number; city_id: number; interest_score: number; trend_date: string }> = []
  for (const k of (keywords ?? []) as Array<{ id: number }>) {
    for (const c of (cities ?? []) as Array<{ id: number }>) {
      rows.push({ keyword_id: k.id, city_id: c.id, interest_score: Math.floor(Math.random() * 60) + 20, trend_date: today })
    }
  }
  if (rows.length) {
    const { error } = await supabase.from('search_trends').upsert(rows, { onConflict: 'keyword_id,city_id,trend_date' })
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
  return new Response(JSON.stringify({ inserted: rows.length }), { headers: { 'content-type': 'application/json' } })
})
