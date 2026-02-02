import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react'
import { EconomicIndicator, IndicatorCategory } from '../../../types/markets'

interface IndicatorTableProps {
  title: string
  category: IndicatorCategory
  indicators: EconomicIndicator[]
}

const categoryIcons = {
  employment: '👷',
  inflation: '💰',
  growth: '📈',
  fed: '🏛️'
}

const categoryColors = {
  employment: 'border-blue-500/30',
  inflation: 'border-yellow-500/30',
  growth: 'border-emerald-500/30',
  fed: 'border-purple-500/30'
}

function SurpriseIndicator({ direction }: { direction: 'beat' | 'miss' | 'inline' }) {
  if (direction === 'beat') {
    return (
      <div className="flex items-center gap-1 text-emerald-400">
        <TrendingUp size={14} />
        <span className="text-xs">Beat</span>
      </div>
    )
  }
  if (direction === 'miss') {
    return (
      <div className="flex items-center gap-1 text-red-400">
        <TrendingDown size={14} />
        <span className="text-xs">Miss</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1 text-gray-500">
      <Minus size={14} />
      <span className="text-xs">Inline</span>
    </div>
  )
}

export function IndicatorTable({ title, category, indicators }: IndicatorTableProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null)

  return (
    <div className={`glass-card overflow-hidden border-l-4 ${categoryColors[category]}`}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-obsidian-700/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{categoryIcons[category]}</span>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <span className="text-xs text-gray-500 bg-obsidian-700 px-2 py-0.5 rounded-full">
            {indicators.length} indicators
          </span>
        </div>
        <ChevronDown
          size={20}
          className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Table */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-t border-b border-obsidian-600 bg-obsidian-900/50">
                    <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Indicator
                    </th>
                    <th className="text-right p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Previous
                    </th>
                    <th className="text-right p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expected
                    </th>
                    <th className="text-right p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actual
                    </th>
                    <th className="text-center p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Surprise
                    </th>
                    <th className="text-right p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {indicators.map((indicator) => (
                    <motion.tr
                      key={indicator.id}
                      onClick={() => setSelectedIndicator(
                        selectedIndicator === indicator.id ? null : indicator.id
                      )}
                      className={`
                        border-b border-obsidian-700/50 cursor-pointer transition-colors
                        ${selectedIndicator === indicator.id
                          ? 'bg-emerald-500/10'
                          : 'hover:bg-obsidian-700/30'
                        }
                        ${indicator.surpriseDirection === 'beat'
                          ? 'bg-emerald-500/5'
                          : indicator.surpriseDirection === 'miss'
                          ? 'bg-red-500/5'
                          : ''
                        }
                      `}
                      whileHover={{ x: 2 }}
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white font-medium">
                            {indicator.name}
                          </span>
                          {indicator.description && (
                            <div className="group relative">
                              <Info size={12} className="text-gray-500" />
                              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block
                                            bg-obsidian-800 border border-obsidian-600 rounded-lg p-2
                                            text-xs text-gray-300 w-48 z-10 shadow-xl">
                                {indicator.description}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-right text-sm text-gray-400 font-mono">
                        {indicator.previous}{indicator.unit}
                      </td>
                      <td className="p-3 text-right text-sm text-gray-400 font-mono">
                        {indicator.expected}{indicator.unit}
                      </td>
                      <td className={`p-3 text-right text-sm font-mono font-medium ${
                        indicator.surpriseDirection === 'beat'
                          ? 'text-emerald-400'
                          : indicator.surpriseDirection === 'miss'
                          ? 'text-red-400'
                          : 'text-white'
                      }`}>
                        {indicator.actual}{indicator.unit}
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center">
                          <SurpriseIndicator direction={indicator.surpriseDirection} />
                        </div>
                      </td>
                      <td className="p-3 text-right text-sm text-gray-500">
                        {new Date(indicator.releaseDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
