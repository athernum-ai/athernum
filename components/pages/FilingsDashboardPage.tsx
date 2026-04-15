'use client'

import { useEffect, useState } from 'react'
import { getFilingStats } from '@/lib/filingStats'
import FilingSummaryViewer from '@/components/FilingSummaryViewer'
import { Tag } from '@/components/ui'
import type { SupabaseFilingRecord } from '@/types'

interface FilingsDashboardStats {
  totalFilings: number
  todayFilings: number
  latestCompanies: Array<{ ticker: string; count: number; lastUpdated: string }>
  allFilings: SupabaseFilingRecord[]
}

interface FilingsDashboardPageProps {
  onTickerNav: (ticker: string) => void
}

export default function FilingsDashboardPage({ onTickerNav }: FilingsDashboardPageProps) {
  const [stats, setStats] = useState<FilingsDashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFiling, setSelectedFiling] = useState<SupabaseFilingRecord | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getFilingStats()
        setStats(data)
      } catch (err) {
        console.error('Error fetching filing stats:', err)
        setError('Failed to load filing statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const getTagVariant = (tag: string): 'default' | 'blue' | 'green' | 'red' => {
    switch (tag) {
      case 'Tech':
        return 'blue'
      case 'Finance':
      case 'Growth':
        return 'green'
      case 'Risk':
        return 'red'
      default:
        return 'default'
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-serif-custom italic text-[var(--text)] mb-2">
            Filings Dashboard
          </h1>
          <p className="text-[var(--text3)]">Loading filing statistics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-serif-custom italic text-[var(--text)] mb-2">
            Filings Dashboard
          </h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-serif-custom italic text-[var(--text)] mb-2">
            Filings Dashboard
          </h1>
          <p className="text-[var(--text3)]">No data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif-custom italic text-[var(--text)] mb-1">Filings Dashboard</h1>
        <p className="text-sm text-[var(--text3)]">Monitor SEC filing imports and company data</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Total Filings Card */}
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--text3)] text-sm font-mono-custom uppercase tracking-[1px]">
                Total Filings
              </p>
              <p className="text-4xl font-serif-custom italic font-bold text-[var(--text)] mt-2">
                {stats.totalFilings}
              </p>
            </div>
            <div className="w-16 h-16 bg-[var(--accent)]/10 rounded-lg flex items-center justify-center text-3xl">
              📊
            </div>
          </div>
        </div>

        {/* Today's Filings Card */}
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--text3)] text-sm font-mono-custom uppercase tracking-[1px]">
                Imported Today
              </p>
              <p className="text-4xl font-serif-custom italic font-bold text-[var(--accentg)] mt-2">
                {stats.todayFilings}
              </p>
            </div>
            <div className="w-16 h-16 bg-[#10b981]/10 rounded-lg flex items-center justify-center text-3xl">
              ✨
            </div>
          </div>
        </div>
      </div>

      {/* Latest Companies Section */}
      <div className="mb-6">
        <h2 className="text-lg font-serif-custom italic text-[var(--text)] mb-4">Latest Companies Processed</h2>
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-lg overflow-hidden">
          {stats.latestCompanies.length > 0 ? (
            <div className="divide-y divide-[var(--border)]">
              {stats.latestCompanies.map((company, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 hover:bg-[var(--bg3)] transition-colors cursor-pointer"
                  onClick={() => onTickerNav(company.ticker)}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-xl font-serif-custom italic font-bold text-[var(--accent)]">
                      {company.ticker}
                    </div>
                    <div className="text-sm text-[var(--text3)]">
                      {company.count} filing{company.count !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="text-xs text-[var(--text3)] font-mono-custom">
                    {new Date(company.lastUpdated).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-[var(--text3)]">No companies found</div>
          )}
        </div>
      </div>

      {/* All Filings Section */}
      <div>
        <h2 className="text-lg font-serif-custom italic text-[var(--text)] mb-4">All Filings</h2>
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-lg overflow-hidden">
          {stats.allFilings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--bg3)]">
                    <th className="px-6 py-3 text-left text-xs font-mono-custom uppercase text-[var(--text3)] tracking-[1px]">
                      Ticker
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-mono-custom uppercase text-[var(--text3)] tracking-[1px]">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-mono-custom uppercase text-[var(--text3)] tracking-[1px]">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-mono-custom uppercase text-[var(--text3)] tracking-[1px]">
                      Tags
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-mono-custom uppercase text-[var(--text3)] tracking-[1px]">
                      Summary
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-mono-custom uppercase text-[var(--text3)] tracking-[1px]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.allFilings.map((filing, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-[var(--border)] hover:bg-[var(--bg3)] transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-serif-custom italic font-bold text-[var(--accent)]">
                        {filing.ticker}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--text)]">{filing.report_type}</td>
                      <td className="px-6 py-4 text-sm text-[var(--text2)]">
                        {new Date(filing.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 flex-wrap">
                          {filing.tags && filing.tags.length > 0 ? (
                            filing.tags.map((tag) => (
                              <Tag
                                key={tag}
                                label={tag}
                                variant={getTagVariant(tag)}
                              />
                            ))
                          ) : (
                            <span className="text-xs text-[var(--text3)]">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[var(--text2)] line-clamp-2">
                          {filing.level1 || 'No summary available'}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedFiling(filing)}
                          className="px-3 py-1.5 bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 text-[var(--accent)] text-xs font-mono-custom rounded border border-[var(--accent)]/30 transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-[var(--text3)]">No filings found</div>
          )}
        </div>
      </div>

      {/* Summary Viewer Modal */}
      {selectedFiling && (
        <FilingSummaryViewer
          filing={selectedFiling}
          onClose={() => setSelectedFiling(null)}
        />
      )}
    </div>
  )
}
