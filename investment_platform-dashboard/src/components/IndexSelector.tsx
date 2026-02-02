import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, X, TrendingUp } from 'lucide-react'
import { BENCHMARK_INDICES, type BenchmarkIndexId, type BenchmarkIndex } from '../types'

interface IndexSelectorProps {
  selectedIndices: BenchmarkIndexId[]
  onSelectionChange: (indices: BenchmarkIndexId[]) => void
  maxSelections?: number
}

export function IndexSelector({
  selectedIndices,
  onSelectionChange,
  maxSelections = 4,
}: IndexSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleIndex = (indexId: BenchmarkIndexId) => {
    if (selectedIndices.includes(indexId)) {
      onSelectionChange(selectedIndices.filter(id => id !== indexId))
    } else if (selectedIndices.length < maxSelections) {
      onSelectionChange([...selectedIndices, indexId])
    }
  }

  const removeIndex = (indexId: BenchmarkIndexId, e: React.MouseEvent) => {
    e.stopPropagation()
    onSelectionChange(selectedIndices.filter(id => id !== indexId))
  }

  const getIndexById = (id: BenchmarkIndexId): BenchmarkIndex | undefined => {
    return BENCHMARK_INDICES.find(idx => idx.id === id)
  }

  // Group indices by region
  const groupedIndices = {
    US: BENCHMARK_INDICES.filter(idx => idx.region === 'US'),
    International: BENCHMARK_INDICES.filter(idx => idx.region === 'International'),
    Emerging: BENCHMARK_INDICES.filter(idx => idx.region === 'Emerging'),
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-obsidian-800 border border-obsidian-600/50 rounded-xl hover:border-obsidian-500 transition-colors"
      >
        <TrendingUp className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-300">
          {selectedIndices.length === 0
            ? 'Compare with...'
            : `${selectedIndices.length} ${selectedIndices.length === 1 ? 'index' : 'indices'}`}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Selected Tags */}
      {selectedIndices.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selectedIndices.map(indexId => {
            const index = getIndexById(indexId)
            if (!index) return null
            return (
              <motion.span
                key={indexId}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium"
                style={{
                  backgroundColor: `${index.color}20`,
                  color: index.color,
                  border: `1px solid ${index.color}40`,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: index.color }}
                />
                {index.shortName}
                <button
                  onClick={(e) => removeIndex(indexId, e)}
                  className="ml-0.5 hover:opacity-70 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            )
          })}
        </div>
      )}

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-72 bg-obsidian-800 border border-obsidian-600/50 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-obsidian-700/50">
              <p className="text-xs text-gray-400">
                Select up to {maxSelections} indices to compare
              </p>
            </div>

            {/* Index Groups */}
            <div className="max-h-80 overflow-y-auto">
              {Object.entries(groupedIndices).map(([region, indices]) => (
                <div key={region}>
                  <div className="px-4 py-2 bg-obsidian-900/50">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {region === 'US' ? '🇺🇸 US Markets' : region === 'International' ? '🌍 International' : '🌏 Emerging Markets'}
                    </span>
                  </div>
                  {indices.map(index => {
                    const isSelected = selectedIndices.includes(index.id)
                    const isDisabled = !isSelected && selectedIndices.length >= maxSelections

                    return (
                      <button
                        key={index.id}
                        onClick={() => !isDisabled && toggleIndex(index.id)}
                        disabled={isDisabled}
                        className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors ${
                          isSelected
                            ? 'bg-obsidian-700/50'
                            : isDisabled
                            ? 'opacity-40 cursor-not-allowed'
                            : 'hover:bg-obsidian-700/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: index.color }}
                          />
                          <div className="text-left">
                            <p className="text-sm text-white font-medium">{index.name}</p>
                            <p className="text-xs text-gray-500">{index.description}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-emerald-400" />
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>

            {/* Footer */}
            {selectedIndices.length > 0 && (
              <div className="px-4 py-2 border-t border-obsidian-700/50 bg-obsidian-900/30">
                <button
                  onClick={() => onSelectionChange([])}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Clear all selections
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
