import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import type { PortfolioView } from '../../types/portfolio'

interface ViewSelectorProps {
  views: PortfolioView[]
  activeViewId: string
  onViewChange: (viewId: string) => void
  onCreateView?: () => void
}

export function ViewSelector({
  views,
  activeViewId,
  onViewChange,
  onCreateView,
}: ViewSelectorProps) {
  return (
    <div className="flex gap-1 bg-obsidian-800 p-1 rounded-xl border border-obsidian-600">
      {views.map((view, index) => (
        <motion.button
          key={view.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onViewChange(view.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeViewId === view.id
              ? 'bg-emerald-500 text-white shadow-emerald-glow'
              : 'text-gray-400 hover:text-white hover:bg-obsidian-700'
          }`}
        >
          {view.name}
        </motion.button>
      ))}
      {onCreateView && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: views.length * 0.05 }}
          onClick={onCreateView}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-obsidian-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New View</span>
        </motion.button>
      )}
    </div>
  )
}
