import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, TrendingUp, TrendingDown } from 'lucide-react'
import { searchSecurities } from '../../utils/ordersMockData'
import type { SecurityPrice } from '../../types/orders'

interface SymbolSearchProps {
  value: string
  selectedSecurity?: SecurityPrice
  onChange: (security: SecurityPrice) => void
  disabled?: boolean
}

export function SymbolSearch({ value, selectedSecurity, onChange, disabled }: SymbolSearchProps) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<SecurityPrice[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Search when query changes
  useEffect(() => {
    if (query.length >= 1 && !disabled) {
      const found = searchSecurities(query)
      setResults(found)
      setIsOpen(found.length > 0)
      setHighlightIndex(0)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [query, disabled])

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

  const handleSelect = (security: SecurityPrice) => {
    onChange(security)
    setQuery(security.symbol)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightIndex((i) => Math.min(i + 1, results.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightIndex((i) => Math.max(i - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (results[highlightIndex]) {
          handleSelect(results[highlightIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  const isPositive = selectedSecurity ? selectedSecurity.changePercent >= 0 : true

  return (
    <div ref={containerRef} className="relative">
      <div className={`relative ${disabled ? 'opacity-60' : ''}`}>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          <Search size={18} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 1 && results.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Search symbol or name..."
          className="w-full pl-10 pr-4 py-3 bg-obsidian-800 border border-obsidian-600 rounded-lg
                     text-white font-mono focus:outline-none focus:border-emerald-500/50
                     focus:ring-1 focus:ring-emerald-500/20 transition-colors
                     disabled:cursor-not-allowed"
        />
        {selectedSecurity && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className="text-sm text-gray-400">{selectedSecurity.name}</span>
            <span className={`flex items-center gap-1 text-sm font-mono ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              ${selectedSecurity.price.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-obsidian-800 border border-obsidian-600
                       rounded-lg shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto"
          >
            {results.map((security, index) => {
              const positive = security.changePercent >= 0
              return (
                <button
                  key={security.symbol}
                  onClick={() => handleSelect(security)}
                  className={`w-full px-4 py-3 flex items-center justify-between hover:bg-obsidian-700
                             transition-colors text-left ${index === highlightIndex ? 'bg-obsidian-700' : ''}`}
                >
                  <div>
                    <span className="font-mono font-semibold text-white">{security.symbol}</span>
                    <span className="text-sm text-gray-500 ml-2">{security.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-white">${security.price.toLocaleString()}</div>
                    <div className={`text-xs font-mono ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
                      {positive ? '+' : ''}{security.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
