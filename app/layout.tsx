import type { Metadata } from 'next'
import './globals.css'
import { AuthModalProvider } from '@/lib/useAuthModal'

export const metadata: Metadata = {
  title: 'Athernum · Financial Intelligence',
  description: 'AI-powered financial news and analysis',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <AuthModalProvider>{children}</AuthModalProvider>
      </body>
    </html>
  )
}