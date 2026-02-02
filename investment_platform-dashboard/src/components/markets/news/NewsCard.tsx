import { motion } from 'framer-motion'
import { Bookmark, BookmarkCheck, ExternalLink, Clock } from 'lucide-react'
import { NewsItem } from '../../../types/markets'
import { useState } from 'react'

interface NewsCardProps {
  item: NewsItem
  isPortfolioHolding?: boolean
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffHours < 1) {
    const diffMins = Math.floor(diffMs / (1000 * 60))
    return `${diffMins}m ago`
  } else if (diffHours < 24) {
    return `${diffHours}h ago`
  } else if (diffDays < 7) {
    return `${diffDays}d ago`
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}

const sourceColors: Record<string, string> = {
  'Reuters': 'text-orange-400',
  'Bloomberg': 'text-purple-400',
  'WSJ': 'text-blue-400',
  'CNBC': 'text-yellow-400',
  'MarketWatch': 'text-emerald-400'
}

export function NewsCard({ item, isPortfolioHolding }: NewsCardProps) {
  const [saved, setSaved] = useState(item.saved || false)
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 hover:border-emerald-500/30 transition-colors"
    >
      {/* Header with tickers and metadata */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Portfolio holding badges */}
          {item.tickers?.map(ticker => (
            <span
              key={ticker}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                ${isPortfolioHolding
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-obsidian-700 text-gray-400'
                }`}
            >
              {isPortfolioHolding && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
              {ticker}
            </span>
          ))}
          {/* Category badge */}
          <span className="px-2 py-0.5 rounded-full text-xs bg-obsidian-700/50 text-gray-500 capitalize">
            {item.category}
          </span>
        </div>
        {/* Save button */}
        <button
          onClick={() => setSaved(!saved)}
          className="p-1.5 rounded-lg hover:bg-obsidian-700 transition-colors text-gray-500 hover:text-gray-300"
        >
          {saved ? (
            <BookmarkCheck size={16} className="text-emerald-400" />
          ) : (
            <Bookmark size={16} />
          )}
        </button>
      </div>

      {/* Headline */}
      <h3
        onClick={() => setExpanded(!expanded)}
        className="text-base font-medium text-white mb-2 cursor-pointer hover:text-emerald-400 transition-colors"
      >
        {item.headline}
      </h3>

      {/* Snippet - shows more when expanded */}
      <p className={`text-sm text-gray-400 mb-3 ${expanded ? '' : 'line-clamp-2'}`}>
        {item.snippet}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className={`font-medium ${sourceColors[item.source] || 'text-gray-400'}`}>
            {item.source}
          </span>
          <span className="flex items-center gap-1 text-gray-500">
            <Clock size={12} />
            {formatTimestamp(item.timestamp)}
          </span>
        </div>
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-gray-500 hover:text-emerald-400 transition-colors"
          >
            <ExternalLink size={12} />
            <span>Read more</span>
          </a>
        )}
      </div>
    </motion.article>
  )
}
