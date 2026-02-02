import type {
  Position,
  PortfolioMetrics,
  Prediction,
  MarketTicker,
  PerformanceDataPoint,
  Transaction
} from '../types'

export const portfolioMetrics: PortfolioMetrics = {
  totalValue: 1247893.45,
  dayChange: 12847.32,
  dayChangePercent: 1.04,
  totalReturn: 247893.45,
  totalReturnPercent: 24.79,
  cashBalance: 45678.90,
  investedValue: 1202214.55,
}

export const positions: Position[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    quantity: 450,
    avgCost: 142.50,
    currentPrice: 178.32,
    marketValue: 80244.00,
    dayChange: 1245.60,
    dayChangePercent: 1.58,
    totalReturn: 16119.00,
    totalReturnPercent: 25.14,
    weight: 6.43,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    quantity: 200,
    avgCost: 285.00,
    currentPrice: 875.28,
    marketValue: 175056.00,
    dayChange: 4876.50,
    dayChangePercent: 2.87,
    totalReturn: 118056.00,
    totalReturnPercent: 207.04,
    weight: 14.03,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    quantity: 320,
    avgCost: 298.45,
    currentPrice: 415.67,
    marketValue: 133014.40,
    dayChange: -987.20,
    dayChangePercent: -0.74,
    totalReturn: 37510.40,
    totalReturnPercent: 39.28,
    weight: 10.66,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    quantity: 180,
    avgCost: 125.80,
    currentPrice: 175.42,
    marketValue: 31575.60,
    dayChange: 432.00,
    dayChangePercent: 1.39,
    totalReturn: 8931.60,
    totalReturnPercent: 39.45,
    weight: 2.53,
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    quantity: 280,
    avgCost: 142.30,
    currentPrice: 185.95,
    marketValue: 52066.00,
    dayChange: 784.00,
    dayChangePercent: 1.53,
    totalReturn: 12222.00,
    totalReturnPercent: 30.68,
    weight: 4.17,
  },
  {
    symbol: 'META',
    name: 'Meta Platforms',
    quantity: 150,
    avgCost: 298.75,
    currentPrice: 505.32,
    marketValue: 75798.00,
    dayChange: 1234.50,
    dayChangePercent: 1.66,
    totalReturn: 30985.50,
    totalReturnPercent: 69.16,
    weight: 6.07,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    quantity: 400,
    avgCost: 198.50,
    currentPrice: 248.75,
    marketValue: 99500.00,
    dayChange: -2400.00,
    dayChangePercent: -2.35,
    totalReturn: 20100.00,
    totalReturnPercent: 25.31,
    weight: 7.97,
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase',
    quantity: 350,
    avgCost: 145.20,
    currentPrice: 198.43,
    marketValue: 69450.50,
    dayChange: 875.00,
    dayChangePercent: 1.27,
    totalReturn: 18630.50,
    totalReturnPercent: 36.66,
    weight: 5.57,
  },
]

export const predictions: Prediction[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    currentPrice: 875.28,
    predictedPrice: 945.00,
    confidence: 0.87,
    signal: 'BUY',
    timeframe: '30 days',
    indicators: { rsi: 62.4, macd: 'bullish', trend: 'up' },
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    currentPrice: 178.32,
    predictedPrice: 192.50,
    confidence: 0.79,
    signal: 'BUY',
    timeframe: '30 days',
    indicators: { rsi: 55.8, macd: 'bullish', trend: 'up' },
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    currentPrice: 248.75,
    predictedPrice: 225.00,
    confidence: 0.73,
    signal: 'SELL',
    timeframe: '30 days',
    indicators: { rsi: 72.1, macd: 'bearish', trend: 'down' },
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    currentPrice: 415.67,
    predictedPrice: 420.00,
    confidence: 0.65,
    signal: 'HOLD',
    timeframe: '30 days',
    indicators: { rsi: 48.3, macd: 'neutral', trend: 'sideways' },
  },
]

export const marketTickers: MarketTicker[] = [
  { symbol: 'SPY', price: 512.43, change: 5.67, changePercent: 1.12 },
  { symbol: 'QQQ', price: 445.87, change: 8.34, changePercent: 1.91 },
  { symbol: 'DIA', price: 398.54, change: 2.18, changePercent: 0.55 },
  { symbol: 'IWM', price: 198.76, change: -1.23, changePercent: -0.62 },
  { symbol: 'VIX', price: 14.32, change: -0.87, changePercent: -5.73 },
  { symbol: 'GLD', price: 215.43, change: 1.54, changePercent: 0.72 },
  { symbol: 'TLT', price: 92.87, change: -0.34, changePercent: -0.36 },
  { symbol: 'BTC-USD', price: 67432.50, change: 1234.00, changePercent: 1.87 },
]

// Generate 1 year of performance data with multiple benchmark indices
export const performanceData: PerformanceDataPoint[] = (() => {
  const data: PerformanceDataPoint[] = []
  const startValue = 1000000
  const startDate = new Date()
  startDate.setFullYear(startDate.getFullYear() - 1)

  // Seeded random for consistent data across renders
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  // Index characteristics: annual return, volatility, correlation phase
  const indexParams = {
    sp500:      { annualReturn: 0.15, volatility: 0.015, phase: 0 },
    nasdaq:     { annualReturn: 0.22, volatility: 0.025, phase: 0.2 },
    russell2000:{ annualReturn: 0.12, volatility: 0.022, phase: 0.5 },
    msciWorld:  { annualReturn: 0.13, volatility: 0.014, phase: 0.3 },
    msciEM:     { annualReturn: 0.08, volatility: 0.028, phase: 0.7 },
    ftse100:    { annualReturn: 0.10, volatility: 0.016, phase: 0.4 },
    dax:        { annualReturn: 0.14, volatility: 0.018, phase: 0.6 },
    nikkei:     { annualReturn: 0.18, volatility: 0.020, phase: 0.8 },
  }

  for (let i = 0; i <= 365; i += 7) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    const dayFraction = i / 365

    // Portfolio: outperforms market with higher volatility
    const portfolioGrowth = 1 + dayFraction * 0.25 + Math.sin(i / 30) * 0.03 + (seededRandom(i * 1.1) - 0.5) * 0.02

    // Calculate each index growth
    const calcIndexGrowth = (params: { annualReturn: number; volatility: number; phase: number }, seed: number) => {
      return 1 + dayFraction * params.annualReturn +
             Math.sin((i / 30) + params.phase * Math.PI) * 0.02 +
             (seededRandom(seed) - 0.5) * params.volatility
    }

    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(startValue * portfolioGrowth),
      benchmark: Math.round(startValue * calcIndexGrowth(indexParams.sp500, i * 1.2)), // Legacy field
      sp500: Math.round(startValue * calcIndexGrowth(indexParams.sp500, i * 1.2)),
      nasdaq: Math.round(startValue * calcIndexGrowth(indexParams.nasdaq, i * 1.3)),
      russell2000: Math.round(startValue * calcIndexGrowth(indexParams.russell2000, i * 1.4)),
      msciWorld: Math.round(startValue * calcIndexGrowth(indexParams.msciWorld, i * 1.5)),
      msciEM: Math.round(startValue * calcIndexGrowth(indexParams.msciEM, i * 1.6)),
      ftse100: Math.round(startValue * calcIndexGrowth(indexParams.ftse100, i * 1.7)),
      dax: Math.round(startValue * calcIndexGrowth(indexParams.dax, i * 1.8)),
      nikkei: Math.round(startValue * calcIndexGrowth(indexParams.nikkei, i * 1.9)),
    })
  }

  return data
})()

export const recentTransactions: Transaction[] = [
  { id: '1', date: '2024-01-18', type: 'BUY', symbol: 'NVDA', quantity: 25, price: 865.50, total: 21637.50 },
  { id: '2', date: '2024-01-17', type: 'SELL', symbol: 'AMZN', quantity: 50, price: 184.20, total: 9210.00 },
  { id: '3', date: '2024-01-16', type: 'DIVIDEND', symbol: 'MSFT', quantity: 320, price: 0.75, total: 240.00 },
  { id: '4', date: '2024-01-15', type: 'BUY', symbol: 'AAPL', quantity: 100, price: 176.50, total: 17650.00 },
  { id: '5', date: '2024-01-12', type: 'BUY', symbol: 'META', quantity: 30, price: 498.25, total: 14947.50 },
]
