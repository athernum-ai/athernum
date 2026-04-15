/**
 * Filing Import Scheduler
 * 
 * Uses node-cron to run the filing import job at specified intervals.
 * 
 * Usage:
 *   import { scheduleFilingImports, startScheduler, stopScheduler } from '@/lib/scheduler'
 *   
 *   // In your app initialization:
 *   startScheduler()
 *   
 *   // To stop:
 *   stopScheduler()
 */

import cron from 'node-cron'
import { importFilingsBatch, logImportResults } from '@/lib/filingImporter'
import { IMPORT_CONFIG, getIntervalInfo } from '@/lib/importConfig'

let scheduler: cron.ScheduledTask | null = null
let isRunning = false

/**
 * Calculate cron expression from minutes
 */
function minutesToCronExpression(minutes: number): string {
  if (minutes === 60) {
    return '0 * * * *'
  }

  if (minutes % 60 === 0) {
    const hours = minutes / 60
    if (hours > 24) {
      return '0 0 * * *'
    }
    return `0 */${hours} * * *`
  }

  if (minutes < 60) {
    return `*/${minutes} * * * *`
  }

  console.warn(`Warning: Cannot express ${minutes} minutes in cron format, using hourly`)
  return '0 * * * *'
}

/**
 * Run the filing import job once
 */
async function runImportJob(): Promise<void> {
  if (!isRunning) {
    console.log(`\n[${new Date().toISOString()}] 🔄 Filing import job started...`)
    isRunning = true

    try {
      const results = await importFilingsBatch({
        tickers: IMPORT_CONFIG.TICKERS,
        filingTypes: [...IMPORT_CONFIG.FILING_TYPES],
      })

      logImportResults(results)
    } catch (error) {
      console.error('❌ Error during import job:', error)
    } finally {
      isRunning = false
      console.log(`✅ Filing import job completed at ${new Date().toISOString()}\n`)
    }
  } else {
    console.warn('⚠️  Import job is already running, skipping...')
  }
}

/**
 * Start the scheduler
 */
function startScheduler(): void {
  if (scheduler) {
    console.warn('⚠️  Scheduler is already running')
    return
  }

  const cronExpression = minutesToCronExpression(IMPORT_CONFIG.INTERVAL_MINUTES)
  console.log(`\n${'='.repeat(60)}`)
  console.log('📅 FILING IMPORT SCHEDULER STARTED')
  console.log(`${'='.repeat(60)}`)
  console.log(`Interval: ${getIntervalInfo()} (${IMPORT_CONFIG.INTERVAL_MINUTES} minutes)`)
  console.log(`Cron Expression: ${cronExpression}`)
  console.log(`Monitoring Tickers: ${IMPORT_CONFIG.TICKERS.join(', ')}`)
  console.log(`Filing Types: ${IMPORT_CONFIG.FILING_TYPES.join(', ')}`)
  console.log(`${'='.repeat(60)}\n`)

  // Schedule the job
  scheduler = cron.schedule(cronExpression, runImportJob, {
    runOnInit: false, // Don't run immediately
  })

  console.log(`✅ Scheduler initialized. Next run: ${getNextRunTime()} (${cronExpression})`)
}

/**
 * Stop the scheduler
 */
function stopScheduler(): void {
  if (scheduler) {
    scheduler.stop()
    scheduler = null
    console.log('⛔ Filing import scheduler stopped')
  }
}

/**
 * Check if scheduler is running
 */
function isSchedulerRunning(): boolean {
  return scheduler !== null
}

/**
 * Run the import job immediately (useful for testing)
 */
async function runImportJobNow(): Promise<void> {
  console.log('▶️  Running filing import job immediately...')
  await runImportJob()
}

/**
 * Get estimated next run time (approximate)
 */
function getNextRunTime(): string {
  const now = new Date()
  const nextRun = new Date(now.getTime() + IMPORT_CONFIG.INTERVAL_MINUTES * 60 * 1000)
  return nextRun.toLocaleString()
}

/**
 * Get scheduler status
 */
function getSchedulerStatus(): object {
  return {
    isRunning: isSchedulerRunning(),
    interval: `${IMPORT_CONFIG.INTERVAL_MINUTES} minutes (${getIntervalInfo()})`,
    tickers: IMPORT_CONFIG.TICKERS,
    filingTypes: IMPORT_CONFIG.FILING_TYPES,
    approximateNextRun: getNextRunTime(),
  }
}

export {
  startScheduler,
  stopScheduler,
  isSchedulerRunning,
  runImportJobNow,
  getSchedulerStatus,
  getNextRunTime,
  minutesToCronExpression,
}
