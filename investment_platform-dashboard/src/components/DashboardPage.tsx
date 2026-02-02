import { motion } from 'framer-motion'
import {
  MetricCard,
  HoldingsTable,
  PerformanceChart,
  PredictionsPanel,
  RecentTransactions,
} from './index'
import {
  portfolioMetrics,
  positions,
  predictions,
  performanceData,
  recentTransactions,
} from '../utils/mockData'
import {
  Wallet,
  TrendingUp,
  PiggyBank,
  Target,
  RefreshCw,
  Download,
  Filter,
} from 'lucide-react'

export function DashboardPage() {
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
            <h1 className="font-display text-4xl font-bold text-white tracking-tight mb-2">
              Good morning, Periklis
            </h1>
            <p className="text-gray-400">
              Here's your portfolio overview for{' '}
              <span className="text-white">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-obsidian-800 border border-obsidian-600/50 text-gray-300 hover:text-white hover:border-obsidian-500 transition-colors">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-obsidian-800 border border-obsidian-600/50 text-gray-300 hover:text-white hover:border-obsidian-500 transition-colors">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Portfolio Value"
          value={portfolioMetrics.totalValue}
          change={portfolioMetrics.dayChange}
          changePercent={portfolioMetrics.dayChangePercent}
          format="currency"
          icon={<Wallet className="w-5 h-5" />}
          delay={0}
          accentColor="emerald"
        />
        <MetricCard
          title="Total Return"
          value={portfolioMetrics.totalReturn}
          changePercent={portfolioMetrics.totalReturnPercent}
          format="currency"
          icon={<TrendingUp className="w-5 h-5" />}
          delay={100}
          accentColor="emerald"
          subtitle="All time"
        />
        <MetricCard
          title="Invested Value"
          value={portfolioMetrics.investedValue}
          format="currency"
          icon={<Target className="w-5 h-5" />}
          delay={200}
          accentColor="gold"
        />
        <MetricCard
          title="Cash Balance"
          value={portfolioMetrics.cashBalance}
          format="currency"
          icon={<PiggyBank className="w-5 h-5" />}
          delay={300}
          accentColor="blue"
          subtitle="Available to invest"
        />
      </div>

      {/* Main Grid - Charts and Predictions */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Performance Chart - Takes 2 columns */}
        <div className="col-span-2">
          <PerformanceChart data={performanceData} />
        </div>

        {/* Predictions Panel */}
        <div className="col-span-1">
          <PredictionsPanel predictions={predictions} />
        </div>
      </div>

      {/* Holdings and Transactions */}
      <div className="grid grid-cols-3 gap-6">
        {/* Holdings Table - Takes 2 columns */}
        <div className="col-span-2">
          <HoldingsTable positions={positions} />
        </div>

        {/* Recent Transactions */}
        <div className="col-span-1">
          <RecentTransactions transactions={recentTransactions} />
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-12 pt-6 border-t border-obsidian-700/30"
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
    </div>
  )
}
