import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Athernum · Financial Intelligence',
  description: 'AI-powered financial news and analysis',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  )
}