import { createClient, SupabaseClient } from '@supabase/supabase-js'

let serverClient: SupabaseClient | null = null

export function getSupabaseServerClient() {
  if (serverClient) return serverClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) return null

  serverClient = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  return serverClient
}
