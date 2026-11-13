import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })
}

Deno.serve(async (req) => {
  const body = await req.json().catch(() => ({})) as Record<string, unknown>
  const token = (body.token ?? new URL(req.url).searchParams.get('token')) as string | undefined
  if (!token) return json({ error: 'Token wajib.' }, 400)
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { data, error } = await supabase.from('subscribers').select('id').eq('unsubscribe_token', token).maybeSingle()
  if (error) return json({ error: error.message }, 500)
  if (!data) return json({ error: 'Token tidak valid.' }, 404)
  const { error: updErr } = await supabase.from('subscribers').update({ unsubscribed_at: new Date().toISOString() }).eq('id', (data as { id: string }).id)
  if (updErr) return json({ error: updErr.message }, 500)
  return json({ ok: true })
})
