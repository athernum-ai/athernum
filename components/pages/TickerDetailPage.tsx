'use client'

import { useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  YAxis,
  Tooltip,
} from 'recharts'
import { Pill, ArticleCard } from '@/components/ui'
import { SUMMARIES, genChartData, BASE_PRICES, RANGE_CONFIG } from '@/lib/data'
import type { TickerMap } from '@/types'

const RANGES = ['1D', '1W', '1M', '3M', '1Y'] as const
type Range = (typeof RANGES)[number]

const RELATED_ARTICLES = [
  {
    source: 'Reuters', time: '2h ago',
    tags: [{ label: 'Reuters', variant: 'default' as const }],
    title: 'Apple beats Q2 estimates with $94.8B revenue',
    summary: 'iPhone sales resilient despite macro headwinds; services hits record...',
  },
  {
    source: "Barron's", time: '3h ago',
    tags: [{ label: "Barron's", variant: 'default' as const }],
    title: "Why Apple's services margin expansion is the real story this quarter",
    summary: 'App Store take rates and advertising revenue drove gross margin to 46.6%...',
  },
]

interface TickerDetailPageProps {
  ticker: string
  onBack: () => void
  tickers: TickerMap
}

const badgeColors = {
  brief:    'bg-[#10b98115] text-[var(--accentg)]',
  standard: 'bg-[#3b82f615] text-[var(--accent)]',
  detailed: 'bg-[#8b5cf615] text-[#8b5cf6]',
}

export default function TickerDetailPage({ ticker, onBack, tickers }: TickerDetailPageProps) {
  const [range, setRange] = useState<Range>('1W')
  const [level, setLevel] = useState(0)

  const t = tickers[ticker] ?? tickers['AAPL']
  const cfg = RANGE_CONFIG[range]
  const base = BASE_PRICES[ticker] ?? 180

  const chartData = useMemo(() => {
    const values = genChartData(cfg.n, base - cfg.n * cfg.trend, cfg.vol, cfg.trend)
    return values.map((v, i) => ({ i, value: v }))
  }, [range, ticker])

  const isUp = t.dir === 'up'
  const chartColor = isUp ? '#10b981' : '#ef4444'
  const summary = SUMMARIES[level]

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px] text-[var(--text3)] font-mono-custom mb-4">
        <button onClick={onBack} className="hover:text-[var(--accent)] transition-colors">
          Feed
        </button>
        <span className="text-[var(--border2)]">›</span>
        <span className="text-[var(--text2)]">{ticker}</span>
      </div>

      {/* Chart Card */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[10px] p-4 mb-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="font-serif-custom italic text-[24px] text-[var(--text)]">
              {t.name} — {ticker}
            </div>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="font-mono-custom text-[22px] font-medium text-[var(--text)]">
                {t.price}
              </span>
              <Pill dir={t.dir} text={`${t.chg} today`} />
            </div>
          </div>
          <div className="flex gap-1">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={[
                  'px-2 py-0.5 rounded text-[11px] font-mono-custom border transition-all',
                  range === r
                    ? 'bg-[var(--bg4)] text-[var(--text)] border-[var(--border2)]'
                    : 'border-[var(--border)] text-[var(--text3)] hover:bg-[var(--bg4)] hover:text-[var(--text)] hover:border-[var(--border2)]',
                ].join(' ')}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fill: '#8a9ab5', fontFamily: 'DM Mono', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${Math.round(v)}`}
                width={48}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  color: 'var(--text)',
                  fontFamily: 'DM Mono',
                  fontSize: 12,
                }}
                formatter={(v: number) => [`$${v.toFixed(2)}`, '']}
                labelFormatter={() => ''}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={1.5}
                fill="url(#colorVal)"
                dot={false}
                animationDuration={400}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2.5 mb-5">
        {[
          { label: 'Open',     value: t.open },
          { label: '52W High', value: t.high },
          { label: '52W Low',  value: t.low  },
          { label: 'Mkt Cap',  value: t.cap  },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[var(--bg2)] border border-[var(--border)] rounded-lg px-3.5 py-3">
            <div className="text-[10px] text-[var(--text3)] font-mono-custom uppercase tracking-[1px] mb-1">
              {label}
            </div>
            <div className="text-[20px] font-medium font-mono-custom text-[var(--text)]">{value}</div>
          </div>
        ))}
      </div>

      {/* AI Summary */}
      <div className="flex items-baseline gap-3 mb-3">
        <h2 className="font-serif-custom italic text-[20px] text-[var(--text)]">AI Summary</h2>
      </div>

      {/* Level Tabs */}
      <div className="flex gap-1.5 mb-4">
        {SUMMARIES.map((s, i) => (
          <button
            key={s.badge}
            onClick={() => setLevel(i)}
            className={[
              'px-3.5 py-1.5 rounded-md border text-[12px] font-mono-custom transition-all capitalize',
              level === i
                ? 'bg-[#3b82f615] border-[var(--accent)] text-[var(--accent)]'
                : 'bg-[var(--bg3)] border-[var(--border)] text-[var(--text2)] hover:border-[var(--border2)] hover:text-[var(--text)]',
            ].join(' ')}
          >
            {s.badge}
          </button>
        ))}
      </div>

      {/* Summary Box */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[10px] p-5 text-[13px] text-[var(--text2)] leading-relaxed mb-5">
        <span
          className={`inline-block text-[10px] font-mono-custom px-2 py-0.5 rounded mb-3 ${badgeColors[summary.badge]}`}
        >
          {summary.label}
        </span>
        <br />
        <span dangerouslySetInnerHTML={{ __html: summary.html }} />
      </div>

      {/* Related Articles */}
      <div className="flex items-baseline gap-3 mb-3">
        <h2 className="font-serif-custom italic text-[20px] text-[var(--text)]">Related Articles</h2>
      </div>
      {RELATED_ARTICLES.map((a, i) => (
        <ArticleCard key={i} article={a} />
      ))}
    </div>
  )
}
