import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { MarketIndex } from '../../../types/markets'
import { useState } from 'react'

interface IndexDetailModalProps {
  index: MarketIndex | null
  onClose: () => void
}

type TimeRange = '7D' | '1M' | '3M' | '6M' | '1Y'

const timeRanges: TimeRange[] = ['7D', '1M', '3M', '6M', '1Y']

// Generate extended data based on sparkline pattern
function generateExtendedData(sparklineData: number[], range: TimeRange): { date: string; value: number }[] {
  const days = {
    '7D': 7,
    '1M': 30,
    '3M': 90,
    '6M': 180,
    '1Y': 365
  }[range]

  const result: { date: string; value: number }[] = []
  const today = new Date()

  // Use the sparkline as a base pattern and extend it
  const baseValue = sparklineData[0] || 100
  const volatility = 0.005

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Create some variation based on position
    const progress = (days - i) / days
    const patternIndex = Math.floor((i / days) * sparklineData.length) % sparklineData.length
    const patternValue = sparklineData[patternIndex] || baseValue
    const randomVariation = (Math.random() - 0.5) * baseValue * volatility

    result.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: patternValue + randomVariation + (progress * baseValue * 0.02)
    })
  }

  return result
}

export function IndexDetailModal({ index, onClose }: IndexDetailModalProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('1M')

  if (!index) return null

  const chartData = generateExtendedData(index.sparklineData, timeRange)
  const isPositive = index.change >= 0

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="glass-card p-6 w-full max-w-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm text-gray-500 font-mono">{index.symbol}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  index.region === 'US'
                    ? 'bg-blue-500/20 text-blue-400'
                    : index.region === 'International'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-orange-500/20 text-orange-400'
                }`}>
                  {index.region}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-white">{index.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-obsidian-700 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-3xl font-bold text-white">
              {index.value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
            <span className={`text-lg font-medium ${
              isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {isPositive ? '+' : ''}{index.change.toFixed(2)}
              ({isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%)
            </span>
          </div>

          {/* Time range selector */}
          <div className="flex gap-2 mb-4">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/50'
                    : 'bg-obsidian-700/50 text-gray-400 hover:text-gray-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                  tickLine={{ stroke: '#4b5563' }}
                  axisLine={{ stroke: '#4b5563' }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                  tickLine={{ stroke: '#4b5563' }}
                  axisLine={{ stroke: '#4b5563' }}
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value: number) => [value.toFixed(2), index.name]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? '#10b981' : '#ef4444'}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: isPositive ? '#10b981' : '#ef4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
