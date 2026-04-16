/**
 * API Route: Save SEC Filing to Database
 * 
 * Usage:
 *   POST /api/save-filing
 *   Body: {
 *     "ticker": "AAPL",
 *     "reportType": "10-K",
 *     "reportDate": "2024-01-27",
 *     "summary": {
 *       "original": "...",
 *       "level1": "...",
 *       "level2": "...",
 *       "level3": [...]
 *     }
 *   }
 */

import { saveFiling } from '@/lib/filingStorage'
import type { SECFilingSummary } from '@/types'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ticker, reportType, reportDate, summary } = body

    // Validate required fields
    if (!ticker || !reportType || !reportDate) {
      return NextResponse.json(
        {
          error: 'Missing required fields: ticker, reportType, reportDate',
        },
        { status: 400 }
      )
    }

    // Validate summary object
    if (!summary || !summary.original || !summary.level1 || !summary.level2 || !summary.level3) {
      return NextResponse.json(
        {
          error:
            'Invalid summary object. Must include: original, level1, level2, level3',
        },
        { status: 400 }
      )
    }

    // Validate report type
    const validTypes = ['10-K', '10-Q', '8-K']
    if (!validTypes.includes(reportType)) {
      return NextResponse.json(
        {
          error: `Invalid reportType. Must be one of: ${validTypes.join(', ')}`,
        },
        { status: 400 }
      )
    }

    // Save to database
    const result = await saveFiling(
      ticker,
      reportType as '10-K' | '10-Q' | '8-K',
      reportDate,
      summary as SECFilingSummary
    )

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Filing saved successfully',
      data: result.data,
    })
  } catch (error) {
    console.error('Error in /api/save-filing:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
