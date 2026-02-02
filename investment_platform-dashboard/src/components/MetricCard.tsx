import { motion } from 'framer-motion'
import { AnimatedValue, ChangeIndicator } from './AnimatedValue'
import type { ReactNode } from 'react'

interface MetricCardProps {
  title: string
  value: number
  change?: number
  changePercent?: number
  format?: 'currency' | 'percent' | 'number'
  icon?: ReactNode
  delay?: number
  accentColor?: 'emerald' | 'gold' | 'blue'
  subtitle?: string
}

export function MetricCard({
  title,
  value,
  change,
  changePercent,
  format = 'currency',
  icon,
  delay = 0,
  accentColor = 'emerald',
  subtitle,
}: MetricCardProps) {
  const accentClasses = {
    emerald: 'from-emerald-500/20 to-transparent',
    gold: 'from-gold-500/20 to-transparent',
    blue: 'from-blue-500/20 to-transparent',
  }

  const iconBgClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-400',
    gold: 'bg-gold-500/10 text-gold-400',
    blue: 'bg-blue-500/10 text-blue-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.5, ease: 'easeOut' }}
      className="metric-card group"
    >
      {/* Accent gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${accentClasses[accentColor]} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">
              {title}
            </p>
            {subtitle && (
              <p className="text-gray-500 text-xs mt-0.5">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className={`p-2.5 rounded-xl ${iconBgClasses[accentColor]}`}>
              {icon}
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-3">
          <AnimatedValue
            value={value}
            format={format}
            delay={delay + 200}
            className="text-3xl font-semibold text-white"
          />
        </div>

        {/* Change */}
        {(change !== undefined || changePercent !== undefined) && (
          <div className="flex items-center gap-3">
            {change !== undefined && (
              <span className={`font-mono text-sm ${change >= 0 ? 'text-emerald-400' : 'text-crimson-400'}`}>
                {change >= 0 ? '+' : ''}{change.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </span>
            )}
            {changePercent !== undefined && (
              <ChangeIndicator value={changePercent} className="text-sm" />
            )}
            <span className="text-gray-500 text-xs">today</span>
          </div>
        )}
      </div>

      {/* Decorative corner accent */}
      <div
        className={`absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-radial ${accentClasses[accentColor]} opacity-30 blur-2xl`}
      />
    </motion.div>
  )
}
