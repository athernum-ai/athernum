'use client'

import { useEffect, useRef, useState } from 'react'
import { Pill } from '@/components/ui'
import type { TickerMap } from '@/types'

interface SearchPageProps {
  onTickerNav: (ticker: string) => void
  initialQuery?: string
  tickers: TickerMap
  refreshData: () => Promise<void>
}

type SearchResult = { symbol: string; name: string | null; exchange?: string | null; currency?: string | null }

export default function SearchPage({ onTickerNav, initialQuery = '', tickers, refreshData }: SearchPageProps) {
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    const run = async () => {
      const q = query.trim()
      if (q.length < 2) {
        setResults([])
        return
      }
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller
      setLoading(true)
      try {
        const res = await fetch(`/api/search-symbol?q=${encodeURIComponent(q)}`, { signal: controller.signal })
        if (!res.ok) {
          const text = await res.text()
          console.error('search-symbol failed', res.status, text)
          setResults([])
        } else {
          const json = await res.json()
          setResults(json.results ?? [])
        }
      } catch (err) {
        if ((err as any).name !== 'AbortError') {
          console.error('search-symbol fetch error', err)
        }
      } finally {
        setLoading(false)
      }
    }
    const t = setTimeout(run, 250)
    return () => {
      clearTimeout(t)
      abortRef.current?.abort()
    }
  }, [query])

  const handleSelect = async (sym: string) => {
    try {
      const res = await fetch(`/api/sync-ticker/${encodeURIComponent(sym)}`)
      if (!res.ok) {
        const text = await res.text()
        console.error('sync ticker failed', res.status, text)
        return
      }
      await refreshData()
      onTickerNav(sym)
    } catch (err) {
      console.error('sync ticker error', err)
    }
  }

  const localMatches = query.length > 0
    ? Object.entries(tickers).filter(
        ([k, v]) =>
          k.includes(query.toUpperCase()) ||
          v.name.toUpperCase().includes(query.toUpperCase())
      )
    : []

  const showLocalFallback = results.length === 0 && localMatches.length > 0

  return (
    <div className="p-6">
      <div className="flex items-baseline gap-3 mb-4">
        <h1 className="font-serif-custom italic text-[20px] text-[var(--text)]">Search</h1>
        <span className="text-[11px] text-[var(--text3)] font-mono-custom">
          type a ticker or company name
        </span>
      </div>

      <div className="relative mb-2">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text3)] pointer-events-none">
          🔍
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. MSFT, Apple, semiconductors..."
          className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-lg py-2.5 pl-10 pr-3 text-[15px] text-[var(--text)] font-sans-custom placeholder-[var(--text3)] outline-none focus:border-[var(--accent)] transition-colors"
          autoFocus
        />
      </div>

      <div className="mt-4">
        {query.length < 2 ? (
          <p className="text-[12px] text-[var(--text3)] font-mono-custom py-2">
            Type at least 2 characters to search.
          </p>
        ) : loading ? (
          <p className="text-[12px] text-[var(--text3)] font-mono-custom py-2">Searching...</p>
        ) : results.length === 0 && !showLocalFallback ? (
          <p className="text-[12px] text-[var(--text3)] font-mono-custom py-2">No results found.</p>
        ) : (
          <>
            {results.map((row) => (
              <div
                key={row.symbol}
                onClick={() => handleSelect(row.symbol)}
                className="flex items-center gap-4 bg-[var(--bg2)] border border-[var(--border)] rounded-lg px-4 py-3.5 mb-2 cursor-pointer hover:border-[var(--border2)] transition-colors"
              >
                <div className="font-mono-custom text-[15px] font-medium text-[var(--text)] w-[70px]">
                  {row.symbol}
                </div>
                <div className="text-[13px] text-[var(--text2)] flex-1">{row.name ?? '—'}</div>
                <div className="text-[11px] text-[var(--text3)]">{row.exchange ?? ''}</div>
              </div>
            ))}
            {showLocalFallback &&
              localMatches.map(([sym, t]) => (
                <div
                  key={sym}
                  onClick={() => handleSelect(sym)}
                  className="flex items-center gap-4 bg-[var(--bg2)] border border-[var(--border)] rounded-lg px-4 py-3.5 mb-2 cursor-pointer hover:border-[var(--border2)] transition-colors"
                >
                  <div className="font-mono-custom text-[15px] font-medium text-[var(--text)] w-[70px]">
                    {sym}
                  </div>
                  <div className="text-[13px] text-[var(--text2)] flex-1">{t.name}</div>
                  <div className="text-right">
                    <div className="font-mono-custom text-[14px] font-medium text-[var(--text)]">
                      {t.price}
                    </div>
                    <div
                      className={`font-mono-custom text-[11px] ${
                        t.dir === 'up' ? 'text-[var(--accentg)]' : 'text-[var(--accentr)]'
                      }`}
                    >
                      {t.chg}
                    </div>
                  </div>
                  <Pill dir={t.dir} text={t.chg} />
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  )
}
