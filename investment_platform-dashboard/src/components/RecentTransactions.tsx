import { motion } from 'framer-motion'
import type { Transaction } from '../types'
import { ArrowUpRight, ArrowDownRight, Coins, Clock } from 'lucide-react'
import { formatCurrency } from '../hooks/useAnimatedNumber'

interface RecentTransactionsProps {
  transactions: Transaction[]
}

const typeConfig = {
  BUY: {
    icon: ArrowDownRight,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    label: 'Bought',
  },
  SELL: {
    icon: ArrowUpRight,
    color: 'text-crimson-400',
    bg: 'bg-crimson-500/10',
    label: 'Sold',
  },
  DIVIDEND: {
    icon: Coins,
    color: 'text-gold-400',
    bg: 'bg-gold-500/10',
    label: 'Dividend',
  },
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="glass-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gold-500/10">
            <Clock className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <h2 className="font-display text-xl text-white">Recent Activity</h2>
            <p className="text-gray-500 text-sm">Last 7 days</p>
          </div>
        </div>
        <button className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
          View All
        </button>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {transactions.map((transaction, index) => {
          const config = typeConfig[transaction.type]
          const Icon = config.icon

          return (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.05, duration: 0.3 }}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-obsidian-700/30 transition-colors cursor-pointer group"
            >
              {/* Icon */}
              <div className={`p-2.5 rounded-xl ${config.bg}`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${config.color}`}>
                    {config.label}
                  </span>
                  <span className="text-white font-medium">
                    {transaction.symbol}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{transaction.quantity} shares</span>
                  <span>•</span>
                  <span>@ {formatCurrency(transaction.price)}</span>
                </div>
              </div>

              {/* Amount & Date */}
              <div className="text-right">
                <p className={`font-mono text-sm font-medium ${
                  transaction.type === 'SELL' || transaction.type === 'DIVIDEND'
                    ? 'text-emerald-400'
                    : 'text-white'
                }`}>
                  {transaction.type === 'SELL' || transaction.type === 'DIVIDEND' ? '+' : '-'}
                  {formatCurrency(transaction.total)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(transaction.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
