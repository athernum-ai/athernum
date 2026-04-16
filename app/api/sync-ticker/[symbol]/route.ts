import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabaseServer'

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

const FMP_BASE = 'https://financialmodelingprep.com/stable/profile'

export async function GET(_req: Request, { params }: { params: Promise<{ symbol: string }> }) {
  const { symbol: rawSymbol } = await params
  const symbol = rawSymbol?.toUpperCase()
  if (!symbol) return NextResponse.json({ ok: false, error: 'Missing ticker symbol' }, { status: 400 })

  const supabase = getSupabaseServerClient()
  const fmpKey = process.env.FMP_API_KEY

  if (!supabase || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Supabase env missing', {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    })
    return NextResponse.json({ ok: false, error: 'Supabase env vars not configured' }, { status: 500 })
  }
  if (!fmpKey) return NextResponse.json({ ok: false, error: 'FMP_API_KEY not set' }, { status: 500 })

  const url = `${FMP_BASE}?symbol=${encodeURIComponent(symbol)}&apikey=${encodeURIComponent(fmpKey)}`
  console.log('FMP request URL:', url.replace(fmpKey, '****'))

  let row: FmpProfile | undefined
  try {
    const res = await fetch(url, { cache: 'no-store' })
    console.log('FMP status:', res.status)
    if (!res.ok) return NextResponse.json({ ok: false, error: `FMP request failed (${res.status})` }, { status: 502 })
    const json = await res.json()
    if (!Array.isArray(json) || json.length === 0) return NextResponse.json({ ok: false, error: 'Ticker not found' }, { status: 404 })
    row = json[0] as FmpProfile
  } catch (err) {
    console.error('FMP fetch error', err)
    return NextResponse.json({ ok: false, error: 'External API failure' }, { status: 502 })
  }

  const mapped = {
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

  const { error } = await supabase.from('tickers').upsert(mapped, { onConflict: 'symbol' })
  if (error) {
    console.error('Supabase upsert error', error)
    return NextResponse.json({ ok: false, error: 'Upsert failed', details: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, data: mapped, source: 'fmp-profile' })
}
