/**
 * Mock SEC EDGAR Filing Summarizer
 * 
 * Generates multi-level summaries of SEC filings.
 * Currently uses mock/fake summaries. Ready for real ML model integration.
 */

import type { SECFilingSummary, SECSummaryResponse } from '@/types'

/**
 * Extract key metrics or keywords from raw SEC text
 * (Simple heuristic - real implementation would use NLP)
 */
function extractKeywords(text: string): string[] {
  const keywords = text
    .split(/\s+/)
    .filter((word) => word.length > 6 && !['Company', 'reported', 'results', 'fiscal'].includes(word))
    .slice(0, 10)

  return keywords
}

const OLLAMA_HOST = process.envOLLAMA_HOST!

// Ollama API call to MS Azure host
async function callOllama(prompt: string): Promise<string> {
  const res = await fetch(`${OLLAMA_HOST}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3.2',
      stream: false,
      message: [
        {
          role: 'system',
          content:
            'You are a financial analyst specializing in summarizing SEC filings (Forms 10-K and 10-Q). Structure your output in a concise and easy to understand manner.',
        },
        {
          role: 'user'
          content: prompt,
        },
       ],
   }),
 })

if (!res.ok) { throw new Error(`Ollama API error: $(await res.text()}` }

const data = await res.json()

return data.message?.content ?? data.response ?? ''
}


// Level 1 summary
export async function generateLevel1Summary(text: string): Promise<string> {
  return callOllama(`
Summarize this SEC filing in four sentences maximum. Focus on reporting company performance.

TEXT:
${text.slice(0, 6000)}
`)
}

// Level 2 summary
export async function generateLevel2Summary(text: string): Promise<string> {
  return callOllama(`
Summarize this SEC filing in six sentences. Focus on reporting company performance.

TEXT:
${text.slice(0, 9000)}
`)
}

// Level 3 summary
export async function generateLevel2Summary(text: string): Promise<string> {
  return callOllama(`
Summarize this SEC filing in ten sentences. Focus on reporting company performance.

TEXT:
${text.slice(0, 12000)}
`)
}

// Summary pipeline
export async function generateSummary(
  rawText: string
): Promise<SECFilingSummary> {
  if (!rawText?.trim()) {
    return {
      original: '',
      level1: 'No content',
      level2: 'No content',
      level3: 'No content",
    }
  }

const [l1, l2, l3] = await Promise.all([
  generateLevel1Summary(rawText),
  generateLevel2Summary(rawText),
  generateLevel3Summary(rawText),
])

/**
 * Generate a fake 1-sentence summary (Level 1)
 * 
 * Current implementation returns a placeholder.
 * To integrate real AI summarization, replace with API call to your model.
 
function generateLevel1Summary(text: string): string {
  // Mock implementation - detect key topics
  const wordCount = text.split(/\s+/).length
  const isQuarterly = text.toLowerCase().includes('quarter') || text.toLowerCase().includes('q1') || text.toLowerCase().includes('q2')
  const isAnnual = text.toLowerCase().includes('annual') || text.toLowerCase().includes('fiscal year')
  const hasResults = text.toLowerCase().includes('results') || text.toLowerCase().includes('revenue')

  let summary =
    isAnnual && hasResults
      ? `The company's annual report shows comprehensive financial performance and operational updates for the fiscal year.`
      : isQuarterly && hasResults
        ? `The quarterly results demonstrate the company's financial performance and progress during the period.`
        : `The SEC filing provides detailed information about the company's business operations and financial status.`

  // Add variation based on text length
  if (wordCount > 10000) {
    summary += ` This comprehensive filing includes detailed disclosures across multiple business segments.`
  }

  return summary
}*/


/**
 * Generate a fake 1-paragraph summary (Level 2)
 * 
 * Current implementation returns a placeholder.
 * To integrate real AI summarization, replace with API call to your model.
 
function generateLevel2Summary(text: string): string {
  const hasRevenue = text.toLowerCase().includes('revenue')
  const hasEarnings = text.toLowerCase().includes('earnings') || text.toLowerCase().includes('net income')
  const hasGrowth = text.toLowerCase().includes('growth') || text.toLowerCase().includes('increase')
  const hasMargin = text.toLowerCase().includes('margin')
  const hasCashflow = text.toLowerCase().includes('cash flow') || text.toLowerCase().includes('operating cash')

  let paragraph = `This SEC filing presents `

  const components = []
  if (hasRevenue) components.push(`comprehensive revenue metrics and segment performance`)
  if (hasEarnings) components.push(`earnings analysis and profitability measures`)
  if (hasGrowth) components.push(`year-over-year growth trends`)
  if (hasMargin) components.push(`operating and net margin data`)
  if (hasCashflow) components.push(`cash flow statements`)

  if (components.length === 0) {
    components.push(`detailed financial information and operational metrics`)
  }

  paragraph += components.join(`, `)
  paragraph += `. The filing includes risk disclosures, management discussion and analysis, and material business developments. Key operational metrics and strategic initiatives are highlighted throughout the document, along with forward-looking guidance and management commentary on market conditions.`

  return paragraph
}
*/

/**
 * Generate a fake bulleted list summary (Level 3)
 * 
 * Current implementation returns placeholder bullets.
 * To integrate real AI summarization, replace with API call to your model.
 
function generateLevel3Summary(text: string): string[] {
  const bullets: string[] = []

  // Detect financial aspects
  if (text.toLowerCase().includes('revenue')) {
    bullets.push('Detailed revenue breakdown by business segment and geography')
  }
  if (text.toLowerCase().includes('net income') || text.toLowerCase().includes('earnings')) {
    bullets.push('Net income and earnings per share (EPS) analysis')
  }
  if (text.toLowerCase().includes('operating margin') || text.toLowerCase().includes('margin')) {
    bullets.push('Operating and gross margin trends and comparisons')
  }
  if (text.toLowerCase().includes('cash') || text.toLowerCase().includes('liquidity')) {
    bullets.push('Cash position, liquidity, and cash flow statement highlights')
  }
  if (text.toLowerCase().includes('debt') || text.toLowerCase().includes('liabilities')) {
    bullets.push('Debt levels, capital structure, and balance sheet metrics')
  }

  // Add risk and strategy bullets
  bullets.push('Material risks, uncertainties, and risk management strategies')
  bullets.push('Management discussion and analysis (MD&A) of financial results')

  // Detect operational aspects
  if (text.toLowerCase().includes('acquisition') || text.toLowerCase().includes('merger')) {
    bullets.push('Merger, acquisition, and divestiture activities')
  }
  if (text.toLowerCase().includes('product') || text.toLowerCase().includes('service')) {
    bullets.push('Product and service line performance and pipeline')
  }
  if (text.toLowerCase().includes('customer') || text.toLowerCase().includes('market')) {
    bullets.push('Customer metrics, market position, and competitive landscape')
  }

  // Add forward guidance
  bullets.push('Forward-looking guidance and management commentary on outlook')

  return bullets.slice(0, 8) // Limit to 8 bullets
}
*/

/**
 * Generate multi-level summary from raw SEC filing text
 * 
 * @param rawText - Raw SEC filing text
 * @returns SECFilingSummary with 4 levels
 
function generateSummary(rawText: string): SECFilingSummary {
  if (!rawText || rawText.trim().length === 0) {
    return {
      original: '',
      level1: 'No content provided.',
      level2: 'The provided text is empty or invalid.',
      level3: ['Unable to generate summary for empty content'],
    }
  }

  return {
    original: rawText,
    level1: generateLevel1Summary(rawText),
    level2: generateLevel2Summary(rawText),
    level3: generateLevel3Summary(rawText),
  }
}
*/

/**
 * Process SEC filing text and return structured summaries
 
function summarizeSECFiling(rawText: string): SECSummaryResponse {
  try {
    if (!rawText || typeof rawText !== 'string') {
      return {
        success: false,
        error: 'Invalid input: rawText must be a non-empty string',
      }
    }

    const summary = generateSummary(rawText)

    return {
      success: true,
      summary,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      success: false,
      error: `Failed to summarize SEC filing: ${errorMessage}`,
    }
  }
}

/**
 * Batch summarize multiple SEC filings
 
function summarizeSECFilingsBatch(texts: string[]): SECSummaryResponse[] {
  return texts.map((text) => summarizeSECFiling(text))
}

export {
  generateSummary,
  summarizeSECFiling,
  summarizeSECFilingsBatch,
  generateLevel1Summary,
  generateLevel2Summary,
  generateLevel3Summary,
}
*/
