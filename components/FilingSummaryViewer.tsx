'use client'

import type { SupabaseFilingRecord } from '@/types'

interface FilingSummaryViewerProps {
  filing: SupabaseFilingRecord
  onClose: () => void
}

export default function FilingSummaryViewer({ filing, onClose }: FilingSummaryViewerProps) {
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

        {/* Content - All 4 Levels Displayed Vertically */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Level 0: Original */}
          <div>
            <h3 className="text-lg font-serif-custom italic text-[var(--accent)] mb-3">
              Level 0: Original
            </h3>
            <p className="text-xs text-[var(--text3)] mb-2 font-mono-custom">Full raw SEC filing text</p>
            <div className="bg-[var(--bg2)] rounded border border-[var(--border)] p-4">
              <p className="text-[var(--text)] text-sm leading-7 whitespace-pre-wrap line-clamp-6">
                {filing.level0 || 'No content available'}
              </p>
            </div>
          </div>

          {/* Level 1: Brief */}
          <div>
            <h3 className="text-lg font-serif-custom italic text-[var(--accent)] mb-3">
              Level 1: Brief Summary
            </h3>
            <p className="text-xs text-[var(--text3)] mb-2 font-mono-custom">1-2 sentence executive summary</p>
            <div className="bg-[var(--bg2)] rounded border border-[var(--border)] p-4">
              <p className="text-[var(--text)] text-sm leading-7">
                {filing.level1 || 'No content available'}
              </p>
            </div>
          </div>

          {/* Level 2: Detailed */}
          <div>
            <h3 className="text-lg font-serif-custom italic text-[var(--accent)] mb-3">
              Level 2: Detailed Summary
            </h3>
            <p className="text-xs text-[var(--text3)] mb-2 font-mono-custom">1-paragraph detailed overview</p>
            <div className="bg-[var(--bg2)] rounded border border-[var(--border)] p-4">
              <p className="text-[var(--text)] text-sm leading-7">
                {filing.level2 || 'No content available'}
              </p>
            </div>
          </div>

          {/* Level 3: In-Depth */}
          <div>
            <h3 className="text-lg font-serif-custom italic text-[var(--accent)] mb-3">
              Level 3: In-Depth Analysis
            </h3>
            <p className="text-xs text-[var(--text3)] mb-2 font-mono-custom">Key points and bullet details</p>
            <div className="bg-[var(--bg2)] rounded border border-[var(--border)] p-4">
              {Array.isArray(filing.level3) && filing.level3.length > 0 ? (
                <ul className="space-y-3">
                  {filing.level3.map((bullet, idx) => (
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
                <p className="text-[var(--text3)]">No bullet points available</p>
              )}
            </div>
          </div>
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
