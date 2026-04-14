export type PageId = 'feed' | 'ticker' | 'search' | 'events' | 'settings'

export interface TickerData {
  name: string
  price: string
  chg: string
  dir: 'up' | 'dn'
  open: string
  high: string
  low: string
  cap: string
}

export interface TickerMap {
  [key: string]: TickerData
}

export interface SummaryLevel {
  badge: 'brief' | 'standard' | 'detailed'
  label: string
  html: string
}

export interface CalendarEvent {
  date: string
  name: string
  desc: string
  urgency: 'today' | 'soon' | 'normal'
}

export interface Article {
  id?: number | string
  source: string
  time: string
  tags: { label: string; variant: 'default' | 'blue' | 'green' | 'red' }[]
  title: string
  summary: string
  ticker?: string
}
