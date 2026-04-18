'use client'

import { useEffect, useState } from 'react'
import { useAuthModal } from '@/lib/useAuthModal'
import type { User } from '@supabase/supabase-js'

interface AuthModalProps {
  user: User | null
  loading: boolean
  onSignIn: (email: string, password: string) => Promise<{ ok: boolean; error: string | null }>
  onSignUp: (email: string, password: string) => Promise<{ ok: boolean; error: string | null }>
  onSignOut: () => Promise<{ ok: boolean; error: string | null }>
}

export default function AuthModal({ user, loading, onSignIn, onSignUp, onSignOut }: AuthModalProps) {
  const { isOpen, context, closeAuthModal } = useAuthModal()
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeAuthModal() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, closeAuthModal])

  // Auto-close when user signs in
  useEffect(() => {
    if (user && isOpen) closeAuthModal()
  }, [user, isOpen, closeAuthModal])

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setMessage(null)
    setError(null)
  }

  const handleModeSwitch = (m: 'sign-in' | 'sign-up') => {
    setMode(m)
    resetForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)
    setError(null)

    const run = mode === 'sign-in' ? onSignIn : onSignUp
    const result = await run(email.trim(), password)

    if (!result.ok) {
      setError(result.error ?? 'Request failed')
    } else {
      setMessage(mode === 'sign-in' ? 'Signed in.' : 'Account created. Check your email to confirm.')
      setPassword('')
    }
    setSubmitting(false)
  }

  if (!isOpen) return null

  const features = [
    'Curated feed for your watched tickers',
    '3-level AI summaries — brief to detailed',
    'Earnings & event tracker for your portfolio',
    'SEC filing browser with plain-language digest',
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-content-center"
      style={{ alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => { if (e.target === e.currentTarget) closeAuthModal() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Modal */}
      <div
        className="relative z-10 flex overflow-hidden"
        style={{
          width: 780,
          maxWidth: '95vw',
          maxHeight: '92vh',
          borderRadius: 16,
          border: '1px solid var(--border2)',
          background: 'var(--bg2)',
        }}
      >
        {/* LEFT PANEL — branding */}
        <div
          className="flex flex-col justify-between p-8 flex-shrink-0"
          style={{
            width: 340,
            background: 'var(--bg3)',
            borderRight: '1px solid var(--border)',
          }}
        >
          {/* Logo */}
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              <span
                className="font-serif-custom italic text-[var(--text)]"
                style={{ fontSize: 18 }}
              >
                Athernum
              </span>
            </div>

            {/* Headline */}
            <h2
              className="font-serif-custom italic text-[var(--text)] leading-tight mb-2"
              style={{ fontSize: 26 }}
            >
              Financial clarity,<br />without the noise.
            </h2>
            <p
              className="font-mono-custom text-[var(--text3)] mb-8"
              style={{ fontSize: 12, letterSpacing: '0.5px' }}
            >
              Sign in to access your feed
            </p>

            {/* Feature list */}
            <ul className="flex flex-col gap-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <div
                    className="flex-shrink-0 rounded-full bg-[var(--accent)]"
                    style={{ width: 6, height: 6, marginTop: 5 }}
                  />
                  <span
                    className="text-[var(--text2)] leading-snug"
                    style={{ fontSize: 13 }}
                  >
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Context message at bottom of left panel */}
          {context && (
            <div
              className="mt-8 rounded-lg"
              style={{
                background: '#3b82f610',
                border: '1px solid #3b82f630',
                padding: '10px 14px',
              }}
            >
              <p
                className="text-[var(--accent)] font-mono-custom leading-relaxed"
                style={{ fontSize: 11 }}
              >
                {context}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT PANEL — form */}
        <div className="flex flex-col flex-1 p-8 overflow-y-auto">
          {/* Close */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-5 text-[var(--text3)] hover:text-[var(--text)] transition-colors text-lg leading-none"
            aria-label="Close"
          >
            ✕
          </button>

          <h3
            className="font-serif-custom italic text-[var(--text)] mb-1"
            style={{ fontSize: 22 }}
          >
            {mode === 'sign-in' ? 'Welcome back.' : 'Create your account.'}
          </h3>
          <p
            className="font-mono-custom text-[var(--text3)] mb-6"
            style={{ fontSize: 11, letterSpacing: '0.5px' }}
          >
            {mode === 'sign-in' ? 'Sign in to your Athernum account' : 'Free forever — no credit card needed'}
          </p>

          {/* Mode tabs */}
          <div className="flex gap-2 mb-6">
            {(['sign-in', 'sign-up'] as const).map((m) => (
              <button
                key={m}
                onClick={() => handleModeSwitch(m)}
                className={[
                  'flex-1 py-2 rounded-md border text-[12px] font-mono-custom transition-all',
                  mode === m
                    ? 'bg-[#3b82f615] border-[var(--accent)] text-[var(--accent)]'
                    : 'border-[var(--border)] text-[var(--text2)] hover:bg-[var(--bg3)] hover:text-[var(--text)]',
                ].join(' ')}
              >
                {m === 'sign-in' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono-custom text-[var(--text3)] uppercase tracking-[1px]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-[13px] text-[var(--text)] placeholder-[var(--text3)] outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono-custom text-[var(--text3)] uppercase tracking-[1px]">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-[13px] text-[var(--text)] placeholder-[var(--text3)] outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || loading}
              className="mt-1 w-full py-2.5 rounded-lg text-[13px] font-mono-custom font-medium text-white transition-opacity disabled:opacity-50"
              style={{ background: 'var(--accent)' }}
            >
              {submitting ? 'Working...' : mode === 'sign-in' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-[11px] font-mono-custom text-[var(--text3)]">or</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          {/* OAuth placeholder */}
          <button
            type="button"
            className="w-full py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg3)] text-[13px] font-mono-custom text-[var(--text2)] hover:bg-[var(--bg4)] hover:text-[var(--text)] hover:border-[var(--border2)] transition-all flex items-center justify-center gap-2.5"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Switch mode */}
          <p className="text-center text-[12px] font-mono-custom text-[var(--text3)] mt-5">
            {mode === 'sign-in' ? "No account? " : "Have an account? "}
            <button
              type="button"
              onClick={() => handleModeSwitch(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
              className="text-[var(--accent)] underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              {mode === 'sign-in' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>

          {/* Feedback messages */}
          {message && (
            <p
              className="mt-4 text-[12px] font-mono-custom rounded-lg px-3 py-2.5"
              style={{ background: '#10b98112', border: '1px solid #10b98130', color: 'var(--accentg)' }}
            >
              {message}
            </p>
          )}
          {error && (
            <p
              className="mt-4 text-[12px] font-mono-custom rounded-lg px-3 py-2.5"
              style={{ background: '#ef444412', border: '1px solid #ef444430', color: 'var(--accentr)' }}
            >
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}