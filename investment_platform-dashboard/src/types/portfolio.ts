// Portfolio Types for the Portfolio Tab
// Supports multi-broker, multi-asset class portfolio tracking with tax lot management

export type AssetClass =
  | 'equities'
  | 'fx'
  | 'fixed-income'
  | 'crypto'
  | 'metals'
  | 'prediction-markets'

export type BrokerRegion = 'US' | 'EU' | 'UK' | 'APAC' | 'Global'

export type AccountType =
  | 'Margin'
  | 'Cash'
  | 'IRA'
  | 'Roth IRA'
  | '401k'
  | 'ISA'
  | 'Vault'
  | 'Trading'
  | 'Cold Storage'

export interface Broker {
  id: string
  name: string
  shortName: string
  region: BrokerRegion
  supportedAssets: AssetClass[]
  iconColor: string // CSS gradient
}

export interface TaxLot {
  id: string
  purchaseDate: string // ISO date
  shares: number
  costBasis: number // per share
  currentValue: number
  gainLoss: number
  gainLossPercent: number
  isLongTerm: boolean
  daysToLongTerm?: number // only if short-term
  estimatedTax: number
  taxRate: number // 0.15 for LT, 0.35 for ST (example)
}

export interface WashSaleWarning {
  symbol: string
  saleDate: string
  sharesAmount: number
  lossAmount: number
  windowEndDate: string // 30 days from sale
}

export interface AccountPosition {
  accountId: string
  brokerId: string
  brokerName: string
  brokerShortName: string
  accountType: AccountType
  region: BrokerRegion
  shares: number
  averageCost: number
  currentValue: number
  costBasis: number
  gainLoss: number
  gainLossPercent: number
  taxLots: TaxLot[]
  washSaleWarnings?: WashSaleWarning[]
}

export interface PortfolioHolding {
  symbol: string
  name: string
  assetClass: AssetClass
  totalShares: number
  totalValue: number
  dayChange: number
  dayChangePercent: number
  totalGainLoss: number
  totalGainLossPercent: number
  accounts: AccountPosition[]
}

export interface AssetClassSummary {
  assetClass: AssetClass
  displayName: string
  subtitle: string
  icon: string
  totalValue: number
  dayChange: number
  dayChangePercent: number
  positionCount: number
  holdings: PortfolioHolding[]
  brokers: string[] // broker names with positions in this asset class
  accentColor: 'emerald' | 'blue' | 'purple' | 'orange' | 'gold' | 'cyan'
}

export interface AllocationSegment {
  assetClass: AssetClass
  displayName: string
  percentage: number
  value: number
  color: string
}

export interface PortfolioView {
  id: string
  name: string
  isDefault?: boolean
  filters: {
    assetClasses?: AssetClass[]
    brokers?: string[]
    regions?: BrokerRegion[]
  }
}

export interface PortfolioSummary {
  totalValue: number
  dayChange: number
  dayChangePercent: number
  totalGainLoss: number
  totalGainLossPercent: number
  brokerCount: number
  lastSyncedAt: string
  allocation: AllocationSegment[]
  assetClasses: AssetClassSummary[]
}

// Tax summary for the lots panel
export interface TaxLotsSummary {
  totalGain: number
  longTermGains: number
  shortTermGains: number
  estimatedTaxIfSold: number
}

// Bento card size configuration
export type BentoCardSize = 'default' | 'wide' | 'tall' | 'large'

export interface BentoCardConfig {
  assetClass: AssetClass
  size: BentoCardSize
  order: number
}
