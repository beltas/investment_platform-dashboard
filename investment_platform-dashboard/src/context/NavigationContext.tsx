import { createContext, useContext, useState, ReactNode } from 'react'

export type PageId = 'dashboard' | 'portfolio' | 'markets' | 'predictions' | 'alerts' | 'settings'

interface NavigationContextType {
  currentPage: PageId
  setCurrentPage: (page: PageId) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard')

  return (
    <NavigationContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
