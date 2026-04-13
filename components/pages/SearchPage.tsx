'use client'

import { useState } from 'react'
import { TICKERS } from '@/lib/data'
import { Pill } from '@/components/ui'

interface SearchPageProps {
  onTickerNav: (ticker: string) => void
  initialQuery?: string
}

export default function SearchPage({ onTickerNav, initialQuery = '' }: SearchPageProps) {
  const [query, setQuery] = useState(initialQuery)

  const matches = query.length > 0
    ? Object.entries(TICKERS).filter(
        ([k, v]) =>
          k.includes(query.toUpperCase()) ||
          v.name.toUpperCase().includes(query.toUpperCase())
      )
    : []

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
        {query.length === 0 ? (
          <p className="text-[12px] text-[var(--text3)] font-mono-custom py-2">
            Start typing to search tickers and companies...
          </p>
        ) : matches.length === 0 ? (
          <p className="text-[12px] text-[var(--text3)] font-mono-custom py-2">No results found.</p>
        ) : (
          matches.map(([sym, t]) => (
            <div
              key={sym}
              onClick={() => onTickerNav(sym)}
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
          ))
        )}
      </div>
    </div>
  )
}