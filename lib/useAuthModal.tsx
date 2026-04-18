'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface AuthModalContextValue {
  isOpen: boolean
  context: string
  openAuthModal: (context?: string) => void
  closeAuthModal: () => void
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null)

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [context, setContext] = useState('')

  const openAuthModal = useCallback((ctx = 'Sign in to access this feature.') => {
    setContext(ctx)
    setIsOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => setIsOpen(false), [])

  return (
    <AuthModalContext.Provider value={{ isOpen, context, openAuthModal, closeAuthModal }}>
      {children}
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext)
  if (!ctx) throw new Error('useAuthModal must be used inside AuthModalProvider')
  return ctx
}