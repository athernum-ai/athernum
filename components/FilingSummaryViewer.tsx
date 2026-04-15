'use client'

import { useState } from 'react'
import type { SupabaseFilingRecord } from '@/types'

interface FilingSummaryViewerProps {
  filing: SupabaseFilingRecord
  onClose: () => void
}

type TabType = 'original' | 'brief' | 'detailed' | 'in-depth'

export default function FilingSummaryViewer({ filing, onClose }: FilingSummaryViewerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('brief')

  const tabs: { id: TabType; label: string; description: string }[] = [
    { id: 'original', label: 'Original', description: 'Full raw text' },
    { id: 'brief', label: 'Brief', description: '1-sentence summary' },
    { id: 'detailed', label: 'Detailed', description: '1-paragraph summary' },
    { id: 'in-depth', label: 'In-depth', description: 'Bullet points' },
  ]

  const getTabContent = (): string | string[] => {
    switch (activeTab) {
      case 'original':
        return filing.level0 || 'No content available'
      case 'brief':
        return filing.level1 || 'No content available'
      case 'detailed':
        return filing.level2 || 'No content available'
      case 'in-depth':
        return filing.level3 || []
      default:
        return 'No content available'
    }
  }

  const content = getTabContent()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-[var(--border)] p-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-serif-custom italic text-[var(--text)] mb-1">
              {filing.ticker} {filing.report_type}
            </h2>
            <p className="text-sm text-[var(--text3)]">
              Filed on {new Date(filing.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text3)] hover:text-[var(--text)] transition-colors text-2xl w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Tags */}
        {filing.tags && filing.tags.length > 0 && (
          <div className="px-6 pt-4 pb-2 border-b border-[var(--border)]">
            <div className="flex gap-2 flex-wrap">
              {filing.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-mono-custom rounded border border-[var(--accent)]/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-[var(--border)] px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[var(--accent)] text-[var(--accent)] font-medium'
                    : 'border-transparent text-[var(--text3)] hover:text-[var(--text)]'
                }`}
              >
                <div className="text-sm font-serif-custom italic">{tab.label}</div>
                <div className="text-xs text-[var(--text3)] font-mono-custom">{tab.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {Array.isArray(content) ? (
            // In-depth: bullet points
            <ul className="space-y-3">
              {content.map((bullet, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 text-[var(--text)] text-sm leading-relaxed"
                >
                  <span className="text-[var(--accent)] font-bold flex-shrink-0">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          ) : (
            // Original, Brief, Detailed: text
            <div className="prose prose-invert max-w-none">
              <p className="text-[var(--text)] text-sm leading-7 whitespace-pre-wrap">
                {content}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--border)] px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[var(--accent)] text-[var(--bg)] rounded font-mono-custom text-sm hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
