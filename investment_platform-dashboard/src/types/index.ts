export interface Position {
  symbol: string
  name: string
  quantity: number
  avgCost: number
  currentPrice: number
  marketValue: number
  dayChange: number
  dayChangePercent: number
  totalReturn: number
  totalReturnPercent: number
  weight: number
}

export interface PortfolioMetrics {
  totalValue: number
  dayChange: number
  dayChangePercent: number
  totalReturn: number
  totalReturnPercent: number
  cashBalance: number
  investedValue: number
}

export interface Prediction {
  symbol: string
  name: string
  currentPrice: number
  predictedPrice: number
  confidence: number
  signal: 'BUY' | 'SELL' | 'HOLD'
  timeframe: string
  indicators: {
    rsi: number
    macd: 'bullish' | 'bearish' | 'neutral'
    trend: 'up' | 'down' | 'sideways'
  }
}

export interface MarketTicker {
  symbol: string
  price: number
  change: number
  changePercent: number
}

export interface PerformanceDataPoint {
  date: string
  value: number
  benchmark: number
  // Multi-index benchmarks
  sp500: number
  nasdaq: number
  russell2000: number
  msciWorld: number
  msciEM: number
  ftse100: number
  dax: number
  nikkei: number
}

// Benchmark index configuration
export type BenchmarkIndexId =
  | 'sp500'
  | 'nasdaq'
  | 'russell2000'
  | 'msciWorld'
  | 'msciEM'
  | 'ftse100'
  | 'dax'
  | 'nikkei'

export interface BenchmarkIndex {
  id: BenchmarkIndexId
  name: string
  shortName: string
  region: 'US' | 'International' | 'Emerging'
  color: string
  description: string
}

export const BENCHMARK_INDICES: BenchmarkIndex[] = [
  { id: 'sp500', name: 'S&P 500', shortName: 'SPX', region: 'US', color: '#fbbf24', description: 'US Large Cap' },
  { id: 'nasdaq', name: 'NASDAQ Composite', shortName: 'IXIC', region: 'US', color: '#8b5cf6', description: 'US Tech-Heavy' },
  { id: 'russell2000', name: 'Russell 2000', shortName: 'RUT', region: 'US', color: '#ec4899', description: 'US Small Cap' },
  { id: 'msciWorld', name: 'MSCI World', shortName: 'MXWO', region: 'International', color: '#06b6d4', description: 'Developed Markets' },
  { id: 'msciEM', name: 'MSCI Emerging', shortName: 'MXEF', region: 'Emerging', color: '#f97316', description: 'Emerging Markets' },
  { id: 'ftse100', name: 'FTSE 100', shortName: 'UKX', region: 'International', color: '#14b8a6', description: 'UK Large Cap' },
  { id: 'dax', name: 'DAX', shortName: 'DAX', region: 'International', color: '#3b82f6', description: 'German Blue Chips' },
  { id: 'nikkei', name: 'Nikkei 225', shortName: 'NKY', region: 'International', color: '#ef4444', description: 'Japan Large Cap' },
]

export interface Transaction {
  id: string
  date: string
  type: 'BUY' | 'SELL' | 'DIVIDEND'
  symbol: string
  quantity: number
  price: number
  total: number
}

// Re-export Portfolio types
export * from './portfolio'

// Re-export Markets types
export * from './markets'

// Re-export Predictions types
export * from './predictions'
