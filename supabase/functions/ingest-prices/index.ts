// Edge Function: ingest-prices
// Dijadwalkan pg_cron 06:00 WIB. Ambil harga eksternal, upsert ke commodity_prices, catat ingestion_logs.
// Skeleton ini pakai fetch dummy; ganti base_url & mapping sesuai sumber nyata (PIHPS/Panel Harga).
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, serviceKey)

  let rowsInserted = 0
  let errorMessage: string | null = null
  let sourceId = 1

  try {
    const { data: sources } = await supabase.from('data_sources').select('*').eq('is_active', true).limit(1)
    sourceId = sources?.[0]?.id ?? 1

    // TODO: fetch dari PIHPS/Panel Harga. Contoh dummy: generate harga hari ini
    const today = new Date().toISOString().slice(0, 10)
    const { data: cities } = await supabase.from('cities').select('id').limit(5)
    const { data: commodities } = await supabase.from('commodities').select('id').limit(10)

    const rows: Array<{ commodity_id: number; city_id: number; source_id: number; price: number; price_date: string }> = []
    for (const city of cities ?? []) {
      for (const com of commodities ?? []) {
        rows.push({ commodity_id: com.id, city_id: city.id, source_id: sourceId, price: 20000 + Math.floor(Math.random()*50000), price_date: today })
      }
    }

    if (rows.length) {
      const { error } = await supabase.from('commodity_prices').upsert(rows, { onConflict: 'commodity_id,city_id,source_id,price_date' })
      if (error) throw error
      rowsInserted = rows.length
    }
  } catch (e) {
    errorMessage = e instanceof Error ? e.message : String(e)
  }

  await supabase.from('ingestion_logs').insert({
    source_id: sourceId,
    status: errorMessage ? (rowsInserted ? 'partial' : 'failed') : 'success',
    rows_inserted: rowsInserted,
    error_message: errorMessage,
  })

  return new Response(JSON.stringify({ rowsInserted, errorMessage }), { headers: { 'content-type': 'application/json' } })
})
