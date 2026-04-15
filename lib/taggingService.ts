/**
 * Tag Assignment Service
 * 
 * Automatically assigns categorization tags to filings.
 * Currently uses mock/random assignment (ready for ML integration).
 */

export const TAG_CATEGORIES = {
  TECH: 'Tech',
  FINANCE: 'Finance',
  GROWTH: 'Growth',
  RISK: 'Risk',
} as const

export type TagCategory = (typeof TAG_CATEGORIES)[keyof typeof TAG_CATEGORIES]

const AVAILABLE_TAGS: TagCategory[] = Object.values(TAG_CATEGORIES)

/**
 * Randomly assign 1-2 tags to a filing
 * 
 * Placeholder implementation. Replace with ML model when ready.
 */
function assignRandomTags(seed?: string): TagCategory[] {
  // Use seed for deterministic random (optional)
  const random = seed ? seededRandom(seed) : Math.random

  // Randomly pick 1 or 2 tags
  const tagCount = Math.random() > 0.5 ? 1 : 2
  const selectedTags: TagCategory[] = []

  while (selectedTags.length < tagCount) {
    const randomIndex = Math.floor(random() * AVAILABLE_TAGS.length)
    const tag = AVAILABLE_TAGS[randomIndex]

    // Avoid duplicates
    if (!selectedTags.includes(tag)) {
      selectedTags.push(tag)
    }
  }

  return selectedTags.sort()
}

/**
 * Analyze filing content and assign tags based on keywords
 * 
 * Heuristic-based assignment. Ready for replacement with real ML model.
 */
function assignTagsBasedOnContent(
  text: string,
  level1Summary: string,
  level2Summary: string
): TagCategory[] {
  const combinedText = `${text} ${level1Summary} ${level2Summary}`.toLowerCase()
  const assignedTags: Set<TagCategory> = new Set()

  // Tech indicators
  const techKeywords = [
    'software',
    'cloud',
    'technology',
    'digital',
    'ai',
    'machine learning',
    'semiconductor',
    'cybersecurity',
    'data center',
  ]
  if (techKeywords.some((keyword) => combinedText.includes(keyword))) {
    assignedTags.add(TAG_CATEGORIES.TECH)
  }

  // Finance indicators
  const financeKeywords = [
    'revenue',
    'earnings',
    'net income',
    'ebitda',
    'cash flow',
    'debt',
    'interest',
    'dividend',
  ]
  if (financeKeywords.some((keyword) => combinedText.includes(keyword))) {
    assignedTags.add(TAG_CATEGORIES.FINANCE)
  }

  // Growth indicators
  const growthKeywords = [
    'growth',
    'increase',
    'expansion',
    'acquisition',
    'revenue growth',
    'margin expansion',
    'market share',
    'upside',
  ]
  if (growthKeywords.some((keyword) => combinedText.includes(keyword))) {
    assignedTags.add(TAG_CATEGORIES.GROWTH)
  }

  // Risk indicators
  const riskKeywords = [
    'risk',
    'uncertainty',
    'decline',
    'loss',
    'competition',
    'regulatory',
    'litigation',
    'downturn',
    'challenge',
  ]
  if (riskKeywords.some((keyword) => combinedText.includes(keyword))) {
    assignedTags.add(TAG_CATEGORIES.RISK)
  }

  // If no tags assigned, pick random
  if (assignedTags.size === 0) {
    return assignRandomTags()
  }

  return Array.from(assignedTags) as TagCategory[]
}

/**
 * Simple seeded random number generator for deterministic randomness
 */
function seededRandom(seed: string): () => number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  return function () {
    hash = (hash * 9301 + 49297) % 233280
    return hash / 233280
  }
}

/**
 * Main function to assign tags to a filing
 * 
 * Strategy:
 * 1. Try to analyze content if provided
 * 2. Fall back to random assignment for testing
 */
function autoAssignTags(options: {
  rawText?: string
  level1?: string
  level2?: string
  useRandom?: boolean // Force random assignment for testing
}): TagCategory[] {
  // Use random assignment if requested or no content provided
  if (options.useRandom || (!options.rawText && !options.level1 && !options.level2)) {
    return assignRandomTags()
  }

  // Try content-based tagging
  const text = options.rawText || ''
  const level1 = options.level1 || ''
  const level2 = options.level2 || ''

  return assignTagsBasedOnContent(text, level1, level2)
}

export {
  autoAssignTags,
  assignRandomTags,
  assignTagsBasedOnContent,
  AVAILABLE_TAGS,
}
