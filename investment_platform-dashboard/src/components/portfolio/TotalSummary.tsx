import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { AllocationSegment } from '../../types/portfolio'
import { AnimatedValue } from '../AnimatedValue'

interface TotalSummaryProps {
  totalValue: number
  dayChange: number
  dayChangePercent: number
  allocation: AllocationSegment[]
}

export function TotalSummary({
  totalValue,
  dayChange,
  dayChangePercent,
  allocation,
}: TotalSummaryProps) {
  const isPositive = dayChange >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex gap-8 mb-8 p-6 bg-obsidian-800/60 backdrop-blur-xl border border-obsidian-600 rounded-2xl"
    >
      {/* Total Value */}
      <div className="flex-1">
        <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">
          Total Portfolio Value
        </div>
        <div className="font-mono text-4xl font-semibold text-white">
          <AnimatedValue
            value={totalValue}
            format="currency"
            duration={1000}
          />
        </div>
        <div
          className={`flex items-center gap-1.5 mt-1 font-mono text-sm ${
            isPositive ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>
            {isPositive ? '+' : ''}
            {dayChange.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}{' '}
            ({isPositive ? '+' : ''}
            {dayChangePercent.toFixed(2)}%) today
          </span>
        </div>
      </div>

      {/* Allocation Bar */}
      <div className="flex-[2] flex flex-col justify-center gap-3">
        <div className="h-8 flex rounded-lg overflow-hidden bg-obsidian-700">
          {allocation.map((segment, index) => (
            <motion.div
              key={segment.assetClass}
              initial={{ width: 0 }}
              animate={{ width: `${segment.percentage}%` }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              className="flex items-center justify-center text-[10px] font-semibold text-white cursor-pointer hover:brightness-110 transition-all"
              style={{ backgroundColor: segment.color }}
              title={`${segment.displayName}: ${segment.percentage}%`}
            >
              {segment.percentage >= 8 && `${segment.percentage}%`}
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-400">
          {allocation.map((segment) => (
            <div key={segment.assetClass} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-sm"
                style={{ backgroundColor: segment.color }}
              />
              <span>{segment.displayName}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
