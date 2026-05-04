'use client'

import { useState } from 'react'
import { getFilingSummaries } from '@/lib/data'
import type { SupabaseFilingRecord } from '@/types'

interface FilingSummaryViewerProps {
  filing: SupabaseFilingRecord
  onClose: () => void
}

const badgeColors = {
  brief:    'bg-[#10b98115] text-[var(--accentg)]',
  standard: 'bg-[#3b82f615] text-[var(--accent)]',
  detailed: 'bg-[#8b5cf615] text-[#8b5cf6]',
}

export default function FilingSummaryViewer({ filing, onClose }: FilingSummaryViewerProps) {
  const [level, setLevel] = useState(0)
  const summaries = getFilingSummaries(filing.ticker, filing.report_type)
  const summary = summaries[level]

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-[var(--bg2)] border border-[var(--border2)] rounded-[14px] shadow-2xl max-w-2xl w-full max-h-[88vh] flex flex-col">

        {/* Header */}
        <div className="border-b border-[var(--border)] px-6 py-5 flex items-start justify-between">
          <div>
            <h2 className="text-[22px] font-serif-custom italic text-[var(--text)] mb-0.5">
              {filing.ticker} — {filing.report_type}
            </h2>
            <p className="text-[11px] text-[var(--text3)] font-mono-custom">
              Filed {new Date(filing.date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text3)] hover:text-[var(--text)] transition-colors text-lg leading-none mt-1"
          >
            ✕
          </button>
        </div>

        {/* Level tabs */}
        <div className="flex gap-2 px-6 pt-5">
          {summaries.map((s, i) => (
            <button
              key={s.badge}
              onClick={() => setLevel(i)}
              className={[
                'px-3.5 py-1.5 rounded-md border text-[12px] font-mono-custom transition-all capitalize',
                level === i
                  ? 'bg-[#3b82f615] border-[var(--accent)] text-[var(--accent)]'
                  : 'bg-[var(--bg3)] border-[var(--border)] text-[var(--text2)] hover:border-[var(--border2)] hover:text-[var(--text)]',
              ].join(' ')}
            >
              {s.badge}
            </button>
          ))}
        </div>

        {/* Summary content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-[10px] p-5">
            <span
              className={`inline-block text-[10px] font-mono-custom px-2 py-0.5 rounded mb-3 ${badgeColors[summary.badge]}`}
            >
              {summary.label}
            </span>
            <div
              className="text-[13px] text-[var(--text2)] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: summary.html }}
            />
          </div>

          {/* Raw filing data below — always visible */}
          <div className="mt-5">
            <div className="text-[10px] font-mono-custom text-[var(--text3)] uppercase tracking-[1px] mb-2">
              Raw Filing Data
            </div>
            <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-[10px] p-4">
              <p className="text-[12px] text-[var(--text2)] leading-relaxed whitespace-pre-wrap line-clamp-6">
                {filing.level0 || filing.level1 || 'No raw data available'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--border)] px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[var(--accent)] text-white rounded-md font-mono-custom text-[12px] hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}