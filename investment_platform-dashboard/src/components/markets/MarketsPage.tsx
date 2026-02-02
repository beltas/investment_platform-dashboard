import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { MARKETS_TABS, MarketsTabId } from '../../types/markets'
import { TabSelector } from './TabSelector'
import { IndicesTab } from './indices/IndicesTab'
import { NewsTab } from './news/NewsTab'
import { EconomicDataTab } from './economic/EconomicDataTab'

export function MarketsPage() {
  const [activeTab, setActiveTab] = useState<MarketsTabId>('indices')
  const [lastUpdated] = useState(new Date())

  const renderTabContent = () => {
    switch (activeTab) {
      case 'indices':
        return <IndicesTab />
      case 'news':
        return <NewsTab />
      case 'economic':
        return <EconomicDataTab />
      default:
        return null
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Markets</h1>
          <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
            <RefreshCw size={12} />
            Last updated: {lastUpdated.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })}
          </p>
        </div>
        <TabSelector
          tabs={MARKETS_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
