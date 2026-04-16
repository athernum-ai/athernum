import { NextResponse } from 'next/server'

const FMP_URL = 'https://financialmodelingprep.com/stable/search-symbol'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').trim()

  const apiKey = process.env.FMP_API_KEY
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasSupabaseServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
  const hasFmpKey = !!apiKey

  console.log('search-symbol: q=', q ? q : '(empty)', 'hasFmpKey:', hasFmpKey)

  if (!apiKey) {
    return NextResponse.json({ ok: false, error: 'FMP_API_KEY missing', hasFmpKey }, { status: 500 })
  }

  if (q.length < 2) {
    return NextResponse.json({ ok: true, results: [] })
  }

  const url = `${FMP_URL}?query=${encodeURIComponent(q)}&apikey=${encodeURIComponent(apiKey)}`
  console.log('search-symbol: fetching', url.replace(apiKey, '****'))

  try {
    const res = await fetch(url, { cache: 'no-store' })
    console.log('search-symbol: FMP status', res.status)
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: `FMP request failed (${res.status})` }, { status: 502 })
    }
    const json = await res.json()
    if (!Array.isArray(json)) {
      return NextResponse.json({ ok: false, error: 'Malformed response from FMP' }, { status: 502 })
    }
    const results = json.map((r: any) => ({
      symbol: r.symbol,
      name: r.name ?? r.companyName ?? r.symbol,
      exchange: r.exchangeShortName ?? r.exchange,
      currency: r.currency,
    })).filter((r: any) => r.symbol)

    return NextResponse.json({ ok: true, results, hasSupabaseUrl, hasSupabaseServiceKey })
  } catch (err) {
    console.error('search-symbol: fetch error', err)
    return NextResponse.json({ ok: false, error: 'FMP fetch error' }, { status: 502 })
  }
}
