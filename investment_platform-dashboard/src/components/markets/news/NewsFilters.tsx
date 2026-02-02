import { motion } from 'framer-motion'
import { NewsFilter } from '../../../types/markets'

interface NewsFiltersProps {
  activeFilter: NewsFilter
  onFilterChange: (filter: NewsFilter) => void
}

const filters: { id: NewsFilter; label: string; description?: string }[] = [
  { id: 'all', label: 'All News' },
  { id: 'holdings', label: 'Portfolio Holdings', description: 'News about your securities' },
  { id: 'market', label: 'Market News', description: 'General market & macro' },
  { id: 'earnings', label: 'Earnings', description: 'Reports & analyst ratings' }
]

export function NewsFilters({ activeFilter, onFilterChange }: NewsFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className="relative"
        >
          {activeFilter === filter.id && (
            <motion.div
              layoutId="activeNewsFilter"
              className="absolute inset-0 bg-emerald-600/30 border border-emerald-500/50 rounded-full"
              initial={false}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className={`
            relative z-10 px-4 py-2 text-sm rounded-full inline-block transition-colors
            ${activeFilter === filter.id
              ? 'text-emerald-400'
              : 'text-gray-400 hover:text-gray-200 bg-obsidian-700/50 hover:bg-obsidian-700'
            }
          `}>
            {filter.label}
          </span>
        </button>
      ))}
    </div>
  )
}
