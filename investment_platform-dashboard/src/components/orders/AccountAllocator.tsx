import { useCallback } from 'react'
import type { OrderAllocation } from '../../types/orders'

interface AccountAllocatorProps {
  allocations: OrderAllocation[]
  totalShares: number
  totalPrincipal: number
  onChange: (allocations: OrderAllocation[]) => void
}

export function AccountAllocator({
  allocations,
  totalShares,
  totalPrincipal,
  onChange,
}: AccountAllocatorProps) {
  const handlePercentageChange = useCallback((index: number, newPercentage: number) => {
    // Clamp percentage between 0 and 100
    const clampedPercentage = Math.max(0, Math.min(100, newPercentage))

    // Calculate remaining percentage to distribute
    const oldPercentage = allocations[index].percentage
    const diff = clampedPercentage - oldPercentage

    // If only one account, it must be 100%
    if (allocations.length === 1) {
      const updated = [...allocations]
      updated[0] = {
        ...updated[0],
        percentage: 100,
        shares: totalShares,
        principal: totalPrincipal,
      }
      onChange(updated)
      return
    }

    // Distribute the difference proportionally among other accounts
    const otherAllocations = allocations.filter((_, i) => i !== index)
    const otherTotal = otherAllocations.reduce((sum, a) => sum + a.percentage, 0)

    const updated = allocations.map((alloc, i) => {
      if (i === index) {
        return {
          ...alloc,
          percentage: clampedPercentage,
          shares: (clampedPercentage / 100) * totalShares,
          principal: (clampedPercentage / 100) * totalPrincipal,
        }
      } else {
        // Proportionally adjust other allocations
        const proportion = otherTotal > 0 ? alloc.percentage / otherTotal : 1 / (allocations.length - 1)
        const newPct = Math.max(0, alloc.percentage - (diff * proportion))
        return {
          ...alloc,
          percentage: newPct,
          shares: (newPct / 100) * totalShares,
          principal: (newPct / 100) * totalPrincipal,
        }
      }
    })

    // Normalize to ensure total is 100%
    const total = updated.reduce((sum, a) => sum + a.percentage, 0)
    if (total !== 100 && total > 0) {
      const factor = 100 / total
      updated.forEach(a => {
        a.percentage *= factor
        a.shares = (a.percentage / 100) * totalShares
        a.principal = (a.percentage / 100) * totalPrincipal
      })
    }

    onChange(updated)
  }, [allocations, totalShares, totalPrincipal, onChange])

  if (allocations.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        No accounts available for this security
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {allocations.map((alloc, index) => (
        <div key={alloc.accountId} className="flex items-center gap-4">
          {/* Account label */}
          <div className="w-32 flex-shrink-0">
            <div className="font-medium text-white text-sm">{alloc.brokerShortName}</div>
            <div className="text-xs text-gray-500">{alloc.accountType}</div>
          </div>

          {/* Slider */}
          <div className="flex-1">
            <div className="relative h-2 bg-obsidian-700 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
                style={{ width: `${alloc.percentage}%` }}
              />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={alloc.percentage}
              onChange={(e) => handlePercentageChange(index, parseFloat(e.target.value))}
              className="absolute w-full h-2 opacity-0 cursor-pointer"
              style={{ marginTop: '-8px' }}
            />
          </div>

          {/* Percentage input */}
          <div className="w-16 flex-shrink-0">
            <input
              type="number"
              min="0"
              max="100"
              value={Math.round(alloc.percentage)}
              onChange={(e) => handlePercentageChange(index, parseFloat(e.target.value) || 0)}
              className="w-full px-2 py-1 bg-obsidian-800 border border-obsidian-600 rounded text-white
                         text-sm text-center font-mono focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <span className="text-gray-500 text-sm w-4">%</span>

          {/* Shares display */}
          <div className="w-24 text-right flex-shrink-0">
            <div className="font-mono text-white text-sm">
              {alloc.shares.toFixed(alloc.shares < 1 ? 4 : 2)} sh
            </div>
            <div className="font-mono text-gray-500 text-xs">
              ${alloc.principal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      ))}

      {/* Total row */}
      <div className="flex items-center gap-4 pt-2 border-t border-obsidian-700">
        <div className="w-32 flex-shrink-0 text-sm text-gray-400">Total</div>
        <div className="flex-1" />
        <div className="w-16 text-center font-mono text-emerald-400 text-sm">
          {Math.round(allocations.reduce((sum, a) => sum + a.percentage, 0))}%
        </div>
        <span className="text-gray-500 text-sm w-4" />
        <div className="w-24 text-right flex-shrink-0">
          <div className="font-mono text-emerald-400 text-sm">
            {totalShares.toFixed(totalShares < 1 ? 4 : 2)} sh
          </div>
          <div className="font-mono text-gray-400 text-xs">
            ${totalPrincipal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  )
}
