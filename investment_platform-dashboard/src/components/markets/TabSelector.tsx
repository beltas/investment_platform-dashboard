import { motion } from 'framer-motion'
import { MarketsTab, MarketsTabId } from '../../types/markets'

interface TabSelectorProps {
  tabs: MarketsTab[]
  activeTab: MarketsTabId
  onTabChange: (tabId: MarketsTabId) => void
}

export function TabSelector({ tabs, activeTab, onTabChange }: TabSelectorProps) {
  return (
    <div className="flex space-x-1 bg-obsidian-800/50 rounded-lg p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            relative px-4 py-2 text-sm font-medium rounded-md transition-colors
            ${activeTab === tab.id
              ? 'text-white'
              : 'text-gray-400 hover:text-gray-200'
            }
          `}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-emerald-600/30 border border-emerald-500/50 rounded-md"
              initial={false}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
