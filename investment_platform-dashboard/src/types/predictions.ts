// Prediction types for the ML Predictions page

export interface ModelPrediction {
  id: string
  symbol: string
  name: string
  sector: string
  currentPrice: number
  predictedPrice: number
  confidence: number
  signal: 'BUY' | 'SELL' | 'HOLD'
  timeframe: '7d' | '14d' | '30d' | '90d'
  modelVersion: string
  lastUpdated: string
  indicators: {
    rsi: number
    macd: 'bullish' | 'bearish' | 'neutral'
    trend: 'up' | 'down' | 'sideways'
    volatility: number
    momentum: number
    volume: 'high' | 'normal' | 'low'
  }
  historicalAccuracy: number
  priceTarget: {
    low: number
    mid: number
    high: number
  }
}

export interface ModelPerformance {
  modelId: string
  modelName: string
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  sharpeRatio: number
  maxDrawdown: number
  totalPredictions: number
  successfulPredictions: number
  avgReturnOnCorrect: number
  avgLossOnIncorrect: number
}

export interface SectorPrediction {
  sector: string
  sentiment: 'bullish' | 'bearish' | 'neutral'
  averageConfidence: number
  buySignals: number
  sellSignals: number
  holdSignals: number
  topPicks: string[]
}

export type PredictionTimeframe = '7d' | '14d' | '30d' | '90d'
export type PredictionFilter = 'all' | 'buy' | 'sell' | 'hold'

export const PREDICTION_TABS = [
  { id: 'overview', label: 'Overview', icon: 'brain' },
  { id: 'signals', label: 'Signals', icon: 'signal' },
  { id: 'models', label: 'Model Performance', icon: 'chart' },
  { id: 'history', label: 'History', icon: 'clock' },
] as const

export type PredictionTabId = typeof PREDICTION_TABS[number]['id']
