import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Instrument Serif', 'serif'],
        mono: ['DM Mono', 'monospace'],
        sans: ['Geist', 'sans-serif'],
      },
      colors: {
        bg: {
          DEFAULT: '#0a0c0f',
          2: '#111418',
          3: '#181c22',
          4: '#1e242c',
        },
        border: {
          DEFAULT: '#2a3040',
          2: '#3a4560',
        },
        txt: {
          DEFAULT: '#e8edf4',
          2: '#8a9ab5',
          3: '#4a5a70',
        },
        accent: {
          DEFAULT: '#3b82f6',
          2: '#1d4ed8',
          g: '#10b981',
          r: '#ef4444',
          y: '#f59e0b',
        },
      },
    },
  },
  plugins: [],
}
export default config