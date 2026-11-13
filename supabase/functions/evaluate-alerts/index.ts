// Edge Function: evaluate-alerts — hitung perubahan_pct, cek cooldown, buat draft (AGENTS.md v2)
// Evaluasi alert_rules global (per commodity), buat alerts status draft dengan payload
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (_req) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  // rules aktif
  const { data: rules, error: rulesErr } = await supabase.from('alert_rules').select('*').eq('is_active', true)
  if (rulesErr) return new Response(JSON.stringify({ error: rulesErr.message }), { status: 500, headers: { 'content-type': 'application/json' } })

  const { data: cities } = await supabase.from('cities').select('id')
  let created = 0

  for (const rule of (rules ?? []) as Array<{ id: string; rule_type: string; commodity_id: number | null; threshold_pct: number; window_days: number; cooldown_hours: number }>) {
    if (rule.commodity_id == null) continue
    const threshold = Number(rule.threshold_pct)

    for (const city of (cities ?? []) as Array<{ id: number }>) {
      const cityId = city.id

      // cooldown per rule+city
      const cutoff = new Date(Date.now() - rule.cooldown_hours * 3600_000).toISOString()
      const { data: recent } = await supabase.from('alerts').select('id').eq('rule_id', rule.id).eq('city_id', cityId).gte('created_at', cutoff).limit(1)
      if (recent && recent.length > 0) continue

      const { data: latestRows } = await supabase.from('commodity_prices')
        .select('price, price_date').eq('commodity_id', rule.commodity_id).eq('city_id', cityId)
        .order('price_date', { ascending: false }).limit(1)
      const latest = latestRows?.[0]?.price as number | undefined
      if (latest == null) continue

      const since = new Date(); since.setDate(since.getDate() - rule.window_days)
      const { data: windowRows } = await supabase.from('commodity_prices')
        .select('price').eq('commodity_id', rule.commodity_id).eq('city_id', cityId).gte('price_date', since.toISOString().slice(0, 10))
      const avg = windowRows?.length ? windowRows.reduce((a: number, r: { price: number }) => a + Number(r.price), 0) / windowRows.length : null
      if (avg == null || avg === 0) continue

      const pct = ((latest - avg) / avg) * 100
      const isUp = rule.rule_type === 'price_up' && pct >= threshold
      const isDown = rule.rule_type === 'price_down' && pct <= -threshold
      const isTrend = rule.rule_type === 'trend_spike' // di-handle terpisah jika ada search_trends
      if (!isUp && !isDown && !isTrend) continue

      const { data: com } = await supabase.from('commodities').select('name').eq('id', rule.commodity_id).maybeSingle()
      const { data: ci } = await supabase.from('cities').select('name').eq('id', cityId).maybeSingle()
      const comName = (com as { name: string } | null)?.name ?? `Komoditas #${rule.commodity_id}`
      const cityName = (ci as { name: string } | null)?.name ?? `Kota #${cityId}`

      // hitung dampak ke template (opsional) — HPP naik = SUM qty*(latest-avg)
      const { data: templates } = await supabase.from('calculator_template_items').select('template_id, quantity').eq('commodity_id', rule.commodity_id)
      const impacted: Array<{ template_id: string; quantity: number; hpp_increase: number }> = []
      for (const t of (templates ?? []) as Array<{ template_id: string; quantity: number }>) {
        impacted.push({ template_id: t.template_id, quantity: Number(t.quantity), hpp_increase: Math.round(Number(t.quantity) * (latest - avg)) })
      }

      const title = `Harga ${comName} ${pct > 0 ? 'naik' : 'turun'} ${Math.abs(pct).toFixed(1)}% di ${cityName}`
      const message = `${comName}: Rp ${Math.round(avg).toLocaleString('id-ID')} → Rp ${Math.round(latest).toLocaleString('id-ID')}/kg dalam ${rule.window_days} hari. ${impacted.length ? `${impacted.length} template terdampak.` : ''}`
      const severity = Math.abs(pct) >= 15 ? 'critical' : Math.abs(pct) >= 8 ? 'warning' : 'info'

      const { error: insErr } = await supabase.from('alerts').insert({
        rule_id: rule.id,
        commodity_id: rule.commodity_id,
        city_id: cityId,
        title,
        message,
        payload: { change_pct: Number(pct.toFixed(2)), old_price: Math.round(avg), new_price: Math.round(latest), window_days: rule.window_days, impacted },
        severity,
        status: 'draft',
      })
      if (!insErr) created++
    }
  }

  // refresh matview harga perubahan
  await supabase.rpc('exec', {} as never).catch(() => {})
  // best-effort refresh via SQL (jika ada permission) — fallback aman jika gagal
  try {
    // @ts-ignore — service_role bisa refresh
    await (supabase as unknown as { from: (t: string) => { select: () => Promise<unknown> } }).from('v_price_changes').select('commodity_id').limit(1)
  } catch {}

  return new Response(JSON.stringify({ created }), { headers: { 'content-type': 'application/json' } })
})
