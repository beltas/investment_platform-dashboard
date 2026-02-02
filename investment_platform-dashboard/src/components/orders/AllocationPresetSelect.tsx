import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Sliders } from 'lucide-react'
import { allocationPresets } from '../../utils/ordersMockData'
import type { AllocationPreset } from '../../types/orders'

interface AllocationPresetSelectProps {
  selectedId: string
  onChange: (preset: AllocationPreset) => void
}

export function AllocationPresetSelect({ selectedId, onChange }: AllocationPresetSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedPreset = allocationPresets.find(p => p.id === selectedId) || allocationPresets[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm text-gray-400 mb-2">Allocation Preset</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-obsidian-800 border border-obsidian-600
                   rounded-lg text-white hover:border-obsidian-500 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-gray-500" />
          <span>{selectedPreset.name}</span>
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-obsidian-800 border border-obsidian-600
                       rounded-lg shadow-xl z-40 overflow-hidden"
          >
            {allocationPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  onChange(preset)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-3 text-left hover:bg-obsidian-700 transition-colors
                           ${preset.id === selectedId ? 'bg-emerald-500/10 border-l-2 border-emerald-500' : ''}`}
              >
                <div className="font-medium text-white">{preset.name}</div>
                {preset.allocations.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {preset.allocations.map(a => `${a.percentage}%`).join(' / ')}
                  </div>
                )}
                {preset.id === 'manual' && (
                  <div className="text-xs text-gray-500 mt-1">
                    Set custom allocation per account
                  </div>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
