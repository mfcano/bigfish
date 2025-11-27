import React, { createContext, useContext, useState, useEffect } from 'react'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { type ThemeContextType } from '../types/ThemeContextType'

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.PROD
    ? "https://api-dyd6pxy55a-uc.a.run.app"
    : "http://localhost:8000");

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }: { children: any }) => {
  const [currentTheme, setCurrentTheme] = useState('dark')
  const [mvpLayout, setMvpLayoutState] = useState('right')

  // Load theme and layout from local storage first
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setCurrentTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      applyTheme('dark')
    }

    const savedLayout = localStorage.getItem('mvpLayout')
    if (savedLayout) {
      setMvpLayoutState(savedLayout)
    }
  }, [])

  // Listen for auth changes to load user preference from API
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const response = await fetch(`${API_BASE}/users/${user.uid}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.theme) {
              setTheme(data.theme) // This updates state and local storage
            }
            if (data.mvp_layout) {
              setMvpLayout(data.mvp_layout)
            }
          }
        } catch (error) {
          console.error('Error loading theme preference:', error)
        }
      }
    })
    return () => unsubscribe()
  }, [])

  const applyTheme = (theme: string) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // Remove all theme classes from body
    document.body.classList.remove('theme-rms')
    
    // Add RMS theme class if needed
    if (theme === 'rms') {
      document.body.classList.add('theme-rms')
    }
  }

  const setTheme = (theme: string) => {
    setCurrentTheme(theme)
    applyTheme(theme)
    localStorage.setItem('theme', theme)
  }

  const setMvpLayout = (layout: string) => {
    setMvpLayoutState(layout)
    localStorage.setItem('mvpLayout', layout)
  }

  const getNavClass = (tabId: string, currentTab: string) => {
    const isActive = currentTab === tabId
    if (currentTheme === 'light') {
      return isActive
        ? 'bg-slate-100 text-slate-900'
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
    } else if (currentTheme === 'dark') {
      return isActive
        ? 'bg-guild-700 text-white'
        : 'text-slate-400 hover:bg-guild-700 hover:text-white'
    } else if (currentTheme === 'cute') {
      return isActive
        ? 'bg-pink-500/20 text-pink-100 border border-pink-500/30'
        : 'text-pink-300/70 hover:bg-pink-500/10 hover:text-pink-200'
    } else if (currentTheme === 'mesi') {
      return isActive
        ? 'bg-[#FFFF00] text-[#0000FF] font-black border-4 border-[#FF00FF]'
        : 'text-white hover:bg-[#FFFF00] hover:text-[#0000FF] font-bold border-4 border-transparent hover:border-[#FF00FF]'
    } else {
      return isActive ? 'active' : ''
    }
  }

  const getNavButtonClass = () => {
    if (currentTheme === 'light')
      return 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
    if (currentTheme === 'dark')
      return 'text-slate-400 hover:text-white hover:bg-guild-700'
    if (currentTheme === 'cute')
      return 'text-pink-300 hover:text-pink-100 hover:bg-pink-500/20'
    if (currentTheme === 'mesi')
      return 'text-[#FFFF00] hover:bg-[#FFFF00] hover:text-[#0000FF]'
    return 'text-white hover:bg-white/20'
  }

  const getLogoClass = () => {
    if (currentTheme === 'light' || currentTheme === 'dark')
      return 'text-guild-accent text-2xl'
    if (currentTheme === 'cute')
      return 'text-pink-400 text-2xl drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]'
    if (currentTheme === 'mesi')
      return 'text-[#FFFF00] text-3xl animate-spin'
    return 'text-white text-sm'
  }

  const getTitleClass = () => {
    if (currentTheme === 'light') return 'text-slate-900 text-xl'
    if (currentTheme === 'dark') return 'text-white text-xl'
    if (currentTheme === 'cute')
      return 'text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 text-xl font-extrabold'
    if (currentTheme === 'mesi')
      return 'text-[#FFFF00] text-2xl uppercase italic tracking-widest bg-[#FF00FF] px-2'
    return 'text-white text-xs'
  }

  const getTimeClass = () => {
    if (currentTheme === 'light') return 'text-slate-600'
    if (currentTheme === 'dark') return 'text-slate-400'
    if (currentTheme === 'cute') return 'text-pink-300/70'
    if (currentTheme === 'mesi') return 'text-[#00FF00] bg-black px-1'
    return 'text-white text-[10px]'
  }

  const getCardClass = () => {
    if (currentTheme === 'light')
      return 'bg-white border-slate-200 hover:border-guild-accent transition-colors'
    if (currentTheme === 'dark')
      return 'bg-guild-800 border-guild-700 hover:border-guild-accent transition-colors'
    if (currentTheme === 'cute')
      return 'bg-[#2a2438] border-pink-500/20 hover:border-pink-400/50 hover:shadow-[0_0_15px_rgba(236,72,153,0.15)] transition-all duration-300'
    if (currentTheme === 'mesi')
      return 'bg-[#0000FF] border-4 border-[#FFFF00] shadow-none rounded-none'
    return 'theme-rms-card'
  }

  const getPrimaryButtonClass = () => {
    if (currentTheme === 'light') return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
    if (currentTheme === 'dark') return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
    if (currentTheme === 'cute') return 'bg-pink-400 text-white hover:bg-pink-500 focus:ring-pink-300'
    if (currentTheme === 'mesi') return 'bg-[#FFFF00] text-[#0000FF] hover:bg-[#0000FF] hover:text-[#FFFF00] font-black border-4 border-[#0000FF] hover:border-[#FFFF00]'
    return 'bg-blue-700 text-white hover:bg-blue-800'
  }

  const getSecondaryButtonClass = () => {
    if (currentTheme === 'light') return 'bg-slate-200 hover:bg-slate-300 text-slate-900'
    if (currentTheme === 'dark') return 'bg-guild-700 hover:bg-guild-600 text-white'
    if (currentTheme === 'cute') return 'bg-pink-900/30 hover:bg-pink-800/50 text-pink-100 border border-pink-500/20'
    return 'bg-[#FF0000] text-[#FFFF00] border-2 border-white hover:bg-[#00FF00] hover:text-[#0000FF] font-bold'
  }

  const getTextClass = () => {
    if (currentTheme === 'light') return 'text-slate-900'
    if (currentTheme === 'dark') return 'text-white'
    if (currentTheme === 'cute') return 'text-pink-50'
    if (currentTheme === 'mesi') return 'text-[#FFFF00] font-black tracking-tighter'
    return 'text-[#000000]'
  }

  const getSubTextClass = () => {
    if (currentTheme === 'light') return 'text-slate-500'
    if (currentTheme === 'dark') return 'text-slate-400'
    if (currentTheme === 'cute') return 'text-pink-200/60'
    if (currentTheme === 'mesi') return 'text-white font-bold'
    return 'text-[#000000]'
  }

  const getBadgeClass = (paid: any) => {
    if (paid) {
      if (currentTheme === 'dark') return 'bg-green-900 text-green-300'
      if (currentTheme === 'light') return 'bg-green-100 text-green-800'
      if (currentTheme === 'cute')
        return 'bg-emerald-900/40 text-emerald-200 border border-emerald-500/20'
      if (currentTheme === 'mesi')
        return 'bg-[#00FF00] text-[#0000FF] border-4 border-[#FF00FF]'
      return 'text-[green] font-bold'
    } else {
      if (currentTheme === 'dark') return 'bg-red-900 text-red-300'
      if (currentTheme === 'light') return 'bg-red-100 text-red-800'
      if (currentTheme === 'cute')
        return 'bg-rose-900/40 text-rose-200 border border-rose-500/20'
      if (currentTheme === 'mesi')
        return 'bg-[#FF0000] text-[#FFFF00] border-4 border-[#000000] animate-pulse'
      return 'text-[red] font-bold'
    }
  }

  const getStatusColor = (status: string) => {
    if (status === 'alive') {
      if (currentTheme === 'dark')
        return 'bg-green-900 text-green-300 border border-green-700'
      if (currentTheme === 'light')
        return 'bg-green-100 text-green-800 border border-green-200'
      if (currentTheme === 'cute')
        return 'bg-emerald-900/30 text-emerald-200 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
      if (currentTheme === 'mesi')
        return 'bg-[#00FF00] text-[#0000FF] border-4 border-[#FFFF00] font-black text-xl'
      return 'text-[green] font-bold'
    } else {
      if (currentTheme === 'dark')
        return 'bg-red-900 text-red-300 border border-red-700 opacity-60'
      if (currentTheme === 'light')
        return 'bg-red-100 text-red-800 border border-red-200 opacity-60'
      if (currentTheme === 'cute')
        return 'bg-rose-900/30 text-rose-300 border border-rose-500/30 opacity-60'
      if (currentTheme === 'mesi')
        return 'bg-[#FF00FF] text-[#FFFF00] border-4 border-[#00FF00] line-through decoration-4 decoration-white'
      return 'text-[red] font-bold'
    }
  }

  const getRoleBadgeClass = (filled: any, needed: any) => {
    const isFull = filled >= needed
    if (isFull) {
      if (currentTheme === 'dark')
        return 'bg-green-900 text-green-300 border-green-700'
      if (currentTheme === 'light')
        return 'bg-green-100 text-green-800 border-green-200'
      if (currentTheme === 'cute')
        return 'bg-emerald-900/30 text-emerald-200 border-emerald-500/30'
      if (currentTheme === 'mesi')
        return 'bg-[#00FF00] text-[#0000FF] border-4 border-[#FFFF00]'
      return 'text-[green] font-bold'
    } else {
      if (currentTheme === 'dark')
        return 'bg-guild-900 text-slate-300 border-guild-600'
      if (currentTheme === 'light')
        return 'bg-slate-100 text-slate-700 border-slate-200'
      if (currentTheme === 'cute')
        return 'bg-[#1e1b2e] text-pink-200/70 border-pink-500/20'
      if (currentTheme === 'mesi')
        return 'bg-[#0000FF] text-[#FFFF00] border-4 border-[#FF0000]'
      return 'text-[#000000]'
    }
  }

  const getBodyClass = () => {
    if (currentTheme === 'light')
      return 'bg-slate-50 text-slate-800'
    if (currentTheme === 'dark') return 'bg-guild-900 text-slate-200'
    if (currentTheme === 'cute')
      return 'bg-[#1e1b2e] text-pink-50 selection:bg-pink-500 selection:text-white'
    if (currentTheme === 'mesi')
      return 'bg-[#0000FF] text-white font-mono selection:bg-[#FFFF00] selection:text-[#0000FF]'
    return 'theme-rms'
  }

  const getInputClass = () => {
    if (currentTheme === 'light')
      return 'block min-w-0 grow bg-slate-500/20 text-slate-800 py-1.5 pr-3 pl-1 text-base text-slate-800 placeholder:text-gray-500 focus:outline-none sm:text-sm/6 rounded transition-colors hover:text-slate-900 hover:bg-slate-100'
    if (currentTheme === 'dark') 
      return 'block min-w-0 grow bg-guild-800/70 text-slate-200 py-1.5 pr-3 pl-1 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6 rounded transition-colors hover:text-white hover:bg-guild-700'
    if (currentTheme === 'cute')
      return 'block min-w-0 grow bg-pink-900/20  text-pink-50 selection:bg-pink-500 selection:text-white py-1.5 pr-3 pl-1 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6 rounded transition-colors hover:text-pink-100 hover:bg-pink-500/20'
    if (currentTheme === 'mesi')
      return 'block min-w-0 grow bg-[#0000FF] text-white font-mono selection:bg-[#FFFF00] selection:text-[#0000FF] py-1.5 pr-3 pl-1 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6 rounded transition-colors hover:bg-[#FFFF00] hover:text-[#0000FF]'
    return 'text-white hover:bg-white/20' //TODO
  }

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        getNavClass,
        getNavButtonClass,
        getLogoClass,
        getTitleClass,
        getTimeClass,
        getCardClass,
        getPrimaryButtonClass,
        getSecondaryButtonClass,
        getTextClass,
        getSubTextClass,
        getBadgeClass,
        getStatusColor,
        getRoleBadgeClass,
        getBodyClass,
        mvpLayout,
        setMvpLayout,
        getInputClass
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
