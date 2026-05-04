'use client'

import type { Article } from '@/types'

// ── Tag ──────────────────────────────────────────────────────────────────────
type TagVariant = 'default' | 'blue' | 'green' | 'red'
const TAG_STYLES: Record<TagVariant, string> = {
  default: 'bg-[var(--bg3)] border-[var(--border)] text-[var(--text3)]',
  blue:    'bg-[#3b82f610] border-[#3b82f630] text-[var(--accent)]',
  green:   'bg-[#10b98110] border-[#10b98130] text-[var(--accentg)]',
  red:     'bg-[#ef444410] border-[#ef444430] text-[var(--accentr)]',
}

export function Tag({ label, variant = 'default' }: { label: string; variant?: TagVariant }) {
  return (
    <span className={`text-[10px] px-[7px] py-0.5 rounded border font-mono-custom ${TAG_STYLES[variant]}`}>
      {label}
    </span>
  )
}

// ── Pill ─────────────────────────────────────────────────────────────────────
export function Pill({ dir, text }: { dir: 'up' | 'dn'; text: string }) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 text-[10px] font-mono-custom px-[7px] py-0.5 rounded font-medium',
        dir === 'up' ? 'bg-[#10b98115] text-[var(--accentg)]' : 'bg-[#ef444415] text-[var(--accentr)]',
      ].join(' ')}
    >
      {dir === 'up' ? '▲' : '▼'} {text}
    </span>
  )
}

// ── ArticleCard ───────────────────────────────────────────────────────────────
export function ArticleCard({
  article,
  onClick,
  compact = false,
}: {
  article: Article
  onClick?: () => void
  compact?: boolean
}) {
  return (
    <div
      onClick={onClick}
      className={[
        'flex gap-4 bg-[var(--bg2)] border border-[var(--border)] rounded-[10px] cursor-pointer hover:border-[var(--border2)] transition-colors',
        compact ? 'p-2.5 mb-1' : 'p-4 mb-2.5',
      ].join(' ')}
    >
      <div className="flex-1 min-w-0">
        <div className={`flex items-center gap-2 ${compact ? 'mb-0.5' : 'mb-1.5'}`}>
          <span className="text-[10px] text-[var(--text3)] font-mono-custom uppercase tracking-[1px]">
            {article.source}
          </span>
          <span className="text-[10px] text-[var(--text3)] font-mono-custom">{article.time}</span>
          {article.tags.map((tag, i) => (
            <Tag key={`${tag.label}-${i}`} label={tag.label} variant={tag.variant} />
          ))}
        </div>
        <div
          className={[
            'text-[var(--text)] font-medium leading-snug',
            compact ? 'text-[13px]' : 'text-[14px] mb-1.5',
          ].join(' ')}
        >
          {article.title}
        </div>
        {!compact && (
          <div className="text-[12px] text-[var(--text2)] leading-relaxed">
            {article.summary}
          </div>
        )}
      </div>
      {!compact && (
        <div className="w-20 h-[60px] bg-[var(--bg3)] rounded-md flex-shrink-0 flex items-center justify-center text-[var(--text3)] text-[10px] font-mono-custom">
          IMG
        </div>
      )}
    </div>
  )
}

// ── MiniSparkline ─────────────────────────────────────────────────────────────
export function MiniSparkline({ data, up }: { data: number[]; up: boolean }) {
  const W = 120
  const H = 32
  if (!data.length) return <div style={{ height: H }} />
  const mn = Math.min(...data)
  const mx = Math.max(...data)
  const range = mx - mn || 1
  const step = W / (data.length - 1)
  const pts = data
    .map((v, i) => `${i * step},${H - ((v - mn) / range) * (H - 4) - 2}`)
    .join(' ')
  const color = up ? '#10b981' : '#ef4444'
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

// ── WatchlistCard ─────────────────────────────────────────────────────────────
export function WatchlistCard({
  ticker,
  name,
  price,
  chg,
  dir,
  sparkData,
  onClick,
  compact = false,
  premarket,
  premktDir,
  showPremarket = false,
}: {
  ticker: string
  name: string
  price: string
  chg: string
  dir: 'up' | 'dn'
  sparkData: number[]
  onClick?: () => void
  compact?: boolean
  premarket?: string
  premktDir?: 'up' | 'dn'
  showPremarket?: boolean
}) {
  return (
    <div
      onClick={onClick}
      className={[
        'relative bg-[var(--bg2)] border border-[var(--border)] rounded-lg cursor-pointer hover:border-[var(--border2)] transition-colors',
        compact ? 'p-2' : 'p-3',
      ].join(' ')}
    >
      <span className="absolute top-2 right-2 text-[var(--accenty)] text-sm">★</span>

      <div className="font-mono-custom text-[14px] font-medium text-[var(--text)]">{ticker}</div>

      {!compact && (
        <div className="text-[10px] text-[var(--text3)] mt-0.5">{name}</div>
      )}

      {!compact && <MiniSparkline data={sparkData} up={dir === 'up'} />}

      <div
        className={[
          'font-mono-custom font-medium text-[var(--text)]',
          compact ? 'text-[13px] mt-1' : 'text-[16px] mt-2',
        ].join(' ')}
      >
        {price}
      </div>

      <div
        className={[
          'font-mono-custom mt-0.5',
          compact ? 'text-[10px]' : 'text-[11px]',
          dir === 'up' ? 'text-[var(--accentg)]' : 'text-[var(--accentr)]',
        ].join(' ')}
      >
        {chg} today
      </div>

      {/* Premarket badge */}
      {showPremarket && premarket && premktDir && (
        <div
          className={[
            'inline-flex items-center gap-1 font-mono-custom rounded px-1.5 py-0.5 mt-1',
            compact ? 'text-[9px]' : 'text-[10px]',
            premktDir === 'up'
              ? 'bg-[#10b98115] text-[var(--accentg)]'
              : 'bg-[#ef444415] text-[var(--accentr)]',
          ].join(' ')}
        >
          {premktDir === 'up' ? '▲' : '▼'} {premarket} pre
        </div>
      )}
    </div>
  )
}