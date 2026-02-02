import { motion } from 'framer-motion'
import { Calendar, Clock } from 'lucide-react'

interface UpcomingRelease {
  name: string
  date: string
  daysUntil: number
}

interface UpcomingBannerProps {
  releases: UpcomingRelease[]
}

export function UpcomingBanner({ releases }: UpcomingBannerProps) {
  if (releases.length === 0) return null

  const nextRelease = releases[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent
                 border border-emerald-500/30 rounded-lg p-4 mb-6"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Main upcoming release */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <Calendar size={20} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Next Release</p>
            <p className="text-white font-medium">{nextRelease.name}</p>
          </div>
          <div className="ml-4 flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 rounded-full">
            <Clock size={14} className="text-emerald-400" />
            <span className="text-emerald-400 font-medium text-sm">
              {nextRelease.daysUntil === 0
                ? 'Today'
                : nextRelease.daysUntil === 1
                ? 'Tomorrow'
                : `In ${nextRelease.daysUntil} days`}
            </span>
          </div>
        </div>

        {/* Other upcoming releases */}
        {releases.length > 1 && (
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 uppercase tracking-wide">Also this week:</span>
            {releases.slice(1, 4).map((release, idx) => (
              <span key={idx} className="text-sm text-gray-400">
                {release.name} ({release.daysUntil}d)
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
