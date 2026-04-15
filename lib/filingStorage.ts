/**
 * SEC Filing Storage Service
 * 
 * Handles saving and retrieving SEC filing summaries from Supabase
 */

import { supabase } from '@/lib/supabaseClient'
import type { SECFilingSummary, SupabaseFilingRecord, SaveFilingResponse } from '@/types'

const TABLE_NAME = 'filings'

/**
 * Save a filing summary to Supabase
 * 
 * If a filing with the same ticker and date exists, it will be updated.
 * Otherwise, a new record is created.
 */
async function saveFiling(
  ticker: string,
  reportType: '10-K' | '10-Q' | '8-K',
  reportDate: string,
  summary: SECFilingSummary,
  tags?: string[]
): Promise<SaveFilingResponse> {
  try {
    if (!ticker || !reportType || !reportDate) {
      return {
        success: false,
        error: 'Missing required fields: ticker, reportType, reportDate',
      }
    }

    // Check if Supabase is configured
    if (!supabase) {
      console.warn('⚠️  Supabase not configured. Skipping database save.')
      // Return mock success for testing without Supabase
      return {
        success: true,
        data: {
          ticker: ticker.toUpperCase(),
          report_type: reportType,
          date: reportDate,
          level0: summary.original,
          level1: summary.level1,
          level2: summary.level2,
          level3: summary.level3,
          tags: tags || [],
          last_updated: new Date().toISOString(),
        },
      }
    }

    const now = new Date().toISOString()

    const filingRecord: SupabaseFilingRecord = {
      ticker: ticker.toUpperCase(),
      report_type: reportType,
      date: reportDate,
      level0: summary.original,
      level1: summary.level1,
      level2: summary.level2,
      level3: summary.level3,
      tags: tags || [],
      last_updated: now,
    }

    // Check if filing already exists
    const { data: existing, error: fetchError } = await supabase
      .from(TABLE_NAME)
      .select('id')
      .eq('ticker', ticker.toUpperCase())
      .eq('report_type', reportType)
      .eq('date', reportDate)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is expected for new records
      return {
        success: false,
        error: `Failed to check existing filing: ${fetchError.message}`,
      }
    }

    let result

    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(filingRecord)
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        return {
          success: false,
          error: `Failed to update filing: ${error.message}`,
        }
      }
      result = data
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([filingRecord])
        .select()
        .single()

      if (error) {
        return {
          success: false,
          error: `Failed to save filing: ${error.message}`,
        }
      }
      result = data
    }

    return {
      success: true,
      data: result as SupabaseFilingRecord,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return {
      success: false,
      error: `Error saving filing: ${errorMessage}`,
    }
  }
}

/**
 * Batch save multiple filings
 */
async function saveFilingsBatch(
  filings: Array<{
    ticker: string
    reportType: '10-K' | '10-Q' | '8-K'
    reportDate: string
    summary: SECFilingSummary
    tags?: string[]
  }>
): Promise<SaveFilingResponse[]> {
  return Promise.all(
    filings.map((filing) =>
      saveFiling(
        filing.ticker,
        filing.reportType,
        filing.reportDate,
        filing.summary,
        filing.tags
      )
    )
  )
}

/**
 * Retrieve a filing from Supabase
 */
async function getFiling(
  ticker: string,
  reportType?: string,
  reportDate?: string
): Promise<SaveFilingResponse> {
  try {
    let query = supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('ticker', ticker.toUpperCase())

    if (reportType) {
      query = query.eq('report_type', reportType)
    }

    if (reportDate) {
      query = query.eq('date', reportDate)
    }

    const { data, error } = await query.order('date', { ascending: false }).limit(1)

    if (error) {
      return {
        success: false,
        error: `Failed to retrieve filing: ${error.message}`,
      }
    }

    if (!data || data.length === 0) {
      return {
        success: false,
        error: `No filing found for ${ticker}${reportType ? ` (${reportType})` : ''}`,
      }
    }

    return {
      success: true,
      data: data[0] as SupabaseFilingRecord,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return {
      success: false,
      error: `Error retrieving filing: ${errorMessage}`,
    }
  }
}

/**
 * Get all filings for a ticker
 */
async function getFilingsByTicker(ticker: string): Promise<SaveFilingResponse> {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('ticker', ticker.toUpperCase())
      .order('date', { ascending: false })

    if (error) {
      return {
        success: false,
        error: `Failed to retrieve filings: ${error.message}`,
      }
    }

    if (!data || data.length === 0) {
      return {
        success: false,
        error: `No filings found for ${ticker}`,
      }
    }

    return {
      success: true,
      data: data as unknown as SupabaseFilingRecord,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return {
      success: false,
      error: `Error retrieving filings: ${errorMessage}`,
    }
  }
}

/**
 * Delete a filing
 */
async function deleteFiling(id: string): Promise<SaveFilingResponse> {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: `Failed to delete filing: ${error.message}`,
      }
    }

    return {
      success: true,
      data: data as SupabaseFilingRecord,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return {
      success: false,
      error: `Error deleting filing: ${errorMessage}`,
    }
  }
}

/**
 * Search filings by tag
 */
async function searchFilingsByTag(tag: string): Promise<SaveFilingResponse> {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .contains('tags', [tag])
      .order('date', { ascending: false })

    if (error) {
      return {
        success: false,
        error: `Failed to search filings: ${error.message}`,
      }
    }

    if (!data || data.length === 0) {
      return {
        success: false,
        error: `No filings found with tag: ${tag}`,
      }
    }

    return {
      success: true,
      data: data as unknown as SupabaseFilingRecord,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return {
      success: false,
      error: `Error searching filings: ${errorMessage}`,
    }
  }
}

export {
  saveFiling,
  saveFilingsBatch,
  getFiling,
  getFilingsByTicker,
  deleteFiling,
  searchFilingsByTag,
}
