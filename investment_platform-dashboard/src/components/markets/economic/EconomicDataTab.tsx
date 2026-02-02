import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { economicIndicators, fedData, upcomingReleases } from '../../../utils/marketsMockData'
import { UpcomingBanner } from './UpcomingBanner'
import { IndicatorTable } from './IndicatorTable'
import { FedSection } from './FedSection'

export function EconomicDataTab() {
  // Group indicators by category
  const groupedIndicators = useMemo(() => ({
    employment: economicIndicators.filter(i => i.category === 'employment'),
    inflation: economicIndicators.filter(i => i.category === 'inflation'),
    growth: economicIndicators.filter(i => i.category === 'growth')
  }), [])

  return (
    <div>
      {/* Upcoming releases banner */}
      <UpcomingBanner releases={upcomingReleases} />

      {/* Fed Section at top */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <FedSection data={fedData} />
      </motion.div>

      {/* Indicator tables */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <IndicatorTable
            title="Employment"
            category="employment"
            indicators={groupedIndicators.employment}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <IndicatorTable
            title="Inflation"
            category="inflation"
            indicators={groupedIndicators.inflation}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <IndicatorTable
            title="Growth & Activity"
            category="growth"
            indicators={groupedIndicators.growth}
          />
        </motion.div>
      </div>
    </div>
  )
}
