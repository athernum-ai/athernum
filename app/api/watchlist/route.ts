import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = url && serviceKey ? createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } }) : null

function jsonError(message: string, status = 500) {
  return NextResponse.json({ ok: false, error: message }, { status })
}

export async function POST(req: Request) {
  if (!supabase) return jsonError('Supabase env vars not configured')

  let symbol: string | undefined
  try {
    const body = await req.json()
    symbol = body?.symbol?.toUpperCase()
  } catch {
    return jsonError('Invalid JSON', 400)
  }

  if (!symbol) return jsonError('Symbol required', 400)

  const { error } = await supabase
    .from('watchlist')
    .upsert({ symbol, position: 0 }, { onConflict: 'symbol' })

  if (error) {
    console.error('watchlist POST error', error)
    return jsonError(error.message, 500)
  }

  return NextResponse.json({ ok: true, symbol })
}

export async function DELETE(req: Request) {
  if (!supabase) return jsonError('Supabase env vars not configured')

  let symbol: string | undefined
  try {
    const body = await req.json()
    symbol = body?.symbol?.toUpperCase()
  } catch {
    return jsonError('Invalid JSON', 400)
  }

  if (!symbol) return jsonError('Symbol required', 400)

  const { error } = await supabase.from('watchlist').delete().eq('symbol', symbol)
  if (error) {
    console.error('watchlist DELETE error', error)
    return jsonError(error.message, 500)
  }

  return NextResponse.json({ ok: true, symbol })
}
