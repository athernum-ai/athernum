import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const FMP_BASE = 'https://financialmodelingprep.com/stable/profile'

type FmpProfile = {
  symbol?: string
  companyName?: string
  name?: string
  price?: number | string
  change?: number | string
  changePercentage?: number | string
  open?: number | string
  dayHigh?: number | string
  dayLow?: number | string
  marketCap?: number | string
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

function mapProfile(symbol: string, row: FmpProfile) {
  return {
    symbol,
    name: row.companyName ?? row.name ?? symbol,
    price: String(row.price ?? '-'),
    chg: String(row.changePercentage ?? '0%'),
    dir: Number(row.change ?? 0) < 0 ? 'dn' : 'up',
    open: row.open !== undefined ? String(row.open) : '-',
    high: row.dayHigh !== undefined ? String(row.dayHigh) : '-',
    low: row.dayLow !== undefined ? String(row.dayLow) : '-',
    cap: String(row.marketCap ?? '-'),
  }
}

export async function GET() {
  const supabase = getSupabase()
  const fmpKey = process.env.FMP_API_KEY

  if (!supabase || !fmpKey) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Missing environment variables',
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        hasFmpKey: !!fmpKey,
      },
      { status: 500 }
    )
  }

  const wlRes = await supabase.from('watchlist').select('symbol').order('position')
  if (wlRes.error) {
    console.error('watchlist select error', wlRes.error)
    return NextResponse.json({ ok: false, error: wlRes.error.message }, { status: 500 })
  }

  const symbols = (wlRes.data ?? []).map((r) => r.symbol).filter(Boolean) as string[]
  console.log('sync-watchlist: found symbols', symbols.length)

  if (!symbols.length) {
    return NextResponse.json({ ok: true, message: 'Watchlist is empty', total: 0, success: 0, failed: 0, successes: [], failures: [] })
  }

  const successes: string[] = []
  const failures: { symbol: string; reason: string }[] = []

  for (const symRaw of symbols) {
    const symbol = symRaw.toUpperCase()
    console.log('syncing', symbol)
    const url = `${FMP_BASE}?symbol=${encodeURIComponent(symbol)}&apikey=${encodeURIComponent(fmpKey)}`
    let row: FmpProfile | undefined

    try {
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) {
        console.error('FMP failure', symbol, res.status)
        failures.push({ symbol, reason: `FMP status ${res.status}` })
        continue
      }
      const json = await res.json()
      if (!Array.isArray(json) || json.length === 0) {
        failures.push({ symbol, reason: 'Ticker not found' })
        continue
      }
      row = json[0] as FmpProfile
    } catch (err) {
      console.error('FMP fetch error', symbol, err)
      failures.push({ symbol, reason: 'Fetch error' })
      continue
    }

    const mapped = mapProfile(symbol, row)
    const { error } = await supabase.from('tickers').upsert(mapped, { onConflict: 'symbol' })
    if (error) {
      console.error('Supabase upsert error', symbol, error)
      failures.push({ symbol, reason: error.message })
      continue
    }

    successes.push(symbol)
  }

  const result = {
    ok: failures.length === 0,
    total: symbols.length,
    success: successes.length,
    failed: failures.length,
    successes,
    failures,
  }

  return NextResponse.json(result)
}
