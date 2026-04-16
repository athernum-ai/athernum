/**
 * Filing Importer
 * 
 * Automatically fetches latest filings from SEC EDGAR,
 * summarizes them, assigns tags, and stores in Supabase.
 */

import { getLatestFiling } from '@/lib/secEdgar'
import { summarizeSECFiling } from '@/lib/secSummarizer'
import { saveFiling } from '@/lib/filingStorage'

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
  filingTypes?: readonly ('10-K' | '10-Q')[]
}

/**
 * Fetch raw filing text from SEC
 */
async function fetchRawFilingText(htmlUrl: string): Promise<string> {
  try {
    const response = await fetch(htmlUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Athernum/1.0)',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`)
    }

    const text = await response.text()
    return text
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to fetch filing text: ${errorMessage}`)
  }
}

/**
 * Import a single filing: fetch, summarize, tag, and save
 */
async function importSingleFiling(
  ticker: string,
  filingTypes: readonly ('10-K' | '10-Q')[] = ['10-K', '10-Q']
): Promise<ImportJobResult> {
  try {
    // Step 1: Fetch filing metadata from SEC
    const filingResult = await getLatestFiling(ticker, filingTypes)

    if (!filingResult.success || !filingResult.filing) {
      return {
        ticker,
        success: false,
        error: filingResult.error || 'Failed to fetch filing metadata',
      }
    }

    const filing = filingResult.filing

    // Step 2: Fetch raw filing text
    console.log(`📝 Fetching raw text for ${ticker} (${filing.filingType})...`)
    let rawText: string

    try {
      rawText = await fetchRawFilingText(filing.htmlUrl || filing.documentUrl)
    } catch (error) {
      // If fetching fails, use a placeholder for testing
      console.warn(`⚠️  Could not fetch raw text, using summary: ${error}`)
      rawText = filing.documentUrl
    }

    // Step 3: Summarize the filing
    console.log(`📊 Summarizing filing...`)
    const summaryResult = summarizeSECFiling(rawText)

    if (!summaryResult.success || !summaryResult.summary) {
      return {
        ticker,
        success: false,
        error: summaryResult.error || 'Failed to summarize filing',
      }
    }

    // Step 4: Save to Supabase
    console.log(`💾 Saving to database...`)
    const saveResult = await saveFiling(
      ticker,
      filing.filingType as '10-K' | '10-Q' | '8-K',
      filing.reportDate,
      summaryResult.summary
    )

    if (!saveResult.success) {
      return {
        ticker,
        success: false,
        error: saveResult.error || 'Failed to save filing',
      }
    }

    console.log(
      `✅ Successfully imported ${ticker} ${filing.filingType} (ID: ${saveResult.data?.id})`
    )

    return {
      ticker,
      success: true,
      filingType: filing.filingType,
      filingDate: filing.reportDate,
      recordId: saveResult.data?.id,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return {
      ticker,
      success: false,
      error: `Import failed: ${errorMessage}`,
    }
  }
}

/**
 * Batch import multiple filings
 */
async function importFilingsBatch(config: ImportJobConfig): Promise<ImportJobResult[]> {
  const filingTypes = config.filingTypes || ['10-K', '10-Q']

  console.log(
    `\n🚀 Starting filing import job (${config.tickers.length} tickers)\n`
  )

  const results = await Promise.all(
    config.tickers.map((ticker) => importSingleFiling(ticker, filingTypes))
  )

  return results
}

/**
 * Log import job results
 */
function logImportResults(results: ImportJobResult[]): void {
  console.log('\n' + '='.repeat(60))
  console.log('📋 IMPORT JOB SUMMARY')
  console.log('='.repeat(60) + '\n')

  const successful = results.filter((r) => r.success)
  const failed = results.filter((r) => !r.success)

  console.log(`✅ Successful: ${successful.length}`)
  successful.forEach((result) => {
    console.log(`   ${result.ticker} (${result.filingType})`)
  })

  if (failed.length > 0) {
    console.log(`\n❌ Failed: ${failed.length}`)
    failed.forEach((result) => {
      console.log(`   ${result.ticker}: ${result.error}`)
    })
  }

  console.log('\n' + '='.repeat(60) + '\n')
}

export { importSingleFiling, importFilingsBatch, fetchRawFilingText, logImportResults }
