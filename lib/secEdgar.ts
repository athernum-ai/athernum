/**
 * SEC EDGAR Filing Fetcher
 *
 * Fetches SEC 10-K and 10-Q (annual and quarterly reports) filings from the SEC EDGAR API.
 */

import type { SECFiling, SECFilingResponse } from '@/types'

const SUBMISSIONS_BASE = 'https://data.sec.gov/submissions'
const ARCHIVES_BASE    = 'https://www.sec.gov/Archives/edgar/data'
const TICKERS_URL      = 'https://www.sec.gov/files/company_tickers.json'

const USER_AGENT = process.env.EDGAR_USER_AGENT ?? 'Athernum, UTDallas CS3345 Student Project, athernum@proton.me'

const CIK_CACHE = new Map<string, string>([
  ['AAPL',  '0000320193'],
  ['NVDA',  '0001045810'],
  ['TSLA',  '0001318605'],
  ['META',  '0001326801'],
  ['MSFT',  '0000789019'],
  ['GOOGL', '0001652044'],
  ['AMZN',  '0001018724'],
])

// Helpers

function edgarHeaders(): HeadersInit {
  return { 'User-Agent': USER_AGENT, Accept: 'application/json' }
}

export async function getTickerToCIK(ticker: string): Promise<string> {
  const upper  = ticker.toUpperCase()
  const cached = CIK_CACHE.get(upper)
  if (cached) return cached

  const res = await fetch(TICKERS_URL, { headers: edgarHeaders() })
  if (!res.ok) throw new Error(`Failed to fetch SEC tickers list: ${res.status}`)

  const data: Record<string, { cik_str: number; ticker: string }> = await res.json()

  for (const company of Object.values(data)) {
    if (company.ticker.toUpperCase() === upper) {
      const cik = String(company.cik_str).padStart(10, '0')
      CIK_CACHE.set(upper, cik)
      return cik
    }
  }

  throw new Error(`Ticker "${ticker}" not found in SEC tickers list`)
}

async function fetchSubmissions(cik: string): Promise<any> {
  const url = `${SUBMISSIONS_BASE}/CIK${cik}.json`
  const res = await fetch(url, { headers: edgarHeaders() })
  if (!res.ok) throw new Error(`EDGAR submissions fetch failed for CIK ${cik}: ${res.status}`)
  return res.json()
}

async function fetchFilingText(
  cik: string,
  accessionRaw: string,
  primaryDoc: string
): Promise<string> {
  const accessionClean = accessionRaw.replace(/-/g, '')
  const cikInt         = parseInt(cik, 10)
  const url            = `${ARCHIVES_BASE}/${cikInt}/${accessionClean}/${primaryDoc}`

  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,text/plain' },
  })
  if (!res.ok) throw new Error(`Failed to fetch filing document at ${url}: ${res.status}`)

  const html = await res.text()
  return html.replace(/<[^>]*>/g, ' ').replace(/\s{2,}/g, ' ').trim()
}

// Public API

export async function getLatestFiling(
  ticker: string,
  filingTypes: readonly ('10-K' | '10-Q')[] = ['10-K', '10-Q']
): Promise<SECFilingResponse> {
  try {
    const cik         = await getTickerToCIK(ticker)
    const submissions = await fetchSubmissions(cik)

    const recent = submissions.filings?.recent
    if (!recent) throw new Error(`No recent filings found for CIK ${cik}`)

    const { form, accessionNumber, filingDate, reportDate, primaryDocument } = recent as {
      form: string[]
      accessionNumber: string[]
      filingDate: string[]
      reportDate: string[]
      primaryDocument: string[]
    }

    for (const targetForm of filingTypes) {
      const idx = form.findIndex((f) => f === targetForm)
      if (idx === -1) continue

      const accRaw       = accessionNumber[idx]
      const primaryDoc   = primaryDocument[idx]
      const accessionClean = accRaw.replace(/-/g, '')
      const cikInt       = parseInt(cik, 10)
      const documentUrl  = `${ARCHIVES_BASE}/${cikInt}/${accessionClean}/${primaryDoc}`
      const rawText      = await fetchFilingText(cik, accRaw, primaryDoc)

      const filing: SECFiling = {
        accessionNumber: accRaw,
        filingDate:      filingDate[idx],
        reportDate:      reportDate[idx] ?? filingDate[idx],
        filingType:      targetForm,
        documentUrl,
        htmlUrl:         documentUrl,
        ticker:          ticker.toUpperCase(),
        rawText,
      }

      return { success: true, filing }
    }

    throw new Error(`No ${filingTypes.join(' or ')} filing found for ${ticker}`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return { success: false, error: errorMessage }
  }
}

export async function getLatestFilingsBatch(
  tickers: string[],
  filingTypes: readonly ('10-K' | '10-Q')[] = ['10-K', '10-Q']
): Promise<SECFilingResponse[]> {
  return Promise.all(tickers.map((ticker) => getLatestFiling(ticker, filingTypes)))
}
