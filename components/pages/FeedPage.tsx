'use client'

import { useMemo } from 'react'
import { WatchlistCard, ArticleCard } from '@/components/ui'
import { genChartData, BASE_PRICES } from '@/lib/data'
import type { Article, TickerMap } from '@/types'

interface FeedPageProps {
  onTickerNav: (ticker: string) => void
  tickers: TickerMap
  watchlist: string[]
  articles: Article[]
}

export default function FeedPage({ onTickerNav, tickers, watchlist, articles }: FeedPageProps) {
  const sparkData = useMemo(
    () =>
      watchlist.map((sym) => {
        const t = tickers[sym]
        if (!t) return []
        return genChartData(20, BASE_PRICES[sym] ?? 150, 4, t.dir === 'up' ? 0.5 : -0.5)
      }),
    [watchlist, tickers]
  )

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
    </div>
  )
}
