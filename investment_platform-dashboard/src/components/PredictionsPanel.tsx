import { motion } from 'framer-motion'
import type { Prediction } from '../types'
import { formatCurrency } from '../hooks/useAnimatedNumber'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Brain,
  Activity,
  BarChart3,
} from 'lucide-react'

interface PredictionsPanelProps {
  predictions: Prediction[]
}

const signalConfig = {
  BUY: {
    color: 'emerald',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    icon: TrendingUp,
  },
  SELL: {
    color: 'crimson',
    bg: 'bg-crimson-500/10',
    border: 'border-crimson-500/30',
    text: 'text-crimson-400',
    icon: TrendingDown,
  },
  HOLD: {
    color: 'gold',
    bg: 'bg-gold-500/10',
    border: 'border-gold-500/30',
    text: 'text-gold-400',
    icon: Minus,
  },
}

export function PredictionsPanel({ predictions }: PredictionsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="glass-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5">
            <Brain className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="font-display text-xl text-white">ML Predictions</h2>
            <p className="text-gray-500 text-sm">AI-powered signals</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">Live</span>
        </div>
      </div>

      {/* Predictions List */}
      <div className="space-y-4">
        {predictions.map((prediction, index) => {
          const config = signalConfig[prediction.signal]
          const SignalIcon = config.icon
          const priceChange = prediction.predictedPrice - prediction.currentPrice
          const priceChangePercent = (priceChange / prediction.currentPrice) * 100

          return (
            <motion.div
              key={prediction.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
              className="group p-4 rounded-xl bg-obsidian-800/50 border border-obsidian-600/30 hover:border-obsidian-500/50 transition-all cursor-pointer"
            >
              {/* Top Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-obsidian-600 to-obsidian-700 flex items-center justify-center border border-obsidian-500/50">
                    <span className="text-xs font-bold text-gray-300">
                      {prediction.symbol.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{prediction.symbol}</p>
                    <p className="text-xs text-gray-500">{prediction.name}</p>
                  </div>
                </div>

                {/* Signal Badge */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${config.bg} border ${config.border}`}
                >
                  <SignalIcon className={`w-3.5 h-3.5 ${config.text}`} />
                  <span className={`text-xs font-bold ${config.text}`}>
                    {prediction.signal}
                  </span>
                </div>
              </div>

              {/* Price Prediction */}
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Current</p>
                  <p className="font-mono text-lg text-gray-300">
                    {formatCurrency(prediction.currentPrice)}
                  </p>
                </div>
                <div className="text-center px-4">
                  <svg className="w-8 h-4 text-gray-600" viewBox="0 0 32 16">
                    <path
                      d="M0 8 L24 8 M20 4 L28 8 L20 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Predicted ({prediction.timeframe})</p>
                  <p className={`font-mono text-lg font-medium ${config.text}`}>
                    {formatCurrency(prediction.predictedPrice)}
                  </p>
                </div>
              </div>

              {/* Expected Change */}
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-obsidian-900/50 mb-3">
                <span className="text-xs text-gray-500">Expected Change</span>
                <span className={`font-mono text-sm font-medium ${config.text}`}>
                  {priceChange >= 0 ? '+' : ''}{formatCurrency(priceChange)} ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(1)}%)
                </span>
              </div>

              {/* Indicators */}
              <div className="flex items-center gap-4">
                {/* Confidence */}
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-gray-500" />
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 h-1.5 bg-obsidian-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.confidence * 100}%` }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
                        className={`h-full rounded-full ${
                          prediction.confidence >= 0.8
                            ? 'bg-emerald-500'
                            : prediction.confidence >= 0.6
                            ? 'bg-gold-500'
                            : 'bg-crimson-500'
                        }`}
                      />
                    </div>
                    <span className="text-xs text-gray-400 font-mono">
                      {(prediction.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* RSI */}
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-xs text-gray-400">
                    RSI: <span className="font-mono">{prediction.indicators.rsi.toFixed(1)}</span>
                  </span>
                </div>

                {/* Trend */}
                <div className="flex items-center gap-1.5">
                  {prediction.indicators.trend === 'up' && (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  {prediction.indicators.trend === 'down' && (
                    <TrendingDown className="w-3.5 h-3.5 text-crimson-400" />
                  )}
                  {prediction.indicators.trend === 'sideways' && (
                    <Minus className="w-3.5 h-3.5 text-gold-400" />
                  )}
                  <span className="text-xs text-gray-400 capitalize">
                    {prediction.indicators.trend}
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-obsidian-700/50 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Updated 2 min ago • Next update in 28 min
        </p>
        <button className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
          View Analysis →
        </button>
      </div>
    </motion.div>
  )
}
