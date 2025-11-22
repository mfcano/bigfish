import { useState, useEffect } from 'react'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { useTime } from './hooks/useTime'
import Navigation from './components/Navigation'
import Home from './components/Home'
import GearStorage from './components/GearStorage'
import MvpTracker from './components/MvpTracker'
import Events from './components/Events'
import Footer from './components/Footer'

const AppContent = () => {
  const [currentTab, setCurrentTab] = useState('home')
  const { getBodyClass } = useTheme()
  const { serverTime, localTime } = useTime()

  useEffect(() => {
    const savedTab = localStorage.getItem('currentTab')
    if (savedTab) {
      setCurrentTab(savedTab)
    }
  }, [])

  const handleSetTab = (tabId) => {
    setCurrentTab(tabId)
    localStorage.setItem('currentTab', tabId)
  }

  const bodyClasses = `min-h-screen flex flex-col transition-colors duration-300 ${getBodyClass()}`

  return (
    <div className={bodyClasses}>
      <Navigation
        currentTab={currentTab}
        setTab={handleSetTab}
        serverTime={serverTime}
        localTime={localTime}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        {currentTab === 'home' && <Home setTab={handleSetTab} />}
        {currentTab === 'gear' && <GearStorage />}
        {currentTab === 'mvp' && <MvpTracker />}
        {currentTab === 'events' && <Events />}
      </main>
      <Footer />
    </div>
  )
}

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App

