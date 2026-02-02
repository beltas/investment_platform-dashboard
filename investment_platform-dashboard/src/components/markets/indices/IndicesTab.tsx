import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ChevronDown } from 'lucide-react'
import { MarketIndex, AVAILABLE_INDICES } from '../../../types/markets'
import { marketIndices } from '../../../utils/marketsMockData'
import { IndexCard } from './IndexCard'
import { DurationSelector, Duration, CustomDateRange } from './DurationSelector'

const MAX_INDICES = 12

export function IndicesTab() {
  const [selectedIndices, setSelectedIndices] = useState<string[]>([
    'sp500', 'nasdaq', 'dowjones', 'russell2000', 'ftse100', 'dax'
  ])
  const [showSelector, setShowSelector] = useState(false)
  const [duration, setDuration] = useState<Duration>('1M')
  const [customRange, setCustomRange] = useState<CustomDateRange | undefined>()

  // Get full market data for selected indices
  const displayedIndices = selectedIndices
    .map(id => marketIndices.find(mi => mi.id === id))
    .filter((mi): mi is MarketIndex => mi !== undefined)

  const availableToAdd = AVAILABLE_INDICES.filter(
    idx => !selectedIndices.includes(idx.id)
  )

  const handleAddIndex = (id: string) => {
    if (selectedIndices.length < MAX_INDICES) {
      setSelectedIndices([...selectedIndices, id])
    }
    setShowSelector(false)
  }

  const handleRemoveIndex = (id: string) => {
    setSelectedIndices(selectedIndices.filter(i => i !== id))
  }

  const handleDurationChange = (newDuration: Duration) => {
    setDuration(newDuration)
    if (newDuration !== 'custom') {
      setCustomRange(undefined)
    }
  }

  // Group available indices by region
  const groupedAvailable = {
    US: availableToAdd.filter(i => i.region === 'US'),
    International: availableToAdd.filter(i => i.region === 'International'),
    Emerging: availableToAdd.filter(i => i.region === 'Emerging')
  }

  // Duration label for display
  const getDurationLabel = () => {
    switch (duration) {
      case '1D': return 'Today'
      case '1W': return 'Past Week'
      case '1M': return 'Past Month'
      case '6M': return 'Past 6 Months'
      case '1Y': return 'Past Year'
      case '2Y': return 'Past 2 Years'
      case '5Y': return 'Past 5 Years'
      case 'custom': return 'Custom Range'
      default: return ''
    }
  }

  return (
    <div>
      {/* Controls Row */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        {/* Left: Duration selector */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Time Period (applies to all indices)</p>
          <DurationSelector
            selected={duration}
            onSelect={handleDurationChange}
            customRange={customRange}
            onCustomRangeChange={setCustomRange}
          />
        </div>

        {/* Right: Add button and count */}
        <div className="flex items-center gap-4">
          <p className="text-gray-400 text-sm">
            {selectedIndices.length} of {MAX_INDICES} indices
          </p>
          <div className="relative">
            <button
              onClick={() => setShowSelector(!showSelector)}
              disabled={selectedIndices.length >= MAX_INDICES}
              className="flex items-center gap-2 px-3 py-2 bg-emerald-600/20 border border-emerald-500/50
                         text-emerald-400 rounded-lg hover:bg-emerald-600/30 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
              <span className="text-sm">Add Index</span>
              <ChevronDown size={14} className={`transition-transform ${showSelector ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {showSelector && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-72 max-h-80 overflow-y-auto
                             bg-obsidian-800 border border-obsidian-600 rounded-lg shadow-xl z-20"
                >
                  {Object.entries(groupedAvailable).map(([region, indices]) => (
                    indices.length > 0 && (
                      <div key={region}>
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-obsidian-900/50 sticky top-0">
                          {region}
                        </div>
                        {indices.map(idx => (
                          <button
                            key={idx.id}
                            onClick={() => handleAddIndex(idx.id)}
                            className="w-full px-3 py-2 text-left hover:bg-obsidian-700 transition-colors flex items-center justify-between"
                          >
                            <div>
                              <span className="text-sm text-white">{idx.name}</span>
                              <span className="ml-2 text-xs text-gray-500">{idx.symbol}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )
                  ))}
                  {availableToAdd.length === 0 && (
                    <div className="px-3 py-4 text-center text-gray-500 text-sm">
                      All available indices selected
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Period indicator */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          Showing: <span className="text-emerald-400">{getDurationLabel()}</span>
          {duration === 'custom' && customRange && (
            <span className="ml-2 text-gray-400">
              ({new Date(customRange.startDate).toLocaleDateString()} - {new Date(customRange.endDate).toLocaleDateString()})
            </span>
          )}
        </p>
      </div>

      {/* Index Cards Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {displayedIndices.map(index => (
            <IndexCard
              key={index.id}
              index={index}
              duration={duration}
              customRange={customRange}
              onRemove={handleRemoveIndex}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      {displayedIndices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No indices selected</p>
          <button
            onClick={() => setShowSelector(true)}
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Add indices to track
          </button>
        </div>
      )}
    </div>
  )
}
