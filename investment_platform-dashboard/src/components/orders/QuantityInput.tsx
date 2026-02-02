import { useEffect, useState, useCallback } from 'react'
import { DollarSign, Hash } from 'lucide-react'

interface QuantityInputProps {
  shares: number
  principal: number
  price: number
  onSharesChange: (shares: number) => void
  onPrincipalChange: (principal: number) => void
}

export function QuantityInput({
  shares,
  principal,
  price,
  onSharesChange,
  onPrincipalChange,
}: QuantityInputProps) {
  const [sharesInput, setSharesInput] = useState(shares.toString())
  const [principalInput, setPrincipalInput] = useState(principal.toFixed(2))
  const [lastEdited, setLastEdited] = useState<'shares' | 'principal'>('shares')

  // Sync inputs when props change from external source
  useEffect(() => {
    if (lastEdited !== 'shares') {
      setSharesInput(shares > 0 ? shares.toString() : '')
    }
    if (lastEdited !== 'principal') {
      setPrincipalInput(principal > 0 ? principal.toFixed(2) : '')
    }
  }, [shares, principal, lastEdited])

  const handleSharesChange = useCallback((value: string) => {
    setSharesInput(value)
    setLastEdited('shares')

    const numShares = parseFloat(value) || 0
    onSharesChange(numShares)

    // Auto-calculate principal
    const newPrincipal = numShares * price
    setPrincipalInput(newPrincipal > 0 ? newPrincipal.toFixed(2) : '')
    onPrincipalChange(newPrincipal)
  }, [price, onSharesChange, onPrincipalChange])

  const handlePrincipalChange = useCallback((value: string) => {
    setPrincipalInput(value)
    setLastEdited('principal')

    const numPrincipal = parseFloat(value) || 0
    onPrincipalChange(numPrincipal)

    // Auto-calculate shares
    const newShares = price > 0 ? numPrincipal / price : 0
    setSharesInput(newShares > 0 ? newShares.toFixed(4).replace(/\.?0+$/, '') : '')
    onSharesChange(newShares)
  }, [price, onSharesChange, onPrincipalChange])

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Shares Input */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Shares</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <Hash size={16} />
          </div>
          <input
            type="text"
            inputMode="decimal"
            value={sharesInput}
            onChange={(e) => handleSharesChange(e.target.value)}
            placeholder="0"
            className="w-full pl-10 pr-4 py-3 bg-obsidian-800 border border-obsidian-600 rounded-lg
                       text-white font-mono text-lg focus:outline-none focus:border-emerald-500/50
                       focus:ring-1 focus:ring-emerald-500/20 transition-colors"
          />
        </div>
      </div>

      {/* Principal Input */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Principal</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <DollarSign size={16} />
          </div>
          <input
            type="text"
            inputMode="decimal"
            value={principalInput}
            onChange={(e) => handlePrincipalChange(e.target.value)}
            placeholder="0.00"
            className="w-full pl-10 pr-4 py-3 bg-obsidian-800 border border-obsidian-600 rounded-lg
                       text-white font-mono text-lg focus:outline-none focus:border-emerald-500/50
                       focus:ring-1 focus:ring-emerald-500/20 transition-colors"
          />
        </div>
      </div>

      {/* Price indicator */}
      <div className="col-span-2 text-center text-xs text-gray-500">
        Current price: <span className="text-gray-400 font-mono">${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
    </div>
  )
}
