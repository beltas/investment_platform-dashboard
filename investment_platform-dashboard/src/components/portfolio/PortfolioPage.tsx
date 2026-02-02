import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Download, Filter, Command, Option, Plus } from 'lucide-react'
import { ViewSelector } from './ViewSelector'
import { TotalSummary } from './TotalSummary'
import { BentoGrid } from './BentoGrid'
import { OrderModal } from '../orders/OrderModal'
import {
  portfolioSummary,
  portfolioViews,
  bentoCardConfig,
} from '../../utils/portfolioMockData'
import type { OrderPrefill, OrderModalState } from '../../types/orders'

export function PortfolioPage() {
  const [activeViewId, setActiveViewId] = useState('all-assets')
  const [orderModal, setOrderModal] = useState<OrderModalState>({ isOpen: false })

  // Handle opening order modal from position right-click
  const handleCreateOrder = useCallback((prefill: OrderPrefill) => {
    setOrderModal({ isOpen: true, prefill })
  }, [])

  // Handle closing order modal
  const handleCloseOrderModal = useCallback(() => {
    setOrderModal({ isOpen: false })
  }, [])

  // Format last synced time
  const lastSyncedAt = new Date(portfolioSummary.lastSyncedAt)
  const minutesAgo = Math.round(
    (Date.now() - lastSyncedAt.getTime()) / (1000 * 60)
  )

  return (
    <div className="p-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white tracking-tight mb-1">
              Portfolio
            </h1>
            <p className="text-gray-400 text-sm">
              All assets across {portfolioSummary.brokerCount} brokers • Last synced{' '}
              {minutesAgo} min ago
            </p>
          </div>

          {/* View Selector and Actions */}
          <div className="flex items-center gap-4">
            <ViewSelector
              views={portfolioViews}
              activeViewId={activeViewId}
              onViewChange={setActiveViewId}
              onCreateView={() => {
                // TODO: Open create view modal
                console.log('Create new view')
              }}
            />
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-obsidian-800 border border-obsidian-600/50 text-gray-300 hover:text-white hover:border-obsidian-500 transition-colors">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filter</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-obsidian-800 border border-obsidian-600/50 text-gray-300 hover:text-white hover:border-obsidian-500 transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export</span>
              </button>
              <button
                onClick={() => setOrderModal({ isOpen: true })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Create Order</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-obsidian-800 border border-obsidian-600/50 text-gray-300 hover:text-white hover:border-obsidian-500 transition-colors">
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm font-medium">Sync</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Total Summary with Allocation */}
      <TotalSummary
        totalValue={portfolioSummary.totalValue}
        dayChange={portfolioSummary.dayChange}
        dayChangePercent={portfolioSummary.dayChangePercent}
        allocation={portfolioSummary.allocation}
      />

      {/* Bento Grid of Asset Classes */}
      <BentoGrid
        assetClasses={portfolioSummary.assetClasses}
        cardConfig={bentoCardConfig}
        onCreateOrder={handleCreateOrder}
      />

      {/* Keyboard shortcuts hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-8 text-center text-gray-500 text-xs"
      >
        Click any position to see account breakdown •{' '}
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-obsidian-700 font-mono">
          <Command className="w-3 h-3" />
          <span>+</span>
          <span>drag</span>
        </span>{' '}
        to resize cards •{' '}
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-obsidian-700 font-mono">
          <Option className="w-3 h-3" />
          <span>+</span>
          <span>click</span>
        </span>{' '}
        to expand card
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-8 pt-6 border-t border-obsidian-700/30"
      >
        <div className="flex items-center justify-between text-xs text-gray-500">
          <p>
            © 2024 Agora Investment Platform • Built by{' '}
            <span className="text-emerald-400">Periklis Beltas</span>
          </p>
          <div className="flex items-center gap-4">
            <span>Market data delayed 15 minutes</span>
            <span>•</span>
            <span>
              Last updated:{' '}
              {new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
      </motion.footer>

      {/* Order Modal */}
      <OrderModal
        isOpen={orderModal.isOpen}
        prefill={orderModal.prefill}
        onClose={handleCloseOrderModal}
      />
    </div>
  )
}
