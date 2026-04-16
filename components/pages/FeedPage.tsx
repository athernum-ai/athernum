'use client'

import { useEffect, useMemo, useState } from 'react'
import { WatchlistCard, ArticleCard } from '@/components/ui'
import FilingArticleCard from '@/components/FilingArticleCard'
import { genChartData, BASE_PRICES } from '@/lib/data'
import { getLatestFilingsForFeed } from '@/lib/feedFilings'
import type { Article, SupabaseFilingRecord, TickerMap } from '@/types'

interface FeedPageProps {
  onTickerNav: (ticker: string) => void
  tickers: TickerMap
  watchlist: string[]
  articles: Article[]
}

export default function FeedPage({ onTickerNav, tickers, watchlist, articles }: FeedPageProps) {
  const [filings, setFilings] = useState<SupabaseFilingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const sparkData = useMemo(
    () =>
      watchlist.map((sym) => {
        const t = tickers[sym]
        if (!t) return []
        return genChartData(20, BASE_PRICES[sym] ?? 150, 4, t.dir === 'up' ? 0.5 : -0.5)
      }),
    [watchlist, tickers]
  )

  // Fetch filings from Supabase on component mount
  useEffect(() => {
    const fetchFilings = async () => {
      try {
        setLoading(true)
        setError(null)
        const filingsList = await getLatestFilingsForFeed(10)
        // filingsList is already SupabaseFilingRecord[] from feedFilings service
        setFilings(filingsList as unknown as SupabaseFilingRecord[])
      } catch (err) {
        console.error('Error fetching filings:', err)
        setError('Failed to load filings')
        // Still show fallback filings on error
        const filingsList = await getLatestFilingsForFeed(10)
        setFilings(filingsList as unknown as SupabaseFilingRecord[])
      } finally {
        setLoading(false)
      }
    }

    fetchFilings()
  }, [])

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-baseline gap-3 mb-4">
        <h1 className="font-serif-custom italic text-[20px] text-[var(--text)]">Your Feed</h1>
        <span className="text-[11px] text-[var(--text3)] font-mono-custom">Mon, Apr 13 · 47 new items</span>
      </div>

      {/* Watchlist grid */}
      <div className="grid grid-cols-4 gap-2.5 mb-5">
        {watchlist.map((sym, i) => {
          const t = tickers[sym]
          if (!t) return null
          return (
            <WatchlistCard
              key={sym}
              ticker={sym}
              name={t.name}
              price={t.price}
              chg={t.chg}
              dir={t.dir}
              sparkData={sparkData[i]}
              onClick={() => onTickerNav(sym)}
            />
          )
        })}
      </div>

      {/* Top Stories */}
      <div className="flex items-baseline gap-3 mb-4">
        <h2 className="font-serif-custom italic text-[20px] text-[var(--text)]">Top Stories</h2>
      </div>

      {articles.map((article, i) => (
        <ArticleCard
          key={article.id ?? `${article.source}-${article.title}-${i}`}
          article={article}
          onClick={() => article.ticker && onTickerNav(article.ticker)}
        />
      ))}

      <div className="flex items-baseline gap-3 mb-4 mt-8">
        <h2 className="font-serif-custom italic text-[20px] text-[var(--text)]">Latest Filings</h2>
        {loading && <span className="text-[11px] text-[var(--text3)]">Loading...</span>}
        {error && <span className="text-[11px] text-red-500">{error}</span>}
      </div>

      {filings.length > 0 ? (
        filings.map((filing, i) => (
          <FilingArticleCard
            key={i}
            filing={filing}
            onNavigateTicker={onTickerNav}
          />
        ))
      ) : (
        <div className="text-center py-8 text-[var(--text3)]">
          {loading ? 'Loading filings...' : 'No filings available'}
        </div>
      )}
    </div>
  )
}
