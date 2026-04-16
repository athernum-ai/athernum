import type { Session, User } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabaseClient'

function getConfiguredClient() {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase env vars not configured')
  }
  return supabase
}

export async function signUp(email: string, password: string) {
  const supabase = getConfiguredClient()
  return supabase.auth.signUp({
    email,
    password,
  })
}

export async function signIn(email: string, password: string) {
  const supabase = getConfiguredClient()
  return supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export async function signOut() {
  const supabase = getConfiguredClient()
  return supabase.auth.signOut()
}

export async function getCurrentSession(): Promise<Session | null> {
  const supabase = getConfiguredClient()
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = getConfiguredClient()
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data.user
}
