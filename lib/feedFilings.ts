/**
 * Feed Filings Service
 * 
 * Fetches SEC filings from Supabase and returns them for display in the feed
 */

import { supabase } from '@/lib/supabaseClient'
import type { SupabaseFilingRecord } from '@/types'

const TABLE_NAME = 'filings'

/**
 * Fetch latest filings from Supabase
 */
export async function getLatestFilingsForFeed(limit: number = 10): Promise<SupabaseFilingRecord[]> {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      console.warn('⚠️  Supabase not configured. Returning mock filing data.')
      return getMockFilings()
    }

    // Fetch latest filings from Supabase
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('last_updated', { ascending: false })
      .limit(limit)

    if (error) {
      console.warn(`Failed to fetch filings: ${error.message}. Using mock data.`)
      return getMockFilings()
    }

    if (!data || data.length === 0) {
      console.warn('No filings found in database. Using mock data.')
      return getMockFilings()
    }

    return data as SupabaseFilingRecord[]
  } catch (error) {
    console.error('Error fetching filings for feed:', error)
    return getMockFilings()
  }
}

/**
 * Get mock filing records for when Supabase is not available
 */
function getMockFilings(): SupabaseFilingRecord[] {
  return [
    {
      ticker: 'AAPL',
      report_type: '10-K',
      date: '2026-04-15',
      level0: 'Full SEC filing text would appear here...',
      level1:
        'Apple reported strong fiscal 2024 results with revenue growth of 16% and expanded margins across all product categories.',
      level2:
        'Apple Inc. reported Q2 FY2025 results that exceeded Wall Street expectations across the board. Revenue of $94.8B (+6% YoY) beat the $93.2B consensus, driven by an 11% surge in Services revenue to $24.2B — a new record. iPhone revenue of $48.3B came in above estimates despite concerns over consumer softness. Gross margin expanded to 46.6% vs. 45.9% a year ago. EPS of $1.53 beat by $0.03. The board declared a $0.25/share dividend (raised 4%) and authorized a fresh $100B buyback program.',
      level3: [
        'Revenue: $94.8B (+6.1% YoY)',
        'Gross margin: 46.6% (+70bps YoY)',
        'EPS: $1.53 (beat by $0.03)',
        'Services revenue: $24.2B (+11.3%)',
        'Dividend raised 4% to $0.25/share',
      ],
      tags: ['Finance'],
      last_updated: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      ticker: 'MSFT',
      report_type: '10-K',
      date: '2026-04-14',
      level0: 'Full SEC filing text would appear here...',
      level1:
        'Microsoft demonstrated robust performance in cloud services with operating margin expansion and strong cash generation.',
      level2:
        'Microsoft reported strong Q2 results driven by continued cloud infrastructure expansion. Azure revenue grew 32% YoY powered by AI service adoption. Operating margin expanded 150bps to 42%. The company generated $18.5B in free cash flow. Management guides Q3 Azure growth in the mid-30% range.',
      level3: [
        'Azure revenue growth: 32% YoY',
        'Operating margin: 42% (+150bps)',
        'Free cash flow: $18.5B',
        'Operating income beat estimates by 5%',
        'Maintained strong balance sheet',
      ],
      tags: ['Finance', 'Tech'],
      last_updated: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      ticker: 'META',
      report_type: '10-K',
      date: '2026-04-13',
      level0: 'Full SEC filing text would appear here...',
      level1: 'Meta reported accelerating revenue growth driven by AI/ML initiatives and improving ad targeting capabilities.',
      level2:
        'Meta reported Q1 results with revenue of $36.5B (+25% YoY), exceeding consensus by 8%. AI investments drove improved ad targeting effectiveness. Operating margin expanded to 35%. The company returned $10B to shareholders via buybacks and maintained strong user growth across platforms.',
      level3: [
        'Revenue: $36.5B (+25% YoY)',
        'Operating margin: 35% (+300bps)',
        'AI-driven ad improvements',
        'User growth acceleration',
        '$10B shareholder returns',
      ],
      tags: ['Growth'],
      last_updated: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      ticker: 'NVDA',
      report_type: '10-K',
      date: '2026-04-12',
      level0: 'Full SEC filing text would appear here...',
      level1: 'NVIDIA showed exceptional growth with record data center revenue and expanding operating margins.',
      level2:
        'NVIDIA reported record Q1 revenue of $28.0B (+268% YoY) driven by continued data center buildout by hyperscalers. Data center revenue doubled to $24.6B. Gross margin expanded to 75% from 65%. The company guided Q2 revenue above $32B, signaling sustained demand for GPU infrastructure.',
      level3: [
        'Q1 Revenue: $28.0B (+268% YoY)',
        'Data center revenue: $24.6B (doubled)',
        'Gross margin: 75% (+1000bps)',
        'Q2 guidance: >$32B',
        'Strong enterprise demand',
      ],
      tags: ['Growth', 'Risk'],
      last_updated: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      ticker: 'TSLA',
      report_type: '10-K',
      date: '2026-04-11',
      level0: 'Full SEC filing text would appear here...',
      level1:
        'Tesla reported competitive pressures in the EV market offset by continued volume growth and cost improvements.',
      level2:
        'Tesla delivered 336,681 vehicles in Q1, below consensus of 370,000. Automotive gross margin compressed to 17.2% due to pricing pressures from competitors. Free cash flow remained positive at $3.2B. The company began deliveries of next-gen platforms targeting higher volumes.',
      level3: [
        'Q1 Deliveries: 336.7K (below consensus)',
        'Automotive margin: 17.2% (-120bps)',
        'Free cash flow: $3.2B',
        'Market share pressure in key regions',
        'Next-gen platform ramp',
      ],
      tags: ['Finance', 'Tech'],
      last_updated: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
  ]
}
