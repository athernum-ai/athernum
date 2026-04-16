#!/usr/bin/env node

/**
 * Manual Filing Import Script
 * 
 * Run filings import manually for testing and debugging.
 * 
 * Usage:
 *   npm run import:test      - Run once with random tags
 *   npm run import:now       - Run once with content-based tagging
 *   npm run import:schedule  - Start the scheduled job
 *   npm run import:status    - Check scheduler status
 */

import { importFilingsBatch, logImportResults } from '../lib/filingImporter'
import {
  startScheduler,
  stopScheduler,
  runImportJobNow,
  getSchedulerStatus,
} from '../lib/scheduler'
import { IMPORT_CONFIG } from '../lib/importConfig'

// Parse command line arguments
const command = process.argv[2] || 'test'

async function main() {
  try {
    switch (command) {
      case 'test': {
        console.log('🧪 TEST MODE: Running filing import\n')
        const results = await importFilingsBatch({
          tickers: IMPORT_CONFIG.TICKERS,
          filingTypes: IMPORT_CONFIG.FILING_TYPES,
        })
        logImportResults(results)
        break
      }

      case 'now':
      case 'run': {
        console.log('▶️  Running import job immediately...\n')
        const results = await importFilingsBatch({
          tickers: IMPORT_CONFIG.TICKERS,
          filingTypes: IMPORT_CONFIG.FILING_TYPES,
        })
        logImportResults(results)
        break
      }

      case 'start':
      case 'schedule': {
        console.log('Starting scheduler...\n')
        startScheduler()

        // Keep the process alive
        console.log('Scheduler is running. Press Ctrl+C to stop.\n')
        process.on('SIGINT', () => {
          console.log('\nStopping scheduler...')
          stopScheduler()
          process.exit(0)
        })
        break
      }

      case 'stop': {
        console.log('Stopping scheduler...\n')
        stopScheduler()
        break
      }

      case 'status': {
        console.log('📊 Scheduler Status:\n')
        console.log(JSON.stringify(getSchedulerStatus(), null, 2))
        break
      }

      case 'config': {
        console.log('⚙️  Current Configuration:\n')
        console.log(JSON.stringify(IMPORT_CONFIG, null, 2))
        break
      }

      case 'help':
      case '--help':
      case '-h': {
        showHelp()
        break
      }

      default: {
        console.log(`Unknown command: ${command}\n`)
        showHelp()
        process.exit(1)
      }
    }
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

function showHelp() {
  console.log(`
📋 Filing Import Script

Usage:
  npm run import:test              Run once with RANDOM TAGS (testing)
  npm run import:content           Run once with CONTENT-BASED tagging
  npm run import:run               Run import job immediately
  npm run import:start             Start the scheduler
  npm run import:stop              Stop the scheduler
  npm run import:status            Show scheduler status
  npm run import:config            Show current configuration
  npm run import:help              Show this help message

Examples:
  # Test the importer with a few tickers
  npm run import:test

  # Start the background scheduler (runs every X hours)
  npm run import:start

  # Check if scheduler is running
  npm run import:status

Configuration:
  Edit lib/importConfig.ts to change:
  - INTERVAL_MINUTES: How often to run (e.g., 360 = 6 hours)
  - TICKERS: Which stocks to monitor
  - FILING_TYPES: Which filing types to fetch (10-K, 10-Q, etc.)
  - USE_RANDOM_TAGS: Whether to use random or content-based tagging
`)
}

// Run if called directly
main()
