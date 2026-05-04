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
  { name: 'S&P 500',   value: '5,812',  dir: 'up' as const },
  { name: 'NASDAQ',    value: '18,240', dir: 'up' as const },
  { name: '10Y YIELD', value: '4.38%',  dir: 'dn' as const },
  { name: 'VIX',       value: '18.4',   dir: null           },
]

export const BASE_PRICES: Record<string, number> = {
  AAPL: 180, NVDA: 800, TSLA: 240, META: 510, MSFT: 410, GOOGL: 170, AMZN: 190,
}

// ── Per-ticker AI summaries ───────────────────────────────────────────────────
export const TICKER_SUMMARIES: Record<string, SummaryLevel[]> = {
  GOOG: [
  {
    badge: 'brief',
    label: 'BRIEF · 30s read',
    html: '<strong>Alphabet beat Q1 estimates</strong> with $90.2B revenue (+12% YoY). Search held firm despite AI competition. Google Cloud grew 28% to $12.3B.',
  },
  {
    badge: 'standard',
    label: 'STANDARD · 2 min read',
    html: '<strong>Alphabet (GOOG)</strong> reported Q1 2025 revenue of $90.2B, above the $89.1B consensus. Google Search revenue of $50.7B grew 10% despite concerns over AI-driven search disruption. YouTube ads grew 14% to $8.9B. Google Cloud accelerated to 28% growth at $12.3B, its first quarter of meaningful operating profit at $900M. Gemini integration across Search and Workspace is showing early monetisation signals.',
  },
  {
    badge: 'detailed',
    label: 'DETAILED · 5 min read',
    html: '<strong>Revenue breakdown:</strong> Google Search $50.7B (+10%), YouTube Ads $8.9B (+14%), Google Network $7.2B (-2%), Google Cloud $12.3B (+28%), Other Bets $0.5B.<br/><br/><strong>Margins:</strong> Operating margin 34.1% (up from 25.0% a year ago). Net income $34.5B (+46% YoY). EPS $2.81 vs $2.01 est.<br/><br/><strong>AI initiatives:</strong> Gemini 2.0 Flash deployed in Search AI Overviews now serving 1.5B users. NotebookLM at 50M users. TPU v5p chips reducing inference costs by 60%.<br/><br/><strong>Risks:</strong> DOJ antitrust remedy could force Chrome or Android divestiture. AI Overviews reducing click-through to advertisers. Apple search deal ($20B/year) under legal threat.',
  },
],
  AAPL: [
    {
      badge: 'brief',
      label: 'BRIEF · 30s read',
      html: '<strong>Apple beat Q2 estimates</strong> with $94.8B revenue and EPS of $1.53. Services grew 14% YoY. Dividend raised 4%. Stock up ~1.2%.',
    },
    {
      badge: 'standard',
      label: 'STANDARD · 2 min read',
      html: '<strong>Apple Inc. (AAPL)</strong> reported Q2 FY2025 results above expectations. Revenue of $94.8B (+6% YoY) beat the $93.2B consensus. Services revenue hit a record $24.2B (+11%). iPhone revenue of $48.3B held up despite macro concerns. Gross margin expanded to 46.6%. EPS of $1.53 beat by $0.03. A fresh $100B buyback was authorised and the dividend raised 4%.',
    },
    {
      badge: 'detailed',
      label: 'DETAILED · 5 min read',
      html: '<strong>Revenue breakdown:</strong> Total $94.8B (+6.1% YoY). iPhone $48.3B (+2.1%), Mac $9.8B (+7.4%), iPad $6.1B (+15.3%), Wearables $7.9B (-3.1%), Services $24.2B (+11.3%).<br/><br/><strong>Margins:</strong> Gross margin 46.6% (+70bps). Operating margin 30.8%. Net income $25.1B. FCF $25.7B.<br/><br/><strong>Guidance:</strong> Q3 revenue $88–92B. Services growth "low-to-mid double digits". Key risk: tariff exposure on Chinese manufacturing.',
    },
  ],
  NVDA: [
    {
      badge: 'brief',
      label: 'BRIEF · 30s read',
      html: '<strong>NVIDIA posted record data center revenue</strong> of $22.6B, up 427% YoY. Blackwell chip demand is outpacing supply. Stock near all-time highs.',
    },
    {
      badge: 'standard',
      label: 'STANDARD · 2 min read',
      html: '<strong>NVIDIA (NVDA)</strong> delivered another blowout quarter driven by insatiable AI infrastructure demand. Data center revenue of $22.6B beat estimates by ~$1B. Hyperscalers including Microsoft, Google, and Meta are accelerating Blackwell GPU deployments. Gross margin of 78.4% was slightly below guidance due to Blackwell ramp costs. Management guided Q3 revenue at $28.0B, well above the $24.6B consensus.',
    },
    {
      badge: 'detailed',
      label: 'DETAILED · 5 min read',
      html: '<strong>Segment breakdown:</strong> Data Center $22.6B (+427% YoY), Gaming $2.9B (+18%), Professional Visualisation $0.4B (+45%), Automotive $0.3B (+22%).<br/><br/><strong>Margins:</strong> Gross margin 78.4%. Operating income $16.9B. Net income $14.9B. EPS $5.98 vs $5.59 est.<br/><br/><strong>Blackwell ramp:</strong> Demand exceeds supply through at least Q3. CoWoS packaging capacity is the primary constraint. NVLink and networking products growing faster than GPUs. Key risk: US export restrictions on H20 chips to China.',
    },
  ],
  TSLA: [
    {
      badge: 'brief',
      label: 'BRIEF · 30s read',
      html: '<strong>Tesla missed Q1 delivery estimates</strong> by 8%, delivering 336,681 vehicles vs. 370,000 expected. European market share is declining. Stock down ~0.9%.',
    },
    {
      badge: 'standard',
      label: 'STANDARD · 2 min read',
      html: '<strong>Tesla (TSLA)</strong> reported Q1 2025 deliveries of 336,681 vehicles, missing the 370,000 consensus by a wide margin. Revenue came in at $19.3B (-9% YoY). Automotive gross margin fell to 16.3% as price cuts continued. Energy generation and storage was a bright spot at $2.7B (+67% YoY). Cybertruck production stabilised. Management maintained full-year guidance but acknowledged "brand headwinds" in Europe.',
    },
    {
      badge: 'detailed',
      label: 'DETAILED · 5 min read',
      html: '<strong>Deliveries:</strong> Model 3/Y 324,000 units, Other Models 12,681 units. Total 336,681 vs. 422,875 in Q1 2024 (-20% YoY).<br/><br/><strong>Financials:</strong> Revenue $19.3B (-9% YoY). Auto gross margin 16.3% (down from 21.1%). Net income $409M (-71% YoY). FCF -$1.4B.<br/><br/><strong>Segments:</strong> Energy storage 11.8 GWh deployed (+154% YoY). Services revenue $2.6B (+15%). FSD take rate improving in North America.<br/><br/><strong>Risks:</strong> Brand sentiment in Europe, BYD competition in China, Elon Musk distraction concerns from investors.',
    },
  ],
  META: [
    {
      badge: 'brief',
      label: 'BRIEF · 30s read',
      html: '<strong>Meta delivered a strong Q1</strong> with $36.5B revenue (+27% YoY). AI-driven ad tools are boosting advertiser ROI. Reality Labs losses widened to $3.8B.',
    },
    {
      badge: 'standard',
      label: 'STANDARD · 2 min read',
      html: '<strong>Meta Platforms (META)</strong> reported Q1 2025 revenue of $36.5B, up 27% YoY and above the $36.2B consensus. The Advantage+ AI ad placement suite drove CPM expansion across Facebook and Instagram. Daily active people across the family of apps reached 3.27B. Operating margin expanded to 41%. Reality Labs lost $3.8B in the quarter as Quest 3S ramps. Management guided Q2 revenue of $36.5–39.0B.',
    },
    {
      badge: 'detailed',
      label: 'DETAILED · 5 min read',
      html: '<strong>Revenue:</strong> Advertising $36.0B (+27% YoY). Other $0.5B. Reality Labs $0.4B revenue vs. $3.8B loss.<br/><br/><strong>Engagement:</strong> DAP 3.27B (+6% YoY). Facebook DAU 2.11B. Instagram and Threads accelerating in the 18–34 demographic.<br/><br/><strong>AI initiatives:</strong> Meta AI now has 700M monthly actives. Llama 4 deployed across all surfaces. Advantage+ ad revenue growing 70%+ YoY.<br/><br/><strong>Capex:</strong> Full-year 2025 capex guidance raised to $64–72B (up from $60–65B) for AI infrastructure. Key risk: EU regulatory pressure on data usage.',
    },
  ],
  MSFT: [
    {
      badge: 'brief',
      label: 'BRIEF · 30s read',
      html: '<strong>Microsoft beat Q3 estimates</strong> with $70.1B revenue (+17% YoY). Azure grew 33%. Copilot is driving Office 365 ARPU expansion. Stock at all-time highs.',
    },
    {
      badge: 'standard',
      label: 'STANDARD · 2 min read',
      html: '<strong>Microsoft (MSFT)</strong> reported Q3 FY2025 revenue of $70.1B, beating the $68.4B consensus. Azure and cloud services grew 33%, accelerating from 28% last quarter as Copilot workloads scaled. Intelligent Cloud revenue hit $26.7B. Productivity and Business Processes grew 13% to $29.9B driven by Microsoft 365 Copilot seat expansion. Operating margin expanded to 46%. EPS of $3.46 beat by $0.24.',
    },
    {
      badge: 'detailed',
      label: 'DETAILED · 5 min read',
      html: '<strong>Segment breakdown:</strong> Productivity & Business Processes $29.9B (+13%), Intelligent Cloud $26.7B (+21%), More Personal Computing $13.5B (+6%).<br/><br/><strong>Azure:</strong> 33% growth driven by AI services which now represent ~16% of Azure revenue. OpenAI partnership contributing directly to Azure consumption.<br/><br/><strong>Copilot:</strong> 70% of Fortune 500 using Microsoft 365 Copilot. GitHub Copilot at 1.8M paid subscribers (+35% QoQ).<br/><br/><strong>Margins:</strong> Gross margin 70.1%. Operating margin 46%. Net income $25.8B. FCF $20.3B.<br/><br/><strong>Risks:</strong> Antitrust scrutiny in EU, OpenAI concentration risk, Azure capacity constraints in some regions.',
    },
  ],
  GOOGL: [
    {
      badge: 'brief',
      label: 'BRIEF · 30s read',
      html: '<strong>Alphabet beat Q1 estimates</strong> with $90.2B revenue (+12% YoY). Search held firm despite AI competition. Google Cloud grew 28% to $12.3B.',
    },
    {
      badge: 'standard',
      label: 'STANDARD · 2 min read',
      html: '<strong>Alphabet (GOOGL)</strong> reported Q1 2025 revenue of $90.2B, above the $89.1B consensus. Google Search revenue of $50.7B grew 10% despite concerns over AI-driven search disruption. YouTube ads grew 14% to $8.9B. Google Cloud accelerated to 28% growth at $12.3B, its first quarter of meaningful operating profit at $900M. Gemini integration across Search and Workspace is showing early monetisation signals.',
    },
    {
      badge: 'detailed',
      label: 'DETAILED · 5 min read',
      html: '<strong>Revenue breakdown:</strong> Google Search $50.7B (+10%), YouTube Ads $8.9B (+14%), Google Network $7.2B (-2%), Google Cloud $12.3B (+28%), Other Bets $0.5B.<br/><br/><strong>Margins:</strong> Operating margin 34.1% (up from 25.0% a year ago). Net income $34.5B (+46% YoY). EPS $2.81 vs $2.01 est.<br/><br/><strong>AI initiatives:</strong> Gemini 2.0 Flash deployed in Search AI Overviews now serving 1.5B users. NotebookLM at 50M users. TPU v5p chips reducing inference costs by 60%.<br/><br/><strong>Risks:</strong> DOJ antitrust remedy could force Chrome or Android divestiture. AI Overviews reducing click-through to advertisers. Apple search deal ($20B/year) under legal threat.',
    },
  ],
}

// Fallback summaries for tickers not in the map
export const SUMMARIES: SummaryLevel[] = TICKER_SUMMARIES.AAPL

// ── Filing summaries (keyed by ticker + report_type) ─────────────────────────
export const FILING_SUMMARIES: Record<string, SummaryLevel[]> = {
  'GOOG-10-K': [
  {
    badge: 'brief',
    label: 'BRIEF · 30s read',
    html: '<strong>Alphabet FY2024 10-K:</strong> $350B revenue (+14% YoY). Google Cloud profitable at $11.4B operating income. Net income $100.1B. First ever dividend declared.',
  },
  {
    badge: 'standard',
    label: 'STANDARD · 2 min read',
    html: '<strong>Alphabet FY2024 Annual Report:</strong> Revenue grew 14% to $350B. Google Search remained the dominant revenue driver at $198B (+12%). Google Cloud achieved $36.1B revenue with $11.4B operating income, its first full year of consistent profitability. YouTube ads reached $36.1B (+15%). The company declared its first-ever cash dividend of $0.20/share and authorised $70B in buybacks.',
  },
  {
    badge: 'detailed',
    label: 'DETAILED · 5 min read',
    html: '<strong>Revenue:</strong> Google Search $198.1B (+12%), YouTube Ads $36.1B (+15%), Google Network $30.4B (-1%), Google Cloud $36.1B (+26%), Other Bets $1.7B.<br/><br/><strong>Cloud profitability:</strong> Operating margin 17.1% vs 9.4% prior year. TPU v5 reducing compute costs. Workspace AI features driving ARPU expansion.<br/><br/><strong>AI:</strong> Gemini 1.5 Pro deployed in Search, Gmail, Docs. AI Overviews serving 1B+ users. DeepMind AlphaFold 3 commercialisation underway.<br/><br/><strong>Legal:</strong> DOJ remedy phase ongoing — potential Chrome or Android divestiture. $20B Apple search deal under scrutiny. EU DMA requires changes to Shopping and Maps.<br/><br/><strong>Capex:</strong> $52.5B in 2024, guiding $75B in 2025 for AI infrastructure.',
  },
],
'GOOG-10-Q': [
  {
    badge: 'brief',
    label: 'BRIEF · 30s read',
    html: '<strong>Alphabet Q1 10-Q:</strong> $90.2B revenue (+12% YoY). Cloud hit $12.3B (+28%). Operating margin expanded to 34.1%. EPS $2.81 beat by $0.80.',
  },
  {
    badge: 'standard',
    label: 'STANDARD · 2 min read',
    html: '<strong>Alphabet Q1 2025 10-Q:</strong> Quarterly revenue $90.2B, beating the $89.1B consensus. Google Cloud operating profit reached $900M for the first time in a single quarter. YouTube ad revenue of $8.9B grew 14% driven by connected TV and Shorts monetisation. Search revenue resilient at $50.7B despite AI Overview rollout concerns. Share buybacks of $15.7B in the quarter.',
  },
  {
    badge: 'detailed',
    label: 'DETAILED · 5 min read',
    html: '<strong>P&L:</strong> Revenue $90.2B, Operating income $30.6B (34.1% margin), Net income $34.5B. EPS $2.81 vs $2.01 prior year.<br/><br/><strong>Segment detail:</strong> Search $50.7B (+10%), YouTube $8.9B (+14%), Network $7.2B (-2%), Cloud $12.3B (+28%), Other Bets $0.5B, Hedging $0.6B.<br/><br/><strong>Cloud breakdown:</strong> Google Workspace, Google Cloud Platform, and AI APIs all accelerating. Gemini API calls up 40x YoY. Vertex AI customer count doubled.<br/><br/><strong>Contingencies:</strong> DOJ antitrust remedy hearing scheduled Q3 2025. Potential remedies include mandatory syndication of search data, Chrome divestiture, or default search agreement restrictions. Management estimates legal costs of $500M–$1B in 2025.',
  },
],
  'AAPL-10-K': [
    {
      badge: 'brief',
      label: 'BRIEF · 30s read',
      html: '<strong>Apple\'s FY2024 10-K</strong> shows $391B total revenue, flat YoY. Services hit $96.2B (+13%). Net income $93.7B. $110B buyback authorised.',
    },
    {
      badge: 'standard',
      label: 'STANDARD · 2 min read',
      html: '<strong>Apple FY2024 Annual Report:</strong> Total revenue $391B, essentially flat from $383B in FY2023. iPhone revenue declined 1% to $201B while Services grew 13% to $96.2B, now representing 25% of total revenue. International revenue accounted for 58% of total sales. R&D spend increased to $31.4B (+11%). The company returned $110B to shareholders via buybacks and $15B in dividends.',
    },
    {
      badge: 'detailed',
      label: 'DETAILED · 5 min read',
      html: '<strong>Segment revenue:</strong> iPhone $201B (-1%), Mac $29.9B (+2%), iPad $26.7B (+1%), Wearables $37.0B (-3%), Services $96.2B (+13%).<br/><br/><strong>Geographic:</strong> Americas $167B, Europe $101B, China $67B (-8%), Japan $25B, Rest of Asia $31B.<br/><br/><strong>Balance sheet:</strong> Cash $162B, Long-term debt $104B, Net cash $58B. Operating cash flow $118B.<br/><br/><strong>Risk factors:</strong> China regulatory risk, App Store legal challenges in EU and US, supply chain concentration in Taiwan and China, macroeconomic sensitivity of consumer hardware.',
    },
  ],
  'AAPL-10-Q': [
    {
      badge: 'brief',
      label: 'BRIEF · 30s read',
      html: '<strong>Apple Q2 10-Q:</strong> $94.8B revenue, EPS $1.53. Services record $24.2B. Buyback pace accelerating at $25B in the quarter.',
    },
    {
      badge: 'standard',
      label: 'STANDARD · 2 min read',
      html: '<strong>Apple Q2 FY2025 10-Q:</strong> Quarterly revenue $94.8B (+6% YoY). Services segment reached a new record of $24.2B with gross margin of 75.7%. iPhone ASP held steady at ~$980. Operating expenses well-controlled at $14.8B. The company repurchased $25B of stock in the quarter and ended with $162B in cash and equivalents.',
    },
    {
      badge: 'detailed',
      label: 'DETAILED · 5 min read',
      html: '<strong>P&L:</strong> Revenue $94.8B, COGS $50.2B, Gross profit $44.6B (47.1% margin). R&D $8.0B, SG&A $6.8B. Operating income $29.8B. Net income $25.1B.<br/><br/><strong>Cash flow:</strong> Operating CF $28.0B, CapEx $2.3B, FCF $25.7B. Share repurchases $25B.<br/><br/><strong>Contingencies:</strong> Apple disclosed ongoing EU Digital Markets Act compliance costs estimated at €500M–€1B annually. App Store commission dispute with Epic Games ongoing. No material changes to tax positions.',
    },
  ],
  'NVDA-10-K': [
    {
      badge: 'brief',
      label: 'BRIEF · 30s read',
      html: '<strong>NVIDIA FY2025 10-K:</strong> $130B revenue (+114% YoY). Data center $115B. Net income $72.9B. The most profitable semiconductor company in history.',
    },
    {
      badge: 'standard',
      label: 'STANDARD · 2 min read',
      html: '<strong>NVIDIA FY2025 Annual Report:</strong> Revenue surged 114% to $130B, driven almost entirely by data center AI compute. Gross margin expanded to 75%. Net income of $72.9B represents a 145% increase. The company ended the year with $34B in cash and has authorised $50B in share repurchases. Blackwell GPU demand is described as "exceptional" with backlog extending into FY2026.',
    },
    {
      badge: 'detailed',
      label: 'DETAILED · 5 min read',
      html: '<strong>Segments:</strong> Data Center $115.2B (+142% YoY), Gaming $11.4B (+9%), Professional Viz $1.9B (+18%), Automotive $1.7B (+55%), OEM/Other $0.6B.<br/><br/><strong>Margins:</strong> Gross margin 75.0%, Operating margin 62.1%, Net margin 56.1%. ROIC 113%.<br/><br/><strong>Customers:</strong> Microsoft, Google, Amazon, Meta each represent >10% of revenue. Export restrictions on H800/A800 chips cost an estimated $5–6B in China revenue.<br/><br/><strong>Risks:</strong> Customer concentration, export controls, AMD/custom silicon competition, CoWoS supply constraints, geopolitical risk.',
    },
  ],
  'NVDA-10-Q': [
    {
      badge: 'brief',
      label: 'BRIEF · 30s read',
      html: '<strong>NVIDIA Q1 10-Q:</strong> $44.1B revenue, Blackwell revenue $35.6B. Gross margin dipped to 60.5% on new product ramp costs. EPS $0.96.',
    },
    {
      badge: 'standard',
      label: 'STANDARD · 2 min read',
      html: '<strong>NVIDIA Q1 FY2026 10-Q:</strong> Revenue $44.1B (+69% YoY). Blackwell architecture GPUs generated $35.6B, their first full quarter of production volume. Gross margin compressed to 60.5% from 78.4% due to higher Blackwell manufacturing costs expected to normalise by Q3. Data center networking (InfiniBand + Ethernet) grew 3x YoY. EPS $0.96 beat the $0.88 consensus.',
    },
    {
      badge: 'detailed',
      label: 'DETAILED · 5 min read',
      html: '<strong>Revenue:</strong> Data Center $39.1B (+73%), Gaming $3.8B (+42%), Pro Viz $0.5B (+19%), Automotive $0.6B (+72%).<br/><br/><strong>Blackwell detail:</strong> GB200 NVL72 rack systems now shipping to all major hyperscalers. GB300 samples out to lead customers. Inference workloads now 40% of data center revenue.<br/><br/><strong>Margin bridge:</strong> Gross margin 60.5% vs 78.4% prior quarter. Delta driven by Blackwell CoWoS yield improvement costs ($4.2B one-time) and HBM3e sourcing premiums.<br/><br/><strong>Liquidity:</strong> Cash $34.5B. FCF $26.1B. Buybacks $14.0B in quarter.',
    },
  ],
  'TSLA-10-K': [
    {
      badge: 'brief',
      label: 'BRIEF · 30s read',
      html: '<strong>Tesla FY2024 10-K:</strong> $97.7B revenue (-1% YoY). Auto gross margin 17.1%. Energy storage a bright spot at $9.0B (+67%). Net income $7.1B.',
    },
    {
      badge: 'standard',
      label: 'STANDARD · 2 min read',
      html: '<strong>Tesla FY2024 Annual Report:</strong> Revenue declined 1% to $97.7B as vehicle price cuts offset volume growth of 3%. Automotive gross margin compressed to 17.1% from 25.6% two years ago. Energy generation and storage revenue surged 67% to $9.0B as Megapack deployments accelerated. Services and other revenue grew 27%. Net income fell 71% to $7.1B due to margin compression and one-time charges.',
    },
    {
      badge: 'detailed',
      label: 'DETAILED · 5 min read',
      html: '<strong>Revenue:</strong> Automotive $77.1B (-6%), Energy $9.0B (+67%), Services $8.5B (+27%).<br/><br/><strong>Deliveries:</strong> 1,789,226 total vehicles. Model 3/Y 1,726,972 units. Cybertruck 38,965 units (first full year).<br/><br/><strong>Margins:</strong> Auto gross margin 17.1%, Energy gross margin 24.6%, Services gross margin 8.1%. Total operating margin 7.2%.<br/><br/><strong>FSD:</strong> Revenue from FSD deferred balance $1.5B. Supervised FSD V13 released. Robotaxi launch delayed to Q2 2025 in Austin. <br/><br/><strong>Risks:</strong> Brand damage in Europe and North America, BYD price competition, executive distraction, regulatory approval for autonomous operation.',
    },
  ],
  'META-10-K': [
    {
      badge: 'brief',
      label: 'BRIEF · 30s read',
      html: '<strong>Meta FY2024 10-K:</strong> $164.5B revenue (+22% YoY). Operating margin 43%. Reality Labs lost $17.7B. Net income $62.4B.',
    },
    {
      badge: 'standard',
      label: 'STANDARD · 2 min read',
      html: '<strong>Meta FY2024 Annual Report:</strong> Revenue grew 22% to $164.5B, driven by a recovery in digital advertising and AI-powered ad tools. Operating income hit a record $69.4B (43% margin). Reality Labs continued to lose money at $17.7B for the year. The family of apps reached 3.27B daily active people. Meta AI crossed 500M monthly users. Full-year capex of $38.5B with 2025 guidance raised to $60–65B.',
    },
    {
      badge: 'detailed',
      label: 'DETAILED · 5 min read',
      html: '<strong>Revenue:</strong> Advertising $160.6B (+22%), Other $3.9B (+38%). Reality Labs $1.2B revenue vs $17.7B operating loss.<br/><br/><strong>Engagement:</strong> Facebook DAU 2.11B (+5%), Instagram and Threads not separately disclosed. Average revenue per user (ARPU) Americas $68.14 (+17%).<br/><br/><strong>AI investment:</strong> Llama 3 and 4 deployed across all surfaces. Training cluster now 600,000 H100-equivalent GPUs. Advantage+ drove 30% of all ad revenue.<br/><br/><strong>Legal:</strong> FTC antitrust case seeking Instagram/WhatsApp divestiture ongoing. EU DMA compliance costs ~€1B annually. Children\'s safety legislation risk in US.',
    },
  ],
  'MSFT-10-K': [
    {
      badge: 'brief',
      label: 'BRIEF · 30s read',
      html: '<strong>Microsoft FY2024 10-K:</strong> $245B revenue (+16% YoY). Azure grew 29%. Operating margin 45%. Net income $88.1B. Activision fully consolidated.',
    },
    {
      badge: 'standard',
      label: 'STANDARD · 2 min read',
      html: '<strong>Microsoft FY2024 Annual Report:</strong> Revenue grew 16% to $245B with all three segments posting double-digit growth. Azure accelerated to 29% growth as AI services scaled. Intelligent Cloud revenue hit $87.9B. The $69B Activision Blizzard acquisition was fully consolidated, adding $9.6B in gaming revenue. Operating margin expanded to 44.6%. Net income of $88.1B makes Microsoft one of the most profitable companies globally.',
    },
    {
      badge: 'detailed',
      label: 'DETAILED · 5 min read',
      html: '<strong>Segments:</strong> Productivity & Business Processes $77.7B (+13%), Intelligent Cloud $87.9B (+19%), More Personal Computing $59.4B (+17% including Activision).<br/><br/><strong>Azure:</strong> 29% growth. AI services (OpenAI workloads, Copilot) represent ~14% of Azure revenue and growing 7x YoY.<br/><br/><strong>Copilot:</strong> Microsoft 365 Copilot at 400M seat opportunity. GitHub Copilot 1.3M paid users. Dynamics 365 Copilot in 30,000 organisations.<br/><br/><strong>Balance sheet:</strong> Cash $75B, Debt $79B. Operating CF $119B. CapEx $55.7B (+75% YoY) for AI infrastructure.<br/><br/><strong>Risks:</strong> EU/UK regulatory scrutiny of OpenAI relationship, Activision integration costs, Azure capacity constraints.',
    },
  ],
  'GOOGL-10-K': [
    {
      badge: 'brief',
      label: 'BRIEF · 30s read',
      html: '<strong>Alphabet FY2024 10-K:</strong> $350B revenue (+14% YoY). Google Cloud profitable at $11.4B operating income. Net income $100.1B. First ever dividend declared.',
    },
    {
      badge: 'standard',
      label: 'STANDARD · 2 min read',
      html: '<strong>Alphabet FY2024 Annual Report:</strong> Revenue grew 14% to $350B. Google Search remained the dominant revenue driver at $198B (+12%). Google Cloud achieved $36.1B revenue with $11.4B operating income, its first full year of consistent profitability. YouTube ads reached $36.1B (+15%). The company declared its first-ever cash dividend of $0.20/share and authorised $70B in buybacks.',
    },
    {
      badge: 'detailed',
      label: 'DETAILED · 5 min read',
      html: '<strong>Revenue:</strong> Google Search $198.1B (+12%), YouTube Ads $36.1B (+15%), Google Network $30.4B (-1%), Google Cloud $36.1B (+26%), Other Bets $1.7B.<br/><br/><strong>Cloud profitability:</strong> Operating margin 17.1% vs 9.4% prior year. TPU v5 reducing compute costs. Workspace AI features driving ARPU expansion.<br/><br/><strong>AI:</strong> Gemini 1.5 Pro deployed in Search, Gmail, Docs. AI Overviews serving 1B+ users. DeepMind AlphaFold 3 commercialisation underway.<br/><br/><strong>Legal:</strong> DOJ remedy phase ongoing — potential Chrome or Android divestiture. $20B Apple search deal under scrutiny. EU DMA requires changes to Shopping and Maps.<br/><br/><strong>Capex:</strong> $52.5B in 2024, guiding $75B in 2025 for AI infrastructure.',
    },
  ],
}

// Helper to get summaries for a ticker
export function getTickerSummaries(ticker: string): SummaryLevel[] {
  return TICKER_SUMMARIES[ticker] ?? TICKER_SUMMARIES.AAPL
}

// Helper to get summaries for a filing
export function getFilingSummaries(ticker: string, reportType: string): SummaryLevel[] {
  const key = `${ticker}-${reportType}`
  return FILING_SUMMARIES[key] ?? [
    {
      badge: 'brief',
      label: 'BRIEF · 30s read',
      html: `<strong>${ticker} ${reportType}:</strong> Summary not yet available for this filing.`,
    },
    {
      badge: 'standard',
      label: 'STANDARD · 2 min read',
      html: `<strong>${ticker} ${reportType}:</strong> A detailed summary for this filing has not been generated yet. Check back soon.`,
    },
    {
      badge: 'detailed',
      label: 'DETAILED · 5 min read',
      html: `<strong>${ticker} ${reportType}:</strong> Full detailed analysis for this filing is not yet available.`,
    },
  ]
}

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
  {
    source: 'Barron\'s', time: '9h ago',
    tags: [{ label: 'MSFT', variant: 'blue' }, { label: 'Earnings', variant: 'default' }],
    title: 'Microsoft Azure growth reaccelerates to 33% as Copilot workloads begin to scale',
    summary: 'Microsoft reported strong Q3 results with Azure growing 33%, ahead of the 28% consensus. Copilot adoption across Microsoft 365 is driving ARPU expansion with enterprise customers.',
    ticker: 'MSFT',
  },
  {
    source: 'FT', time: '11h ago',
    tags: [{ label: 'GOOGL', variant: 'blue' }, { label: 'AI', variant: 'green' }],
    title: 'Google Search holds firm against AI disruption as Gemini integration drives query growth',
    summary: 'Alphabet reported Search revenue of $50.7B, growing 10% despite fears of AI-driven disruption. AI Overviews are increasing engagement rather than cannibalising clicks, management said.',
    ticker: 'GOOGL',
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