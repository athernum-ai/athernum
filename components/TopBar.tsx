'use client'

import { useState } from 'react'
import type { PageId } from '@/types'
import type { Theme } from '@/lib/useTheme'
import { useAuthModal } from '@/lib/useAuthModal'

interface TopBarProps {
  onNav: (page: PageId) => void
  onSearch: (query: string) => void
  theme: Theme
  onToggleTheme: () => void
  isAuthenticated: boolean
}

export default function TopBar({ onNav, onSearch, theme, onToggleTheme, isAuthenticated }: TopBarProps) {
  const [filterActive, setFilterActive] = useState(false)
  const [query, setQuery] = useState('')
  const { openAuthModal } = useAuthModal()

  const handleChange = (val: string) => {
    setQuery(val)
    if (val.length > 1) onNav('search')
    onSearch(val)
  }

  return (
    <div className="sticky top-0 z-10 h-[52px] flex items-center gap-4 px-6 bg-[var(--bg2)] border-b border-[var(--border)]">
      <div className="relative flex-1 max-w-[480px]">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text3)] text-sm pointer-events-none">🔍</span>
        <input
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search ticker, company, or topic..."
          className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-lg py-2 pl-9 pr-3 text-[13px] text-[var(--text)] placeholder-[var(--text3)] outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={() => setFilterActive((p) => !p)}
          className={[
            'flex items-center gap-1.5 px-2.5 py-1.5 border rounded-md text-[13px] transition-all',
            filterActive
              ? 'border-[var(--accent)] text-[var(--accent)] bg-[#3b82f615]'
              : 'border-[var(--border)] text-[var(--text2)] hover:border-[var(--border2)] hover:text-[var(--text)] hover:bg-[var(--bg3)]',
          ].join(' ')}
        >
          Filter
        </button>
        <button
          onClick={onToggleTheme}
          className="flex items-center gap-1.5 px-2.5 py-1.5 border border-[var(--border)] rounded-md text-[13px] text-[var(--text2)] hover:border-[var(--border2)] hover:text-[var(--text)] hover:bg-[var(--bg3)] transition-all"
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
        <button
          onClick={() => {
            if (isAuthenticated) {
              onNav('settings')
            } else {
              openAuthModal('Sign in to access Settings and configure your feed, AI model, and notifications.')
            }
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 border border-[var(--border)] rounded-md text-[13px] text-[var(--text2)] hover:border-[var(--border2)] hover:text-[var(--text)] hover:bg-[var(--bg3)] transition-all"
        >
          ⚙
        </button>

        {/* Sign in button — only shown when logged out */}
        {!isAuthenticated && (
          <button
            onClick={() => openAuthModal('Sign in to access your full feed, watchlist, AI summaries, and settings.')}
            className="px-3 py-1.5 border border-[var(--accent)] rounded-md text-[12px] font-mono-custom text-[var(--accent)] bg-[#3b82f615] hover:bg-[#3b82f625] transition-colors"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  )
}
