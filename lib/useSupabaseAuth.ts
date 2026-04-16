'use client'

import { useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabaseClient'
import {
  getCurrentSession,
  signIn,
  signOut,
  signUp,
} from '@/lib/supabaseAuth'

interface AuthResult {
  ok: boolean
  error: string | null
}

export function useSupabaseAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseClient()
    if (!supabase) {
      setLoading(false)
      return
    }

    getCurrentSession()
      .then((currentSession) => {
        setSession(currentSession)
        setUser(currentSession?.user ?? null)
      })
      .catch((err) => {
        console.error('Failed to load auth session', err)
      })
      .finally(() => {
        setLoading(false)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const { error } = await signIn(email, password)
      return { ok: !error, error: error?.message ?? null }
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : 'Failed to sign in',
      }
    }
  }

  const handleSignUp = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const { data, error } = await signUp(email, password)
      if (error) return { ok: false, error: error.message }

      if (!data.session) {
        return {
          ok: true,
          error: 'Account created. Check your email to confirm your address if email confirmation is enabled.',
        }
      }

      return { ok: true, error: null }
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : 'Failed to sign up',
      }
    }
  }

  const handleSignOut = async (): Promise<AuthResult> => {
    try {
      const { error } = await signOut()
      return { ok: !error, error: error?.message ?? null }
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : 'Failed to sign out',
      }
    }
  }

  return {
    session,
    user,
    loading,
    isAuthenticated: !!user,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
  }
}
