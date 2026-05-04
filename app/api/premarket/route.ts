import { NextResponse } from 'next/server'

type FmpPremarket = {
  symbol?: string
  price?: number
  change?: number
  changesPercentage?: number
}

const FMP_BASE = 'https://financialmodelingprep.com/stable/pre-post-market'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const symbols = searchParams.get('symbols') // comma separated e.g. AAPL,NVDA,TSLA
  const fmpKey = process.env.FMP_API_KEY

  if (!fmpKey) {
    return NextResponse.json({ ok: false, error: 'FMP_API_KEY not set' }, { status: 500 })
  }
  if (!symbols) {
    return NextResponse.json({ ok: false, error: 'Missing symbols param' }, { status: 400 })
  }

  const url = `${FMP_BASE}?symbol=${encodeURIComponent(symbols)}&apikey=${encodeURIComponent(fmpKey)}`

  try {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: `FMP request failed (${res.status})` }, { status: 502 })
    }

    const json = await res.json()
    if (!Array.isArray(json)) {
      return NextResponse.json({ ok: true, data: {} })
    }

    // map to { AAPL: { chg: '+0.42%', dir: 'up' }, ... }
    const data: Record<string, { chg: string; dir: 'up' | 'dn' }> = {}
    json.forEach((row: FmpPremarket) => {
      if (!row.symbol) return
      const pct = row.changesPercentage ?? 0
      const sign = pct >= 0 ? '+' : ''
      data[row.symbol.toUpperCase()] = {
        chg: `${sign}${pct.toFixed(2)}%`,
        dir: pct < 0 ? 'dn' : 'up',
      }
    })

    return NextResponse.json({ ok: true, data })
  } catch (err) {
    console.error('premarket fetch error', err)
    return NextResponse.json({ ok: false, error: 'External API failure' }, { status: 502 })
  }
}