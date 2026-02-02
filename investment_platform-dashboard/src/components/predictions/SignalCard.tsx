import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Zap,
  Target,
  Clock,
} from 'lucide-react'
import { NeuralPulse } from './NeuralPulse'
import type { ModelPrediction } from '../../types/predictions'
import { formatCurrency } from '../../hooks/useAnimatedNumber'

interface SignalCardProps {
  prediction: ModelPrediction
  index: number
}

const signalConfig = {
  BUY: {
    label: 'Strong Buy',
    color: 'emerald',
    bgGradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    icon: TrendingUp,
    glowClass: 'shadow-emerald-500/20',
    rangeGradient: 'bg-gradient-to-r from-emerald-500/50 to-emerald-400/50',
    markerColor: '#10b981',
  },
  SELL: {
    label: 'Sell',
    color: 'crimson',
    bgGradient: 'from-crimson-500/10 via-crimson-500/5 to-transparent',
    borderColor: 'border-crimson-500/30',
    textColor: 'text-crimson-400',
    icon: TrendingDown,
    glowClass: 'shadow-crimson-500/20',
    rangeGradient: 'bg-gradient-to-r from-crimson-500/50 to-crimson-400/50',
    markerColor: '#ef4444',
  },
  HOLD: {
    label: 'Hold',
    color: 'gold',
    bgGradient: 'from-gold-500/10 via-gold-500/5 to-transparent',
    borderColor: 'border-gold-500/30',
    textColor: 'text-gold-400',
    icon: Minus,
    glowClass: 'shadow-gold-500/20',
    rangeGradient: 'bg-gradient-to-r from-gold-500/50 to-gold-400/50',
    markerColor: '#fbbf24',
  },
}

// Calculate percentage within a range, with division-by-zero protection
function calcRangePercent(value: number, low: number, high: number): number {
  const range = high - low
  if (range === 0) return 50 // Default to middle if range is zero
  return ((value - low) / range) * 100
}

export function SignalCard({ prediction, index }: SignalCardProps) {
  const config = signalConfig[prediction.signal]
  const SignalIcon = config.icon

  const priceChange = prediction.predictedPrice - prediction.currentPrice
  const priceChangePercent = (priceChange / prediction.currentPrice) * 100

  const timeSinceUpdate = Math.round(
    (Date.now() - new Date(prediction.lastUpdated).getTime()) / (1000 * 60)
  )

  // Pre-calculate range percentages with division-by-zero protection
  const currentPricePercent = calcRangePercent(
    prediction.currentPrice,
    prediction.priceTarget.low,
    prediction.priceTarget.high
  )
  const targetPricePercent = calcRangePercent(
    prediction.priceTarget.mid,
    prediction.priceTarget.low,
    prediction.priceTarget.high
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.08,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`
        group relative overflow-hidden rounded-2xl
        bg-gradient-to-br ${config.bgGradient}
        border ${config.borderColor}
        backdrop-blur-sm
        transition-all duration-300
        hover:border-opacity-60 hover:shadow-lg ${config.glowClass}
        cursor-pointer
      `}
    >
      {/* Animated corner accent */}
      <motion.div
        className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${config.bgGradient} opacity-50`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative p-5">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Symbol Badge */}
            <div className="relative">
              <div
                className={`
                  w-12 h-12 rounded-xl
                  bg-gradient-to-br from-obsidian-700 to-obsidian-800
                  border border-obsidian-600/50
                  flex items-center justify-center
                  group-hover:border-obsidian-500/70 transition-colors
                `}
              >
                <span className="text-sm font-bold text-white tracking-tight">
                  {prediction.symbol.slice(0, 3)}
                </span>
              </div>
              {/* Live indicator */}
              <div className="absolute -top-1 -right-1 w-3 h-3">
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
                <span className="absolute inset-0 rounded-full bg-emerald-500" />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white text-lg leading-tight">
                {prediction.symbol}
              </h3>
              <p className="text-gray-500 text-xs mt-0.5 truncate max-w-[120px]">
                {prediction.name}
              </p>
            </div>
          </div>

          {/* Neural Pulse Confidence */}
          <NeuralPulse
            confidence={prediction.confidence}
            signal={prediction.signal}
            size="sm"
          />
        </div>

        {/* Signal Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
              bg-gradient-to-r ${config.bgGradient}
              border ${config.borderColor}
            `}
          >
            <SignalIcon className={`w-4 h-4 ${config.textColor}`} />
            <span className={`text-sm font-bold ${config.textColor}`}>
              {config.label}
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <Clock className="w-3 h-3" />
            <span>{prediction.timeframe}</span>
          </div>
        </div>

        {/* Price Prediction */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Current</p>
            <p className="font-mono text-lg text-gray-200">
              {formatCurrency(prediction.currentPrice)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Target</p>
            <p className={`font-mono text-lg font-semibold ${config.textColor}`}>
              {formatCurrency(prediction.predictedPrice)}
            </p>
          </div>
        </div>

        {/* Price Target Range */}
        <div className="relative h-2 bg-obsidian-800 rounded-full mb-4 overflow-hidden">
          <motion.div
            className={`absolute inset-y-0 left-0 rounded-full ${config.rangeGradient}`}
            initial={{ width: 0 }}
            animate={{ width: `${currentPricePercent}%` }}
            transition={{ delay: 0.3 + index * 0.08, duration: 0.8 }}
          />
          {/* Target marker */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-1 h-4 rounded-full"
            style={{
              left: `${targetPricePercent}%`,
              background: config.markerColor,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.08 }}
          />
        </div>

        {/* Expected Return */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-obsidian-900/60 mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-400">Expected Return</span>
          </div>
          <span className={`font-mono text-sm font-semibold ${config.textColor}`}>
            {priceChange >= 0 ? '+' : ''}
            {priceChangePercent.toFixed(1)}%
          </span>
        </div>

        {/* Indicators Row */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            {/* RSI */}
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-gray-400">
                RSI:{' '}
                <span
                  className={`font-mono ${
                    prediction.indicators.rsi > 70
                      ? 'text-crimson-400'
                      : prediction.indicators.rsi < 30
                      ? 'text-emerald-400'
                      : 'text-gray-300'
                  }`}
                >
                  {prediction.indicators.rsi.toFixed(0)}
                </span>
              </span>
            </div>

            {/* Momentum */}
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-gray-400">
                Mom:{' '}
                <span
                  className={`font-mono ${
                    prediction.indicators.momentum > 0.3
                      ? 'text-emerald-400'
                      : prediction.indicators.momentum < -0.3
                      ? 'text-crimson-400'
                      : 'text-gray-300'
                  }`}
                >
                  {(prediction.indicators.momentum * 100).toFixed(0)}%
                </span>
              </span>
            </div>
          </div>

          {/* Updated time */}
          <span className="text-gray-600">{timeSinceUpdate}m ago</span>
        </div>
      </div>
    </motion.div>
  )
}
