import { motion } from 'framer-motion'
import type { MarketTicker as MarketTickerType } from '../types'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MarketTickerProps {
  tickers: MarketTickerType[]
}

export function MarketTicker({ tickers }: MarketTickerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full overflow-hidden bg-obsidian-900/80 backdrop-blur-sm border-b border-obsidian-700/50"
    >
      <div className="relative">
        {/* Gradient masks for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-obsidian-900 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-obsidian-900 to-transparent z-10" />

        {/* Scrolling ticker */}
        <motion.div
          className="flex items-center gap-8 py-3 px-8"
          animate={{ x: [0, -1000] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 30,
              ease: 'linear',
            },
          }}
        >
          {/* Duplicate tickers for seamless loop */}
          {[...tickers, ...tickers].map((ticker, index) => (
            <div
              key={`${ticker.symbol}-${index}`}
              className="flex items-center gap-3 whitespace-nowrap"
            >
              <span className="font-mono text-sm font-medium text-gray-300">
                {ticker.symbol}
              </span>

              <span className="font-mono text-sm text-white">
                {ticker.symbol === 'BTC-USD'
                  ? `$${ticker.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
                  : `$${ticker.price.toFixed(2)}`}
              </span>

              <div
                className={`flex items-center gap-1 ${
                  ticker.change >= 0 ? 'text-emerald-400' : 'text-crimson-400'
                }`}
              >
                {ticker.change >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span className="font-mono text-xs">
                  {ticker.changePercent >= 0 ? '+' : ''}
                  {ticker.changePercent.toFixed(2)}%
                </span>
              </div>

              {index < [...tickers, ...tickers].length - 1 && (
                <div className="w-px h-4 bg-obsidian-600 ml-5" />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

// Static version for sidebar
export function MarketTickerVertical({ tickers }: MarketTickerProps) {
  return (
    <div className="space-y-2">
      {tickers.slice(0, 5).map((ticker, index) => (
        <motion.div
          key={ticker.symbol}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 + index * 0.05, duration: 0.3 }}
          className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-obsidian-700/30 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                ticker.change >= 0 ? 'bg-emerald-500' : 'bg-crimson-500'
              }`}
            />
            <span className="font-mono text-sm text-gray-300">
              {ticker.symbol}
            </span>
          </div>

          <div className="text-right">
            <p className="font-mono text-sm text-white">
              ${ticker.price.toFixed(2)}
            </p>
            <p
              className={`font-mono text-xs ${
                ticker.change >= 0 ? 'text-emerald-400' : 'text-crimson-400'
              }`}
            >
              {ticker.changePercent >= 0 ? '+' : ''}
              {ticker.changePercent.toFixed(2)}%
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
