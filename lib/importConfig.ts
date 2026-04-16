/**
 * Filing Import Scheduler Configuration
 * 
 * Configure the automatic filing import job parameters here
 */

export const IMPORT_CONFIG = {
  // ========== JOB SCHEDULE ==========
  // Interval in MINUTES. Examples:
  // 60 = 1 hour
  // 360 = 6 hours
  // 720 = 12 hours
  // 1440 = 24 hours (1 day)
  INTERVAL_MINUTES: 60, // Default: 1 hours

  // ========== TICKERS TO MONITOR ==========
  TICKERS: ['AAPL', 'NVDA', 'TSLA', 'META', 'MSFT'],

  // ========== FILING TYPES TO FETCH ==========
  // Which types of filings to monitor
  FILING_TYPES: ['10-K', '10-Q'] as const,

  // ========== LOGGING ==========
  // Enable detailed console logs during import
  VERBOSE_LOGGING: true,

  // ========== RETRY POLICY ==========
  // Retry failed imports?
  MAX_RETRIES: 2,
  RETRY_DELAY_MS: 5000, // 5 seconds between retries

  // ========== ERROR HANDLING ==========
  // Continue importing other tickers if one fails?
  CONTINUE_ON_ERROR: true,
}

export type ImportConfig = typeof IMPORT_CONFIG

// Export formatted interval info
export const getIntervalInfo = () => {
  const minutes = IMPORT_CONFIG.INTERVAL_MINUTES
  if (minutes < 60) return `${minutes} minutes`
  if (minutes === 60) return '1 hour'
  const hours = Math.round(minutes / 60)
  if (hours === 24) return '1 day'
  return `${hours} hours`
}
