import { motion } from 'framer-motion'
import { ChevronDown, AlertTriangle, Clock } from 'lucide-react'
import { useState } from 'react'
import type { TaxLot, WashSaleWarning, TaxLotsSummary } from '../../types/portfolio'

interface TaxLotsPanelProps {
  lots: TaxLot[]
  washSaleWarnings?: WashSaleWarning[]
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function calculateSummary(lots: TaxLot[]): TaxLotsSummary {
  const longTermLots = lots.filter((l) => l.isLongTerm)
  const shortTermLots = lots.filter((l) => !l.isLongTerm)

  return {
    totalGain: lots.reduce((sum, l) => sum + l.gainLoss, 0),
    longTermGains: longTermLots.reduce((sum, l) => sum + l.gainLoss, 0),
    shortTermGains: shortTermLots.reduce((sum, l) => sum + l.gainLoss, 0),
    estimatedTaxIfSold: lots.reduce((sum, l) => sum + l.estimatedTax, 0),
  }
}

export function TaxLotsPanel({ lots, washSaleWarnings }: TaxLotsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (lots.length === 0) {
    return null
  }

  const summary = calculateSummary(lots)

  return (
    <div className="mt-2">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-1.5 px-2 py-1.5 text-[11px] rounded transition-all ${
          isExpanded
            ? 'text-emerald-400 bg-obsidian-700/50'
            : 'text-gray-500 hover:text-gray-400 hover:bg-obsidian-700/30'
        }`}
      >
        <ChevronDown
          className={`w-3 h-3 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
        <span>View {lots.length} tax lot{lots.length !== 1 ? 's' : ''}</span>
      </button>

      {/* Lots Table */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-2 p-3 bg-obsidian-900 border border-obsidian-700 rounded-lg"
        >
          {/* Header */}
          <div className="grid grid-cols-[1fr_0.8fr_0.8fr_0.8fr_1.2fr] gap-2 pb-2 border-b border-obsidian-700 mb-2">
            <span className="text-[10px] uppercase tracking-wide text-gray-500 font-medium">
              Date
            </span>
            <span className="text-[10px] uppercase tracking-wide text-gray-500 font-medium">
              Shares
            </span>
            <span className="text-[10px] uppercase tracking-wide text-gray-500 font-medium">
              Cost
            </span>
            <span className="text-[10px] uppercase tracking-wide text-gray-500 font-medium">
              Value
            </span>
            <span className="text-[10px] uppercase tracking-wide text-gray-500 font-medium text-right">
              Gain/Loss
            </span>
          </div>

          {/* Lot Rows */}
          {lots.map((lot) => (
            <div
              key={lot.id}
              className="grid grid-cols-[1fr_0.8fr_0.8fr_0.8fr_1.2fr] gap-2 py-2 border-b border-dashed border-obsidian-700 last:border-b-0 font-mono text-[11px]"
            >
              <div className="text-gray-400">
                <div>{formatDate(lot.purchaseDate)}</div>
                {!lot.isLongTerm && lot.daysToLongTerm && (
                  <div
                    className={`flex items-center gap-1 mt-0.5 text-[10px] ${
                      lot.daysToLongTerm <= 90 ? 'text-gold-400' : 'text-gray-500'
                    }`}
                  >
                    <Clock className="w-2.5 h-2.5" />
                    <span>{lot.daysToLongTerm} days to LT</span>
                  </div>
                )}
              </div>
              <span className="text-white">{lot.shares}</span>
              <span className="text-gray-400">
                ${lot.costBasis.toLocaleString()}
              </span>
              <span className="text-white">
                ${lot.currentValue.toLocaleString()}
              </span>
              <div className="text-right">
                <div
                  className={`flex items-center justify-end gap-1 ${
                    lot.gainLoss >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  <span>
                    {lot.gainLoss >= 0 ? '+' : ''}$
                    {Math.abs(lot.gainLoss).toLocaleString()} (
                    {lot.gainLoss >= 0 ? '+' : ''}
                    {lot.gainLossPercent.toFixed(0)}%)
                  </span>
                  <span
                    className={`px-1 py-0.5 text-[9px] font-semibold rounded ${
                      lot.isLongTerm
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-orange-500/15 text-orange-400'
                    }`}
                  >
                    {lot.isLongTerm ? 'LT' : 'ST'}
                  </span>
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">
                  Est. tax:{' '}
                  <span
                    className={lot.taxRate <= 0.15 ? 'text-emerald-400' : 'text-red-400'}
                  >
                    ${lot.estimatedTax.toLocaleString()}
                  </span>{' '}
                  ({(lot.taxRate * 100).toFixed(0)}%)
                </div>
              </div>
            </div>
          ))}

          {/* Wash Sale Warnings */}
          {washSaleWarnings && washSaleWarnings.length > 0 && (
            <div className="mt-3 space-y-2">
              {washSaleWarnings.map((warning, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg"
                >
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-red-400">
                    <strong>Wash Sale Alert:</strong> You sold{' '}
                    {warning.sharesAmount} {warning.symbol} shares at a loss on{' '}
                    {formatDate(warning.saleDate)}. Buying within 30 days (until{' '}
                    {formatDate(warning.windowEndDate)}) will trigger wash sale
                    rules.
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Summary Footer */}
          <div className="flex justify-between mt-3 pt-3 border-t border-obsidian-700 text-[11px]">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] uppercase tracking-wide text-gray-500">
                Total Gain
              </span>
              <span
                className={`font-mono font-medium ${
                  summary.totalGain >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {summary.totalGain >= 0 ? '+' : ''}$
                {Math.abs(summary.totalGain).toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] uppercase tracking-wide text-gray-500">
                LT Gains
              </span>
              <span
                className={`font-mono font-medium ${
                  summary.longTermGains >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {summary.longTermGains >= 0 ? '+' : ''}$
                {Math.abs(summary.longTermGains).toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] uppercase tracking-wide text-gray-500">
                ST Gains
              </span>
              <span
                className={`font-mono font-medium ${
                  summary.shortTermGains >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {summary.shortTermGains >= 0 ? '+' : ''}$
                {Math.abs(summary.shortTermGains).toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] uppercase tracking-wide text-gray-500">
                Est. Tax If Sold
              </span>
              <span className="font-mono font-medium text-red-400">
                ${summary.estimatedTaxIfSold.toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
