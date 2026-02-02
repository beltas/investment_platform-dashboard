import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Wallet,
  LineChart,
  Brain,
  Bell,
  Settings,
  ChevronRight,
  TrendingUp,
  LogOut,
} from 'lucide-react'
import { useNavigation, PageId } from '../context/NavigationContext'

interface NavItem {
  id: PageId
  icon: React.ReactNode
  label: string
  badge?: number
}

const navItems: NavItem[] = [
  { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
  { id: 'portfolio', icon: <Wallet className="w-5 h-5" />, label: 'Portfolio' },
  { id: 'markets', icon: <LineChart className="w-5 h-5" />, label: 'Markets' },
  { id: 'predictions', icon: <Brain className="w-5 h-5" />, label: 'Predictions', badge: 4 },
  { id: 'alerts', icon: <Bell className="w-5 h-5" />, label: 'Alerts', badge: 2 },
  { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
]

export function Sidebar() {
  const { currentPage, setCurrentPage } = useNavigation()

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed left-0 top-0 bottom-0 w-72 bg-obsidian-900/95 backdrop-blur-xl border-r border-obsidian-700/50 z-40 flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-obsidian-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-emerald-glow">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-white tracking-tight">
              Agora
            </h1>
            <p className="text-xs text-gray-500">Investment Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item, index) => {
          const isActive = currentPage === item.id
          return (
            <motion.button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-obsidian-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-emerald-400' : 'text-gray-500 group-hover:text-gray-400'}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </div>

              {item.badge ? (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-400">
                  {item.badge}
                </span>
              ) : isActive ? (
                <ChevronRight className="w-4 h-4 text-emerald-400" />
              ) : null}
            </motion.button>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-obsidian-700/50">
        {/* Quick Stats */}
        <div className="mb-4 p-4 rounded-xl bg-obsidian-800/50 border border-obsidian-700/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Today's P&L</span>
            <span className="text-emerald-400 text-xs font-mono">+1.04%</span>
          </div>
          <p className="font-mono text-lg font-semibold text-emerald-400">+$12,847.32</p>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-obsidian-800/50 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center border border-gold-500/30">
            <span className="font-bold text-gold-400 text-sm">PB</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Periklis Beltas</p>
            <p className="text-xs text-gray-500">Premium Account</p>
          </div>
          <LogOut className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </motion.aside>
  )
}
