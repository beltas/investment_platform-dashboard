import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { AssetClassSummary, BentoCardSize } from '../../types/portfolio'
import type { OrderPrefill } from '../../types/orders'
import { HoldingRow } from './HoldingRow'
import { AnimatedValue } from '../AnimatedValue'

interface AssetCardProps {
  assetClass: AssetClassSummary
  size?: BentoCardSize
  delay?: number
  onCreateOrder?: (prefill: OrderPrefill) => void
}

// Accent color classes mapping
const accentColorClasses: Record<
  string,
  { border: string; icon: string; value: string; gradient: string }
> = {
  emerald: {
    border: 'hover:border-emerald-500/30',
    icon: 'bg-emerald-500/15 text-emerald-400',
    value: 'text-emerald-400',
    gradient: 'from-emerald-500 to-emerald-400',
  },
  blue: {
    border: 'hover:border-blue-500/30',
    icon: 'bg-blue-500/15 text-blue-400',
    value: 'text-blue-400',
    gradient: 'from-blue-400 to-blue-300',
  },
  purple: {
    border: 'hover:border-purple-500/30',
    icon: 'bg-purple-500/15 text-purple-400',
    value: 'text-purple-400',
    gradient: 'from-purple-400 to-purple-300',
  },
  orange: {
    border: 'hover:border-orange-500/30',
    icon: 'bg-orange-500/15 text-orange-400',
    value: 'text-orange-400',
    gradient: 'from-orange-400 to-orange-300',
  },
  gold: {
    border: 'hover:border-gold-500/30',
    icon: 'bg-gold-500/15 text-gold-400',
    value: 'text-gold-400',
    gradient: 'from-gold-500 to-gold-400',
  },
  cyan: {
    border: 'hover:border-cyan-500/30',
    icon: 'bg-cyan-500/15 text-cyan-400',
    value: 'text-cyan-400',
    gradient: 'from-cyan-400 to-cyan-300',
  },
}

// Grid span classes for different sizes
const sizeClasses: Record<BentoCardSize, string> = {
  default: '',
  wide: 'col-span-2',
  tall: 'row-span-2',
  large: 'col-span-2 row-span-2',
}

export function AssetCard({
  assetClass,
  size = 'default',
  delay = 0,
  onCreateOrder,
}: AssetCardProps) {
  const colors = accentColorClasses[assetClass.accentColor] || accentColorClasses.emerald
  const isPositive = assetClass.dayChange >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      className={`relative bg-obsidian-800/60 backdrop-blur-xl border border-obsidian-600 rounded-2xl p-5 overflow-hidden transition-all group ${sizeClasses[size]} ${colors.border}`}
    >
      {/* Top accent line on hover */}
      <div
        className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${colors.icon}`}
        >
          {assetClass.icon}
        </div>
        <div className="px-2 py-1 text-[10px] font-medium rounded-full bg-obsidian-700 text-gray-400">
          {assetClass.positionCount} position
          {assetClass.positionCount !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-white mb-0.5">
        {assetClass.displayName}
      </h3>
      <p className="text-xs text-gray-500 mb-4">{assetClass.subtitle}</p>

      {/* Value */}
      <div className={`font-mono text-2xl font-semibold mb-2 ${colors.value}`}>
        <AnimatedValue
          value={assetClass.totalValue}
          format="currency"
          duration={800}
        />
      </div>

      {/* Change */}
      <div
        className={`flex items-center gap-1.5 font-mono text-xs ${
          isPositive ? 'text-emerald-400' : 'text-red-400'
        }`}
      >
        {isPositive ? (
          <TrendingUp className="w-3.5 h-3.5" />
        ) : (
          <TrendingDown className="w-3.5 h-3.5" />
        )}
        <span>
          {isPositive ? '+' : ''}$
          {Math.abs(assetClass.dayChange).toLocaleString()} (
          {isPositive ? '+' : ''}
          {assetClass.dayChangePercent.toFixed(2)}%)
        </span>
      </div>

      {/* Broker Tags */}
      <div className="flex flex-wrap gap-1.5 mt-4">
        {assetClass.brokers.map((broker) => (
          <span
            key={broker}
            className="text-[10px] px-2 py-1 rounded bg-obsidian-700 text-gray-400 border border-obsidian-600"
          >
            {broker}
          </span>
        ))}
      </div>

      {/* Holdings List - only show for larger cards or if few holdings */}
      {(size === 'large' || size === 'tall' || assetClass.holdings.length <= 4) && (
        <div className="mt-4 space-y-0">
          {assetClass.holdings.slice(0, size === 'large' ? 6 : 4).map((holding) => (
            <HoldingRow key={holding.symbol} holding={holding} onCreateOrder={onCreateOrder} />
          ))}
          {assetClass.holdings.length > (size === 'large' ? 6 : 4) && (
            <div className="text-center text-[11px] text-gray-500 pt-2">
              +{assetClass.holdings.length - (size === 'large' ? 6 : 4)} more
              positions
            </div>
          )}
        </div>
      )}

      {/* For default size with many holdings, show compact view */}
      {size === 'default' && assetClass.holdings.length > 4 && (
        <div className="mt-4 flex flex-col gap-1">
          {assetClass.holdings.slice(0, 3).map((holding) => (
            <div
              key={holding.symbol}
              className="flex justify-between items-center py-1"
            >
              <span className="font-mono text-xs text-white">
                {holding.symbol}
              </span>
              <span
                className={`font-mono text-[11px] ${
                  holding.dayChangePercent >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {holding.dayChangePercent >= 0 ? '+' : ''}
                {holding.dayChangePercent.toFixed(2)}%
              </span>
            </div>
          ))}
          <div className="text-center text-[10px] text-gray-500 pt-1">
            +{assetClass.holdings.length - 3} more
          </div>
        </div>
      )}

      {/* Wide card layout for metals */}
      {size === 'wide' && (
        <div className="mt-4 flex gap-6">
          {assetClass.holdings.map((holding) => (
            <div key={holding.symbol} className="flex-1 flex justify-between items-center">
              <div>
                <div className="font-mono text-sm font-semibold text-white">
                  {holding.symbol}
                </div>
                <div className="text-[10px] text-gray-500">
                  {holding.name} ({holding.totalShares} oz)
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm text-white">
                  ${holding.totalValue.toLocaleString()}
                </div>
                <div
                  className={`font-mono text-[11px] ${
                    holding.dayChangePercent >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {holding.dayChangePercent >= 0 ? '+' : ''}
                  {holding.dayChangePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
