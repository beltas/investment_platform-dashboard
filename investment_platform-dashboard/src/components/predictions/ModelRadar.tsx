import { motion } from 'framer-motion'
import type { ModelPerformance } from '../../types/predictions'

interface ModelRadarProps {
  models: ModelPerformance[]
}

// Radar chart showing model performance metrics
export function ModelRadar({ models }: ModelRadarProps) {
  const metrics = ['accuracy', 'precision', 'recall', 'f1Score', 'sharpeRatio'] as const
  const metricLabels = {
    accuracy: 'Accuracy',
    precision: 'Precision',
    recall: 'Recall',
    f1Score: 'F1 Score',
    sharpeRatio: 'Sharpe',
  }

  const colors = [
    { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.15)' },
    { stroke: '#8b5cf6', fill: 'rgba(139, 92, 246, 0.15)' },
    { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.15)' },
    { stroke: '#06b6d4', fill: 'rgba(6, 182, 212, 0.15)' },
  ]

  const centerX = 150
  const centerY = 150
  const radius = 100

  // Calculate point position on radar
  const getPoint = (value: number, index: number, maxValue: number = 1) => {
    const angle = (Math.PI * 2 * index) / metrics.length - Math.PI / 2
    const normalizedValue = Math.min(value / maxValue, 1)
    const distance = radius * normalizedValue
    return {
      x: centerX + Math.cos(angle) * distance,
      y: centerY + Math.sin(angle) * distance,
    }
  }

  // Create polygon path for a model
  const createPath = (model: ModelPerformance) => {
    const points = metrics.map((metric, i) => {
      const value = metric === 'sharpeRatio' ? model[metric] / 3 : model[metric]
      return getPoint(value, i)
    })
    return points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ') + ' Z'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <svg width="300" height="300" className="mx-auto">
        {/* Background grid rings */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((level, i) => (
          <motion.polygon
            key={level}
            points={metrics
              .map((_, index) => {
                const point = getPoint(level, index)
                return `${point.x},${point.y}`
              })
              .join(' ')}
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * i, duration: 0.4 }}
          />
        ))}

        {/* Axis lines */}
        {metrics.map((_, i) => {
          const point = getPoint(1, i)
          return (
            <motion.line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={point.x}
              y2={point.y}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />
          )
        })}

        {/* Model polygons */}
        {models.map((model, modelIndex) => (
          <motion.path
            key={model.modelId}
            d={createPath(model)}
            fill={colors[modelIndex % colors.length].fill}
            stroke={colors[modelIndex % colors.length].stroke}
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.4 + modelIndex * 0.15,
              duration: 0.6,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Data points */}
        {models.map((model, modelIndex) =>
          metrics.map((metric, i) => {
            const value = metric === 'sharpeRatio' ? model[metric] / 3 : model[metric]
            const point = getPoint(value, i)
            return (
              <motion.circle
                key={`${model.modelId}-${metric}`}
                cx={point.x}
                cy={point.y}
                r="4"
                fill={colors[modelIndex % colors.length].stroke}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.6 + modelIndex * 0.15 + i * 0.05,
                  duration: 0.3,
                }}
              />
            )
          })
        )}

        {/* Metric labels */}
        {metrics.map((metric, i) => {
          const point = getPoint(1.25, i)
          return (
            <motion.text
              key={metric}
              x={point.x}
              y={point.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-gray-400 text-xs font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              {metricLabels[metric]}
            </motion.text>
          )
        })}

        {/* Center pulse */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r="6"
          fill="rgba(16, 185, 129, 0.5)"
          animate={{
            r: [6, 10, 6],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <circle cx={centerX} cy={centerY} r="3" fill="#10b981" />
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {models.map((model, i) => (
          <motion.div
            key={model.modelId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + i * 0.1 }}
            className="flex items-center gap-2"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[i % colors.length].stroke }}
            />
            <span className="text-xs text-gray-400">{model.modelName}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
