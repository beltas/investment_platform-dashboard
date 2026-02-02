// Mock data for Order functionality
import type { AllocationPreset, SecurityPrice } from '../types/orders'

// Allocation presets for distributing orders across accounts
export const allocationPresets: AllocationPreset[] = [
  {
    id: 'manual',
    name: 'Manual',
    allocations: [],
  },
  {
    id: 'ib-primary',
    name: 'IB Primary (100%)',
    allocations: [
      { accountId: 'ibkr-margin', brokerId: 'ibkr', percentage: 100 },
    ],
  },
  {
    id: 'us-60-40',
    name: 'US 60/40 Split',
    allocations: [
      { accountId: 'ibkr-margin', brokerId: 'ibkr', percentage: 60 },
      { accountId: 'ibkr-ira', brokerId: 'ibkr', percentage: 40 },
    ],
  },
  {
    id: 'equal-split',
    name: 'Equal Split',
    allocations: [
      { accountId: 'ibkr-margin', brokerId: 'ibkr', percentage: 50 },
      { accountId: 'degiro-cash', brokerId: 'degiro', percentage: 50 },
    ],
  },
  {
    id: 'tax-optimized',
    name: 'Tax Optimized',
    allocations: [
      { accountId: 'ibkr-ira', brokerId: 'ibkr', percentage: 70 },
      { accountId: 'ibkr-margin', brokerId: 'ibkr', percentage: 30 },
    ],
  },
]

// Mock security prices for symbol search and order calculations
export const securityPrices: SecurityPrice[] = [
  // Equities
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.28, change: 12.45, changePercent: 1.44 },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 198.50, change: -1.23, changePercent: -0.62 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 425.22, change: 3.78, changePercent: 0.90 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 175.98, change: 2.15, changePercent: 1.24 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 186.75, change: -0.89, changePercent: -0.47 },
  { symbol: 'META', name: 'Meta Platforms Inc.', price: 505.75, change: 8.32, changePercent: 1.67 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -5.67, changePercent: -2.23 },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 198.45, change: 1.12, changePercent: 0.57 },
  { symbol: 'V', name: 'Visa Inc.', price: 278.90, change: 0.45, changePercent: 0.16 },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 156.78, change: -0.34, changePercent: -0.22 },
  { symbol: 'WMT', name: 'Walmart Inc.', price: 165.23, change: 2.11, changePercent: 1.29 },
  { symbol: 'PG', name: 'Procter & Gamble Co.', price: 162.45, change: 0.78, changePercent: 0.48 },
  { symbol: 'HD', name: 'Home Depot Inc.', price: 345.67, change: -2.34, changePercent: -0.67 },
  { symbol: 'BAC', name: 'Bank of America Corp.', price: 37.89, change: 0.23, changePercent: 0.61 },
  { symbol: 'DIS', name: 'Walt Disney Co.', price: 112.34, change: 1.56, changePercent: 1.41 },
  // Crypto
  { symbol: 'BTC', name: 'Bitcoin', price: 67245.50, change: 1234.00, changePercent: 1.87 },
  { symbol: 'ETH', name: 'Ethereum', price: 3456.78, change: -45.23, changePercent: -1.29 },
  { symbol: 'SOL', name: 'Solana', price: 145.67, change: 8.90, changePercent: 6.51 },
  // FX
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', price: 1.0845, change: 0.0023, changePercent: 0.21 },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', price: 1.2678, change: -0.0045, changePercent: -0.35 },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', price: 154.23, change: 0.56, changePercent: 0.36 },
  // Metals
  { symbol: 'XAU', name: 'Gold (oz)', price: 2345.67, change: 12.34, changePercent: 0.53 },
  { symbol: 'XAG', name: 'Silver (oz)', price: 28.45, change: 0.67, changePercent: 2.41 },
]

// Get security price by symbol
export function getSecurityPrice(symbol: string): SecurityPrice | undefined {
  return securityPrices.find(s => s.symbol.toUpperCase() === symbol.toUpperCase())
}

// Search securities by symbol or name
export function searchSecurities(query: string): SecurityPrice[] {
  if (!query || query.length < 1) return []
  const lowerQuery = query.toLowerCase()
  return securityPrices.filter(
    s => s.symbol.toLowerCase().includes(lowerQuery) ||
         s.name.toLowerCase().includes(lowerQuery)
  ).slice(0, 8) // Limit results
}

// Get preset by ID
export function getAllocationPreset(presetId: string): AllocationPreset | undefined {
  return allocationPresets.find(p => p.id === presetId)
}

// Commission rates by broker (mock)
export const brokerCommissions: Record<string, { perShare: number; minimum: number; maximum: number }> = {
  ibkr: { perShare: 0.005, minimum: 1.00, maximum: 50.00 },
  degiro: { perShare: 0.00, minimum: 0.50, maximum: 0.50 }, // Flat fee
  saxo: { perShare: 0.01, minimum: 3.00, maximum: 30.00 },
  coinbase: { perShare: 0.00, minimum: 0.00, maximum: 0.00 }, // Spread-based
  kraken: { perShare: 0.00, minimum: 0.00, maximum: 0.00 }, // Fee in spread
  oanda: { perShare: 0.00, minimum: 0.00, maximum: 0.00 }, // Spread-based
  bullionvault: { perShare: 0.00, minimum: 5.00, maximum: 5.00 },
  polymarket: { perShare: 0.00, minimum: 0.00, maximum: 0.00 },
  kalshi: { perShare: 0.00, minimum: 0.00, maximum: 0.00 },
}

// Calculate estimated commission for an order
export function calculateCommission(brokerId: string, shares: number): number {
  const rates = brokerCommissions[brokerId]
  if (!rates) return 0

  const calculated = shares * rates.perShare
  return Math.max(rates.minimum, Math.min(rates.maximum, calculated))
}
