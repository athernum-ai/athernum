'use client'

import { useEffect, useState } from 'react'
import { useAuthModal } from '@/lib/useAuthModal'
import { EVENTS } from '@/lib/data'

interface EventsPageProps {
  isAuthenticated: boolean
}

const ALL_TICKERS = ['AAPL', 'NVDA', 'TSLA', 'META', 'MSFT']
const ALL_TYPES   = ['Earnings', 'Ex-Dividend', 'Fed Meeting', 'Conference', 'Macro'] as const

export default function EventsPage({ isAuthenticated }: EventsPageProps) {
  const { openAuthModal } = useAuthModal()
  const [tickerFilter, setTickerFilter] = useState('All Tickers')
  const [typeFilter, setTypeFilter]     = useState('All Types')

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal('Sign in to access the Event Tracker and follow upcoming earnings, dividends, and macro events.')
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="p-6">
        <div className="flex items-baseline gap-3 mb-4">
          <h1 className="font-serif-custom italic text-[20px] text-[var(--text)]">Event Tracker</h1>
          <span className="text-[11px] text-[var(--text3)] font-mono-custom">Upcoming catalysts</span>
        </div>
        <button
          onClick={() => openAuthModal('Sign in to access the Event Tracker and follow upcoming earnings, dividends, and macro events.')}
          className="w-full bg-[var(--bg2)] border border-dashed border-[var(--border2)] rounded-[10px] py-16 text-[13px] text-[var(--text3)] hover:text-[var(--text2)] hover:border-[var(--accent)] transition-colors"
        >
          Sign in to view upcoming events →
        </button>
      </div>
    )
  }

  const filtered = EVENTS.filter((ev) => {
    const matchesTicker = tickerFilter === 'All Tickers'
      ? true
      : ev.ticker === tickerFilter
    const matchesType = typeFilter === 'All Types'
      ? true
      : ev.type === typeFilter
    return matchesTicker && matchesType
  })

  return (
    <div className="p-6">
      <div className="flex items-baseline gap-3 mb-4">
        <h1 className="font-serif-custom italic text-[20px] text-[var(--text)]">Event Tracker</h1>
        <span className="text-[11px] text-[var(--text3)] font-mono-custom">Upcoming catalysts</span>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5">
        <select
          value={tickerFilter}
          onChange={(e) => setTickerFilter(e.target.value)}
          className="bg-[var(--bg3)] border border-[var(--border)] rounded-md px-2.5 py-1.5 text-[12px] text-[var(--text2)] font-mono-custom outline-none cursor-pointer"
        >
          <option>All Tickers</option>
          {ALL_TICKERS.map((t) => <option key={t}>{t}</option>)}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-[var(--bg3)] border border-[var(--border)] rounded-md px-2.5 py-1.5 text-[12px] text-[var(--text2)] font-mono-custom outline-none cursor-pointer"
        >
          <option>All Types</option>
          {ALL_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>

        {/* Reset button — only shown when a filter is active */}
        {(tickerFilter !== 'All Tickers' || typeFilter !== 'All Types') && (
          <button
            onClick={() => { setTickerFilter('All Tickers'); setTypeFilter('All Types') }}
            className="px-2.5 py-1.5 rounded-md border border-[var(--border)] text-[11px] font-mono-custom text-[var(--text3)] hover:text-[var(--text)] hover:border-[var(--border2)] transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Event list */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[10px] px-4 mb-4">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-[12px] text-[var(--text3)] font-mono-custom">
            No events match the selected filters.
          </div>
        ) : (
          filtered.map((ev, i) => (
            <div
              key={i}
              className={`flex gap-4 py-3 ${i < filtered.length - 1 ? 'border-b border-[var(--border)]' : ''}`}
            >
              <div className="font-mono-custom text-[11px] text-[var(--text3)] w-20 flex-shrink-0 pt-0.5">
                {ev.date}
              </div>
              <div className="flex-shrink-0 mt-1">
                <div className={[
                  'w-2 h-2 rounded-full',
                  ev.urgency === 'today' ? 'bg-[var(--accentg)]'
                  : ev.urgency === 'soon'  ? 'bg-[var(--accenty)]'
                  : 'bg-[var(--border2)]',
                ].join(' ')} />
              </div>
              <div>
                <div className="text-[13px] text-[var(--text)] font-medium mb-0.5 flex items-center gap-2">
                  {ev.name}
                  {ev.urgency === 'today' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono-custom px-1.5 py-0.5 rounded bg-[#10b98115] text-[var(--accentg)]">
                      ▲ TODAY
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[var(--text2)]">{ev.desc}</span>
                  {ev.type && (
                    <span className="text-[10px] font-mono-custom px-1.5 py-0.5 rounded bg-[var(--bg3)] border border-[var(--border)] text-[var(--text3)]">
                      {ev.type}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}