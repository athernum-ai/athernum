'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabaseClient'
import { TICKERS, FEED_ARTICLES } from '@/lib/data'
import type { Article, TickerMap } from '@/types'
import type { User } from '@supabase/supabase-js'

interface SupabaseData {
  tickers: TickerMap
  watchlist: string[]
  articles: Article[]
  loading: boolean
  connected: boolean
  watchlistMessage: string | null
  addToWatchlist: (symbol: string) => Promise<void>
  removeFromWatchlist: (symbol: string) => Promise<void>
  refreshData: () => Promise<void>
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

function getErrorMessage(error: unknown, fallback: string) {
  return getErrorDetails(error).message ?? fallback
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

export function useSupabaseData(userId: string | null): SupabaseData {
  const [tickers, setTickers] = useState<TickerMap>(TICKERS)
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [articles, setArticles] = useState<Article[]>(FEED_ARTICLES)
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)
  const [watchlistMessage, setWatchlistMessage] = useState<string | null>(null)

  const getAuthenticatedUser = async (): Promise<{ supabase: ReturnType<typeof getSupabaseClient>; user: User | null }> => {
    const supabase = getSupabaseClient()
    if (!supabase) return { supabase: null, user: null }

    const { data, error } = await supabase.auth.getUser()
    if (error) {
      logSupabaseError('supabase.auth.getUser failed', error)
      return { supabase, user: null }
    }

    return { supabase, user: data.user ?? null }
  }

  const refreshData = async () => {
    const supabase = getSupabaseClient()
    if (!supabase) {
      setConnected(false)
      setWatchlist([])
      return
    }

    setLoading(true)
    if (!userId) {
      setWatchlist([])
    }

    const [tickersRes, watchlistRes, articlesRes] = await Promise.all([
      supabase
        .from('tickers')
        .select('symbol,name,price,chg,dir,open,high,low,cap'),
      userId
        ? supabase.from('watchlist').select('symbol').eq('user_id', userId).order('position')
        : Promise.resolve({ data: [], error: null }),
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

    if (watchlistRes.error) {
      logSupabaseError('watchlist load failed', watchlistRes.error, { userId })
      setWatchlist([])
    }

    if (!watchlistRes.error && watchlistRes.data) {
      const symbols = watchlistRes.data
        .map((r: any) => r.symbol)
        .filter(Boolean)
      setWatchlist(symbols)
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
    setWatchlist([])
    setWatchlistMessage(null)
  }, [userId])

  useEffect(() => {
    refreshData().catch((err) => {
      logSupabaseError('Supabase load failed', err, { userId })
      setLoading(false)
    })
  }, [userId])

  const addToWatchlist = async (symbol: string) => {
    const sym = symbol.toUpperCase()
    if (watchlist.includes(sym)) return

    const { supabase, user } = await getAuthenticatedUser()
    if (!userId || !user || user.id !== userId) {
      setWatchlistMessage('Sign in to save tickers to your watchlist.')
      return
    }

    if (!supabase) {
      setWatchlistMessage('Supabase is not configured.')
      return
    }

    setWatchlistMessage(null)
    setWatchlist((prev) => (prev.includes(sym) ? prev : [...prev, sym]))
    try {
      const { error } = await supabase
        .from('watchlist')
        .upsert({ user_id: user.id, symbol: sym, position: watchlist.length }, { onConflict: 'user_id,symbol' })

      if (error) {
        logSupabaseError('addToWatchlist failed', error, { userId: user.id, symbol: sym })
        setWatchlistMessage(getErrorMessage(error, 'Failed to add to watchlist'))
        setWatchlist((prev) => prev.filter((s) => s !== sym))
      }
    } catch (err) {
      logSupabaseError('addToWatchlist failed', err, { userId: user.id, symbol: sym })
      setWatchlistMessage(getErrorMessage(err, 'Failed to add to watchlist'))
      setWatchlist((prev) => prev.filter((s) => s !== sym))
    }
  }

  const removeFromWatchlist = async (symbol: string) => {
    const sym = symbol.toUpperCase()

    const { supabase, user } = await getAuthenticatedUser()
    if (!userId || !user || user.id !== userId) {
      setWatchlistMessage('Sign in to manage your watchlist.')
      return
    }

    if (!supabase) {
      setWatchlistMessage('Supabase is not configured.')
      return
    }

    setWatchlistMessage(null)
    setWatchlist((prev) => prev.filter((s) => s !== sym))
    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('symbol', sym)

      if (error) {
        logSupabaseError('removeFromWatchlist failed', error, { userId: user.id, symbol: sym })
        setWatchlistMessage(getErrorMessage(error, 'Failed to remove from watchlist'))
        setWatchlist((prev) => (prev.includes(sym) ? prev : [...prev, sym]))
      }
    } catch (err) {
      logSupabaseError('removeFromWatchlist failed', err, { userId: user.id, symbol: sym })
      setWatchlistMessage(getErrorMessage(err, 'Failed to remove from watchlist'))
      setWatchlist((prev) => (prev.includes(sym) ? prev : [...prev, sym]))
    }
  }

  return {
    tickers,
    watchlist,
    articles,
    loading,
    connected,
    watchlistMessage,
    addToWatchlist,
    removeFromWatchlist,
    refreshData,
  }
}
