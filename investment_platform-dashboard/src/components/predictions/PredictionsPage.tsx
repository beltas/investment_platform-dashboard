import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Filter,
  SlidersHorizontal,
  RefreshCw,
  Sparkles,
  BarChart3,
  History,
  Signal,
} from 'lucide-react'
import { SignalCard } from './SignalCard'
import { ModelRadar } from './ModelRadar'
import { SectorSentiment } from './SectorSentiment'
import { SummaryStats } from './SummaryStats'
import {
  modelPredictions,
  modelPerformance,
  sectorPredictions,
  predictionSummary,
} from '../../utils/predictionsMockData'
import type { PredictionFilter } from '../../types/predictions'

const tabs = [
  { id: 'overview', label: 'Overview', icon: Brain },
  { id: 'signals', label: 'All Signals', icon: Signal },
  { id: 'models', label: 'Model Performance', icon: BarChart3 },
  { id: 'history', label: 'History', icon: History },
] as const

type TabId = typeof tabs[number]['id']

export function PredictionsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [signalFilter, setSignalFilter] = useState<PredictionFilter>('all')
  const [sortBy, setSortBy] = useState<'confidence' | 'return' | 'symbol'>('confidence')
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Handle refresh - updates timestamp to trigger re-render
  const handleRefresh = () => {
    setLastRefresh(new Date())
  }

  // Filter and sort predictions
  const filteredPredictions = useMemo(() => {
    let filtered = [...modelPredictions]

    // Filter by signal type
    if (signalFilter !== 'all') {
      filtered = filtered.filter(
        (p) => p.signal.toLowerCase() === signalFilter
      )
    }

    // Sort
    switch (sortBy) {
      case 'confidence':
        filtered.sort((a, b) => b.confidence - a.confidence)
        break
      case 'return':
        filtered.sort((a, b) => {
          const returnA = (a.predictedPrice - a.currentPrice) / a.currentPrice
          const returnB = (b.predictedPrice - b.currentPrice) / b.currentPrice
          return Math.abs(returnB) - Math.abs(returnA)
        })
        break
      case 'symbol':
        filtered.sort((a, b) => a.symbol.localeCompare(b.symbol))
        break
    }

    return filtered
  }, [signalFilter, sortBy])

  // Count by signal type for filter badges
  const signalCounts = useMemo(
    () => ({
      all: modelPredictions.length,
      buy: modelPredictions.filter((p) => p.signal === 'BUY').length,
      sell: modelPredictions.filter((p) => p.signal === 'SELL').length,
      hold: modelPredictions.filter((p) => p.signal === 'HOLD').length,
    }),
    []
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Summary Stats */}
            <SummaryStats
              totalPredictions={predictionSummary.totalPredictions}
              buySignals={predictionSummary.buySignals}
              sellSignals={predictionSummary.sellSignals}
              holdSignals={predictionSummary.holdSignals}
              averageConfidence={predictionSummary.averageConfidence}
              highConfidencePredictions={predictionSummary.highConfidencePredictions}
              nextUpdate={predictionSummary.nextScheduledUpdate}
            />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* High Confidence Signals */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    High Confidence Signals
                  </h2>
                  <span className="text-xs text-gray-500">
                    Confidence &gt; 75%
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modelPredictions
                    .filter((p) => p.confidence >= 0.75)
                    .sort((a, b) => b.confidence - a.confidence)
                    .slice(0, 4)
                    .map((prediction, index) => (
                      <SignalCard
                        key={prediction.id}
                        prediction={prediction}
                        index={index}
                      />
                    ))}
                </div>
              </div>

              {/* Sector Sentiment */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">
                  Sector Sentiment
                </h2>
                <SectorSentiment sectors={sectorPredictions} />
              </div>
            </div>

            {/* Model Performance Radar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl bg-obsidian-800/30 border border-obsidian-600/30"
            >
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Model Comparison
              </h2>
              <ModelRadar models={modelPerformance} />
            </motion.div>
          </div>
        )

      case 'signals':
        return (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Signal Type Filter */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-obsidian-800/50 border border-obsidian-600/30">
                {(['all', 'buy', 'sell', 'hold'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSignalFilter(filter)}
                    className={`
                      px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                      ${
                        signalFilter === filter
                          ? filter === 'buy'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : filter === 'sell'
                            ? 'bg-crimson-500/20 text-crimson-400 border border-crimson-500/30'
                            : filter === 'hold'
                            ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                            : 'bg-obsidian-700 text-white border border-obsidian-500/50'
                          : 'text-gray-400 hover:text-white border border-transparent'
                      }
                    `}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}{' '}
                    <span className="text-gray-500">({signalCounts[filter]})</span>
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as 'confidence' | 'return' | 'symbol')
                  }
                  className="px-3 py-1.5 rounded-lg bg-obsidian-800/50 border border-obsidian-600/30 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="confidence">Sort by Confidence</option>
                  <option value="return">Sort by Expected Return</option>
                  <option value="symbol">Sort by Symbol</option>
                </select>
              </div>
            </div>

            {/* Signals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredPredictions.map((prediction, index) => (
                  <SignalCard
                    key={prediction.id}
                    prediction={prediction}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>

            {filteredPredictions.length === 0 && (
              <div className="text-center py-12">
                <Filter className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">
                  No predictions match your filters
                </p>
              </div>
            )}
          </div>
        )

      case 'models':
        return (
          <div className="space-y-6">
            <ModelRadar models={modelPerformance} />

            {/* Model Performance Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-obsidian-600/30">
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Model
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Accuracy
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precision
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recall
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      F1 Score
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sharpe
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Max DD
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Predictions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {modelPerformance.map((model, index) => (
                    <motion.tr
                      key={model.modelId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-obsidian-700/30 hover:bg-obsidian-800/30 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <p className="font-medium text-white">{model.modelName}</p>
                        <p className="text-xs text-gray-500">{model.modelId}</p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-mono text-emerald-400">
                          {(model.accuracy * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-mono text-gray-300">
                          {(model.precision * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-mono text-gray-300">
                          {(model.recall * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-mono text-gray-300">
                          {(model.f1Score * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span
                          className={`font-mono ${
                            model.sharpeRatio >= 2
                              ? 'text-emerald-400'
                              : model.sharpeRatio >= 1.5
                              ? 'text-gold-400'
                              : 'text-gray-400'
                          }`}
                        >
                          {model.sharpeRatio.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-mono text-crimson-400">
                          -{(model.maxDrawdown * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-mono text-gray-400">
                          {model.successfulPredictions}/{model.totalPredictions}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      case 'history':
        return (
          <div className="text-center py-20">
            <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Prediction History
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Track historical prediction accuracy and performance over time.
              This feature is coming soon.
            </p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Animated Brain Icon */}
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-purple-500/10 to-emerald-500/5 border border-emerald-500/30 flex items-center justify-center">
                <Brain className="w-7 h-7 text-emerald-400" />
              </div>
              {/* Pulse effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-emerald-500/20"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>

            <div>
              <h1 className="font-display text-3xl font-bold text-white tracking-tight">
                ML Predictions
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                AI-powered trading signals • Updated every hour
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">Live</span>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-obsidian-800 border border-obsidian-600/50 text-gray-300 hover:text-white hover:border-obsidian-500 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mt-6 p-1 rounded-xl bg-obsidian-800/50 border border-obsidian-600/30 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${
                  activeTab === tab.id
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-gray-400 hover:text-white'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </motion.header>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 pt-6 border-t border-obsidian-700/30"
      >
        <div className="flex items-center justify-between text-xs text-gray-500">
          <p>
            Model v3.2.1 • Ensemble of LSTM, Transformer & XGBoost
          </p>
          <p>
            Last refreshed:{' '}
            {lastRefresh.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              second: '2-digit',
            })}
          </p>
        </div>
      </motion.footer>
    </div>
  )
}
