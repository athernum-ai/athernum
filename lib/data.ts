import type { TickerMap, SummaryLevel, CalendarEvent, Article } from '@/types'

export const TICKERS: TickerMap = {
  AAPL:  { name: 'Apple Inc.',       price: '$188.42', chg: '+1.2%', dir: 'up', open: '$186.10', high: '$199.62', low: '$142.08', cap: '$2.9T' },
  NVDA:  { name: 'NVIDIA Corp.',     price: '$824.18', chg: '+2.8%', dir: 'up', open: '$801.50', high: '$974.00', low: '$415.03', cap: '$2.0T' },
  TSLA:  { name: 'Tesla Inc.',       price: '$242.05', chg: '-0.9%', dir: 'dn', open: '$244.20', high: '$299.29', low: '$138.80', cap: '$773B'  },
  META:  { name: 'Meta Platforms',   price: '$519.34', chg: '+0.5%', dir: 'up', open: '$516.20', high: '$589.78', low: '$296.46', cap: '$1.3T' },
  MSFT:  { name: 'Microsoft Corp.',  price: '$421.70', chg: '+0.3%', dir: 'up', open: '$419.00', high: '$468.35', low: '$309.45', cap: '$3.1T' },
  GOOGL: { name: 'Alphabet Inc.',    price: '$178.90', chg: '+0.8%', dir: 'up', open: '$177.20', high: '$207.05', low: '$130.67', cap: '$2.2T' },
  AMZN:  { name: 'Amazon.com Inc.',  price: '$198.45', chg: '+1.5%', dir: 'up', open: '$195.80', high: '$242.52', low: '$151.61', cap: '$2.1T' },
}

export const WATCHLIST = ['AAPL', 'NVDA', 'TSLA', 'META']

export const MARKET_BAR = [
  { name: 'S&P 500',   value: '5,812', dir: 'up'  as const },
  { name: 'NASDAQ',    value: '18,240', dir: 'up' as const },
  { name: '10Y YIELD', value: '4.38%', dir: 'dn'  as const },
  { name: 'VIX',       value: '18.4',  dir: null              },
]

export const BASE_PRICES: Record<string, number> = {
  AAPL: 180, NVDA: 800, TSLA: 240, META: 510, MSFT: 410, GOOGL: 170, AMZN: 190,
}

export const SUMMARIES: SummaryLevel[] = [
  {
    badge: 'brief',
    label: 'BRIEF · 30s read',
    html: '<strong>Apple beat Q2 estimates</strong> with $94.8B revenue and EPS of $1.53. Services revenue grew 14% YoY. iPhone demand held up despite macro uncertainty. Dividend raised 4%. Stock up ~1.2% on the session.',
  },
  {
    badge: 'standard',
    label: 'STANDARD · 2 min read',
    html: '<strong>Apple Inc. (AAPL)</strong> reported Q2 FY2025 results that exceeded Wall Street expectations across the board. Revenue of $94.8B (+6% YoY) beat the $93.2B consensus, driven by an 11% surge in Services revenue to $24.2B — a new record. iPhone revenue of $48.3B came in above estimates despite concerns over consumer softness. Gross margin expanded to 46.6% vs. 45.9% a year ago. EPS of $1.53 beat by $0.03. The board declared a $0.25/share dividend (raised 4%) and authorized a fresh $100B buyback program. Management guided Q3 revenue of $88–92B, roughly in line with consensus.',
  },
  {
    badge: 'detailed',
    label: 'DETAILED · 5 min read',
    html: '<strong>Revenue breakdown:</strong> Total $94.8B (+6.1% YoY). iPhone $48.3B (+2.1%), Mac $9.8B (+7.4%), iPad $6.1B (+15.3%), Wearables $7.9B (-3.1%), Services $24.2B (+11.3%). Geographic: Americas $42.1B (+5%), Europe $24.3B (+7%), China $16.4B (+2%), Rest of Asia $12.0B (+11%).<br/><br/><strong>Margins & cash flow:</strong> Gross margin 46.6% (+70bps YoY). Operating margin 30.8%. Net income $25.1B. FCF $25.7B. Cash + equivalents $162B vs. $104B long-term debt.<br/><br/><strong>Forward guidance:</strong> Q3 FY2025 revenue $88–92B; services revenue growth "low-to-mid double digits". No share-count guidance given tariff uncertainty.',
  },
]

export const EVENTS: CalendarEvent[] = [
  { date: 'Apr 15', name: 'AAPL — Q2 Earnings Call',         desc: 'After-market close · EPS est. $1.50 · Rev est. $93.2B',           urgency: 'today',  ticker: 'AAPL', type: 'Earnings'    },
  { date: 'Apr 17', name: 'TSLA — Q1 Earnings Call',         desc: 'After-market close · EPS est. $0.47 · Rev est. $24.1B',           urgency: 'soon',   ticker: 'TSLA', type: 'Earnings'    },
  { date: 'Apr 22', name: 'META — Q1 Earnings Call',         desc: 'After-market close · EPS est. $4.62 · Rev est. $36.2B',           urgency: 'soon',   ticker: 'META', type: 'Earnings'    },
  { date: 'Apr 23', name: 'AAPL — Ex-Dividend Date',         desc: '$0.25/share · Record date Apr 22',                                urgency: 'normal', ticker: 'AAPL', type: 'Ex-Dividend' },
  { date: 'Apr 29', name: 'FOMC Rate Decision',               desc: 'Fed target rate · Market implied: hold at 4.25–4.50%',            urgency: 'normal',                 type: 'Fed Meeting' },
  { date: 'Apr 30', name: 'NVDA — GTC Developer Conference', desc: 'Jensen Huang keynote · Next-gen Blackwell Ultra reveal expected', urgency: 'normal', ticker: 'NVDA', type: 'Conference'  },
  { date: 'May 1',  name: 'MSFT — Q3 Earnings Call',         desc: 'After-market close · EPS est. $3.22 · Rev est. $68.4B',           urgency: 'normal', ticker: 'MSFT', type: 'Earnings'    },
  { date: 'May 8',  name: 'NVDA — Q1 Earnings Call',         desc: 'After-market close · EPS est. $0.88 · Rev est. $28.0B',           urgency: 'normal', ticker: 'NVDA', type: 'Earnings'    },
  { date: 'May 14', name: 'CPI Print — April 2025',           desc: 'Bureau of Labor Statistics · Prior: 2.8% YoY',                   urgency: 'normal',                 type: 'Macro'       },
]

export const FEED_ARTICLES: Article[] = [
  {
    source: 'Reuters', time: '2h ago',
    tags: [{ label: 'AAPL', variant: 'blue' }, { label: 'Earnings', variant: 'default' }],
    title: 'Apple beats Q2 estimates with $94.8B revenue, iPhone sales resilient despite macro headwinds',
    summary: 'Apple reported second-quarter revenue above Wall Street expectations, driven by services growth and stronger-than-anticipated iPhone demand in emerging markets. The company raised its dividend by 4%.',
    ticker: 'AAPL',
  },
  {
    source: 'Bloomberg', time: '4h ago',
    tags: [{ label: 'NVDA', variant: 'blue' }, { label: 'Upgrade', variant: 'green' }],
    title: 'NVIDIA data center revenue hits record $22.6B as AI infrastructure buildout continues',
    summary: 'NVIDIA\'s data center segment posted another record quarter, with hyperscaler customers accelerating Blackwell chip deployments. Management guided Q3 revenue above consensus at $28.0B.',
    ticker: 'NVDA',
  },
  {
    source: 'WSJ', time: '6h ago',
    tags: [{ label: 'Fed', variant: 'default' }, { label: 'Macro', variant: 'default' }],
    title: 'Fed signals one rate cut in 2025 as inflation remains sticky above 2% target',
    summary: 'Federal Reserve officials revised down their rate cut projections for 2025, now projecting a single 25bps reduction amid persistent services inflation. Treasury yields moved higher on the announcement.',
  },
  {
    source: 'FT', time: '8h ago',
    tags: [{ label: 'TSLA', variant: 'blue' }, { label: 'Downgrade', variant: 'red' }],
    title: 'Tesla Q1 deliveries miss by 8% as European market share erodes amid brand sentiment issues',
    summary: 'Tesla delivered 336,681 vehicles in Q1, below the 370,000 analyst consensus. European registrations fell sharply in Germany and France while BYD continued to gain ground in key markets.',
    ticker: 'TSLA',
  },
]

export function genChartData(n: number, base: number, vol: number, trend: number): number[] {
  let v = base
  const d: number[] = []
  for (let i = 0; i < n; i++) {
    v += trend + (Math.random() - 0.45) * vol
    d.push(Math.round(v * 100) / 100)
  }
  return d
}

export const RANGE_CONFIG: Record<string, { n: number; vol: number; trend: number }> = {
  '1D': { n: 78,  vol: 1.5,  trend: 0.05 },
  '1W': { n: 35,  vol: 3,    trend: 0.2  },
  '1M': { n: 22,  vol: 6,    trend: 0.8  },
  '3M': { n: 65,  vol: 8,    trend: 1.5  },
  '1Y': { n: 52,  vol: 12,   trend: 2.5  },
}