// Order Types for Trading Functionality
import type { AccountType, AccountPosition } from './portfolio'

export type OrderSide = 'buy' | 'sell'
export type OrderType = 'market' | 'limit' | 'stop'

export interface AllocationPreset {
  id: string
  name: string
  allocations: AccountAllocation[]
}

export interface AccountAllocation {
  accountId: string
  brokerId: string
  percentage: number // 0-100, must sum to 100
}

export interface OrderAllocation {
  accountId: string
  brokerId: string
  brokerName: string
  brokerShortName: string
  accountType: AccountType
  percentage: number
  shares: number
  principal: number
}

export interface OrderFormData {
  symbol: string
  name: string
  side: OrderSide
  orderType: OrderType
  shares: number
  principal: number
  limitPrice?: number
  stopPrice?: number
  allocations: OrderAllocation[]
  usePreset: boolean
  presetId?: string
}

export interface OrderPrefill {
  symbol: string
  name: string
  side: OrderSide
  accounts: AccountPosition[]
}

export interface SecurityPrice {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

export interface OrderModalState {
  isOpen: boolean
  prefill?: OrderPrefill
}
