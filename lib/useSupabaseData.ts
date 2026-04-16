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
  addToWatchlist: (symbol: string) => Promise<void>
  removeFromWatchlist: (symbol: string) => Promise<void>
  refreshData: () => Promise<void>
}

export function useSupabaseData(): SupabaseData {
  const [tickers, setTickers] = useState<TickerMap>(TICKERS)
  const [watchlist, setWatchlist] = useState<string[]>(WATCHLIST)
  const [articles, setArticles] = useState<Article[]>(FEED_ARTICLES)
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)

  const refreshData = async () => {
    const supabase = getSupabaseClient()
    if (!supabase) {
      setConnected(false)
      return
    }

    setLoading(true)

    const [tickersRes, watchlistRes, articlesRes] = await Promise.all([
      supabase
        .from('tickers')
        .select('symbol,name,price,chg,dir,open,high,low,cap'),
      supabase.from('watchlist').select('symbol').order('position'),
      supabase
        .from('articles')
        .select('id,source,time,tags,title,summary,ticker,published_at')
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

  useEffect(() => {
    refreshData().catch((err) => {
      console.error('Supabase load failed', err)
      setLoading(false)
    })
  }, [])

  const addToWatchlist = async (symbol: string) => {
    const sym = symbol.toUpperCase()
    if (watchlist.includes(sym)) return

    setWatchlist((prev) => [...prev, sym])
    try {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: sym }),
      })
      if (!res.ok) {
        const text = await res.text()
        console.error('addToWatchlist failed')
        console.error('status:', res.status)
        console.error('body:', text)
        setWatchlist((prev) => prev.filter((s) => s !== sym))
      }
    } catch (err) {
      console.error('addToWatchlist failed', err)
      setWatchlist((prev) => prev.filter((s) => s !== sym))
    }
  }

  const removeFromWatchlist = async (symbol: string) => {
    const sym = symbol.toUpperCase()
    setWatchlist((prev) => prev.filter((s) => s !== sym))
    try {
      const res = await fetch('/api/watchlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: sym }),
      })
      if (!res.ok) {
        const text = await res.text()
        console.error('removeFromWatchlist failed')
        console.error('status:', res.status)
        console.error('body:', text)
        setWatchlist((prev) => (prev.includes(sym) ? prev : [...prev, sym]))
      }
    } catch (err) {
      console.error('removeFromWatchlist failed', err)
      setWatchlist((prev) => (prev.includes(sym) ? prev : [...prev, sym]))
    }
  }

  return { tickers, watchlist, articles, loading, connected, addToWatchlist, removeFromWatchlist, refreshData }
}
