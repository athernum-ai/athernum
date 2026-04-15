/**
 * API Route: Summarize SEC Filing
 * 
 * Usage:
 *   POST /api/summarize
 *   Body: { "text": "raw SEC filing text..." }
 */

import { summarizeSECFiling } from '@/lib/secSummarizer'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text } = body

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'text parameter is required and must be a string' },
        { status: 400 }
      )
    }

    if (text.trim().length === 0) {
      return NextResponse.json(
        { error: 'text cannot be empty' },
        { status: 400 }
      )
    }

    const result = summarizeSECFiling(text)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: result.summary,
    })
  } catch (error) {
    console.error('Error in /api/summarize:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Example GET endpoint to test with sample text
export async function GET(request: NextRequest) {
  const sampleText = `FORM 10-K - ANNUAL REPORT
Item 1. Business
The Company develops and markets a range of cutting-edge technology products and services to enterprise and consumer markets worldwide. Our revenue streams include software licensing, cloud services, and hardware sales. We have experienced consistent growth over the past five years with expanding gross margins.

Item 7. Management's Discussion and Analysis
Net revenue for fiscal 2024 increased 12% to $156.2 billion compared with $139.5 billion in fiscal 2023. Operating income increased 18% to $48.5 billion, with operating margin at 31%. 

Net income for the period was $37.8 billion, representing earnings per share of $2.47 on a fully diluted basis. Cash flow from operations was strong at $52.3 billion.

Item 1A. Risk Factors
Our business faces significant competitive pressures and rapid technological change. We discuss our market risks, regulatory compliance challenges, and supply chain dependencies.`

  const result = summarizeSECFiling(sampleText)

  return NextResponse.json({
    success: true,
    message: 'Sample SEC filing summarization (GET returns hardcoded example)',
    data: result.summary,
  })
}
