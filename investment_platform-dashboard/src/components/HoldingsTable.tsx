import { motion } from 'framer-motion'
import type { Position } from '../types'
import { formatCurrency, formatPercent } from '../hooks/useAnimatedNumber'

interface HoldingsTableProps {
  positions: Position[]
}

export function HoldingsTable({ positions }: HoldingsTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="glass-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl text-white">Holdings</h2>
          <p className="text-gray-500 text-sm mt-1">{positions.length} positions</p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors">
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="data-table">
          <thead>
            <tr>
              <th className="min-w-[140px]">Asset</th>
              <th className="text-right">Price</th>
              <th className="text-right">Shares</th>
              <th className="text-right">Market Value</th>
              <th className="text-right">Day</th>
              <th className="text-right">Total Return</th>
              <th className="text-right">Weight</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position, index) => (
              <motion.tr
                key={position.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05, duration: 0.4 }}
                className="group cursor-pointer"
              >
                {/* Asset */}
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-obsidian-600 to-obsidian-700 flex items-center justify-center border border-obsidian-500/50 group-hover:border-emerald-500/30 transition-colors">
                      <span className="text-xs font-bold text-gray-300">
                        {position.symbol.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-white group-hover:text-emerald-400 transition-colors">
                        {position.symbol}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-[120px]">
                        {position.name}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td className="text-right text-gray-300">
                  {formatCurrency(position.currentPrice)}
                </td>

                {/* Shares */}
                <td className="text-right text-gray-300">
                  {position.quantity.toLocaleString()}
                </td>

                {/* Market Value */}
                <td className="text-right text-white font-medium">
                  {formatCurrency(position.marketValue)}
                </td>

                {/* Day Change */}
                <td className="text-right">
                  <div className={position.dayChange >= 0 ? 'text-emerald-400' : 'text-crimson-400'}>
                    <span className="block">
                      {position.dayChange >= 0 ? '+' : ''}
                      {formatCurrency(position.dayChange)}
                    </span>
                    <span className="text-xs opacity-75">
                      {formatPercent(position.dayChangePercent)}
                    </span>
                  </div>
                </td>

                {/* Total Return */}
                <td className="text-right">
                  <div className={position.totalReturn >= 0 ? 'text-emerald-400' : 'text-crimson-400'}>
                    <span className="block">
                      {position.totalReturn >= 0 ? '+' : ''}
                      {formatCurrency(position.totalReturn)}
                    </span>
                    <span className="text-xs opacity-75">
                      {formatPercent(position.totalReturnPercent)}
                    </span>
                  </div>
                </td>

                {/* Weight */}
                <td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1.5 bg-obsidian-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${position.weight}%` }}
                        transition={{ delay: 0.6 + index * 0.05, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                      />
                    </div>
                    <span className="text-gray-400 w-12 text-right">
                      {position.weight.toFixed(1)}%
                    </span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
