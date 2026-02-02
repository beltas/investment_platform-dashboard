import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { NewsFilter } from '../../../types/markets'
import { newsItems } from '../../../utils/marketsMockData'
import { NewsFilters } from './NewsFilters'
import { NewsCard } from './NewsCard'

// Mock portfolio holdings - in real app would come from portfolio context
const portfolioHoldings = ['AAPL', 'GOOGL', 'MSFT', 'NVDA', 'META', 'AMZN', 'TSLA']

export function NewsTab() {
  const [filter, setFilter] = useState<NewsFilter>('all')
  const [visibleCount, setVisibleCount] = useState(10)

  // Filter and check portfolio holdings
  const filteredNews = useMemo(() => {
    let filtered = [...newsItems]

    switch (filter) {
      case 'holdings':
        filtered = filtered.filter(item =>
          item.tickers?.some(ticker => portfolioHoldings.includes(ticker))
        )
        break
      case 'market':
        filtered = filtered.filter(item =>
          item.category === 'market' || item.category === 'economy'
        )
        break
      case 'earnings':
        filtered = filtered.filter(item => item.category === 'earnings')
        break
      default:
        // 'all' - no filtering
        break
    }

    return filtered
  }, [filter])

  const displayedNews = filteredNews.slice(0, visibleCount)
  const hasMore = visibleCount < filteredNews.length

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 10, filteredNews.length))
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-6">
        <NewsFilters activeFilter={filter} onFilterChange={setFilter} />
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          Showing {displayedNews.length} of {filteredNews.length} articles
        </p>
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors">
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* News feed */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {displayedNews.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <NewsCard
                item={item}
                isPortfolioHolding={item.tickers?.some(t => portfolioHoldings.includes(t))}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">No news found for this filter</p>
          <button
            onClick={() => setFilter('all')}
            className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm"
          >
            View all news
          </button>
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-obsidian-700 hover:bg-obsidian-600 text-gray-300 rounded-lg transition-colors text-sm"
          >
            Load More ({filteredNews.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  )
}
