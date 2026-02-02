import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import type { PerformanceDataPoint, BenchmarkIndexId } from '../types'
import { BENCHMARK_INDICES } from '../types'
import { formatCompact } from '../hooks/useAnimatedNumber'
import { useState } from 'react'
import { IndexSelector } from './IndexSelector'

interface PerformanceChartProps {
  data: PerformanceDataPoint[]
}

type TimeRange = '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL'

const timeRanges: TimeRange[] = ['1W', '1M', '3M', '6M', '1Y', 'ALL']

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string; color: string }>
  label?: string
  selectedIndices: BenchmarkIndexId[]
}

function CustomTooltip({ active, payload, label, selectedIndices }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  // Find portfolio value
  const portfolioPayload = payload.find(p => p.dataKey === 'value')

  // Get index info helper
  const getIndexInfo = (dataKey: string) => {
    return BENCHMARK_INDICES.find(idx => idx.id === dataKey)
  }

  return (
    <div className="glass-card p-4 border border-obsidian-500/50 min-w-[180px]">
      <p className="text-gray-400 text-xs font-mono mb-3">{label}</p>
      <div className="space-y-2">
        {/* Portfolio always first */}
        {portfolioPayload && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-gray-400 text-xs">Portfolio</span>
            </div>
            <span className="text-emerald-400 font-mono font-medium text-sm">
              {formatCompact(portfolioPayload.value)}
            </span>
          </div>
        )}

        {/* Divider if indices selected */}
        {selectedIndices.length > 0 && (
          <div className="border-t border-obsidian-600/50 my-2" />
        )}

        {/* Selected indices */}
        {payload
          .filter(p => p.dataKey !== 'value' && selectedIndices.includes(p.dataKey as BenchmarkIndexId))
          .map(p => {
            const indexInfo = getIndexInfo(p.dataKey)
            if (!indexInfo) return null
            return (
              <div key={p.dataKey} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: indexInfo.color }}
                  />
                  <span className="text-gray-400 text-xs">{indexInfo.shortName}</span>
                </div>
                <span
                  className="font-mono font-medium text-sm"
                  style={{ color: indexInfo.color }}
                >
                  {formatCompact(p.value)}
                </span>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const [activeRange, setActiveRange] = useState<TimeRange>('1Y')
  const [selectedIndices, setSelectedIndices] = useState<BenchmarkIndexId[]>(['sp500'])

  const filterDataByRange = (range: TimeRange): PerformanceDataPoint[] => {
    const now = new Date()
    const cutoff = new Date()

    switch (range) {
      case '1W':
        cutoff.setDate(now.getDate() - 7)
        break
      case '1M':
        cutoff.setMonth(now.getMonth() - 1)
        break
      case '3M':
        cutoff.setMonth(now.getMonth() - 3)
        break
      case '6M':
        cutoff.setMonth(now.getMonth() - 6)
        break
      case '1Y':
      case 'ALL':
        return data
    }

    return data.filter(d => new Date(d.date) >= cutoff)
  }

  const filteredData = filterDataByRange(activeRange)
  const startValue = filteredData[0]?.value || 0

  // Get index info by ID
  const getIndexById = (id: BenchmarkIndexId) => {
    return BENCHMARK_INDICES.find(idx => idx.id === id)
  }

  // Generate gradient definitions for selected indices
  const generateGradients = () => {
    return selectedIndices.map(indexId => {
      const index = getIndexById(indexId)
      if (!index) return null
      return (
        <linearGradient key={indexId} id={`gradient-${indexId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={index.color} stopOpacity={0.15} />
          <stop offset="100%" stopColor={index.color} stopOpacity={0} />
        </linearGradient>
      )
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="glass-card p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-display text-xl text-white">Performance</h2>
          <p className="text-gray-500 text-sm mt-1">
            Portfolio vs {selectedIndices.length === 0
              ? 'benchmarks'
              : selectedIndices.length === 1
              ? getIndexById(selectedIndices[0])?.name
              : `${selectedIndices.length} indices`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Index Selector */}
          <IndexSelector
            selectedIndices={selectedIndices}
            onSelectionChange={setSelectedIndices}
            maxSelections={4}
          />

          {/* Time Range Selector */}
          <div className="flex items-center gap-1 p-1 bg-obsidian-800 rounded-xl">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setActiveRange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeRange === range
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-obsidian-700'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              {/* Portfolio gradient */}
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="50%" stopColor="#10b981" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              {/* Dynamic index gradients */}
              {generateGradients()}
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#282a31"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 11 }}
              tickFormatter={(date) => {
                const d = new Date(date)
                return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              }}
              tickMargin={10}
              interval="preserveStartEnd"
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 11 }}
              tickFormatter={(value) => formatCompact(value)}
              tickMargin={10}
              domain={['dataMin - 20000', 'dataMax + 20000']}
            />

            <Tooltip
              content={<CustomTooltip selectedIndices={selectedIndices} />}
            />

            <ReferenceLine
              y={startValue}
              stroke="#3d4049"
              strokeDasharray="4 4"
            />

            {/* Render benchmark areas - behind portfolio */}
            {selectedIndices.map((indexId, i) => {
              const index = getIndexById(indexId)
              if (!index) return null
              return (
                <Area
                  key={indexId}
                  type="monotone"
                  dataKey={indexId}
                  stroke={index.color}
                  strokeWidth={1.5}
                  fill={`url(#gradient-${indexId})`}
                  animationDuration={1500}
                  animationBegin={300 + i * 100}
                />
              )
            })}

            {/* Portfolio area - always on top */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#portfolioGradient)"
              animationDuration={1500}
              animationBegin={0}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-obsidian-700/50 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-sm text-gray-400">Portfolio</span>
        </div>
        {selectedIndices.map(indexId => {
          const index = getIndexById(indexId)
          if (!index) return null
          return (
            <div key={indexId} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: index.color }}
              />
              <span className="text-sm text-gray-400">{index.name}</span>
            </div>
          )
        })}
        {selectedIndices.length === 0 && (
          <span className="text-sm text-gray-500 italic">Select indices to compare</span>
        )}
      </div>
    </motion.div>
  )
}
