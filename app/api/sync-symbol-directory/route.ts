import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const FMP_URL = 'https://financialmodelingprep.com/stable/stock-list'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

export async function GET() {
  const supabase = getSupabase()
  const apiKey = process.env.FMP_API_KEY

  if (!supabase || !apiKey) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Missing environment variables',
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        hasFmpKey: !!apiKey,
      },
      { status: 500 }
    )
  }

  const url = `${FMP_URL}?apikey=${encodeURIComponent(apiKey)}`
  console.log('sync-symbol-directory: fetching', url.replace(apiKey, '****'))

  let rows: any[] = []
  try {
    const res = await fetch(url, { cache: 'no-store' })
    console.log('sync-symbol-directory: FMP status', res.status)
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: `FMP request failed (${res.status})` }, { status: 502 })
    }
    const json = await res.json()
    if (!Array.isArray(json) || json.length === 0) {
      return NextResponse.json({ ok: false, error: 'Empty symbol list from FMP' }, { status: 502 })
    }
    rows = json
  } catch (err) {
    console.error('sync-symbol-directory: fetch error', err)
    return NextResponse.json({ ok: false, error: 'FMP fetch error' }, { status: 502 })
  }

  console.log('sync-symbol-directory: received', rows.length, 'rows')

  const mapped = rows
    .map((r) => ({
      symbol: r.symbol,
      name: r.name ?? r.companyName ?? r.symbol,
      exchange: r.exchange,
      exchange_short_name: r.exchangeShortName,
      type: r.type,
      currency: r.currency,
    }))
    .filter((r) => r.symbol)

  let inserted = 0
  let errors = 0

  for (const batch of chunk(mapped, 1000)) {
    const { error, count } = await supabase
      .from('securities')
      .upsert(batch, { onConflict: 'symbol', count: 'exact' })
    if (error) {
      errors += batch.length
      console.error('sync-symbol-directory: upsert error', error)
    } else {
      inserted += count ?? batch.length
      console.log('sync-symbol-directory: upserted batch size', batch.length)
    }
  }

  return NextResponse.json({
    ok: errors === 0,
    total: mapped.length,
    inserted,
    errors,
  })
}
