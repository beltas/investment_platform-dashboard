import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { SymbolSearch } from './SymbolSearch'
import { OrderTypeSelector } from './OrderTypeSelector'
import { QuantityInput } from './QuantityInput'
import { AllocationPresetSelect } from './AllocationPresetSelect'
import { AccountAllocator } from './AccountAllocator'
import { OrderSummary } from './OrderSummary'
import { getSecurityPrice } from '../../utils/ordersMockData'
import { brokers } from '../../utils/portfolioMockData'
import type {
  OrderFormData,
  OrderSide,
  OrderType,
  OrderPrefill,
  SecurityPrice,
  OrderAllocation,
  AllocationPreset,
} from '../../types/orders'

interface OrderFormProps {
  prefill?: OrderPrefill
  onSubmit: (data: OrderFormData) => void
  onCancel: () => void
}

export function OrderForm({ prefill, onSubmit, onCancel }: OrderFormProps) {
  // Form state
  const [selectedSecurity, setSelectedSecurity] = useState<SecurityPrice | undefined>(
    prefill ? getSecurityPrice(prefill.symbol) : undefined
  )
  const [side, setSide] = useState<OrderSide>(prefill?.side || 'buy')
  const [orderType, setOrderType] = useState<OrderType>('market')
  const [shares, setShares] = useState(0)
  const [principal, setPrincipal] = useState(0)
  const [limitPrice, setLimitPrice] = useState<number | undefined>()
  const [stopPrice, setStopPrice] = useState<number | undefined>()
  const [presetId, setPresetId] = useState('manual')
  const [allocations, setAllocations] = useState<OrderAllocation[]>([])

  // Get current price
  const currentPrice = selectedSecurity?.price || 0

  // Initialize allocations when security or prefill changes
  useEffect(() => {
    if (!selectedSecurity) {
      setAllocations([])
      return
    }

    // If prefill has accounts, use those
    if (prefill?.accounts && prefill.accounts.length > 0) {
      const initialAllocations: OrderAllocation[] = prefill.accounts.map((acc) => {
        const broker = brokers.find(b => b.id === acc.brokerId)
        const percentage = 100 / prefill.accounts.length
        return {
          accountId: acc.accountId,
          brokerId: acc.brokerId,
          brokerName: broker?.name || acc.brokerName,
          brokerShortName: broker?.shortName || acc.brokerShortName,
          accountType: acc.accountType,
          percentage,
          shares: (percentage / 100) * shares,
          principal: (percentage / 100) * principal,
        }
      })
      setAllocations(initialAllocations)
    } else {
      // Default: create single allocation for first available broker
      const defaultBroker = brokers[0]
      setAllocations([{
        accountId: `${defaultBroker.id}-margin`,
        brokerId: defaultBroker.id,
        brokerName: defaultBroker.name,
        brokerShortName: defaultBroker.shortName,
        accountType: 'Margin',
        percentage: 100,
        shares: shares,
        principal: principal,
      }])
    }
  }, [selectedSecurity, prefill])

  // Update allocations when shares/principal changes
  useEffect(() => {
    if (allocations.length === 0) return

    setAllocations(prev => prev.map(alloc => ({
      ...alloc,
      shares: (alloc.percentage / 100) * shares,
      principal: (alloc.percentage / 100) * principal,
    })))
  }, [shares, principal])

  // Handle preset selection
  const handlePresetChange = useCallback((preset: AllocationPreset) => {
    setPresetId(preset.id)

    if (preset.id === 'manual' || preset.allocations.length === 0) {
      return // Keep current manual allocations
    }

    // Apply preset allocations
    const newAllocations: OrderAllocation[] = preset.allocations.map(pa => {
      const broker = brokers.find(b => b.id === pa.brokerId)
      return {
        accountId: pa.accountId,
        brokerId: pa.brokerId,
        brokerName: broker?.name || '',
        brokerShortName: broker?.shortName || '',
        accountType: 'Margin',
        percentage: pa.percentage,
        shares: (pa.percentage / 100) * shares,
        principal: (pa.percentage / 100) * principal,
      }
    })
    setAllocations(newAllocations)
  }, [shares, principal])

  // Handle security selection
  const handleSecurityChange = useCallback((security: SecurityPrice) => {
    setSelectedSecurity(security)
    setLimitPrice(security.price)
    setStopPrice(security.price)
  }, [])

  // Build form data for submission
  const formData: OrderFormData = useMemo(() => ({
    symbol: selectedSecurity?.symbol || '',
    name: selectedSecurity?.name || '',
    side,
    orderType,
    shares,
    principal,
    limitPrice: orderType === 'limit' ? limitPrice : undefined,
    stopPrice: orderType === 'stop' ? stopPrice : undefined,
    allocations,
    usePreset: presetId !== 'manual',
    presetId: presetId !== 'manual' ? presetId : undefined,
  }), [selectedSecurity, side, orderType, shares, principal, limitPrice, stopPrice, allocations, presetId])

  // Validation
  const isValid = useMemo(() => {
    if (!selectedSecurity) return false
    if (shares <= 0) return false
    if (allocations.length === 0) return false
    if (orderType === 'limit' && (!limitPrice || limitPrice <= 0)) return false
    if (orderType === 'stop' && (!stopPrice || stopPrice <= 0)) return false
    return true
  }, [selectedSecurity, shares, allocations, orderType, limitPrice, stopPrice])

  const handleSubmit = () => {
    if (isValid) {
      onSubmit(formData)
    }
  }

  return (
    <div className="space-y-6">
      {/* Symbol Search */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Symbol</label>
        <SymbolSearch
          value={selectedSecurity?.symbol || ''}
          selectedSecurity={selectedSecurity}
          onChange={handleSecurityChange}
          disabled={!!prefill}
        />
      </div>

      {/* Buy/Sell Toggle */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setSide('buy')}
          className={`py-3 rounded-lg font-semibold text-sm transition-all ${
            side === 'buy'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
              : 'bg-obsidian-800 text-gray-400 hover:text-white hover:bg-obsidian-700'
          }`}
        >
          BUY
        </button>
        <button
          onClick={() => setSide('sell')}
          className={`py-3 rounded-lg font-semibold text-sm transition-all ${
            side === 'sell'
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
              : 'bg-obsidian-800 text-gray-400 hover:text-white hover:bg-obsidian-700'
          }`}
        >
          SELL
        </button>
      </div>

      {/* Order Type */}
      <OrderTypeSelector selected={orderType} onChange={setOrderType} />

      {/* Quantity Inputs */}
      <QuantityInput
        shares={shares}
        principal={principal}
        price={currentPrice}
        onSharesChange={setShares}
        onPrincipalChange={setPrincipal}
      />

      {/* Limit/Stop Price */}
      {orderType === 'limit' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <label className="block text-sm text-gray-400 mb-2">Limit Price</label>
          <input
            type="number"
            step="0.01"
            value={limitPrice || ''}
            onChange={(e) => setLimitPrice(parseFloat(e.target.value) || undefined)}
            placeholder="0.00"
            className="w-full px-4 py-3 bg-obsidian-800 border border-obsidian-600 rounded-lg
                       text-white font-mono focus:outline-none focus:border-emerald-500/50"
          />
        </motion.div>
      )}
      {orderType === 'stop' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <label className="block text-sm text-gray-400 mb-2">Stop Price</label>
          <input
            type="number"
            step="0.01"
            value={stopPrice || ''}
            onChange={(e) => setStopPrice(parseFloat(e.target.value) || undefined)}
            placeholder="0.00"
            className="w-full px-4 py-3 bg-obsidian-800 border border-obsidian-600 rounded-lg
                       text-white font-mono focus:outline-none focus:border-emerald-500/50"
          />
        </motion.div>
      )}

      {/* Account Allocation Section */}
      <div className="border-t border-obsidian-700 pt-6">
        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
          Account Allocation
        </h4>
        <AllocationPresetSelect selectedId={presetId} onChange={handlePresetChange} />
        <div className="mt-4">
          <AccountAllocator
            allocations={allocations}
            totalShares={shares}
            totalPrincipal={principal}
            onChange={setAllocations}
          />
        </div>
      </div>

      {/* Order Summary */}
      <div className="border-t border-obsidian-700 pt-6">
        <OrderSummary formData={formData} price={currentPrice} />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 py-3 px-4 rounded-lg font-medium text-gray-400 bg-obsidian-800
                     hover:bg-obsidian-700 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
            isValid
              ? side === 'buy'
                ? 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/25'
                : 'bg-red-500 text-white hover:bg-red-400 shadow-lg shadow-red-500/25'
              : 'bg-obsidian-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          {side === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
        </button>
      </div>
    </div>
  )
}
