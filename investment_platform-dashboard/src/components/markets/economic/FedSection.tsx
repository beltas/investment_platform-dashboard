import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Calendar, AlertTriangle, ChevronDown } from 'lucide-react'
import { FedData } from '../../../types/markets'
import { DotPlotChart } from './DotPlotChart'

interface FedSectionProps {
  data: FedData
}

export function FedSection({ data }: FedSectionProps) {
  const [selectedMeetingId, setSelectedMeetingId] = useState(data.meetings[0]?.id || '')
  const [showMeetingSelector, setShowMeetingSelector] = useState(false)

  const selectedMeeting = data.meetings.find(m => m.id === selectedMeetingId) || data.meetings[0]

  const yieldCurveColor =
    data.yieldCurveStatus === 'normal'
      ? 'text-emerald-400'
      : data.yieldCurveStatus === 'inverted'
      ? 'text-red-400'
      : 'text-yellow-400'

  const yieldCurveIcon =
    data.yieldCurveStatus === 'normal' ? (
      <TrendingUp size={16} className={yieldCurveColor} />
    ) : data.yieldCurveStatus === 'inverted' ? (
      <TrendingDown size={16} className={yieldCurveColor} />
    ) : (
      <Minus size={16} className={yieldCurveColor} />
    )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 border-l-4 border-purple-500/30"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🏛️</span>
        <h3 className="text-xl font-semibold text-white">Federal Reserve</h3>
      </div>

      {/* Key metrics row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Current Rate */}
        <div className="bg-obsidian-800/50 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Fed Funds Rate</p>
          <p className="text-2xl font-bold text-white">{data.currentRate}</p>
        </div>

        {/* Next Meeting */}
        <div className="bg-obsidian-800/50 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Next FOMC</p>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-purple-400" />
            <div>
              <p className="text-sm text-white font-medium">{data.nextMeeting}</p>
              <p className="text-xs text-gray-500">{data.nextMeetingDate}</p>
            </div>
          </div>
        </div>

        {/* Yield Curve */}
        <div className="bg-obsidian-800/50 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">10Y-2Y Spread</p>
          <div className="flex items-center gap-2">
            {yieldCurveIcon}
            <span className={`text-xl font-bold ${yieldCurveColor}`}>
              {data.yieldCurveSpread > 0 ? '+' : ''}{data.yieldCurveSpread.toFixed(2)}%
            </span>
          </div>
          <p className={`text-xs mt-1 capitalize ${yieldCurveColor}`}>
            {data.yieldCurveStatus === 'inverted' && (
              <span className="flex items-center gap-1">
                <AlertTriangle size={10} />
                Inverted (Recession Signal)
              </span>
            )}
            {data.yieldCurveStatus === 'normal' && 'Normal'}
            {data.yieldCurveStatus === 'flat' && 'Flat'}
          </p>
        </div>

        {/* Market Expectations */}
        <div className="bg-obsidian-800/50 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Market Expectations</p>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Hold</span>
              <span className="text-white font-medium">{data.marketExpectations.hold}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-emerald-400">Cut</span>
              <span className="text-white font-medium">{data.marketExpectations.cut}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-red-400">Hike</span>
              <span className="text-white font-medium">{data.marketExpectations.hike}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dot Plot Section */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <div>
            <h4 className="text-lg font-medium text-white">FOMC Dot Plot</h4>
            <p className="text-xs text-gray-500">
              Each dot represents one FOMC official's rate projection
            </p>
          </div>

          {/* Meeting Selector */}
          <div className="relative">
            <button
              onClick={() => setShowMeetingSelector(!showMeetingSelector)}
              className="flex items-center gap-2 px-4 py-2 bg-obsidian-700 border border-obsidian-600
                         rounded-lg hover:bg-obsidian-600 transition-colors"
            >
              <Calendar size={16} className="text-purple-400" />
              <span className="text-white font-medium">{selectedMeeting?.displayName}</span>
              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform ${showMeetingSelector ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {showMeetingSelector && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-obsidian-800 border border-obsidian-600
                             rounded-lg shadow-xl z-20 overflow-hidden"
                >
                  {data.meetings.map((meeting) => (
                    <button
                      key={meeting.id}
                      onClick={() => {
                        setSelectedMeetingId(meeting.id)
                        setShowMeetingSelector(false)
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-obsidian-700 transition-colors
                        ${meeting.id === selectedMeetingId ? 'bg-emerald-500/10 border-l-2 border-emerald-500' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{meeting.displayName}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(meeting.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{meeting.rateDecision}</p>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Selected Meeting Info */}
        {selectedMeeting && (
          <div className="mb-4 p-3 bg-obsidian-800/50 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-400">Meeting: </span>
              <span className="text-white font-medium">{selectedMeeting.displayName}</span>
              <span className="text-gray-500 mx-2">|</span>
              <span className="text-sm text-gray-400">Decision: </span>
              <span className="text-emerald-400">{selectedMeeting.rateDecision}</span>
            </div>
          </div>
        )}

        {/* Dot Plot Chart */}
        {selectedMeeting && (
          <DotPlotChart
            data={selectedMeeting.dotPlot}
            meetingName={selectedMeeting.displayName}
          />
        )}

        {/* Legend */}
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            Official Projections
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-0.5 bg-emerald-500" style={{ borderStyle: 'dashed' }} />
            Median Projection
          </span>
        </div>
      </div>
    </motion.div>
  )
}
