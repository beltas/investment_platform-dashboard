import { motion } from 'framer-motion'
import { Brain, TrendingUp, TrendingDown, Minus, Sparkles, Clock } from 'lucide-react'

interface SummaryStatsProps {
  totalPredictions: number
  buySignals: number
  sellSignals: number
  holdSignals: number
  averageConfidence: number
  highConfidencePredictions: number
  nextUpdate: string
}

export function SummaryStats({
  totalPredictions,
  buySignals,
  sellSignals,
  holdSignals,
  averageConfidence,
  highConfidencePredictions,
  nextUpdate,
}: SummaryStatsProps) {
  const nextUpdateTime = new Date(nextUpdate)
  const minutesUntilUpdate = Math.max(
    0,
    Math.round((nextUpdateTime.getTime() - Date.now()) / (1000 * 60))
  )

  const stats = [
    {
      label: 'Total Signals',
      value: totalPredictions,
      icon: Brain,
      color: 'emerald',
      suffix: '',
    },
    {
      label: 'Buy Signals',
      value: buySignals,
      icon: TrendingUp,
      color: 'emerald',
      suffix: '',
    },
    {
      label: 'Sell Signals',
      value: sellSignals,
      icon: TrendingDown,
      color: 'crimson',
      suffix: '',
    },
    {
      label: 'Hold Signals',
      value: holdSignals,
      icon: Minus,
      color: 'gold',
      suffix: '',
    },
    {
      label: 'Avg. Confidence',
      value: Math.round(averageConfidence * 100),
      icon: Sparkles,
      color: 'purple',
      suffix: '%',
    },
    {
      label: 'High Confidence',
      value: highConfidencePredictions,
      icon: Sparkles,
      color: 'cyan',
      suffix: '',
    },
  ]

  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-500/10',
    },
    crimson: {
      bg: 'bg-crimson-500/10',
      border: 'border-crimson-500/20',
      text: 'text-crimson-400',
      glow: 'shadow-crimson-500/10',
    },
    gold: {
      bg: 'bg-gold-500/10',
      border: 'border-gold-500/20',
      text: 'text-gold-400',
      glow: 'shadow-gold-500/10',
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      text: 'text-purple-400',
      glow: 'shadow-purple-500/10',
    },
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      text: 'text-cyan-400',
      glow: 'shadow-cyan-500/10',
    },
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((stat, index) => {
        const colors = colorClasses[stat.color as keyof typeof colorClasses]
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className={`
              relative p-4 rounded-xl overflow-hidden
              bg-obsidian-800/50 border border-obsidian-600/30
              hover:border-obsidian-500/50 transition-all
            `}
          >
            {/* Icon */}
            <div
              className={`
                w-8 h-8 rounded-lg mb-3 flex items-center justify-center
                ${colors.bg} border ${colors.border}
              `}
            >
              <stat.icon className={`w-4 h-4 ${colors.text}`} />
            </div>

            {/* Value */}
            <motion.p
              className={`text-2xl font-bold ${colors.text} font-mono`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.08 }}
            >
              {stat.value}
              {stat.suffix}
            </motion.p>

            {/* Label */}
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </motion.div>
        )
      })}

      {/* Next Update Timer - Special Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="col-span-2 sm:col-span-3 lg:col-span-6 p-4 rounded-xl bg-gradient-to-r from-obsidian-800/50 via-emerald-500/5 to-obsidian-800/50 border border-obsidian-600/30"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Clock className="w-5 h-5 text-emerald-400" />
              <motion.div
                className="absolute inset-0 rounded-full bg-emerald-500/30"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </div>
            <div>
              <p className="text-sm text-white font-medium">Next Model Update</p>
              <p className="text-xs text-gray-500">Models refresh every hour</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-mono text-emerald-400 font-semibold">
              {minutesUntilUpdate} min
            </p>
            <p className="text-xs text-gray-500">
              {nextUpdateTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
