import { motion } from 'framer-motion'
import type { AccountPosition } from '../../types/portfolio'
import { TaxLotsPanel } from './TaxLotsPanel'

interface AccountBreakdownProps {
  accounts: AccountPosition[]
  totalShares: number
  symbol: string
}

// Broker icon colors mapping
const brokerColors: Record<string, string> = {
  ibkr: 'linear-gradient(135deg, #d32f2f, #b71c1c)',
  degiro: 'linear-gradient(135deg, #0288d1, #01579b)',
  saxo: 'linear-gradient(135deg, #1565c0, #0d47a1)',
  oanda: 'linear-gradient(135deg, #2e7d32, #1b5e20)',
  coinbase: 'linear-gradient(135deg, #1652f0, #0d3ac4)',
  kraken: 'linear-gradient(135deg, #5741d9, #3d2ba8)',
  bullionvault: 'linear-gradient(135deg, #f59e0b, #d97706)',
  polymarket: 'linear-gradient(135deg, #0891b2, #0e7490)',
  kalshi: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
}

export function AccountBreakdown({
  accounts,
  totalShares,
  symbol,
}: AccountBreakdownProps) {
  // Format shares display based on asset class (crypto may have decimals)
  const formatShares = (shares: number) => {
    if (shares < 1) {
      return shares.toFixed(4)
    }
    if (shares < 100 && shares % 1 !== 0) {
      return shares.toFixed(2)
    }
    return shares.toLocaleString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-obsidian-800 border border-obsidian-600 border-t-0 rounded-b-lg mx-[-0.5rem] mb-2 p-3"
    >
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-obsidian-600 mb-2">
        <span className="text-[10px] uppercase tracking-wide text-gray-500 font-medium">
          Positions by Account
        </span>
        <span className="font-mono text-[11px] text-gray-400">
          {formatShares(totalShares)} {symbol.includes('/') ? 'units' : 'shares'} total
        </span>
      </div>

      {/* Account Rows */}
      <div className="space-y-1">
        {accounts.map((account) => (
          <div key={account.accountId} className="flex flex-col">
            <div className="flex justify-between items-center py-2 border-b border-dashed border-obsidian-600 last:border-b-0">
              {/* Broker Info */}
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold text-white"
                  style={{
                    background:
                      brokerColors[account.brokerId] ||
                      'linear-gradient(135deg, #6b7280, #4b5563)',
                  }}
                >
                  {account.brokerShortName}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-white">
                    {account.brokerName}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {account.accountType} • {account.region}
                  </span>
                </div>
              </div>

              {/* Position Info */}
              <div className="flex flex-col items-end">
                <span className="font-mono text-[11px] text-gray-400">
                  {formatShares(account.shares)} shares
                </span>
                <span className="font-mono text-xs font-medium text-white">
                  ${account.currentValue.toLocaleString()}
                </span>
                <span className="font-mono text-[10px] text-gray-500">
                  Avg: ${account.averageCost.toLocaleString()}
                </span>
                <span
                  className={`font-mono text-[10px] ${
                    account.gainLoss >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {account.gainLoss >= 0 ? '+' : ''}$
                  {Math.abs(account.gainLoss).toLocaleString()} (
                  {account.gainLoss >= 0 ? '+' : ''}
                  {account.gainLossPercent.toFixed(0)}%)
                </span>
              </div>
            </div>

            {/* Tax Lots Panel */}
            {account.taxLots.length > 0 && (
              <TaxLotsPanel
                lots={account.taxLots}
                washSaleWarnings={account.washSaleWarnings}
              />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
