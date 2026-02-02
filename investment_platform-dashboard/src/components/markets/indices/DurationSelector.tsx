import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, X } from 'lucide-react'

export type Duration = '1D' | '1W' | '1M' | '6M' | '1Y' | '2Y' | '5Y' | 'custom'

export interface CustomDateRange {
  startDate: string
  endDate: string
}

interface DurationSelectorProps {
  selected: Duration
  onSelect: (duration: Duration) => void
  customRange?: CustomDateRange
  onCustomRangeChange?: (range: CustomDateRange) => void
}

const durations: { id: Duration; label: string }[] = [
  { id: '1D', label: '1D' },
  { id: '1W', label: '1W' },
  { id: '1M', label: '1M' },
  { id: '6M', label: '6M' },
  { id: '1Y', label: '1Y' },
  { id: '2Y', label: '2Y' },
  { id: '5Y', label: '5Y' },
  { id: 'custom', label: 'Custom' },
]

export function DurationSelector({
  selected,
  onSelect,
  customRange,
  onCustomRangeChange,
}: DurationSelectorProps) {
  const [showCustomPicker, setShowCustomPicker] = useState(false)
  const [tempStartDate, setTempStartDate] = useState(customRange?.startDate || '')
  const [tempEndDate, setTempEndDate] = useState(customRange?.endDate || '')

  const handleDurationClick = (duration: Duration) => {
    if (duration === 'custom') {
      setShowCustomPicker(true)
    } else {
      setShowCustomPicker(false)
      onSelect(duration)
    }
  }

  const handleApplyCustomRange = () => {
    if (tempStartDate && tempEndDate && onCustomRangeChange) {
      onCustomRangeChange({ startDate: tempStartDate, endDate: tempEndDate })
      onSelect('custom')
      setShowCustomPicker(false)
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-1 bg-obsidian-800/50 rounded-lg p-1">
        {durations.map((duration) => (
          <button
            key={duration.id}
            onClick={() => handleDurationClick(duration.id)}
            className="relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
          >
            {selected === duration.id && (
              <motion.div
                layoutId="activeDuration"
                className="absolute inset-0 bg-emerald-600/30 border border-emerald-500/50 rounded-md"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 flex items-center gap-1 ${
                selected === duration.id ? 'text-emerald-400' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {duration.id === 'custom' && <Calendar size={14} />}
              {duration.label}
            </span>
          </button>
        ))}
      </div>

      {/* Custom date range display */}
      {selected === 'custom' && customRange && (
        <div className="mt-2 text-xs text-gray-400">
          {new Date(customRange.startDate).toLocaleDateString()} -{' '}
          {new Date(customRange.endDate).toLocaleDateString()}
        </div>
      )}

      {/* Custom date picker modal */}
      <AnimatePresence>
        {showCustomPicker && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 p-4 bg-obsidian-800 border border-obsidian-600
                       rounded-lg shadow-xl z-30 min-w-[280px]"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-white">Custom Date Range</h4>
              <button
                onClick={() => setShowCustomPicker(false)}
                className="p-1 hover:bg-obsidian-700 rounded transition-colors text-gray-400"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={tempStartDate}
                  onChange={(e) => setTempStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-obsidian-900 border border-obsidian-600 rounded-lg
                           text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End Date</label>
                <input
                  type="date"
                  value={tempEndDate}
                  onChange={(e) => setTempEndDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 bg-obsidian-900 border border-obsidian-600 rounded-lg
                           text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                onClick={handleApplyCustomRange}
                disabled={!tempStartDate || !tempEndDate}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-obsidian-700
                         disabled:text-gray-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Apply Range
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
