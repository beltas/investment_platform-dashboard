import type {
  MarketIndex,
  NewsItem,
  EconomicIndicator,
  FedData,
} from '../types/markets'

// Seeded random for consistent data generation
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
}

// Helper to generate sparkline data
const generateSparkline = (baseValue: number, volatility: number, trend: number): number[] => {
  const data: number[] = []
  let value = baseValue * (1 - trend * 0.03) // Start slightly back
  for (let i = 0; i < 7; i++) {
    const change = (Math.random() - 0.5) * volatility + (trend * volatility * 0.1)
    value = value * (1 + change)
    data.push(Math.round(value * 100) / 100)
  }
  return data
}

// Time series data point interface
export interface TimeSeriesPoint {
  date: string
  timestamp: number
  value: number
  open?: number
  high?: number
  low?: number
  close?: number
}

// Index characteristics for realistic data generation
const indexCharacteristics: Record<string, { annualReturn: number; volatility: number; baseValue: number }> = {
  sp500: { annualReturn: 0.10, volatility: 0.15, baseValue: 5842 },
  nasdaq: { annualReturn: 0.15, volatility: 0.22, baseValue: 18456 },
  dowjones: { annualReturn: 0.08, volatility: 0.12, baseValue: 42156 },
  russell2000: { annualReturn: 0.07, volatility: 0.20, baseValue: 2234 },
  vix: { annualReturn: -0.05, volatility: 0.80, baseValue: 14.32 },
  us10y: { annualReturn: 0.02, volatility: 0.10, baseValue: 4.28 },
  ftse100: { annualReturn: 0.06, volatility: 0.14, baseValue: 7654 },
  dax: { annualReturn: 0.09, volatility: 0.16, baseValue: 16789 },
  cac40: { annualReturn: 0.07, volatility: 0.15, baseValue: 7456 },
  nikkei: { annualReturn: 0.12, volatility: 0.18, baseValue: 35678 },
  hangseng: { annualReturn: -0.02, volatility: 0.25, baseValue: 17234 },
  msciem: { annualReturn: 0.04, volatility: 0.20, baseValue: 1045 },
  shanghai: { annualReturn: 0.03, volatility: 0.22, baseValue: 3123 },
}

// Duration to days mapping
export type Duration = '1D' | '1W' | '1M' | '6M' | '1Y' | '2Y' | '5Y' | 'custom'

function getDurationDays(duration: Duration): number {
  switch (duration) {
    case '1D': return 1
    case '1W': return 7
    case '1M': return 30
    case '6M': return 180
    case '1Y': return 365
    case '2Y': return 730
    case '5Y': return 1825
    default: return 30
  }
}

// Generate time series data for an index
export function generateIndexTimeSeries(
  indexId: string,
  duration: Duration,
  customStartDate?: string,
  customEndDate?: string
): TimeSeriesPoint[] {
  const characteristics = indexCharacteristics[indexId] || {
    annualReturn: 0.08,
    volatility: 0.15,
    baseValue: 1000
  }

  const endDate = customEndDate ? new Date(customEndDate) : new Date()
  let startDate: Date
  let dataPoints: number

  if (duration === 'custom' && customStartDate) {
    startDate = new Date(customStartDate)
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    dataPoints = Math.min(daysDiff, 1825) // Cap at 5 years
  } else {
    const days = getDurationDays(duration)
    startDate = new Date(endDate)
    startDate.setDate(startDate.getDate() - days)
    dataPoints = duration === '1D' ? 78 : days // 78 data points for intraday (5-min intervals for 6.5 hours)
  }

  const data: TimeSeriesPoint[] = []
  const random = seededRandom(indexId.split('').reduce((a, c) => a + c.charCodeAt(0), 0) + endDate.getDate())

  // Calculate daily parameters
  const dailyReturn = characteristics.annualReturn / 252
  const dailyVolatility = characteristics.volatility / Math.sqrt(252)

  // Start from a calculated historical value
  const totalDays = duration === '1D' ? 1 : getDurationDays(duration)
  let currentValue = characteristics.baseValue * Math.exp(-dailyReturn * totalDays)

  if (duration === '1D') {
    // Intraday data - 5-minute intervals
    const marketOpen = new Date(endDate)
    marketOpen.setHours(9, 30, 0, 0)

    for (let i = 0; i < dataPoints; i++) {
      const time = new Date(marketOpen)
      time.setMinutes(time.getMinutes() + i * 5)

      const intradayVolatility = dailyVolatility / Math.sqrt(78)
      const change = (random() - 0.5) * 2 * intradayVolatility + dailyReturn / 78
      currentValue = currentValue * (1 + change)

      data.push({
        date: time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        timestamp: time.getTime(),
        value: Math.round(currentValue * 100) / 100,
      })
    }
  } else {
    // Daily data
    const interval = Math.max(1, Math.floor(totalDays / Math.min(dataPoints, 500)))

    for (let i = 0; i <= totalDays; i += interval) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)

      // Skip weekends for market indices
      if (date.getDay() === 0 || date.getDay() === 6) continue

      const change = (random() - 0.5) * 2 * dailyVolatility * Math.sqrt(interval) + dailyReturn * interval
      currentValue = currentValue * (1 + change)

      // Generate OHLC data
      const dayVolatility = dailyVolatility * Math.sqrt(interval)
      const open = currentValue * (1 + (random() - 0.5) * dayVolatility * 0.3)
      const high = Math.max(open, currentValue) * (1 + random() * dayVolatility * 0.5)
      const low = Math.min(open, currentValue) * (1 - random() * dayVolatility * 0.5)

      data.push({
        date: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: totalDays > 365 ? '2-digit' : undefined,
        }),
        timestamp: date.getTime(),
        value: Math.round(currentValue * 100) / 100,
        open: Math.round(open * 100) / 100,
        high: Math.round(high * 100) / 100,
        low: Math.round(low * 100) / 100,
        close: Math.round(currentValue * 100) / 100,
      })
    }
  }

  return data
}

// Get period change for an index
export function getIndexPeriodChange(
  indexId: string,
  duration: Duration,
  customStartDate?: string,
  customEndDate?: string
): { change: number; changePercent: number } {
  const data = generateIndexTimeSeries(indexId, duration, customStartDate, customEndDate)
  if (data.length < 2) return { change: 0, changePercent: 0 }

  const startValue = data[0].value
  const endValue = data[data.length - 1].value
  const change = endValue - startValue
  const changePercent = (change / startValue) * 100

  return {
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
  }
}

// Market Indices
export const marketIndices: MarketIndex[] = [
  {
    id: 'sp500',
    symbol: 'SPX',
    name: 'S&P 500',
    value: 5842.15,
    change: 72.45,
    changePercent: 1.26,
    sparklineData: generateSparkline(5842, 0.01, 1),
    region: 'US',
  },
  {
    id: 'nasdaq',
    symbol: 'IXIC',
    name: 'NASDAQ Composite',
    value: 18456.78,
    change: 312.34,
    changePercent: 1.72,
    sparklineData: generateSparkline(18456, 0.015, 1),
    region: 'US',
  },
  {
    id: 'dowjones',
    symbol: 'DJI',
    name: 'Dow Jones',
    value: 42156.89,
    change: 245.67,
    changePercent: 0.59,
    sparklineData: generateSparkline(42156, 0.008, 1),
    region: 'US',
  },
  {
    id: 'russell2000',
    symbol: 'RUT',
    name: 'Russell 2000',
    value: 2234.56,
    change: -18.23,
    changePercent: -0.81,
    sparklineData: generateSparkline(2234, 0.012, -1),
    region: 'US',
  },
  {
    id: 'vix',
    symbol: 'VIX',
    name: 'CBOE Volatility',
    value: 14.32,
    change: -0.87,
    changePercent: -5.73,
    sparklineData: generateSparkline(14.32, 0.05, -1),
    region: 'US',
  },
  {
    id: 'us10y',
    symbol: 'TNX',
    name: '10-Year Treasury',
    value: 4.28,
    change: 0.02,
    changePercent: 0.47,
    sparklineData: generateSparkline(4.28, 0.02, 1),
    region: 'US',
  },
  {
    id: 'ftse100',
    symbol: 'UKX',
    name: 'FTSE 100',
    value: 7654.32,
    change: 45.67,
    changePercent: 0.60,
    sparklineData: generateSparkline(7654, 0.008, 1),
    region: 'International',
  },
  {
    id: 'dax',
    symbol: 'DAX',
    name: 'DAX',
    value: 16789.45,
    change: 123.45,
    changePercent: 0.74,
    sparklineData: generateSparkline(16789, 0.01, 1),
    region: 'International',
  },
  {
    id: 'cac40',
    symbol: 'CAC',
    name: 'CAC 40',
    value: 7456.78,
    change: 34.56,
    changePercent: 0.47,
    sparklineData: generateSparkline(7456, 0.009, 1),
    region: 'International',
  },
  {
    id: 'nikkei',
    symbol: 'NKY',
    name: 'Nikkei 225',
    value: 35678.90,
    change: 456.78,
    changePercent: 1.30,
    sparklineData: generateSparkline(35678, 0.012, 1),
    region: 'International',
  },
  {
    id: 'hangseng',
    symbol: 'HSI',
    name: 'Hang Seng',
    value: 16234.56,
    change: -234.56,
    changePercent: -1.42,
    sparklineData: generateSparkline(16234, 0.015, -1),
    region: 'International',
  },
  {
    id: 'msciem',
    symbol: 'EEM',
    name: 'MSCI Emerging',
    value: 42.34,
    change: -0.45,
    changePercent: -1.05,
    sparklineData: generateSparkline(42.34, 0.012, -1),
    region: 'Emerging',
  },
  {
    id: 'shanghai',
    symbol: 'SHCOMP',
    name: 'Shanghai Composite',
    value: 3156.78,
    change: 23.45,
    changePercent: 0.75,
    sparklineData: generateSparkline(3156, 0.01, 1),
    region: 'Emerging',
  },
]

// Default selected indices
export const defaultSelectedIndices = ['sp500', 'nasdaq', 'dowjones', 'russell2000', 'vix', 'us10y']

// News Items
export const newsItems: NewsItem[] = [
  {
    id: '1',
    headline: 'NVIDIA Reports Record Q4 Revenue, Beats Estimates by 15%',
    source: 'Reuters',
    timestamp: '2 hours ago',
    snippet: 'NVIDIA Corporation reported quarterly revenue of $22.1 billion, exceeding analyst expectations of $19.2 billion. The company cited strong demand for AI chips...',
    category: 'earnings',
    tickers: ['NVDA'],
  },
  {
    id: '2',
    headline: 'Fed Signals Potential Rate Cut in March Meeting',
    source: 'Bloomberg',
    timestamp: '4 hours ago',
    snippet: 'Federal Reserve officials indicated they may consider cutting interest rates at the March meeting if inflation continues to moderate. Markets now pricing in 65% probability...',
    category: 'economy',
  },
  {
    id: '3',
    headline: 'Apple Unveils New AI Features for iPhone 17',
    source: 'WSJ',
    timestamp: '5 hours ago',
    snippet: 'Apple Inc. announced a suite of artificial intelligence features coming to the iPhone 17, including an enhanced Siri with GPT-like capabilities...',
    category: 'company',
    tickers: ['AAPL'],
  },
  {
    id: '4',
    headline: 'S&P 500 Hits New All-Time High Amid Tech Rally',
    source: 'CNBC',
    timestamp: '6 hours ago',
    snippet: 'The S&P 500 index closed at a record high of 5,842, driven by gains in technology stocks. The rally was led by semiconductor companies...',
    category: 'market',
  },
  {
    id: '5',
    headline: 'Microsoft Cloud Revenue Surges 28% in Q4',
    source: 'Bloomberg',
    timestamp: '8 hours ago',
    snippet: 'Microsoft reported Azure cloud revenue growth of 28% year-over-year, beating expectations. The company also raised its dividend by 10%...',
    category: 'earnings',
    tickers: ['MSFT'],
  },
  {
    id: '6',
    headline: 'Tesla Announces $25,000 Model for 2026 Launch',
    source: 'Reuters',
    timestamp: '10 hours ago',
    snippet: 'Tesla Inc. confirmed plans for a more affordable electric vehicle priced at $25,000, expected to begin production in late 2026...',
    category: 'company',
    tickers: ['TSLA'],
  },
  {
    id: '7',
    headline: 'Oil Prices Surge 3% on Middle East Supply Concerns',
    source: 'MarketWatch',
    timestamp: '12 hours ago',
    snippet: 'Crude oil prices jumped over 3% as tensions in the Middle East raised concerns about potential supply disruptions. Brent crude rose to $82 per barrel...',
    category: 'market',
  },
  {
    id: '8',
    headline: 'Amazon Expands Same-Day Delivery to 15 New Cities',
    source: 'CNBC',
    timestamp: '14 hours ago',
    snippet: 'Amazon announced expansion of its same-day delivery service to 15 additional metropolitan areas, increasing coverage to over 90% of the US population...',
    category: 'company',
    tickers: ['AMZN'],
  },
  {
    id: '9',
    headline: 'January Jobs Report: Economy Adds 216K Jobs, Unemployment at 4.1%',
    source: 'Bloomberg',
    timestamp: '1 day ago',
    snippet: 'The US economy added 216,000 jobs in January, beating expectations of 185,000. The unemployment rate held steady at 4.1%, signaling continued labor market strength...',
    category: 'economy',
  },
  {
    id: '10',
    headline: 'Meta Platforms Announces $50B Stock Buyback Program',
    source: 'WSJ',
    timestamp: '1 day ago',
    snippet: 'Meta Platforms unveiled a new $50 billion share repurchase program, the largest in company history. The announcement sent shares up 4% in after-hours trading...',
    category: 'earnings',
    tickers: ['META'],
  },
  {
    id: '11',
    headline: 'JPMorgan Raises S&P 500 Year-End Target to 6,200',
    source: 'Bloomberg',
    timestamp: '1 day ago',
    snippet: 'JPMorgan strategists raised their S&P 500 year-end price target to 6,200 from 5,800, citing strong corporate earnings and resilient economic growth...',
    category: 'market',
  },
  {
    id: '12',
    headline: 'Google Parent Alphabet Reports 18% Revenue Growth',
    source: 'Reuters',
    timestamp: '2 days ago',
    snippet: 'Alphabet Inc. reported quarterly revenue of $86.3 billion, up 18% year-over-year, driven by strong advertising demand and cloud services growth...',
    category: 'earnings',
    tickers: ['GOOGL'],
  },
]

// Economic Indicators
export const economicIndicators: EconomicIndicator[] = [
  // Employment
  {
    id: 'nfp',
    name: 'Non-Farm Payrolls',
    category: 'employment',
    previous: '256K',
    expected: '185K',
    actual: '216K',
    surprise: '+31K',
    surpriseDirection: 'beat',
    releaseDate: 'Jan 10, 2026',
    nextRelease: 'Feb 7, 2026',
    unit: 'K',
    description: 'Monthly change in employment excluding farm workers',
  },
  {
    id: 'unemployment',
    name: 'Unemployment Rate',
    category: 'employment',
    previous: '4.1%',
    expected: '4.2%',
    actual: '4.1%',
    surprise: '-0.1%',
    surpriseDirection: 'beat',
    releaseDate: 'Jan 10, 2026',
    nextRelease: 'Feb 7, 2026',
    unit: '%',
    description: 'Percentage of labor force without employment',
  },
  {
    id: 'jobless-claims',
    name: 'Initial Jobless Claims',
    category: 'employment',
    previous: '219K',
    expected: '225K',
    actual: '213K',
    surprise: '-12K',
    surpriseDirection: 'beat',
    releaseDate: 'Jan 16, 2026',
    nextRelease: 'Jan 23, 2026',
    unit: 'K',
    description: 'Weekly new unemployment insurance claims',
  },
  // Inflation
  {
    id: 'cpi',
    name: 'CPI YoY',
    category: 'inflation',
    previous: '3.4%',
    expected: '3.2%',
    actual: '3.1%',
    surprise: '-0.1%',
    surpriseDirection: 'beat',
    releaseDate: 'Jan 11, 2026',
    nextRelease: 'Feb 12, 2026',
    unit: '%',
    description: 'Consumer Price Index year-over-year change',
  },
  {
    id: 'core-cpi',
    name: 'Core CPI YoY',
    category: 'inflation',
    previous: '3.9%',
    expected: '3.8%',
    actual: '3.8%',
    surprise: '0.0%',
    surpriseDirection: 'inline',
    releaseDate: 'Jan 11, 2026',
    nextRelease: 'Feb 12, 2026',
    unit: '%',
    description: 'CPI excluding food and energy',
  },
  {
    id: 'pce',
    name: 'PCE YoY',
    category: 'inflation',
    previous: '2.6%',
    expected: '2.5%',
    actual: '2.6%',
    surprise: '+0.1%',
    surpriseDirection: 'miss',
    releaseDate: 'Dec 22, 2025',
    nextRelease: 'Jan 31, 2026',
    unit: '%',
    description: "Personal Consumption Expenditures - Fed's preferred inflation measure",
  },
  // Growth
  {
    id: 'gdp',
    name: 'GDP QoQ',
    category: 'growth',
    previous: '4.9%',
    expected: '3.2%',
    actual: '3.3%',
    surprise: '+0.1%',
    surpriseDirection: 'beat',
    releaseDate: 'Dec 21, 2025',
    nextRelease: 'Jan 30, 2026',
    unit: '%',
    description: 'Gross Domestic Product quarterly growth rate',
  },
  {
    id: 'ism-manufacturing',
    name: 'ISM Manufacturing PMI',
    category: 'growth',
    previous: '46.7',
    expected: '47.5',
    actual: '47.4',
    surprise: '-0.1',
    surpriseDirection: 'miss',
    releaseDate: 'Jan 3, 2026',
    nextRelease: 'Feb 3, 2026',
    unit: '',
    description: 'Manufacturing sector activity index (above 50 = expansion)',
  },
  {
    id: 'consumer-confidence',
    name: 'Consumer Confidence',
    category: 'growth',
    previous: '101.0',
    expected: '104.0',
    actual: '110.7',
    surprise: '+6.7',
    surpriseDirection: 'beat',
    releaseDate: 'Dec 20, 2025',
    nextRelease: 'Jan 28, 2026',
    unit: '',
    description: 'Consumer sentiment about economic conditions',
  },
  {
    id: 'retail-sales',
    name: 'Retail Sales MoM',
    category: 'growth',
    previous: '0.3%',
    expected: '0.4%',
    actual: '0.6%',
    surprise: '+0.2%',
    surpriseDirection: 'beat',
    releaseDate: 'Jan 16, 2026',
    nextRelease: 'Feb 14, 2026',
    unit: '%',
    description: 'Monthly change in retail trade sales',
  },
  {
    id: 'housing-starts',
    name: 'Housing Starts',
    category: 'growth',
    previous: '1.56M',
    expected: '1.48M',
    actual: '1.50M',
    surprise: '+20K',
    surpriseDirection: 'beat',
    releaseDate: 'Jan 17, 2026',
    nextRelease: 'Feb 19, 2026',
    unit: 'M',
    description: 'Annualized new residential construction starts',
  },
  {
    id: 'trade-balance',
    name: 'Trade Balance',
    category: 'growth',
    previous: '-$64.3B',
    expected: '-$65.0B',
    actual: '-$63.2B',
    surprise: '+$1.8B',
    surpriseDirection: 'beat',
    releaseDate: 'Jan 9, 2026',
    nextRelease: 'Feb 6, 2026',
    unit: 'B',
    description: 'Difference between exports and imports',
  },
]

// Fed Data with Dot Plot organized by FOMC Meeting
export const fedData: FedData = {
  currentRate: '4.25% - 4.50%',
  nextMeeting: 'FOMC Meeting',
  nextMeetingDate: 'Jan 29, 2026',
  marketExpectations: {
    hold: 92,
    cut: 8,
    hike: 0,
  },
  yieldCurveSpread: 0.18,
  yieldCurveStatus: 'normal',
  meetings: [
    {
      id: 'dec-2025',
      date: '2025-12-17',
      displayName: 'December 2025',
      rateDecision: 'Hold at 4.25% - 4.50%',
      dotPlot: [
        // 2026 projections
        { year: 2026, rate: 4.50, count: 2 },
        { year: 2026, rate: 4.25, count: 4 },
        { year: 2026, rate: 4.00, count: 5 },
        { year: 2026, rate: 3.75, count: 5 },
        { year: 2026, rate: 3.50, count: 3 },
        // 2027 projections
        { year: 2027, rate: 4.00, count: 1 },
        { year: 2027, rate: 3.75, count: 3 },
        { year: 2027, rate: 3.50, count: 5 },
        { year: 2027, rate: 3.25, count: 5 },
        { year: 2027, rate: 3.00, count: 4 },
        { year: 2027, rate: 2.75, count: 1 },
        // 2028 projections
        { year: 2028, rate: 3.50, count: 2 },
        { year: 2028, rate: 3.25, count: 4 },
        { year: 2028, rate: 3.00, count: 6 },
        { year: 2028, rate: 2.75, count: 5 },
        { year: 2028, rate: 2.50, count: 2 },
        // Long run projections
        { year: 2030, rate: 3.25, count: 2 },
        { year: 2030, rate: 3.00, count: 7 },
        { year: 2030, rate: 2.75, count: 6 },
        { year: 2030, rate: 2.50, count: 4 },
      ],
    },
    {
      id: 'sep-2025',
      date: '2025-09-17',
      displayName: 'September 2025',
      rateDecision: 'Cut 25bp to 4.25% - 4.50%',
      dotPlot: [
        // 2026 projections
        { year: 2026, rate: 4.25, count: 3 },
        { year: 2026, rate: 4.00, count: 5 },
        { year: 2026, rate: 3.75, count: 6 },
        { year: 2026, rate: 3.50, count: 4 },
        { year: 2026, rate: 3.25, count: 1 },
        // 2027 projections
        { year: 2027, rate: 3.75, count: 2 },
        { year: 2027, rate: 3.50, count: 4 },
        { year: 2027, rate: 3.25, count: 6 },
        { year: 2027, rate: 3.00, count: 5 },
        { year: 2027, rate: 2.75, count: 2 },
        // 2028 projections
        { year: 2028, rate: 3.25, count: 3 },
        { year: 2028, rate: 3.00, count: 6 },
        { year: 2028, rate: 2.75, count: 6 },
        { year: 2028, rate: 2.50, count: 4 },
        // Long run projections
        { year: 2030, rate: 3.00, count: 5 },
        { year: 2030, rate: 2.75, count: 8 },
        { year: 2030, rate: 2.50, count: 6 },
      ],
    },
    {
      id: 'jun-2025',
      date: '2025-06-11',
      displayName: 'June 2025',
      rateDecision: 'Hold at 4.50% - 4.75%',
      dotPlot: [
        // 2026 projections
        { year: 2026, rate: 4.50, count: 4 },
        { year: 2026, rate: 4.25, count: 5 },
        { year: 2026, rate: 4.00, count: 5 },
        { year: 2026, rate: 3.75, count: 4 },
        { year: 2026, rate: 3.50, count: 1 },
        // 2027 projections
        { year: 2027, rate: 4.00, count: 2 },
        { year: 2027, rate: 3.75, count: 4 },
        { year: 2027, rate: 3.50, count: 5 },
        { year: 2027, rate: 3.25, count: 5 },
        { year: 2027, rate: 3.00, count: 3 },
        // 2028 projections
        { year: 2028, rate: 3.50, count: 3 },
        { year: 2028, rate: 3.25, count: 5 },
        { year: 2028, rate: 3.00, count: 6 },
        { year: 2028, rate: 2.75, count: 4 },
        { year: 2028, rate: 2.50, count: 1 },
        // Long run projections
        { year: 2030, rate: 3.00, count: 6 },
        { year: 2030, rate: 2.75, count: 7 },
        { year: 2030, rate: 2.50, count: 6 },
      ],
    },
    {
      id: 'mar-2025',
      date: '2025-03-19',
      displayName: 'March 2025',
      rateDecision: 'Hold at 4.50% - 4.75%',
      dotPlot: [
        // 2025 projections
        { year: 2025, rate: 4.75, count: 3 },
        { year: 2025, rate: 4.50, count: 6 },
        { year: 2025, rate: 4.25, count: 6 },
        { year: 2025, rate: 4.00, count: 4 },
        // 2026 projections
        { year: 2026, rate: 4.50, count: 2 },
        { year: 2026, rate: 4.25, count: 4 },
        { year: 2026, rate: 4.00, count: 6 },
        { year: 2026, rate: 3.75, count: 5 },
        { year: 2026, rate: 3.50, count: 2 },
        // 2027 projections
        { year: 2027, rate: 4.00, count: 1 },
        { year: 2027, rate: 3.75, count: 3 },
        { year: 2027, rate: 3.50, count: 6 },
        { year: 2027, rate: 3.25, count: 5 },
        { year: 2027, rate: 3.00, count: 4 },
        // Long run projections
        { year: 2030, rate: 3.00, count: 5 },
        { year: 2030, rate: 2.75, count: 8 },
        { year: 2030, rate: 2.50, count: 6 },
      ],
    },
    {
      id: 'dec-2024',
      date: '2024-12-18',
      displayName: 'December 2024',
      rateDecision: 'Cut 25bp to 4.50% - 4.75%',
      dotPlot: [
        // 2025 projections
        { year: 2025, rate: 5.00, count: 1 },
        { year: 2025, rate: 4.75, count: 3 },
        { year: 2025, rate: 4.50, count: 5 },
        { year: 2025, rate: 4.25, count: 6 },
        { year: 2025, rate: 4.00, count: 3 },
        { year: 2025, rate: 3.75, count: 1 },
        // 2026 projections
        { year: 2026, rate: 4.50, count: 2 },
        { year: 2026, rate: 4.25, count: 3 },
        { year: 2026, rate: 4.00, count: 4 },
        { year: 2026, rate: 3.75, count: 5 },
        { year: 2026, rate: 3.50, count: 4 },
        { year: 2026, rate: 3.25, count: 1 },
        // 2027 projections
        { year: 2027, rate: 4.00, count: 1 },
        { year: 2027, rate: 3.75, count: 2 },
        { year: 2027, rate: 3.50, count: 4 },
        { year: 2027, rate: 3.25, count: 5 },
        { year: 2027, rate: 3.00, count: 5 },
        { year: 2027, rate: 2.75, count: 2 },
        // Long run projections
        { year: 2030, rate: 3.25, count: 2 },
        { year: 2030, rate: 3.00, count: 7 },
        { year: 2030, rate: 2.75, count: 6 },
        { year: 2030, rate: 2.50, count: 4 },
      ],
    },
    {
      id: 'sep-2024',
      date: '2024-09-18',
      displayName: 'September 2024',
      rateDecision: 'Cut 50bp to 4.75% - 5.00%',
      dotPlot: [
        // 2024 projections
        { year: 2024, rate: 4.75, count: 7 },
        { year: 2024, rate: 4.50, count: 9 },
        { year: 2024, rate: 4.25, count: 2 },
        { year: 2024, rate: 4.00, count: 1 },
        // 2025 projections
        { year: 2025, rate: 4.50, count: 2 },
        { year: 2025, rate: 4.25, count: 4 },
        { year: 2025, rate: 4.00, count: 5 },
        { year: 2025, rate: 3.75, count: 5 },
        { year: 2025, rate: 3.50, count: 3 },
        // 2026 projections
        { year: 2026, rate: 4.00, count: 2 },
        { year: 2026, rate: 3.75, count: 3 },
        { year: 2026, rate: 3.50, count: 5 },
        { year: 2026, rate: 3.25, count: 5 },
        { year: 2026, rate: 3.00, count: 4 },
        // Long run projections
        { year: 2030, rate: 3.00, count: 5 },
        { year: 2030, rate: 2.75, count: 8 },
        { year: 2030, rate: 2.50, count: 6 },
      ],
    },
  ],
}

// Upcoming releases (next 14 days)
export const upcomingReleases = [
  { name: 'Initial Jobless Claims', date: 'Jan 23, 2026', daysUntil: 4 },
  { name: 'Consumer Confidence', date: 'Jan 28, 2026', daysUntil: 9 },
  { name: 'FOMC Rate Decision', date: 'Jan 29, 2026', daysUntil: 10 },
  { name: 'GDP Q4 2025', date: 'Jan 30, 2026', daysUntil: 11 },
  { name: 'PCE Price Index', date: 'Jan 31, 2026', daysUntil: 12 },
]
