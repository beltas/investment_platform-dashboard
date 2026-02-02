import { motion } from 'framer-motion'

interface NeuralPulseProps {
  confidence: number
  signal: 'BUY' | 'SELL' | 'HOLD'
  size?: 'sm' | 'md' | 'lg'
}

// Animated neural network-inspired confidence visualization
export function NeuralPulse({ confidence, signal, size = 'md' }: NeuralPulseProps) {
  const sizeMap = {
    sm: { outer: 48, inner: 32, ring: 24 },
    md: { outer: 72, inner: 48, ring: 36 },
    lg: { outer: 96, inner: 64, ring: 48 },
  }

  const colorMap = {
    BUY: {
      primary: '#10b981',
      secondary: '#34d399',
      glow: 'rgba(16, 185, 129, 0.4)',
      ring: 'rgba(16, 185, 129, 0.2)',
    },
    SELL: {
      primary: '#ef4444',
      secondary: '#f87171',
      glow: 'rgba(239, 68, 68, 0.4)',
      ring: 'rgba(239, 68, 68, 0.2)',
    },
    HOLD: {
      primary: '#fbbf24',
      secondary: '#fcd34d',
      glow: 'rgba(251, 191, 36, 0.4)',
      ring: 'rgba(251, 191, 36, 0.2)',
    },
  }

  const dimensions = sizeMap[size]
  const colors = colorMap[signal]
  const pulseScale = 0.85 + confidence * 0.3

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: dimensions.outer, height: dimensions.outer }}
    >
      {/* Outer pulsing ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.ring} 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, pulseScale, 1],
          opacity: [0.6, 0.3, 0.6],
        }}
        transition={{
          duration: 2 + (1 - confidence),
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Middle ring with gradient */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: dimensions.inner,
          height: dimensions.inner,
          background: `conic-gradient(from 0deg, ${colors.primary}, ${colors.secondary}, ${colors.primary})`,
          opacity: 0.3,
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Inner confidence indicator */}
      <motion.div
        className="absolute rounded-full flex items-center justify-center"
        style={{
          width: dimensions.ring,
          height: dimensions.ring,
          background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}10)`,
          border: `2px solid ${colors.primary}`,
          boxShadow: `0 0 20px ${colors.glow}, inset 0 0 15px ${colors.glow}`,
        }}
        animate={{
          boxShadow: [
            `0 0 20px ${colors.glow}, inset 0 0 15px ${colors.glow}`,
            `0 0 35px ${colors.glow}, inset 0 0 25px ${colors.glow}`,
            `0 0 20px ${colors.glow}, inset 0 0 15px ${colors.glow}`,
          ],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <span
          className="font-mono font-bold"
          style={{
            color: colors.primary,
            fontSize: size === 'sm' ? 10 : size === 'md' ? 14 : 18,
            textShadow: `0 0 10px ${colors.glow}`,
          }}
        >
          {Math.round(confidence * 100)}%
        </span>
      </motion.div>

      {/* Orbiting particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: colors.secondary,
            boxShadow: `0 0 6px ${colors.primary}`,
          }}
          animate={{
            rotate: [0 + i * 120, 360 + i * 120],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: 'linear',
          }}
          initial={{
            x: dimensions.inner / 2 - 3,
            y: 0,
            rotate: i * 120,
          }}
        />
      ))}
    </div>
  )
}
