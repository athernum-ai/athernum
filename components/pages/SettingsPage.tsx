'use client'

import { useState } from 'react'
import type { Theme } from '@/lib/useTheme'

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button
      onClick={() => setOn((p) => !p)}
      className={[
        'relative w-10 h-[22px] rounded-full flex-shrink-0 transition-colors duration-200 border-none outline-none cursor-pointer',
        on ? 'bg-[var(--accent)]' : 'bg-[var(--border2)]',
      ].join(' ')}
      aria-checked={on}
      role="switch"
    >
      <span
        className={[
          'absolute top-[3px] left-[3px] w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
          on ? 'translate-x-[18px]' : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  )
}

function SettingsRow({
  label,
  desc,
  control,
}: {
  label: string
  desc: string
  control: React.ReactNode
}) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-[var(--border)] last:border-b-0 last:pb-0">
      <div>
        <div className="text-[13px] text-[var(--text)] font-medium">{label}</div>
        <div className="text-[11px] text-[var(--text3)] mt-0.5">{desc}</div>
      </div>
      {control}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[10px] p-5 mb-4">
      <div className="text-[11px] text-[var(--text3)] font-mono-custom tracking-[1px] uppercase mb-3">
        {title}
      </div>
      {children}
    </div>
  )
}

const SelectBox = ({ options }: { options: string[] }) => (
  <select className="bg-[var(--bg3)] border border-[var(--border)] rounded-md px-2.5 py-1.5 text-[12px] text-[var(--text2)] font-mono-custom outline-none cursor-pointer">
    {options.map((o) => <option key={o}>{o}</option>)}
  </select>
)

interface SettingsPageProps {
  theme: Theme
  onToggleTheme: () => void
}

export default function SettingsPage({ theme, onToggleTheme }: SettingsPageProps) {
  return (
    <div className="p-6">
      <div className="flex items-baseline gap-3 mb-5">
        <h1 className="font-serif-custom italic text-[20px] text-[var(--text)]">Settings</h1>
      </div>

      <Section title="Display">
        <SettingsRow
          label="Dark Mode"
          desc="Use dark theme across the app"
          control={
            <button
              onClick={onToggleTheme}
              className={[
                'px-3 py-1.5 rounded-md text-[12px] font-mono-custom border transition-colors',
                theme === 'dark'
                  ? 'bg-[var(--accent)]/10 border-[var(--accent)]/30 text-[var(--accent)]'
                  : 'bg-[var(--bg3)] border-[var(--border)] text-[var(--text2)]',
              ].join(' ')}
            >
              {theme === 'dark' ? 'Dark' : 'Light'}
            </button>
          }
        />
        <SettingsRow label="Compact Feed"       desc="Show more articles with less spacing"       control={<Toggle />} />
        <SettingsRow label="Show Premarket Data" desc="Display premarket price changes in watchlist" control={<Toggle defaultOn />} />
      </Section>

      <Section title="AI Summaries">
        <SettingsRow
          label="Default Summary Level"
          desc="Brief · Standard · Detailed"
          control={<SelectBox options={['Brief', 'Standard', 'Detailed']} />}
        />
      </Section>

      <Section title="Notifications">
        <SettingsRow label="Earnings Alerts"    desc="Notify 1 hour before earnings for watched tickers" control={<Toggle defaultOn />} />
        <SettingsRow label="Price Move Alerts"  desc="Alert on moves >5% for watched tickers"            control={<Toggle />} />
      </Section>
    </div>
  )
}
