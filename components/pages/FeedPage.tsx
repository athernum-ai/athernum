'use client'

import { useMemo } from 'react'
import { WatchlistCard, ArticleCard } from '@/components/ui'
import { TICKERS, WATCHLIST, FEED_ARTICLES, genChartData, BASE_PRICES } from '@/lib/data'

interface FeedPageProps {
  onTickerNav: (ticker: string) => void
}

export default function FeedPage({ onTickerNav }: FeedPageProps) {
  const sparkData = useMemo(
    () =>
      WATCHLIST.map((sym) => {
        const t = TICKERS[sym]
        return genChartData(20, BASE_PRICES[sym] ?? 150, 4, t.dir === 'up' ? 0.5 : -0.5)
      }),
    []
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
        {WATCHLIST.map((sym, i) => {
          const t = TICKERS[sym]
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

      {FEED_ARTICLES.map((article, i) => (
        <ArticleCard
          key={i}
          article={article}
          onClick={() => article.ticker && onTickerNav(article.ticker)}
        />
      ))}
    </div>
  )
}