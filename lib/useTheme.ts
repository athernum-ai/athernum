'use client'

import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'
const STORAGE_KEY = 'athernum-theme'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')

  const apply = (next: Theme) => {
    setTheme(next)
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', next === 'dark')
      document.documentElement.classList.toggle('light', next === 'light')
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, next)
    }
  }

  const toggleTheme = () => apply(theme === 'dark' ? 'light' : 'dark')

  useEffect(() => {
    const stored = (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY)) as Theme | null
    const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    const initial = stored ?? (prefersDark ? 'dark' : 'light')
    apply(initial)
  }, [])

  return { theme, setTheme: apply, toggleTheme }
}
