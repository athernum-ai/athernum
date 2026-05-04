'use client'

import { useEffect, useMemo, useState } from 'react'
import { WatchlistCard, ArticleCard } from '@/components/ui'
import FilingArticleCard from '@/components/FilingArticleCard'
import { genChartData, BASE_PRICES } from '@/lib/data'
import { getLatestFilingsForFeed } from '@/lib/feedFilings'
import { useAuthModal } from '@/lib/useAuthModal'
import type { Article, SupabaseFilingRecord, TickerMap } from '@/types'

interface FeedPageProps {
  onTickerNav: (ticker: string) => void
  tickers: TickerMap
  watchlist: string[]
  articles: Article[]
  isAuthenticated: boolean
  compactFeed: boolean
  showPremarket: boolean
}

export default function FeedPage({
  onTickerNav,
  tickers,
  watchlist,
  articles,
  isAuthenticated,
  compactFeed,
  showPremarket,
}: FeedPageProps) {
  const { openAuthModal } = useAuthModal()
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

  useEffect(() => {
    const fetchFilings = async () => {
      try {
        setLoading(true)
        setError(null)
        const filingsList = await getLatestFilingsForFeed(10)
        setFilings(filingsList as unknown as SupabaseFilingRecord[])
      } catch (err) {
        console.error('Error fetching filings:', err)
        setError('Failed to load filings')
      } finally {
        setLoading(false)
      }
    }
    fetchFilings()
  }, [])

  const handleTickerClick = (sym: string) => {
    if (isAuthenticated) onTickerNav(sym)
    else openAuthModal(`Sign in to view the full chart, news, and AI summaries for ${sym}.`)
  }

  const handleArticleClick = (ticker?: string) => {
    if (isAuthenticated) { if (ticker) onTickerNav(ticker) }
    else openAuthModal('Sign in to read full articles and access Brief, Standard, and Detailed AI summaries.')
  }

  const handleFilingClick = (ticker: string) => {
    if (isAuthenticated) onTickerNav(ticker)
    else openAuthModal(`Sign in to read the full filing and AI digest for ${ticker}.`)
  }

  return (
    <div className={compactFeed ? 'p-4' : 'p-6'}>

      {/* Header */}
      <div className={`flex items-baseline gap-3 ${compactFeed ? 'mb-3' : 'mb-4'}`}>
        <h1 className="font-serif-custom italic text-[20px] text-[var(--text)]">Your Feed</h1>
        <span className="text-[11px] text-[var(--text3)] font-mono-custom">Mon, Apr 13 · 47 new items</span>
      </div>

      {/* Watchlist grid */}
      {watchlist.length > 0 ? (
        <div className={`grid grid-cols-4 gap-2.5 ${compactFeed ? 'mb-3' : 'mb-5'}`}>
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
                onClick={() => handleTickerClick(sym)}
                compact={compactFeed}
                premarket={t.premarket}
                premktDir={t.premktDir}
                showPremarket={showPremarket}
              />
            )
          })}
        </div>
      ) : !isAuthenticated ? (
        <button
          onClick={() => openAuthModal('Sign in to build your watchlist and get a personalised feed of tickers you follow.')}
          className={`w-full ${compactFeed ? 'mb-3' : 'mb-5'} bg-[var(--bg2)] border border-dashed border-[var(--border2)] rounded-[10px] py-5 text-[13px] text-[var(--text3)] hover:text-[var(--text2)] hover:border-[var(--accent)] transition-colors`}
        >
          Sign in to add tickers to your watchlist →
        </button>
      ) : null}

      {/* Top Stories */}
      <div className={`flex items-baseline gap-3 ${compactFeed ? 'mb-2' : 'mb-4'}`}>
        <h2 className="font-serif-custom italic text-[20px] text-[var(--text)]">Top Stories</h2>
      </div>

      {articles.map((article, i) => (
        <ArticleCard
          key={article.id ?? `${article.source}-${article.title}-${i}`}
          article={article}
          onClick={() => handleArticleClick(article.ticker)}
          compact={compactFeed}
        />
      ))}

      {/* Latest Filings */}
      <div className={`flex items-baseline gap-3 ${compactFeed ? 'mb-2 mt-5' : 'mb-4 mt-8'}`}>
        <h2 className="font-serif-custom italic text-[20px] text-[var(--text)]">Latest Filings</h2>
        {loading && <span className="text-[11px] text-[var(--text3)]">Loading...</span>}
        {error && <span className="text-[11px] text-red-500">{error}</span>}
      </div>

      {filings.length > 0 ? (
        filings.map((filing, i) => (
          <FilingArticleCard
            key={i}
            filing={filing}
            isAuthenticated={isAuthenticated}
            onNavigateTicker={() => handleFilingClick(filing.ticker)}
            compact={compactFeed}
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