import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { SectorPrediction } from '../../types/predictions'

interface SectorSentimentProps {
  sectors: SectorPrediction[]
}

export function SectorSentiment({ sectors }: SectorSentimentProps) {
  const sentimentConfig = {
    bullish: {
      icon: TrendingUp,
      color: 'emerald',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      label: 'Bullish',
    },
    bearish: {
      icon: TrendingDown,
      color: 'crimson',
      bg: 'bg-crimson-500/10',
      border: 'border-crimson-500/30',
      text: 'text-crimson-400',
      label: 'Bearish',
    },
    neutral: {
      icon: Minus,
      color: 'gold',
      bg: 'bg-gold-500/10',
      border: 'border-gold-500/30',
      text: 'text-gold-400',
      label: 'Neutral',
    },
  }

  return (
    <div className="space-y-3">
      {sectors.map((sector, index) => {
        const config = sentimentConfig[sector.sentiment]
        const SentimentIcon = config.icon
        const totalSignals = sector.buySignals + sector.sellSignals + sector.holdSignals || 1

        return (
          <motion.div
            key={sector.sector}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={`
              p-4 rounded-xl
              bg-obsidian-800/50 border border-obsidian-600/30
              hover:border-obsidian-500/50 transition-all
            `}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h4 className="text-white font-medium">{sector.sector}</h4>
                <div
                  className={`
                    inline-flex items-center gap-1 px-2 py-0.5 rounded-md
                    ${config.bg} border ${config.border}
                  `}
                >
                  <SentimentIcon className={`w-3 h-3 ${config.text}`} />
                  <span className={`text-xs font-semibold ${config.text}`}>
                    {config.label}
                  </span>
                </div>
              </div>
              <span className="text-gray-500 text-xs">
                {(sector.averageConfidence * 100).toFixed(0)}% conf.
              </span>
            </div>

            {/* Signal Distribution Bar */}
            <div className="h-2 rounded-full bg-obsidian-900 overflow-hidden flex">
              {sector.buySignals > 0 && (
                <motion.div
                  className="h-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(sector.buySignals / totalSignals) * 100}%` }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                />
              )}
              {sector.holdSignals > 0 && (
                <motion.div
                  className="h-full bg-gold-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(sector.holdSignals / totalSignals) * 100}%` }}
                  transition={{ delay: 0.35 + index * 0.1, duration: 0.5 }}
                />
              )}
              {sector.sellSignals > 0 && (
                <motion.div
                  className="h-full bg-crimson-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(sector.sellSignals / totalSignals) * 100}%` }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                />
              )}
            </div>

            {/* Signal counts */}
            <div className="flex items-center justify-between mt-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-emerald-400">{sector.buySignals} Buy</span>
                <span className="text-gold-400">{sector.holdSignals} Hold</span>
                <span className="text-crimson-400">{sector.sellSignals} Sell</span>
              </div>
              {sector.topPicks.length > 0 && (
                <span className="text-gray-500">
                  Top: {sector.topPicks.join(', ')}
                </span>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
