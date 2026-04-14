'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabaseClient'
import { TICKERS, WATCHLIST, FEED_ARTICLES } from '@/lib/data'
import type { Article, TickerMap } from '@/types'

interface SupabaseData {
  tickers: TickerMap
  watchlist: string[]
  articles: Article[]
  loading: boolean
  connected: boolean
}

export function useSupabaseData(): SupabaseData {
  const [tickers, setTickers] = useState<TickerMap>(TICKERS)
  const [watchlist, setWatchlist] = useState<string[]>(WATCHLIST)
  const [articles, setArticles] = useState<Article[]>(FEED_ARTICLES)
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const client = getSupabaseClient()
    if (!client) return

    setLoading(true)

    async function load() {
      const [tickersRes, watchlistRes, articlesRes] = await Promise.all([
        client
          .from('tickers')
          .select('symbol,name,price,chg,dir,open,high,low,cap'),
        client.from('watchlist').select('symbol').order('position'),
        client
          .from('articles')
          .select('source,time,tags,title,summary,ticker')
          .order('published_at', { ascending: false })
          .limit(20),
      ])

      if (!tickersRes.error && tickersRes.data) {
        const map: TickerMap = {}
        tickersRes.data.forEach((row: any) => {
          if (!row.symbol) return
          map[row.symbol] = {
            name: row.name ?? row.symbol,
            price: row.price ?? '-',
            chg: row.chg ?? '0%',
            dir: row.dir === 'dn' ? 'dn' : 'up',
            open: row.open ?? '-',
            high: row.high ?? '-',
            low: row.low ?? '-',
            cap: row.cap ?? '-',
          }
        })
        if (Object.keys(map).length) setTickers(map)
      }

      if (!watchlistRes.error && watchlistRes.data) {
        const symbols = watchlistRes.data
          .map((r: any) => r.symbol)
          .filter(Boolean)
        if (symbols.length) setWatchlist(symbols)
      }

      if (!articlesRes.error && articlesRes.data) {
        const parsed = articlesRes.data.map((a: any) => ({
          ...a,
          tags: Array.isArray(a.tags) ? a.tags : [],
        })) as Article[]
        if (parsed.length) setArticles(parsed)
      }

      setConnected(true)
      setLoading(false)
    }

    load().catch((err) => {
      console.error('Supabase load failed', err)
      setLoading(false)
    })
  }, [])

  return { tickers, watchlist, articles, loading, connected }
}
