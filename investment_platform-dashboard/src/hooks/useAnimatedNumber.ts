import { useState, useEffect, useRef } from 'react'

interface UseAnimatedNumberOptions {
  duration?: number
  delay?: number
  decimals?: number
  easing?: (t: number) => number
}

// Easing functions
const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export function useAnimatedNumber(
  targetValue: number,
  options: UseAnimatedNumberOptions = {}
): number {
  const {
    duration = 1500,
    delay = 0,
    decimals = 2,
    easing = easeOutExpo,
  } = options

  const [displayValue, setDisplayValue] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const startValueRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const delayTimeout = setTimeout(() => {
      startValueRef.current = displayValue
      startTimeRef.current = null

      const animate = (timestamp: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp
        }

        const elapsed = timestamp - startTimeRef.current
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easing(progress)

        const currentValue =
          startValueRef.current +
          (targetValue - startValueRef.current) * easedProgress

        setDisplayValue(
          Number(currentValue.toFixed(decimals))
        )

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate)
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(delayTimeout)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [targetValue, duration, delay, decimals, easing])

  return displayValue
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatCompact(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`
  }
  return `$${value.toFixed(2)}`
}
