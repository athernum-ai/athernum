'use client'

import type { PageId, TickerData, TickerMap } from '@/types'
import { MARKET_BAR } from '@/lib/data'
import { useAuthModal } from '@/lib/useAuthModal'

interface SidebarProps {
  activePage: PageId
  onNav: (page: PageId) => void
  onTickerNav: (ticker: string) => void
  currentTicker: string
  tickers: TickerMap
  watchlist: string[]
  isAuthenticated: boolean
}

const NavItem = ({
  active, onClick, children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) => (
  <button
    onClick={onClick}
    className={[
      'flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-[13px] transition-all duration-150 border-l-2 text-left',
      active
        ? 'bg-[var(--bg4)] text-[var(--text)] border-[var(--accent)]'
        : 'text-[var(--text2)] border-transparent hover:bg-[var(--bg3)] hover:text-[var(--text)]',
    ].join(' ')}
  >
    {children}
  </button>
)

const TickerPill = ({ dir, chg }: { dir: TickerData['dir']; chg: string }) => (
  <span className={[
    'ml-auto font-mono text-[10px] px-1.5 py-0.5 rounded border',
    dir === 'up'
      ? 'text-[var(--accentg)] border-[#10b98130] bg-[var(--bg4)]'
      : 'text-[var(--accentr)] border-[#ef444430] bg-[var(--bg4)]',
  ].join(' ')}>
    {chg}
  </span>
)

export default function Sidebar({
  activePage, onNav, onTickerNav, currentTicker, tickers, watchlist, isAuthenticated,
}: SidebarProps) {
  const { openAuthModal } = useAuthModal()

  // Wrap nav for protected pages — show modal if not signed in, navigate if signed in
  const guardedNav = (page: PageId, context: string) => {
    if (isAuthenticated) {
      onNav(page)
    } else {
      openAuthModal(context)
    }
  }

  return (
    <aside className="flex flex-col h-screen sticky top-0 bg-[var(--bg2)] border-r border-[var(--border)] overflow-hidden" style={{ width: 220 }}>
      {/* Logo */}
      <div className="px-5 py-4 pb-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2 font-serif-custom text-[22px] text-[var(--text)] tracking-tight">
          <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
          Athernum
        </div>
        <div className="text-[10px] text-[var(--text3)] font-mono-custom tracking-[2px] uppercase mt-0.5">
          Financial Intelligence
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <div className="mb-5">
          <div className="text-[10px] text-[var(--text3)] font-mono-custom tracking-[2px] uppercase px-3 mb-1.5">Main</div>
          {/* Feed and Search are always accessible */}
          <NavItem active={activePage === 'feed'} onClick={() => onNav('feed')}>
            <span>📰</span> Feed
          </NavItem>
          <NavItem active={activePage === 'search'} onClick={() => onNav('search')}>
            <span>🔍</span> Search
          </NavItem>
          {/* Gated pages */}
          <NavItem
            active={activePage === 'events'}
            onClick={() => guardedNav('events', 'Sign in to access the Event Tracker and follow upcoming earnings, dividends, and macro events.')}
          >
            <span>📅</span> Event Tracker
            {!isAuthenticated && <span className="ml-auto text-[10px] text-[var(--text3)] font-mono-custom">Sign in</span>}
          </NavItem>
          <NavItem
            active={activePage === 'filings-dashboard'}
            onClick={() => guardedNav('filings-dashboard', 'Sign in to access the Filings Dashboard and browse SEC filings with AI-generated digests.')}
          >
            <span>📊</span> Filings Dashboard
            {!isAuthenticated && <span className="ml-auto text-[10px] text-[var(--text3)] font-mono-custom">Sign in</span>}
          </NavItem>
        </div>

        {/* Watchlist — gated entirely when logged out */}
        <div className="mb-5">
          <div className="text-[10px] text-[var(--text3)] font-mono-custom tracking-[2px] uppercase px-3 mb-1.5">Watchlist</div>
          {isAuthenticated ? (
            watchlist.map((sym) => {
              const t = tickers[sym]
              if (!t) return null
              return (
                <NavItem
                  key={sym}
                  active={activePage === 'ticker' && currentTicker === sym}
                  onClick={() => onTickerNav(sym)}
                >
                  <span className="text-[var(--accenty)]">★</span>
                  <span className="font-mono-custom text-[12px]">{sym}</span>
                  <TickerPill dir={t.dir} chg={t.chg} />
                </NavItem>
              )
            })
          ) : (
            <button
              onClick={() => openAuthModal('Sign in to save tickers to your watchlist and get a personalised feed.')}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-[12px] text-[var(--text3)] border-l-2 border-transparent hover:bg-[var(--bg3)] hover:text-[var(--text2)] transition-all text-left font-mono-custom"
            >
              <span>☆</span> Sign in to add tickers
            </button>
          )}
        </div>

        {/* Account */}
        <div>
          <div className="text-[10px] text-[var(--text3)] font-mono-custom tracking-[2px] uppercase px-3 mb-1.5">Account</div>
          <NavItem
            active={activePage === 'settings'}
            onClick={() => guardedNav('settings', 'Sign in to access Settings and configure your feed, AI model, and notifications.')}
          >
            <span>⚙</span> Settings
            {!isAuthenticated && <span className="ml-auto text-[10px] text-[var(--text3)] font-mono-custom">Sign in</span>}
          </NavItem>
        </div>
      </nav>

      {/* Market Bar */}
      <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--bg2)]">
        {MARKET_BAR.map((m) => (
          <div key={m.name} className="flex justify-between items-center mb-1 text-[11px] last:mb-0">
            <span className="text-[var(--text2)] font-mono-custom">{m.name}</span>
            <span className={[
              'font-mono-custom font-medium',
              m.dir === 'up' ? 'text-[var(--accentg)]' : m.dir === 'dn' ? 'text-[var(--accentr)]' : 'text-[var(--text)]',
            ].join(' ')}>
              {m.value} {m.dir === 'up' ? '▲' : m.dir === 'dn' ? '▼' : ''}
            </span>
          </div>
        ))}
      </div>
    </aside>
  )
}