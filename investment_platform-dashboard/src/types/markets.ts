// Market Indices
export interface MarketIndex {
  id: string
  symbol: string
  name: string
  value: number
  change: number
  changePercent: number
  sparklineData: number[]
  region: 'US' | 'International' | 'Emerging'
}

// News
export type NewsSource = 'Reuters' | 'Bloomberg' | 'WSJ' | 'CNBC' | 'MarketWatch'
export type NewsCategory = 'earnings' | 'market' | 'economy' | 'company'
export type NewsFilter = 'all' | 'holdings' | 'market' | 'earnings'

export interface NewsItem {
  id: string
  headline: string
  source: NewsSource
  timestamp: string
  snippet: string
  category: NewsCategory
  tickers?: string[]
  url?: string
  saved?: boolean
}

// Economic Data
export type IndicatorCategory = 'employment' | 'inflation' | 'fed' | 'growth'
export type SurpriseDirection = 'beat' | 'miss' | 'inline'

export interface EconomicIndicator {
  id: string
  name: string
  category: IndicatorCategory
  previous: string
  expected: string
  actual: string
  surprise: string
  surpriseDirection: SurpriseDirection
  releaseDate: string
  nextRelease?: string
  unit: string
  description?: string
}

export interface FedDotPlotPoint {
  year: number
  rate: number
  count: number
}

export interface FomcMeeting {
  id: string
  date: string
  displayName: string
  rateDecision: string
  dotPlot: FedDotPlotPoint[]
}

export interface FedData {
  currentRate: string
  nextMeeting: string
  nextMeetingDate: string
  marketExpectations: {
    hold: number
    cut: number
    hike: number
  }
  meetings: FomcMeeting[]
  yieldCurveSpread: number
  yieldCurveStatus: 'normal' | 'inverted' | 'flat'
}

// Tab types
export type MarketsTabId = 'indices' | 'news' | 'economic'

export interface MarketsTab {
  id: MarketsTabId
  label: string
  icon?: string
}

export const MARKETS_TABS: MarketsTab[] = [
  { id: 'indices', label: 'Indices' },
  { id: 'news', label: 'News' },
  { id: 'economic', label: 'Economic Data' },
]

// Available indices for selection
export const AVAILABLE_INDICES: Omit<MarketIndex, 'sparklineData'>[] = [
  // US Markets
  { id: 'sp500', symbol: 'SPX', name: 'S&P 500', value: 0, change: 0, changePercent: 0, region: 'US' },
  { id: 'nasdaq', symbol: 'IXIC', name: 'NASDAQ Composite', value: 0, change: 0, changePercent: 0, region: 'US' },
  { id: 'dowjones', symbol: 'DJI', name: 'Dow Jones', value: 0, change: 0, changePercent: 0, region: 'US' },
  { id: 'russell2000', symbol: 'RUT', name: 'Russell 2000', value: 0, change: 0, changePercent: 0, region: 'US' },
  { id: 'vix', symbol: 'VIX', name: 'CBOE Volatility', value: 0, change: 0, changePercent: 0, region: 'US' },
  { id: 'us10y', symbol: 'TNX', name: '10-Year Treasury', value: 0, change: 0, changePercent: 0, region: 'US' },
  // International
  { id: 'ftse100', symbol: 'UKX', name: 'FTSE 100', value: 0, change: 0, changePercent: 0, region: 'International' },
  { id: 'dax', symbol: 'DAX', name: 'DAX', value: 0, change: 0, changePercent: 0, region: 'International' },
  { id: 'cac40', symbol: 'CAC', name: 'CAC 40', value: 0, change: 0, changePercent: 0, region: 'International' },
  { id: 'nikkei', symbol: 'NKY', name: 'Nikkei 225', value: 0, change: 0, changePercent: 0, region: 'International' },
  { id: 'hangseng', symbol: 'HSI', name: 'Hang Seng', value: 0, change: 0, changePercent: 0, region: 'International' },
  // Emerging
  { id: 'msciem', symbol: 'EEM', name: 'MSCI Emerging', value: 0, change: 0, changePercent: 0, region: 'Emerging' },
  { id: 'shanghai', symbol: 'SHCOMP', name: 'Shanghai Composite', value: 0, change: 0, changePercent: 0, region: 'Emerging' },
]
