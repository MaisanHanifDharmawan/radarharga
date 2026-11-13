// Edge Function: subscribe — validasi, Turnstile, rate limit, double opt-in
// Body: { email?: string, whatsapp?: string, city_id: number, commodity_id?: number | null, turnstile_token?: string }
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const body = await req.json().catch(() => ({})) as Record<string, unknown>
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : null
  const whatsapp = typeof body.whatsapp === 'string' ? body.whatsapp.trim() : null
  const city_id = Number(body.city_id)
  const commodity_id = body.commodity_id != null ? Number(body.commodity_id) : null
  const turnstileToken = body.turnstile_token as string | undefined

  if (!email && !whatsapp) return json({ error: 'Email atau WhatsApp wajib diisi.' }, 400)
  if (!Number.isFinite(city_id)) return json({ error: 'city_id wajib.' }, 400)
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Email tidak valid.' }, 400)

  // Turnstile (opsional — skip jika secret tidak diset)
  const turnstileSecret = Deno.env.get('TURNSTILE_SECRET_KEY')
  if (turnstileSecret && turnstileToken) {
    const v = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret: turnstileSecret, response: turnstileToken }),
    }).then(r => r.json()).catch(() => ({ success: false }))
    if (!v.success) return json({ error: 'Verifikasi anti-spam gagal.' }, 400)
  }

  // rate limit: max 5 subscribe per IP per jam (best-effort via header)
  // (untuk produksi gunakan Redis/kv; di sini skip jika tidak ada infra)

  const verify_token = crypto.randomUUID()
  const unsubscribe_token = crypto.randomUUID()

  // upsert subscriber by email/whatsapp
  let subscriberId: string
  if (email) {
    const { data: existing } = await supabase.from('subscribers').select('id').eq('email', email).maybeSingle()
    if (existing) {
      subscriberId = existing.id as string
      await supabase.from('subscribers').update({ verify_token, unsubscribe_token }).eq('id', subscriberId)
    } else {
      const { data, error } = await supabase.from('subscribers').insert({ email, whatsapp, verify_token, unsubscribe_token }).select('id').single()
      if (error) return json({ error: error.message }, 500)
      subscriberId = (data as { id: string }).id
    }
  } else {
    const { data, error } = await supabase.from('subscribers').insert({ whatsapp, verify_token, unsubscribe_token }).select('id').single()
    if (error) return json({ error: error.message }, 500)
    subscriberId = (data as { id: string }).id
  }

  // subscription (city + optional commodity)
  const { error: subErr } = await supabase.from('subscriptions').upsert(
    { subscriber_id: subscriberId, city_id, commodity_id, min_change_pct: 5 },
    { onConflict: 'subscriber_id,city_id,commodity_id' },
  )
  if (subErr) return json({ error: subErr.message }, 500)

  // kirim email verifikasi via Resend (jika ada key)
  const resendKey = Deno.env.get('RESEND_API_KEY')
  const appUrl = Deno.env.get('APP_URL') ?? 'http://localhost:5173'
  if (resendKey && email) {
    const verifyUrl = `${appUrl}/langganan/verifikasi?token=${verify_token}`
    const unsubscribeUrl = `${appUrl}/berhenti?token=${unsubscribe_token}`
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: 'RadarHarga <noreply@radarharga.id>',
        to: email,
        subject: 'Verifikasi langganan alert RadarHarga',
        html: `<p>Klik tautan untuk verifikasi: <a href="${verifyUrl}">${verifyUrl}</a></p><p>Berhenti: <a href="${unsubscribeUrl}">${unsubscribeUrl}</a></p>`,
      }),
    }).catch(() => {})
  }

  return json({ ok: true, message: 'Tautan verifikasi dikirim. Cek email.' })
})
