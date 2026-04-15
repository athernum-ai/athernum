'use client'

import { useState, useCallback, useEffect } from 'react'
import type { PageId } from '@/types'

import Sidebar           from '@/components/Sidebar'
import TopBar            from '@/components/TopBar'
import FeedPage          from '@/components/pages/FeedPage'
import TickerDetailPage  from '@/components/pages/TickerDetailPage'
import SearchPage        from '@/components/pages/SearchPage'
import EventsPage        from '@/components/pages/EventsPage'
import SettingsPage      from '@/components/pages/SettingsPage'
import FilingsDashboardPage from '@/components/pages/FilingsDashboardPage'

export default function Home() {
  const [isMounted, setIsMounted] = useState(false)
  
  const [activePage, setActivePage]     = useState<PageId>('feed')
  const [currentTicker, setCurrentTicker] = useState('AAPL')
  const [searchQuery, setSearchQuery]   = useState('')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleNav = useCallback((page: PageId) => {
    setActivePage(page)
  }, [])

  const handleTickerNav = useCallback((ticker: string) => {
    setCurrentTicker(ticker)
    setActivePage('ticker')
  }, [])

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q)
    if (q.length > 1) setActivePage('search')
  }, [])

  if (!isMounted) {
    return <div className="min-h-screen bg-[var(--bg)]" />
  }

  return (
    <div className="grid min-h-screen" style={{ gridTemplateColumns: '220px 1fr' }}>
      <Sidebar
        activePage={activePage}
        onNav={handleNav}
        onTickerNav={handleTickerNav}
        currentTicker={currentTicker}
      />

      <main className="bg-[var(--bg)] overflow-y-auto">
        <TopBar onNav={handleNav} onSearch={handleSearch} />

        <div style={{ display: activePage === 'feed'     ? 'block' : 'none' }}>
          <FeedPage onTickerNav={handleTickerNav} />
        </div>

        <div style={{ display: activePage === 'ticker'   ? 'block' : 'none' }}>
          <TickerDetailPage ticker={currentTicker} onBack={() => handleNav('feed')} />
        </div>

        <div style={{ display: activePage === 'search'   ? 'block' : 'none' }}>
          <SearchPage onTickerNav={handleTickerNav} initialQuery={searchQuery} />
        </div>

        <div style={{ display: activePage === 'events'   ? 'block' : 'none' }}>
          <EventsPage />
        </div>

        <div style={{ display: activePage === 'settings' ? 'block' : 'none' }}>
          <SettingsPage />
        </div>

        <div style={{ display: activePage === 'filings-dashboard' ? 'block' : 'none' }}>
          <FilingsDashboardPage onTickerNav={handleTickerNav} />
        </div>
      </main>
    </div>
  )
}