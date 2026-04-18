'use client'

import { useState } from 'react'
import { useAuthModal } from '@/lib/useAuthModal'
import type { SupabaseFilingRecord } from '@/types'
import FilingSummaryViewer from '@/components/FilingSummaryViewer'

interface FilingArticleCardProps {
  filing: SupabaseFilingRecord
  onNavigateTicker?: (ticker: string) => void
  isAuthenticated?: boolean
}

export default function FilingArticleCard({ filing, onNavigateTicker, isAuthenticated = false }: FilingArticleCardProps) {
  const { openAuthModal } = useAuthModal()
  const [showSummary, setShowSummary] = useState(false)

  const filingDate = new Date(filing.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  const timeAgo = getTimeAgo(filing.last_updated || filing.created_at)

  const handleViewSummary = () => {
    if (!isAuthenticated) {
      openAuthModal(`Sign in to read the full AI summary for this ${filing.ticker} ${filing.report_type} filing.`)
      return
    }
    setShowSummary(true)
  }

  const handleViewTicker = () => {
    if (!isAuthenticated) {
      openAuthModal(`Sign in to view the full ticker page and chart for ${filing.ticker}.`)
      return
    }
    onNavigateTicker?.(filing.ticker)
  }

  return (
    <>
      <div className="flex gap-4 bg-[var(--bg2)] border border-[var(--border)] rounded-[10px] p-4 mb-2.5 hover:border-[var(--border2)] transition-colors">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] text-[var(--text3)] font-mono-custom uppercase tracking-[1px]">
              SEC Filing
            </span>
            <span className="text-[10px] text-[var(--text3)] font-mono-custom">{timeAgo}</span>
          </div>

          {/* Title */}
          <div className="text-[14px] text-[var(--text)] font-medium leading-snug mb-1.5">
            {filing.ticker} {filing.report_type} on {filingDate}
          </div>

          {/* Summary preview — always visible, acts as a teaser */}
          <div className="text-[12px] text-[var(--text2)] leading-relaxed mb-3">
            {filing.level1
              ? isAuthenticated
                ? filing.level1
                : `${filing.level1.slice(0, 120)}...`
              : 'Summary not available'}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 items-center">
            <button
              onClick={handleViewSummary}
              className="px-3 py-1.5 bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 text-[var(--accent)] text-[11px] font-mono-custom rounded border border-[var(--accent)]/30 transition-colors"
            >
              {isAuthenticated ? 'View Summary' : 'Sign In to Read'}
            </button>
            {onNavigateTicker && (
              <button
                onClick={handleViewTicker}
                className="px-3 py-1.5 bg-[var(--bg3)] hover:bg-[var(--border)] text-[var(--text3)] hover:text-[var(--text)] text-[11px] font-mono-custom rounded border border-[var(--border)] transition-colors"
              >
                View Ticker
              </button>
            )}
          </div>
        </div>

        {/* Ticker Badge */}
        <div className="w-20 h-[60px] bg-[var(--bg3)] rounded-md flex-shrink-0 flex flex-col items-center justify-center gap-1">
          <div className="text-[14px] font-serif-custom italic font-bold text-[var(--text)]">
            {filing.ticker}
          </div>
          <div className="text-[10px] font-mono-custom text-[var(--text3)]">
            {filing.report_type}
          </div>
        </div>
      </div>

      {showSummary && (
        <FilingSummaryViewer
          filing={filing}
          onClose={() => setShowSummary(false)}
        />
      )}
    </>
  )
}

function getTimeAgo(timestamp?: string): string {
  if (!timestamp) return 'Recently'
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  if (diffMins < 1) return 'now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}