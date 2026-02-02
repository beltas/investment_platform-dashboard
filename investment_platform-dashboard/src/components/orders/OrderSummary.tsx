import { useMemo } from 'react'
import { AlertTriangle } from 'lucide-react'
import type { OrderFormData, OrderAllocation } from '../../types/orders'
import { calculateCommission } from '../../utils/ordersMockData'

interface OrderSummaryProps {
  formData: OrderFormData
  price: number
}

export function OrderSummary({ formData, price }: OrderSummaryProps) {
  const summary = useMemo(() => {
    const { shares, principal, allocations, side } = formData

    // Calculate commissions per account
    const accountSummaries = allocations.map((alloc: OrderAllocation) => {
      const commission = calculateCommission(alloc.brokerId, alloc.shares)
      return {
        ...alloc,
        commission,
        total: side === 'buy'
          ? alloc.principal + commission
          : alloc.principal - commission,
      }
    })

    const totalCommission = accountSummaries.reduce((sum, a) => sum + a.commission, 0)
    const estimatedTotal = side === 'buy'
      ? principal + totalCommission
      : principal - totalCommission

    return {
      accountSummaries,
      totalCommission,
      estimatedTotal,
      shares,
      principal,
    }
  }, [formData, price])

  const hasValidOrder = summary.shares > 0 && summary.accountSummaries.length > 0

  if (!hasValidOrder) {
    return (
      <div className="bg-obsidian-800/50 rounded-lg p-4 text-center text-gray-500 text-sm">
        Enter quantity to see order summary
      </div>
    )
  }

  return (
    <div className="bg-obsidian-800/50 rounded-lg p-4 space-y-3">
      <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
        Order Summary
      </h4>

      {/* Per-account breakdown */}
      {summary.accountSummaries.length > 1 && (
        <div className="space-y-2 pb-3 border-b border-obsidian-700">
          {summary.accountSummaries.map((acct) => (
            <div key={acct.accountId} className="flex justify-between text-sm">
              <span className="text-gray-400">
                {acct.brokerShortName} {acct.accountType}
              </span>
              <span className="text-white font-mono">
                ${acct.principal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                {acct.commission > 0 && (
                  <span className="text-gray-500 text-xs ml-1">
                    +${acct.commission.toFixed(2)}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Totals */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Subtotal</span>
          <span className="text-white font-mono">
            ${summary.principal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Est. Commission</span>
          <span className="text-white font-mono">
            ${summary.totalCommission.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-base pt-2 border-t border-obsidian-700">
          <span className="text-white font-medium">
            Est. {formData.side === 'buy' ? 'Cost' : 'Proceeds'}
          </span>
          <span className={`font-mono font-bold ${formData.side === 'buy' ? 'text-red-400' : 'text-emerald-400'}`}>
            ${summary.estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Market order warning */}
      {formData.orderType === 'market' && (
        <div className="flex items-start gap-2 mt-3 p-2 bg-yellow-500/10 rounded-lg">
          <AlertTriangle size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-500/90">
            Market orders execute at the current market price, which may differ from the displayed price.
          </p>
        </div>
      )}

      {/* Limit/Stop price display */}
      {formData.orderType === 'limit' && formData.limitPrice && (
        <div className="flex justify-between text-sm text-gray-400">
          <span>Limit Price</span>
          <span className="font-mono text-white">${formData.limitPrice.toFixed(2)}</span>
        </div>
      )}
      {formData.orderType === 'stop' && formData.stopPrice && (
        <div className="flex justify-between text-sm text-gray-400">
          <span>Stop Price</span>
          <span className="font-mono text-white">${formData.stopPrice.toFixed(2)}</span>
        </div>
      )}
    </div>
  )
}
