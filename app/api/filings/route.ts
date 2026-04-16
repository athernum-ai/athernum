/**
 * API Route: Get SEC Filing
 * 
 * Usage:
 *   GET /api/filings?ticker=AAPL&type=10-K
 *   GET /api/filings?ticker=TSLA
 * 
 * Query Parameters:
 *   - ticker (required): Stock ticker (e.g., AAPL, NVDA)
 *   - type (optional): Filing type (10-K or 10-Q, defaults to both)
 */

import { getLatestFiling } from '@/lib/secEdgar'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ticker = searchParams.get('ticker')
    const typeParam = searchParams.get('type')

    // Validate ticker parameter
    if (!ticker || ticker.trim() === '') {
      return NextResponse.json(
        { error: 'ticker parameter is required' },
        { status: 400 }
      )
    }

    // Parse filing types
    let filingTypes: ('10-K' | '10-Q')[] = ['10-K', '10-Q']
    if (typeParam) {
      const types = typeParam.split(',').map((t) => t.trim().toUpperCase())
      filingTypes = types.filter(
        (t) => t === '10-K' || t === '10-Q'
      ) as ('10-K' | '10-Q')[]

      if (filingTypes.length === 0) {
        return NextResponse.json(
          { error: 'Invalid filing type. Use 10-K or 10-Q' },
          { status: 400 }
        )
      }
    }

    // Fetch filing
    const result = await getLatestFiling(ticker.toUpperCase(), filingTypes)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      )
    }

    // Return filing data
    return NextResponse.json({
      success: true,
      data: result.filing,
    })
  } catch (error) {
    console.error('Error in /api/filings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
