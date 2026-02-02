import {
  Sidebar,
  MarketTicker,
  DashboardPage,
  PortfolioPage,
  MarketsPage,
  PredictionsPage,
} from './components'
import { marketTickers } from './utils/mockData'
import { NavigationProvider, useNavigation } from './context/NavigationContext'

function PageRouter() {
  const { currentPage } = useNavigation()

  // Render the current page based on navigation state
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />
      case 'portfolio':
        return <PortfolioPage />
      case 'markets':
        return <MarketsPage />
      case 'predictions':
        return <PredictionsPage />
      case 'alerts':
        return (
          <div className="p-8">
            <h1 className="font-display text-3xl font-bold text-white">Alerts</h1>
            <p className="text-gray-400 mt-2">Coming soon...</p>
          </div>
        )
      case 'settings':
        return (
          <div className="p-8">
            <h1 className="font-display text-3xl font-bold text-white">Settings</h1>
            <p className="text-gray-400 mt-2">Coming soon...</p>
          </div>
        )
      default:
        return <DashboardPage />
    }
  }

  return (
    <div className="min-h-screen bg-luxe-gradient">
      {/* Market Ticker - Top Bar */}
      <div className="fixed top-0 left-72 right-0 z-30">
        <MarketTicker tickers={marketTickers} />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-72 pt-14 min-h-screen">
        {renderPage()}
      </main>

      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Top-right emerald glow */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        {/* Bottom-left gold glow */}
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  )
}

function App() {
  return (
    <NavigationProvider>
      <PageRouter />
    </NavigationProvider>
  )
}

export default App
