import { motion } from 'framer-motion'
import type { OrderType } from '../../types/orders'

interface OrderTypeSelectorProps {
  selected: OrderType
  onChange: (type: OrderType) => void
}

const ORDER_TYPES: { value: OrderType; label: string }[] = [
  { value: 'market', label: 'Market' },
  { value: 'limit', label: 'Limit' },
  { value: 'stop', label: 'Stop' },
]

export function OrderTypeSelector({ selected, onChange }: OrderTypeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-400 mr-2">Order Type:</span>
      <div className="flex gap-1 p-1 bg-obsidian-800 rounded-lg">
        {ORDER_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => onChange(type.value)}
            className={`relative px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              selected === type.value
                ? 'text-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {selected === type.value && (
              <motion.div
                layoutId="orderTypeIndicator"
                className="absolute inset-0 bg-obsidian-600 rounded-md"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
