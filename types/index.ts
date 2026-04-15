export type PageId = 'feed' | 'ticker' | 'search' | 'events' | 'settings' | 'filings-dashboard'

export interface TickerData {
  name: string
  price: string
  chg: string
  dir: 'up' | 'dn'
  open: string
  high: string
  low: string
  cap: string
}

export interface TickerMap {
  [key: string]: TickerData
}

export interface SummaryLevel {
  badge: 'brief' | 'standard' | 'detailed'
  label: string
  html: string
}

export interface CalendarEvent {
  date: string
  name: string
  desc: string
  urgency: 'today' | 'soon' | 'normal'
}

export interface Article {
  source: string
  time: string
  tags: { label: string; variant: 'default' | 'blue' | 'green' | 'red' }[]
  title: string
  summary: string
  ticker?: string
}

// SEC EDGAR Types
export interface SECFiling {
  accessionNumber: string
  filingDate: string
  reportDate: string
  filingType: '10-K' | '10-Q' | '8-K' | string
  documentUrl: string
  htmlUrl?: string
  ticker: string
}

export interface CompanyInfo {
  cik: string
  ticker: string
  name: string
  sic: string
}

export interface SECFilingResponse {
  success: boolean
  filing?: SECFiling
  error?: string
}

export interface SECFilingSummary {
  original: string
  level1: string
  level2: string
  level3: string[]
}

export interface SECSummaryResponse {
  success: boolean
  summary?: SECFilingSummary
  error?: string
}

export interface SupabaseFilingRecord {
  id?: string // Auto-generated UUID
  ticker: string
  report_type: '10-K' | '10-Q' | '8-K' | string
  date: string // YYYY-MM-DD
  level0: string // Original raw text
  level1: string // 1-sentence summary
  level2: string // 1-paragraph summary
  level3: string[] // Bullet points
  last_updated?: string // ISO timestamp
  created_at?: string // Auto-generated
  updated_at?: string // Auto-generated
}

export interface SaveFilingResponse {
  success: boolean
  data?: SupabaseFilingRecord
  error?: string
}

// Import Job Types
export interface ImportJobResult {
  ticker: string
  success: boolean
  filingType?: string
  filingDate?: string
  recordId?: string
  error?: string
}

export interface ImportJobConfig {
  tickers: string[]
  filingTypes?: ('10-K' | '10-Q')[]
}