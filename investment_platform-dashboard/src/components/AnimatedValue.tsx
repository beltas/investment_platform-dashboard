import { useAnimatedNumber, formatCurrency, formatPercent } from '../hooks/useAnimatedNumber'
import { motion } from 'framer-motion'

interface AnimatedValueProps {
  value: number
  format?: 'currency' | 'percent' | 'number'
  prefix?: string
  suffix?: string
  className?: string
  delay?: number
  duration?: number
  decimals?: number
}

export function AnimatedValue({
  value,
  format = 'number',
  prefix = '',
  suffix = '',
  className = '',
  delay = 0,
  duration = 1500,
  decimals = 2,
}: AnimatedValueProps) {
  const animatedValue = useAnimatedNumber(value, { delay, duration, decimals })

  const formatValue = (val: number): string => {
    switch (format) {
      case 'currency':
        return formatCurrency(val)
      case 'percent':
        return formatPercent(val)
      default:
        return val.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
    }
  }

  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.5 }}
      className={`number-display ${className}`}
    >
      {prefix}
      {formatValue(animatedValue)}
      {suffix}
    </motion.span>
  )
}

interface ChangeIndicatorProps {
  value: number
  showIcon?: boolean
  className?: string
}

export function ChangeIndicator({ value, showIcon = true, className = '' }: ChangeIndicatorProps) {
  const isPositive = value >= 0
  const colorClass = isPositive ? 'text-emerald-400' : 'text-crimson-400'

  return (
    <span className={`inline-flex items-center gap-1 ${colorClass} ${className}`}>
      {showIcon && (
        <svg
          className={`w-4 h-4 ${isPositive ? '' : 'rotate-180'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      )}
      <span className="font-mono">
        {isPositive ? '+' : ''}{value.toFixed(2)}%
      </span>
    </span>
  )
}
