'use client'

import { useState, useCallback, useEffect } from 'react'
import type { PageId } from '@/types'
import { useSupabaseData } from '@/lib/useSupabaseData'
import { useSupabaseAuth } from '@/lib/useSupabaseAuth'
import { useTheme } from '@/lib/useTheme'

import AuthModal            from '@/components/AuthModal'
import Sidebar              from '@/components/Sidebar'
import TopBar               from '@/components/TopBar'
import FeedPage             from '@/components/pages/FeedPage'
import TickerDetailPage     from '@/components/pages/TickerDetailPage'
import SearchPage           from '@/components/pages/SearchPage'
import EventsPage           from '@/components/pages/EventsPage'
import SettingsPage         from '@/components/pages/SettingsPage'
import FilingsDashboardPage from '@/components/pages/FilingsDashboardPage'

export default function Home() {
  const [isMounted, setIsMounted]         = useState(false)
  const [activePage, setActivePage]       = useState<PageId>('feed')
  const [currentTicker, setCurrentTicker] = useState('AAPL')
  const [searchQuery, setSearchQuery]     = useState('')

  // Settings state
  const [compactFeed, setCompactFeed]         = useState(false)
  const [showPremarket, setShowPremarket]     = useState(true)
  const [emailNotifications, setEmailNotifications] = useState({
    earnings: true,
    priceMoves: false,
  })

  const auth = useSupabaseAuth()
  const {
    tickers,
    watchlist,
    articles,
    addToWatchlist,
    removeFromWatchlist,
    refreshData,
    refreshPremarket,
    watchlistMessage,
  } = useSupabaseData(auth.user?.id ?? null)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => { setIsMounted(true) }, [])

  // fetch premarket whenever watchlist changes or toggle flips
  useEffect(() => {
    if (showPremarket && watchlist.length > 0) {
      refreshPremarket(watchlist)
    }
  }, [watchlist, showPremarket])

  const handleNav = useCallback((page: PageId) => setActivePage(page), [])

  const handleTickerNav = useCallback((ticker: string) => {
    setCurrentTicker(ticker)
    setActivePage('ticker')
  }, [])

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q)
    if (q.length > 1) setActivePage('search')
  }, [])

  if (!isMounted) return <div className="min-h-screen bg-[var(--bg)]" />

  return (
    <>
      <AuthModal
        user={auth.user}
        loading={auth.loading}
        onSignIn={auth.signIn}
        onSignUp={auth.signUp}
        onSignOut={auth.signOut}
      />

      <div className="grid min-h-screen" style={{ gridTemplateColumns: '220px 1fr' }}>
        <Sidebar
          activePage={activePage}
          onNav={handleNav}
          onTickerNav={handleTickerNav}
          currentTicker={currentTicker}
          tickers={tickers}
          watchlist={watchlist}
          user={auth.user}
          loading={auth.loading}
          isAuthenticated={auth.isAuthenticated}
          onSignOut={auth.signOut}
        />

        <main className="bg-[var(--bg)] overflow-y-auto">
          <TopBar
            onNav={handleNav}
            onSearch={handleSearch}
            theme={theme}
            onToggleTheme={toggleTheme}
            isAuthenticated={auth.isAuthenticated}
          />

          <div style={{ display: activePage === 'feed' ? 'block' : 'none' }}>
            <FeedPage
              onTickerNav={handleTickerNav}
              tickers={tickers}
              watchlist={watchlist}
              articles={articles}
              isAuthenticated={auth.isAuthenticated}
              compactFeed={compactFeed}
              showPremarket={showPremarket}
            />
          </div>

          <div style={{ display: activePage === 'ticker' ? 'block' : 'none' }}>
            <TickerDetailPage
              ticker={currentTicker}
              onBack={() => handleNav('feed')}
              tickers={tickers}
              watchlist={watchlist}
              watchlistMessage={watchlistMessage}
              isAuthenticated={auth.isAuthenticated}
              addToWatchlist={addToWatchlist}
              removeFromWatchlist={removeFromWatchlist}
            />
          </div>

          <div style={{ display: activePage === 'search' ? 'block' : 'none' }}>
            <SearchPage
              onTickerNav={handleTickerNav}
              initialQuery={searchQuery}
              tickers={tickers}
              refreshData={refreshData}
              isAuthenticated={auth.isAuthenticated}
            />
          </div>

          <div style={{ display: activePage === 'events' ? 'block' : 'none' }}>
            <EventsPage isAuthenticated={auth.isAuthenticated} />
          </div>

          <div style={{ display: activePage === 'settings' ? 'block' : 'none' }}>
            <SettingsPage
              theme={theme}
              onToggleTheme={toggleTheme}
              isAuthenticated={auth.isAuthenticated}
              compactFeed={compactFeed}
              onToggleCompactFeed={() => setCompactFeed((p) => !p)}
              showPremarket={showPremarket}
              onTogglePremarket={() => setShowPremarket((p) => !p)}
              emailNotifications={emailNotifications}
              onToggleEarningsAlerts={() =>
                setEmailNotifications((p) => ({ ...p, earnings: !p.earnings }))
              }
              onTogglePriceMoveAlerts={() =>
                setEmailNotifications((p) => ({ ...p, priceMoves: !p.priceMoves }))
              }
            />
          </div>

          <div style={{ display: activePage === 'filings-dashboard' ? 'block' : 'none' }}>
            <FilingsDashboardPage
              onTickerNav={handleTickerNav}
              isAuthenticated={auth.isAuthenticated}
            />
          </div>
        </main>
      </div>
    </>
  )
}