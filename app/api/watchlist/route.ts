import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function jsonError(message: string, status = 500) {
  return NextResponse.json({ ok: false, error: message }, { status })
}

type SupabaseErrorLike = {
  message?: string
  code?: string
  details?: string
  hint?: string
}

function getErrorDetails(error: unknown): SupabaseErrorLike {
  if (!error || typeof error !== 'object') return {}

  const candidate = error as SupabaseErrorLike
  return {
    message: candidate.message,
    code: candidate.code,
    details: candidate.details,
    hint: candidate.hint,
  }
}

function logSupabaseError(context: string, error: unknown, extra: Record<string, unknown> = {}) {
  const details = getErrorDetails(error)
  console.error(context, {
    ...extra,
    message: details.message ?? null,
    code: details.code ?? null,
    details: details.details ?? null,
    hint: details.hint ?? null,
  })
}

function getSupabaseFromRequest(req: Request) {
  const authorization = req.headers.get('authorization')
  if (!url || !anonKey || !authorization) return null

  return createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: authorization } },
  })
}

async function getAuthenticatedUser(req: Request) {
  const supabase = getSupabaseFromRequest(req)
  if (!supabase) return { supabase: null, user: null }

  const { data, error } = await supabase.auth.getUser()
  if (error) {
    logSupabaseError('watchlist auth.getUser failed', error)
    return { supabase, user: null }
  }
  if (!data.user) return { supabase, user: null }
  return { supabase, user: data.user }
}

export async function GET(req: Request) {
  const { supabase, user } = await getAuthenticatedUser(req)
  if (!supabase) return jsonError('Supabase env vars not configured', 500)
  if (!user) return jsonError('Missing session', 401)

  const { data, error } = await supabase
    .from('watchlist')
    .select('symbol,position,user_id')
    .eq('user_id', user.id)
    .order('position')

  if (error) {
    logSupabaseError('watchlist GET error', error, { userId: user.id })
    return jsonError(error.message ?? 'Failed to load watchlist', 500)
  }

  return NextResponse.json({ ok: true, userId: user.id, rows: data ?? [] })
}

export async function POST(req: Request) {
  const { supabase, user } = await getAuthenticatedUser(req)
  if (!supabase) return jsonError('Supabase env vars not configured', 500)
  if (!user) return jsonError('Missing session', 401)

  let symbol: string | undefined
  let position = 0
  try {
    const body = await req.json()
    symbol = body?.symbol?.toUpperCase()
    if (Number.isFinite(body?.position)) {
      position = Number(body.position)
    }
  } catch {
    return jsonError('Invalid JSON', 400)
  }

  if (!symbol) return jsonError('Symbol required', 400)

  const { error } = await supabase
    .from('watchlist')
    .upsert({ user_id: user.id, symbol, position }, { onConflict: 'user_id,symbol' })

  if (error) {
    logSupabaseError('watchlist POST error', error, { userId: user.id, symbol, position })
    return jsonError(error.message ?? 'Failed to add to watchlist', 500)
  }

  return NextResponse.json({ ok: true, symbol, position, userId: user.id })
}

export async function DELETE(req: Request) {
  const { supabase, user } = await getAuthenticatedUser(req)
  if (!supabase) return jsonError('Supabase env vars not configured', 500)
  if (!user) return jsonError('Missing session', 401)

  let symbol: string | undefined
  try {
    const body = await req.json()
    symbol = body?.symbol?.toUpperCase()
  } catch {
    return jsonError('Invalid JSON', 400)
  }

  if (!symbol) return jsonError('Symbol required', 400)

  const { error } = await supabase.from('watchlist').delete().eq('user_id', user.id).eq('symbol', symbol)
  if (error) {
    logSupabaseError('watchlist DELETE error', error, { userId: user.id, symbol })
    return jsonError(error.message ?? 'Failed to remove from watchlist', 500)
  }

  return NextResponse.json({ ok: true, symbol, userId: user.id })
}
