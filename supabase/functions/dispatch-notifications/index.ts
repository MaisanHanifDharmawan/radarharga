// Edge Function: dispatch-notifications — kirim alerts published ke subscribers yang cocok
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (_req) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  // ambil alerts published terbaru yang belum dikirim (limit)
  const { data: alerts } = await supabase.from('alerts').select('id, title, message, payload, city_id, commodity_id, published_at').eq('status', 'published').order('published_at', { ascending: false }).limit(20)
  if (!alerts?.length) return new Response(JSON.stringify({ sent: 0 }), { headers: { 'content-type': 'application/json' } })

  let sent = 0, failed = 0
  const resendKey = Deno.env.get('RESEND_API_KEY')
  const appUrl = Deno.env.get('APP_URL') ?? 'http://localhost:5173'

  for (const alert of alerts as Array<{ id: string; title: string; message: string; city_id: number | null; commodity_id: number | null }>) {
    // cari subscriptions yang cocok: city_id sama, commodity_id sama atau null (semua), dan sudah verified
    const { data: subs } = await supabase.from('subscriptions').select('subscriber_id, city_id, commodity_id').eq('city_id', alert.city_id!)
    const filtered = (subs ?? []).filter((s: { commodity_id: number | null }) => s.commodity_id == null || s.commodity_id === alert.commodity_id)
    for (const sub of filtered as Array<{ subscriber_id: string }>) {
      const { data: subscriber } = await supabase.from('subscribers').select('id, email, whatsapp, verified_at, unsubscribed_at, unsubscribe_token').eq('id', sub.subscriber_id).maybeSingle() as { data: { email: string | null; whatsapp: string | null; verified_at: string | null; unsubscribed_at: string | null; unsubscribe_token: string | null } | null }
      if (!subscriber?.verified_at || subscriber.unsubscribed_at) continue
      // hindari duplikat: cek sudah ada notification untuk alert+subscriber
      const { data: existing } = await supabase.from('notifications').select('id').eq('alert_id', alert.id).eq('subscriber_id', sub.subscriber_id).limit(1)
      if (existing && existing.length > 0) continue

      const unsubscribeUrl = subscriber.unsubscribe_token ? `${appUrl}/berhenti?token=${subscriber.unsubscribe_token}` : `${appUrl}/berhenti`
      const channel = subscriber.email ? 'email' as const : 'whatsapp' as const

      try {
        if (channel === 'email' && subscriber.email && resendKey) {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${resendKey}`, 'content-type': 'application/json' },
            body: JSON.stringify({
              from: 'RadarHarga <noreply@radarharga.id>',
              to: subscriber.email,
              subject: alert.title,
              html: `<p>${alert.message}</p><p><a href="${appUrl}/alert/${alert.id}">Lihat detail</a></p><p><a href="${unsubscribeUrl}">Berhenti berlangganan</a></p>`,
            }),
          })
        }
        await supabase.from('notifications').insert({ alert_id: alert.id, subscriber_id: sub.subscriber_id, channel, status: 'sent' })
        sent++
      } catch (e) {
        await supabase.from('notifications').insert({ alert_id: alert.id, subscriber_id: sub.subscriber_id, channel, status: 'failed', error_message: e instanceof Error ? e.message : String(e) })
        failed++
      }
    }
  }
  return new Response(JSON.stringify({ sent, failed }), { headers: { 'content-type': 'application/json' } })
})
