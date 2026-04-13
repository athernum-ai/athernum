'use client'

import { EVENTS } from '@/lib/data'

export default function EventsPage() {
  return (
    <div className="p-6">
      <div className="flex items-baseline gap-3 mb-4">
        <h1 className="font-serif-custom italic text-[20px] text-[var(--text)]">Event Tracker</h1>
        <span className="text-[11px] text-[var(--text3)] font-mono-custom">Upcoming catalysts</span>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5">
        <select className="bg-[var(--bg3)] border border-[var(--border)] rounded-md px-2.5 py-1.5 text-[12px] text-[var(--text2)] font-mono-custom outline-none cursor-pointer">
          <option>All Tickers</option>
          <option>AAPL</option>
          <option>NVDA</option>
          <option>TSLA</option>
          <option>META</option>
        </select>
        <select className="bg-[var(--bg3)] border border-[var(--border)] rounded-md px-2.5 py-1.5 text-[12px] text-[var(--text2)] font-mono-custom outline-none cursor-pointer">
          <option>All Types</option>
          <option>Earnings</option>
          <option>Ex-Dividend</option>
          <option>Fed Meeting</option>
          <option>FDA</option>
        </select>
      </div>

      {/* Event List */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[10px] px-4 mb-4">
        {EVENTS.map((ev, i) => (
          <div
            key={i}
            className={`flex gap-4 py-3 ${i < EVENTS.length - 1 ? 'border-b border-[var(--border)]' : ''}`}
          >
            {/* Date */}
            <div className="font-mono-custom text-[11px] text-[var(--text3)] w-20 flex-shrink-0 pt-0.5">
              {ev.date}
            </div>

            {/* Dot */}
            <div className="flex-shrink-0 mt-1">
              <div
                className={[
                  'w-2 h-2 rounded-full',
                  ev.urgency === 'today'
                    ? 'bg-[var(--accentg)]'
                    : ev.urgency === 'soon'
                    ? 'bg-[var(--accenty)]'
                    : 'bg-[var(--border2)]',
                ].join(' ')}
              />
            </div>

            {/* Content */}
            <div>
              <div className="text-[13px] text-[var(--text)] font-medium mb-0.5 flex items-center gap-2">
                {ev.name}
                {ev.urgency === 'today' && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono-custom px-1.5 py-0.5 rounded bg-[#10b98115] text-[var(--accentg)]">
                    ▲ TODAY
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[var(--text2)]">{ev.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}