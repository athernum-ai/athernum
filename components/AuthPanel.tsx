'use client'

import { useState } from 'react'
import type { User } from '@supabase/supabase-js'

interface AuthPanelProps {
  user: User | null
  loading: boolean
  onSignIn: (email: string, password: string) => Promise<{ ok: boolean; error: string | null }>
  onSignUp: (email: string, password: string) => Promise<{ ok: boolean; error: string | null }>
  onSignOut: () => Promise<{ ok: boolean; error: string | null }>
}

export default function AuthPanel({ user, loading, onSignIn, onSignUp, onSignOut }: AuthPanelProps) {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setMessage(null)
    setError(null)

    const run = mode === 'sign-in' ? onSignIn : onSignUp
    const result = await run(email.trim(), password)

    if (!result.ok) {
      setError(result.error ?? 'Request failed')
    } else if (result.error) {
      setMessage(result.error)
    } else {
      setMessage(mode === 'sign-in' ? 'Signed in.' : 'Account created.')
      setPassword('')
    }

    setSubmitting(false)
  }

  const handleSignOut = async () => {
    setSubmitting(true)
    setMessage(null)
    setError(null)
    const result = await onSignOut()
    if (!result.ok) {
      setError(result.error ?? 'Failed to sign out')
    } else {
      setMessage('Signed out.')
    }
    setSubmitting(false)
  }

  return (
    <div className="px-6 pt-5">
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[10px] p-4">
        <div className="flex items-baseline justify-between gap-3 mb-3">
          <div>
            <h2 className="font-serif-custom italic text-[18px] text-[var(--text)]">Account</h2>
            <p className="text-[11px] text-[var(--text3)] font-mono-custom mt-1">
              {user ? 'Signed in with Supabase Auth' : 'Sign in to keep a private watchlist'}
            </p>
          </div>
          {user && (
            <button
              onClick={handleSignOut}
              disabled={submitting}
              className="px-3 py-1.5 rounded-md border border-[var(--border)] text-[12px] font-mono-custom text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--bg3)] disabled:opacity-60"
            >
              Sign Out
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-[12px] text-[var(--text3)] font-mono-custom">Loading session...</p>
        ) : user ? (
          <div className="text-[13px] text-[var(--text2)]">
            <span className="font-mono-custom text-[var(--text)]">{user.email}</span>
            <span className="text-[var(--text3)]"> is active.</span>
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-3">
              {(['sign-in', 'sign-up'] as const).map((value) => (
                <button
                  key={value}
                  onClick={() => {
                    setMode(value)
                    setMessage(null)
                    setError(null)
                  }}
                  className={[
                    'px-3 py-1.5 rounded-md border text-[12px] font-mono-custom transition-colors',
                    mode === value
                      ? 'bg-[#3b82f615] border-[var(--accent)] text-[var(--accent)]'
                      : 'border-[var(--border)] text-[var(--text2)] hover:bg-[var(--bg3)]',
                  ].join(' ')}
                >
                  {value === 'sign-in' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="bg-[var(--bg3)] border border-[var(--border)] rounded-md px-3 py-2 text-[13px] text-[var(--text)] outline-none focus:border-[var(--accent)]"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="bg-[var(--bg3)] border border-[var(--border)] rounded-md px-3 py-2 text-[13px] text-[var(--text)] outline-none focus:border-[var(--accent)]"
                minLength={6}
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-3 py-2 rounded-md border border-[var(--accent)] bg-[#3b82f615] text-[12px] font-mono-custom text-[var(--accent)] disabled:opacity-60"
              >
                {submitting ? 'Working...' : mode === 'sign-in' ? 'Sign In' : 'Sign Up'}
              </button>
            </form>
          </>
        )}

        {message && <p className="mt-3 text-[12px] text-[var(--accentg)]">{message}</p>}
        {error && <p className="mt-3 text-[12px] text-[var(--accentr)]">{error}</p>}
      </div>
    </div>
  )
}
