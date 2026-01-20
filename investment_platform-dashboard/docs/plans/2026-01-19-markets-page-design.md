# Markets Page Design

**Author:** Periklis Beltas
**Date:** 2026-01-19
**Status:** Approved

## Overview

The Markets page provides a comprehensive view of market data through three tabs: Indices, News, and Economic Data. Users can customize which indices to track, filter news by relevance to their portfolio, and monitor economic indicators with expected vs actual values.

## Tab Structure

### Page Layout
- Header with "Markets" title and last-updated timestamp
- Three tabs: Indices | News | Economic Data
- Tab styling matches existing emerald active state pattern
- Each tab renders independent content area

## Tab 1: Indices

### Display Format
Card grid layout with customizable index selection.

### Card Contents
- Index name + remove button (×)
- Current value (large, prominent)
- Daily change (% and color-coded green/red)
- 7-day sparkline chart

### Available Indices
Grouped by region, user selects up to 12:

**US Markets:**
- S&P 500, NASDAQ Composite, Dow Jones, Russell 2000
- VIX, 10-Year Treasury Yield

**International:**
- FTSE 100, DAX, CAC 40, Nikkei 225, Hang Seng

**Emerging:**
- MSCI Emerging Markets, Shanghai Composite

### Interactions
- Hover: subtle lift/glow effect
- Click card: expands to show 30-day chart with time range selector
- × button: removes index from view
- Add Index dropdown: reuses existing `IndexSelector` component pattern

### Responsive Grid
- Desktop: 3 cards per row
- Tablet: 2 cards per row
- Mobile: 1 card per row

## Tab 2: News

### Display Format
Aggregated chronological feed with filter chips.

### Filter Chips
- **All**: Shows everything
- **Portfolio Holdings**: News about owned securities (highlighted with ticker badge)
- **Market News**: General market/macro news
- **Earnings**: Earnings reports, guidance, analyst ratings

### News Item Card
- Ticker badge (if about portfolio holding) - green dot + symbol
- Headline (bold, clickable)
- Source + timestamp
- Save/bookmark button
- Preview snippet (2 lines, truncated)

### Interactions
- Click headline: expands to show full article preview
- Click ticker badge: navigates to that holding in Portfolio
- Infinite scroll or "Load More" pagination

### Data Structure
```typescript
interface NewsItem {
  id: string
  headline: string
  source: 'Reuters' | 'Bloomberg' | 'WSJ' | 'CNBC' | 'MarketWatch'
  timestamp: string
  snippet: string
  category: 'earnings' | 'market' | 'economy' | 'company'
  tickers?: string[]
  url?: string
}
```

## Tab 3: Economic Data

### Display Format
Category cards with tables showing expected vs actual values, plus interactive Fed dot plot.

### Top Banner
Shows next upcoming releases with countdown (e.g., "Non-Farm Payrolls in 2 days")

### Category Tables

**Employment:**
- Non-Farm Payrolls
- Unemployment Rate
- Initial Jobless Claims

**Inflation:**
- CPI YoY
- Core CPI YoY
- PCE YoY

**Growth:**
- GDP QoQ
- ISM Manufacturing PMI
- Consumer Confidence
- Retail Sales MoM
- Housing Starts
- Trade Balance

### Table Columns
| Indicator | Previous | Expected | Actual | Surprise (Δ) | Date |

### Surprise Indicators
- 🟢 Green: Actual beats expected (good for markets)
- 🔴 Red: Actual misses expected (bad for markets)
- ⚪ Gray: In-line with expected

### Fed & Interest Rates Section (Special)
- Current Fed Funds Rate
- Next FOMC meeting date
- Market expectations (% hold vs cut vs hike)
- Interactive dot plot
- 10Y/2Y Treasury spread (yield curve indicator)

### Fed Dot Plot Features
- Scatter chart visualization
- X-axis: years (2025, 2026, 2027, Longer Run)
- Y-axis: rate levels (2.5% - 5.5%)
- Two series: current meeting (●) vs previous meeting (○)
- Hover tooltip: "X officials project Y% for 2025"
- Median line highlighted
- Legend showing meeting dates

### Row Interactions
- Click any indicator row to see historical chart

## Data Types

```typescript
// src/types/markets.ts

// Indices
export interface MarketIndex {
  id: string
  symbol: string
  name: string
  value: number
  change: number
  changePercent: number
  sparklineData: number[]
  region: 'US' | 'International' | 'Emerging'
}

// News
export interface NewsItem {
  id: string
  headline: string
  source: 'Reuters' | 'Bloomberg' | 'WSJ' | 'CNBC' | 'MarketWatch'
  timestamp: string
  snippet: string
  category: 'earnings' | 'market' | 'economy' | 'company'
  tickers?: string[]
}

export type NewsFilter = 'all' | 'holdings' | 'market' | 'earnings'

// Economic Data
export interface EconomicIndicator {
  id: string
  name: string
  category: 'employment' | 'inflation' | 'fed' | 'growth'
  previous: number | string
  expected: number | string
  actual: number | string
  surprise: number
  surpriseDirection: 'beat' | 'miss' | 'inline'
  releaseDate: string
  nextRelease?: string
  unit: string
  description?: string
}

export interface FedDotPlotPoint {
  year: number
  rate: number
  count: number
  meeting: 'current' | 'previous'
}

export interface FedData {
  currentRate: string
  nextMeeting: string
  marketExpectations: {
    hold: number
    cut: number
    hike: number
  }
  dotPlot: FedDotPlotPoint[]
  yieldCurveSpread: number
}
```

## Component Architecture

```
src/components/markets/
├── MarketsPage.tsx          # Main page with tab state
├── TabSelector.tsx          # Reusable tab component
├── indices/
│   ├── IndicesTab.tsx       # Grid container + index selector
│   ├── IndexCard.tsx        # Individual index card with sparkline
│   └── IndexDetailModal.tsx # Expanded chart view (modal)
├── news/
│   ├── NewsTab.tsx          # Feed container
│   ├── NewsFilters.tsx      # Filter chips component
│   └── NewsCard.tsx         # Individual news item
└── economic/
    ├── EconomicDataTab.tsx  # Main container with all sections
    ├── IndicatorTable.tsx   # Reusable category table
    ├── FedSection.tsx       # Fed rates + expectations + dot plot
    ├── DotPlotChart.tsx     # Interactive scatter plot (Recharts)
    └── UpcomingBanner.tsx   # Next releases countdown
```

## Mock Data

Create `src/utils/marketsMockData.ts` containing:
- `marketIndices`: Array of 12+ indices with sparkline data
- `newsItems`: Array of 20+ news items across categories
- `economicIndicators`: Array of all indicators with historical data
- `fedData`: Current Fed data with dot plot points

## Visual Design

### Styling
- Follows existing "Dark Luxe Terminal" theme
- Glass card styling (`glass-card` class)
- Obsidian backgrounds with emerald/gold accents
- Framer Motion animations for tab transitions and card interactions

### Color Coding
- Positive changes: `text-emerald-400`
- Negative changes: `text-red-400`
- Neutral: `text-gray-400`
- Beat expectations: `bg-emerald-500/20`
- Miss expectations: `bg-red-500/20`

### Sparkline Charts
- Use Recharts `<LineChart>` with minimal styling
- No axes, just the line
- 7-day data points
- Stroke color matches change direction

## Implementation Notes

1. Reuse `IndexSelector` pattern from Performance chart for index selection
2. News filtering should check if `tickers` array intersects with user's portfolio holdings
3. Economic data tables should be collapsible by category
4. Fed dot plot requires custom Recharts scatter chart with hover state
5. Consider localStorage for persisting user's index selection

## Future Enhancements (Out of Scope)

- Real-time data via WebSocket
- Push notifications for economic releases
- Custom alerts for indicator thresholds
- Historical comparison views
- Export to CSV/PDF
