/**
 * Filing Statistics Service
 * 
 * Provides analytics and statistics about SEC filings from Supabase
 */

import { supabase } from '@/lib/supabaseClient'
import type { SupabaseFilingRecord } from '@/types'

const TABLE_NAME = 'filings'

interface FilingStats {
  totalFilings: number
  todayFilings: number
  latestCompanies: Array<{ ticker: string; count: number; lastUpdated: string }>
  allFilings: SupabaseFilingRecord[]
}

/**
 * Get filing statistics including today's count, latest companies, and all filings
 */
export async function getFilingStats(): Promise<FilingStats> {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      console.warn('⚠️  Supabase not configured. Returning mock statistics.')
      return getMockStats()
    }

    // Fetch all filings
    const { data: allFilings, error: allError } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('last_updated', { ascending: false })

    if (allError || !allFilings) {
      console.warn(`Failed to fetch filings: ${allError?.message}. Using mock data.`)
      return getMockStats()
    }

    // Count total filings
    const totalFilings = allFilings.length

    // Count today's filings
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayFilings = allFilings.filter((filing: SupabaseFilingRecord) => {
      const createdDate = new Date(filing.created_at || filing.last_updated || '')
      createdDate.setHours(0, 0, 0, 0)
      return createdDate.getTime() === today.getTime()
    }).length

    // Get latest companies (unique tickers ordered by last_updated)
    const tickerMap = new Map<string, { count: number; lastUpdated: string }>()
    allFilings.forEach((filing: SupabaseFilingRecord) => {
      const ticker = filing.ticker
      const entry = tickerMap.get(ticker)
      if (entry) {
        entry.count += 1
      } else {
        tickerMap.set(ticker, {
          count: 1,
          lastUpdated: filing.last_updated || filing.created_at || new Date().toISOString(),
        })
      }
    })

    const latestCompanies = Array.from(tickerMap.entries())
      .map(([ticker, { count, lastUpdated }]) => ({
        ticker,
        count,
        lastUpdated,
      }))
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, 10) // Top 10 latest

    return {
      totalFilings,
      todayFilings,
      latestCompanies,
      allFilings,
    }
  } catch (error) {
    console.error('Error fetching filing stats:', error)
    return getMockStats()
  }
}

/**
 * Get mock statistics for when Supabase is not available
 */
function getMockStats(): FilingStats {
  const mockFilings: SupabaseFilingRecord[] = [
    {
      ticker: 'AAPL',
      report_type: '10-K',
      date: '2026-04-15',
      level0: 'Full SEC filing text...',
      level1:
        'Apple reported strong fiscal 2024 results with revenue growth of 16% and expanded margins across all product categories.',
      level2:
        'Apple Inc. reported Q2 FY2025 results that exceeded Wall Street expectations. Revenue of $94.8B (+6% YoY) beat the $93.2B consensus. Services revenue grew 11% to $24.2B.',
      level3: [
        'Revenue: $94.8B (+6.1% YoY)',
        'Gross margin: 46.6% (+70bps YoY)',
        'EPS: $1.53 (beat by $0.03)',
        'Services revenue: $24.2B (+11.3%)',
      ],
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
    },
    {
      ticker: 'MSFT',
      report_type: '10-K',
      date: '2026-04-14',
      level0: 'Full SEC filing text...',
      level1:
        'Microsoft demonstrated robust performance in cloud services with operating margin expansion and strong cash generation.',
      level2:
        'Microsoft reported strong Q2 results driven by continued cloud infrastructure expansion. Azure revenue grew 32% YoY.',
      level3: [
        'Azure revenue growth: 32% YoY',
        'Operating margin: 42% (+150bps)',
        'Free cash flow: $18.5B',
        'Operating income beat estimates by 5%',
      ],
      created_at: new Date(Date.now() - 86400000).toISOString(),
      last_updated: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      ticker: 'NVDA',
      report_type: '10-K',
      date: '2026-04-12',
      level0: 'Full SEC filing text...',
      level1: 'NVIDIA showed exceptional growth with record data center revenue and expanding operating margins.',
      level2:
        'NVIDIA reported record Q1 revenue of $28.0B (+268% YoY) driven by continued data center buildout by hyperscalers.',
      level3: [
        'Q1 Revenue: $28.0B (+268% YoY)',
        'Data center revenue: $24.6B (doubled)',
        'Gross margin: 75% (+1000bps)',
        'Q2 guidance: >$32B',
      ],
      created_at: new Date(Date.now() - 86400000).toISOString(),
      last_updated: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      ticker: 'META',
      report_type: '10-K',
      date: '2026-04-13',
      level0: 'Full SEC filing text...',
      level1: 'Meta reported accelerating revenue growth driven by AI/ML initiatives and improving ad targeting capabilities.',
      level2:
        'Meta reported Q1 results with revenue of $36.5B (+25% YoY). AI investments drove improved ad targeting effectiveness.',
      level3: [
        'Revenue: $36.5B (+25% YoY)',
        'Operating margin: 35% (+300bps)',
        'AI-driven ad improvements',
        'User growth acceleration',
      ],
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      last_updated: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      ticker: 'TSLA',
      report_type: '10-K',
      date: '2026-04-11',
      level0: 'Full SEC filing text...',
      level1:
        'Tesla reported competitive pressures in the EV market offset by continued volume growth and cost improvements.',
      level2:
        'Tesla delivered 336,681 vehicles in Q1, below consensus of 370,000. Automotive gross margin compressed to 17.2%.',
      level3: [
        'Q1 Deliveries: 336.7K (below consensus)',
        'Automotive margin: 17.2% (-120bps)',
        'Free cash flow: $3.2B',
        'Market share pressure in key regions',
      ],
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      last_updated: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
  ]

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayFilings = mockFilings.filter((filing) => {
    const createdDate = new Date(filing.created_at || '')
    createdDate.setHours(0, 0, 0, 0)
    return createdDate.getTime() === today.getTime()
  }).length

  const tickerMap = new Map<string, { count: number; lastUpdated: string }>()
  mockFilings.forEach((filing) => {
    const ticker = filing.ticker
    const entry = tickerMap.get(ticker)
    if (entry) {
      entry.count += 1
    } else {
      tickerMap.set(ticker, {
        count: 1,
        lastUpdated: filing.last_updated || new Date().toISOString(),
      })
    }
  })

  const latestCompanies = Array.from(tickerMap.entries())
    .map(([ticker, { count, lastUpdated }]) => ({
      ticker,
      count,
      lastUpdated,
    }))
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())

  return {
    totalFilings: mockFilings.length,
    todayFilings,
    latestCompanies,
    allFilings: mockFilings,
  }
}
