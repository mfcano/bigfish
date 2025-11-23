import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'

const Navigation = ({ currentTab, setTab, serverTime, localTime, user }) => {
  const {
    currentTheme,
    setTheme,
    getNavClass,
    getTextClass,
    getSubTextClass,
  } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'gear', label: 'Gear Storage' },
    { id: 'mvp', label: 'MVP Tracker' },
    { id: 'events', label: 'Events' },
  ]

  const getNavBarClass = () => {
    if (currentTheme === 'light')
      return 'bg-white border-slate-200'
    if (currentTheme === 'dark') return 'bg-guild-800 border-guild-700'
    if (currentTheme === 'cute')
      return 'bg-[#2a2438] border-pink-500/20 shadow-[0_4px_20px_-5px_rgba(236,72,153,0.1)]'
    if (currentTheme === 'mesi')
      return 'bg-[#0000FF] border-b-4 border-[#FFFF00]'
    return 'bg-[#006699] border-black'
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

  return (
    <nav
      className={`sticky top-0 z-50 transition-colors duration-300 border-b ${
        currentTheme !== 'rms' && currentTheme !== 'cute' && currentTheme !== 'mesi'
          ? 'shadow-lg'
          : ''
      } ${getNavBarClass()}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between ${
            currentTheme === 'rms' ? 'h-10' : 'h-16'
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setTab('home')}
            >
              <div className={`flex-shrink-0 mr-2 ${getLogoClass()}`}>
                <i className="fa-solid fa-fish"></i>
              </div>
              <div className={`font-bold tracking-tight ${getTitleClass()}`}>
                BIG FISH
              </div>
            </div>
            <div
              className={`font-mono text-xs hidden md:block ${getTimeClass()}`}
            >
              <span>{`Server: ${serverTime} (GMT) | Local: ${localTime}`}</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTab(tab.id)}
                  className={`px-3 py-2 rounded-md transition-colors duration-200 nav-link ${getNavClass(
                    tab.id,
                    currentTab
                  )}`}
                >
                  {currentTheme === 'rms' ? `[ ${tab.label} ]` : tab.label}
                </button>
              ))}

              <div className="relative ml-4">
                <button
                  onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                  onBlur={() => setTimeout(() => setThemeMenuOpen(false), 200)}
                  className={`p-2 rounded-md focus:outline-none flex items-center gap-2 transition-colors ${getNavButtonClass()}`}
                >
                  <i className="fa-solid fa-palette"></i>
                  <span className="font-bold uppercase">{currentTheme}</span>
                </button>

                {themeMenuOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 focus:outline-none ${
                      currentTheme === 'light'
                        ? 'bg-white'
                        : currentTheme === 'dark'
                        ? 'bg-guild-800 border border-guild-700'
                        : currentTheme === 'cute'
                        ? 'bg-[#2a2438] border border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.2)]'
                        : 'bg-[#0000FF] border-4 border-[#FFFF00]'
                    }`}
                  >
                    <button
                      onClick={() => {
                        setTheme('light')
                        setThemeMenuOpen(false)
                      }}
                      className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-guild-700 ${
                        currentTheme === 'light'
                          ? 'text-gray-900'
                          : 'text-white'
                      }`}
                    >
                      <i className="fa-solid fa-sun w-6 text-center"></i> Light
                      Mode
                    </button>
                    <button
                      onClick={() => {
                        setTheme('dark')
                        setThemeMenuOpen(false)
                      }}
                      className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-guild-700 ${
                        currentTheme === 'light'
                          ? 'text-gray-900'
                          : 'text-white'
                      }`}
                    >
                      <i className="fa-solid fa-moon w-6 text-center"></i> Dark
                      Mode
                    </button>
                    <button
                      onClick={() => {
                        setTheme('cute')
                        setThemeMenuOpen(false)
                      }}
                      className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-guild-700 hover:text-pink-300 ${
                        currentTheme === 'light'
                          ? 'text-gray-900'
                          : 'text-white'
                      }`}
                    >
                      <i className="fa-solid fa-heart w-6 text-center text-pink-400"></i>{' '}
                      Cute Mode
                    </button>
                    <button
                      onClick={() => {
                        setTheme('mesi')
                        setThemeMenuOpen(false)
                      }}
                      className={`block px-4 py-2 text-sm w-full text-left hover:bg-[#FFFF00] hover:text-[#0000FF] font-bold ${
                        currentTheme === 'light'
                          ? 'text-gray-900'
                          : 'text-white'
                      }`}
                    >
                      <i className="fa-solid fa-eye w-6 text-center text-[#FFFF00]"></i>{' '}
                      Mesi Mode
                    </button>
                    <button
                      onClick={() => {
                        setTheme('rms')
                        setThemeMenuOpen(false)
                      }}
                      className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-guild-700 ${
                        currentTheme === 'light'
                          ? 'text-gray-900'
                          : 'text-white'
                      }`}
                    >
                      <i className="fa-solid fa-scroll w-6 text-center"></i>{' '}
                      Ragnarok 2005
                    </button>
                  </div>
                )}
              </div>

              <div className="ml-4">
                <button
                  onClick={handleSignOut}
                  className={`p-2 rounded-md focus:outline-none flex items-center gap-2 transition-colors ${getNavButtonClass()}`}
                >
                  <i className="fa-solid fa-sign-out-alt"></i>
                  <span className="font-bold uppercase hidden lg:inline">
                    Sign Out
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none ${getNavButtonClass()}`}
            >
              <i
                className={`fa-solid ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}
              ></i>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden">
          <div
            className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 border-b ${
              currentTheme === 'light'
                ? 'bg-white border-slate-200'
                : currentTheme === 'dark'
                ? 'bg-guild-800 border-guild-700'
                : currentTheme === 'cute'
                ? 'bg-[#2a2438] border-pink-500/20'
                : currentTheme === 'mesi'
                ? 'bg-[#0000FF] border-[#FFFF00]'
                : 'bg-[#006699] border-black'
            }`}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setTab(tab.id)
                  setMobileMenuOpen(false)
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium nav-link ${getNavClass(
                  tab.id,
                  currentTab
                )}`}
              >
                {currentTheme === 'rms' ? `[ ${tab.label} ]` : tab.label}
              </button>
            ))}
            <div
              className={`border-t my-2 ${
                currentTheme === 'light'
                  ? 'border-slate-200'
                  : currentTheme === 'dark'
                  ? 'border-guild-700'
                  : currentTheme === 'cute'
                  ? 'border-pink-500/20'
                  : currentTheme === 'mesi'
                  ? 'border-[#FFFF00]'
                  : 'border-white/20'
              }`}
            ></div>
            <div
              className={`px-3 py-2 text-xs font-bold uppercase opacity-50 ${getTextClass()}`}
            >
              Theme
            </div>
            <button
              onClick={() => {
                setTheme('light')
                setMobileMenuOpen(false)
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${getTextClass()}`}
            >
              Light
            </button>
            <button
              onClick={() => {
                setTheme('dark')
                setMobileMenuOpen(false)
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${getTextClass()}`}
            >
              Dark
            </button>
            <button
              onClick={() => {
                setTheme('cute')
                setMobileMenuOpen(false)
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                currentTheme === 'light' ? 'text-slate-900' : 'text-pink-300'
              }`}
            >
              Cute Mode
            </button>
            <button
              onClick={() => {
                setTheme('mesi')
                setMobileMenuOpen(false)
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[#FFFF00] font-black`}
            >
              Mesi Mode
            </button>
            <button
              onClick={() => {
                setTheme('rms')
                setMobileMenuOpen(false)
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${getTextClass()}`}
            >
              Ragnarok 2005
            </button>

            <div
              className={`border-t my-2 ${
                currentTheme === 'light'
                  ? 'border-slate-200'
                  : currentTheme === 'dark'
                  ? 'border-guild-700'
                  : currentTheme === 'cute'
                  ? 'border-pink-500/20'
                  : currentTheme === 'mesi'
                  ? 'border-[#FFFF00]'
                  : 'border-white/20'
              }`}
            ></div>
            <button
              onClick={() => {
                handleSignOut()
                setMobileMenuOpen(false)
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${getTextClass()}`}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navigation

