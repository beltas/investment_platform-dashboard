import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { X } from 'lucide-react'
import { MarketIndex } from '../../../types/markets'
import { generateIndexTimeSeries, getIndexPeriodChange } from '../../../utils/marketsMockData'
import type { Duration, CustomDateRange } from './DurationSelector'

interface IndexCardProps {
  index: MarketIndex
  duration: Duration
  customRange?: CustomDateRange
  onRemove: (id: string) => void
}

// Custom tooltip
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="bg-obsidian-800 border border-obsidian-600 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-medium text-white">
        {payload[0].value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
    </div>
  )
}

export function IndexCard({ index, duration, customRange, onRemove }: IndexCardProps) {
  // Generate time series data based on duration
  const chartData = useMemo(() => {
    return generateIndexTimeSeries(
      index.id,
      duration,
      customRange?.startDate,
      customRange?.endDate
    )
  }, [index.id, duration, customRange])

  // Calculate period change
  const periodChange = useMemo(() => {
    return getIndexPeriodChange(
      index.id,
      duration,
      customRange?.startDate,
      customRange?.endDate
    )
  }, [index.id, duration, customRange])

  const isPositive = periodChange.change >= 0
  const currentValue = chartData.length > 0 ? chartData[chartData.length - 1].value : index.value

  // Calculate Y-axis domain with padding
  const yDomain = useMemo(() => {
    if (chartData.length === 0) return ['auto', 'auto']
    const values = chartData.map(d => d.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const padding = (max - min) * 0.1
    return [min - padding, max + padding]
  }, [chartData])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ boxShadow: '0 8px 30px rgba(16, 185, 129, 0.1)' }}
      className="glass-card p-4 group relative"
    >
      {/* Remove button */}
      <button
        onClick={() => onRemove(index.id)}
        className="absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100
                   hover:bg-obsidian-700 transition-all text-gray-500 hover:text-gray-300 z-10"
      >
        <X size={14} />
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-mono">{index.symbol}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${
              index.region === 'US'
                ? 'bg-blue-500/20 text-blue-400'
                : index.region === 'International'
                ? 'bg-purple-500/20 text-purple-400'
                : 'bg-orange-500/20 text-orange-400'
            }`}>
              {index.region}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-300 truncate max-w-[180px]">
            {index.name}
          </h3>
        </div>
      </div>

      {/* Value and Change */}
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-xl font-bold text-white">
          {currentValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
        <div className="text-right">
          <span className={`text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{periodChange.change.toFixed(2)}
          </span>
          <span className={`text-xs ml-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            ({isPositive ? '+' : ''}{periodChange.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Time Series Chart */}
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id={`gradient-${index.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={isPositive ? '#10b981' : '#ef4444'}
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor={isPositive ? '#10b981' : '#ef4444'}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fill: '#6b7280', fontSize: 9 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={30}
            />
            <YAxis
              domain={yDomain as [number, number]}
              tick={{ fill: '#6b7280', fontSize: 9 }}
              tickLine={false}
              axisLine={false}
              width={45}
              tickFormatter={(value) => {
                if (value >= 10000) return `${(value / 1000).toFixed(0)}k`
                if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
                return value.toFixed(value < 10 ? 2 : 0)
              }}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={isPositive ? '#10b981' : '#ef4444'}
              strokeWidth={1.5}
              fill={`url(#gradient-${index.id})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
