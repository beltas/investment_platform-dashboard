import { useMemo } from 'react'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { FedDotPlotPoint } from '../../../types/markets'

interface DotPlotChartProps {
  data: FedDotPlotPoint[]
  meetingName: string
}

// Custom tooltip for dot plot
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null

  const data = payload[0].payload
  return (
    <div className="bg-obsidian-800 border border-obsidian-600 rounded-lg p-3 shadow-xl">
      <p className="text-white font-medium mb-1">
        {data.year === 2030 ? 'Longer Run' : data.year}
      </p>
      <p className="text-sm text-gray-400">
        Rate: <span className="text-emerald-400 font-mono">{data.rate.toFixed(2)}%</span>
      </p>
      <p className="text-sm text-gray-400">
        Officials: <span className="text-white">{data.count}</span>
      </p>
    </div>
  )
}

export function DotPlotChart({ data, meetingName }: DotPlotChartProps) {
  // Get unique years from data and determine axis range
  const { years, processedData, medians, yDomain } = useMemo(() => {
    const uniqueYears = [...new Set(data.map(d => d.year))].sort((a, b) => a - b)

    // Calculate Y domain from data
    const rates = data.map(d => d.rate)
    const minRate = Math.min(...rates)
    const maxRate = Math.max(...rates)
    const yPadding = 0.25
    const yDomain: [number, number] = [
      Math.floor((minRate - yPadding) * 4) / 4,
      Math.ceil((maxRate + yPadding) * 4) / 4
    ]

    // Process data for scatter chart - expand counts into individual points
    const processed: any[] = []
    data.forEach(point => {
      // Create multiple points based on count, with slight x-offset for visibility
      for (let i = 0; i < point.count; i++) {
        const offset = (i - point.count / 2) * 0.03
        processed.push({
          x: point.year + offset,
          rate: point.rate,
          year: point.year,
          count: point.count,
        })
      }
    })

    // Calculate medians for reference lines
    const medianData = uniqueYears.map(year => {
      const yearData = data.filter(d => d.year === year)
      if (yearData.length === 0) return null

      // Weighted median calculation
      const expanded: number[] = []
      yearData.forEach(d => {
        for (let i = 0; i < d.count; i++) {
          expanded.push(d.rate)
        }
      })
      expanded.sort((a, b) => a - b)
      const mid = Math.floor(expanded.length / 2)
      const median = expanded.length % 2
        ? expanded[mid]
        : (expanded[mid - 1] + expanded[mid]) / 2

      return { year, median }
    }).filter(Boolean) as { year: number; median: number }[]

    return {
      years: uniqueYears,
      processedData: processed,
      medians: medianData,
      yDomain,
    }
  }, [data])

  // Calculate X domain
  const xDomain = useMemo(() => {
    if (years.length === 0) return [2024, 2030]
    const minYear = Math.min(...years)
    const maxYear = Math.max(...years)
    return [minYear - 0.5, maxYear + 0.5]
  }, [years])

  // Generate Y-axis ticks
  const yTicks = useMemo(() => {
    const ticks: number[] = []
    for (let rate = yDomain[0]; rate <= yDomain[1]; rate += 0.25) {
      ticks.push(Math.round(rate * 100) / 100)
    }
    return ticks
  }, [yDomain])

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis
            type="number"
            dataKey="x"
            domain={xDomain}
            ticks={years}
            tickFormatter={(value) => value === 2030 ? 'Long Run' : value.toString()}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            axisLine={{ stroke: '#4b5563' }}
          />
          <YAxis
            type="number"
            dataKey="rate"
            domain={yDomain}
            ticks={yTicks}
            tickFormatter={(value) => `${value.toFixed(2)}%`}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            axisLine={{ stroke: '#4b5563' }}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Median reference lines */}
          {medians.map((m) => (
            <ReferenceLine
              key={m.year}
              segment={[
                { x: m.year - 0.35, y: m.median },
                { x: m.year + 0.35, y: m.median }
              ]}
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="4 4"
            />
          ))}

          {/* Dot plot points */}
          <Scatter
            name={meetingName}
            data={processedData}
            fill="#10b981"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
