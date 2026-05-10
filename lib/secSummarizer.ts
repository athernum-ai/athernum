/**
 * SEC Filing Summarizer
 *
 * Calls Ollama hosted on MS Azure and generates 3 filings
 * Gets 10-K and 10-Q filings (Annual and Quarterly)
 */

export type SECFilingSummary = {
  original: string // Raw
  level1: string   // Short
  level2: string   // Medium
  level3: string   // Long
}

type OllamaChatResponse = {
  message?: { content?: string }
  response?: string
}

// Ollama

const OLLAMA_HOST = process.env.OLLAMA_HOST!

async function callOllama(prompt: string): Promise<string> {
  const res = await fetch(`${OLLAMA_HOST}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2',
      stream: false,
      messages: [
        {
          role: 'system',
          content:
            'You are a financial analyst specializing in summarizing SEC filings ' +
            '(Forms 10-K and 10-Q). Structure your output concisely and clearly.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  })

  if (!res.ok) {
    throw new Error(`Ollama API error: ${await res.text()}`)
  }

  const data: OllamaChatResponse = await res.json()
  return (data.message?.content ?? data.response ?? '').trim()
}

// Summary prompts

async function generateLevel1Summary(text: string): Promise<string> {
  return callOllama(
    `Summarize this SEC filing in two sentences minimum and four sentences maximum. Focus on the overall company performance and key financial outcomes.\n\nTEXT:\n${text.slice(0, 6000)}`
  )
}

async function generateLevel2Summary(text: string): Promise<string> {
  return callOllama(
    `Summarize this SEC filing in six sentences minimum and eight sentences maximum. Focus on revenue, earnings, key risks, and future oulook.\n\nTEXT:\n${text.slice(0, 9000)}`
  )
}

async function generateLevel3Summary(text: string): Promise<string> {
  return callOllama(
    `Summarize this SEC filing in ten sentences minimum and twelve sentences maximum. Focus on revenue, net income, margins, cash flow, debt, segment performance, risks, acquisitions, guidance, and management commentary.\n\nTEXT:\n${text.slice(0, 12000)}`
  )
}

// Public API

export async function generateSummary(rawText: string): Promise<SECFilingSummary> {
  if (!rawText?.trim()) {
    return {
      original: '',
      level1: 'No content provided.',
      level2: 'No content provided.',
      level3: 'No content provided.',
    }
  }

  const [level1, level2, level3] = await Promise.all([
    generateLevel1Summary(rawText),
    generateLevel2Summary(rawText),
    generateLevel3Summary(rawText),
  ])

  return { original: rawText, level1, level2, level3 }
}
