import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { PortfolioHolding } from '../../types/portfolio'
import type { OrderPrefill } from '../../types/orders'
import { AccountBreakdown } from './AccountBreakdown'

interface HoldingRowProps {
  holding: PortfolioHolding
  onCreateOrder?: (prefill: OrderPrefill) => void
}

export function HoldingRow({ holding, onCreateOrder }: HoldingRowProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isPositive = holding.dayChangePercent >= 0

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onCreateOrder) {
      onCreateOrder({
        symbol: holding.symbol,
        name: holding.name,
        side: 'sell',
        accounts: holding.accounts,
      })
    }
  }

  return (
    <>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        onContextMenu={handleRightClick}
        className={`flex justify-between items-center px-2 py-2.5 mx-[-0.5rem] rounded-lg cursor-pointer transition-all border-b border-obsidian-700 last:border-b-0 ${
          isExpanded
            ? 'bg-obsidian-700 rounded-b-none border-b-0'
            : 'hover:bg-obsidian-700/50'
        }`}
      >
        {/* Left side: Expand icon + Symbol info */}
        <div className="flex items-center gap-3">
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${
              isExpanded ? 'rotate-180 text-emerald-400' : ''
            }`}
          />
          <div>
            <div className="font-mono text-sm font-semibold text-white">
              {holding.symbol}
            </div>
            <div className="text-[11px] text-gray-500">{holding.name}</div>
          </div>
        </div>

        {/* Right side: Value and change */}
        <div className="text-right">
          <div className="font-mono text-sm text-white">
            ${holding.totalValue.toLocaleString()}
          </div>
          <div
            className={`font-mono text-[11px] ${
              isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {isPositive ? '+' : ''}
            {holding.dayChangePercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Expanded Account Breakdown */}
      <AnimatePresence>
        {isExpanded && (
          <AccountBreakdown
            accounts={holding.accounts}
            totalShares={holding.totalShares}
            symbol={holding.symbol}
          />
        )}
      </AnimatePresence>
    </>
  )
}
