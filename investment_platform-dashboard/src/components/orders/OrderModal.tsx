import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { OrderForm } from './OrderForm'
import type { OrderPrefill, OrderFormData } from '../../types/orders'

interface OrderModalProps {
  isOpen: boolean
  prefill?: OrderPrefill
  onClose: () => void
  onSubmit?: (data: OrderFormData) => void
}

export function OrderModal({ isOpen, prefill, onClose, onSubmit }: OrderModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSubmit = useCallback((data: OrderFormData) => {
    console.log('Order submitted:', data)
    onSubmit?.(data)
    onClose()
  }, [onClose, onSubmit])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50
                       w-full max-w-2xl max-h-[calc(100vh-4rem)] overflow-y-auto
                       bg-obsidian-900 border border-obsidian-600 rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-obsidian-900/95 backdrop-blur-sm border-b border-obsidian-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {prefill ? `Trade ${prefill.symbol}` : 'New Order'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-obsidian-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <OrderForm
                prefill={prefill}
                onSubmit={handleSubmit}
                onCancel={onClose}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
