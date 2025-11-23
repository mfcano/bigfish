import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'

const Navigation = ({ currentTab, setTab, serverTime, localTime, user, sidebarOpen, setSidebarOpen }) => {
  const {
    currentTheme,
    getNavButtonClass,
    getTitleClass,
    getTimeClass,
    getLogoClass
  } = useTheme()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

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

  return (
    <nav
      className={`sticky top-0 z-50 transition-colors duration-300 border-b h-16 ${
        currentTheme !== 'rms' && currentTheme !== 'cute' && currentTheme !== 'mesi'
          ? 'shadow-lg'
          : ''
      } ${getNavBarClass()}`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* Left: Mobile Menu & Logo */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              type="button"
              className={`md:hidden inline-flex items-center justify-center p-2 rounded-md focus:outline-none ${getNavButtonClass()}`}
            >
              <i className={`fa-solid ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>

            {/* Logo */}
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
          </div>

          {/* Middle: Server Time (Hidden on mobile) */}
          <div className={`font-mono text-xs hidden md:block ${getTimeClass()}`}>
              <span>{`Server: ${serverTime} (GMT) | Local: ${localTime}`}</span>
          </div>

          {/* Right: User Profile */}
          <div className="relative">
                <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              onBlur={() => setTimeout(() => setUserMenuOpen(false), 200)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors focus:outline-none ${getNavButtonClass()}`}
                >
              <div className="w-8 h-8 rounded-full border-2 border-white/20 overflow-hidden flex items-center justify-center bg-slate-700">
                {user?.photoURL ? (
                   <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <i className="fa-solid fa-user text-slate-300"></i>
                )}
              </div>
              <span className="font-bold hidden sm:block max-w-[150px] truncate">
                {user?.displayName || user?.email || 'Member'}
              </span>
              <i className="fa-solid fa-chevron-down text-xs opacity-70"></i>
                </button>

            {/* Dropdown */}
            {userMenuOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 focus:outline-none ${
                      currentTheme === 'light'
                        ? 'bg-white'
                        : currentTheme === 'dark'
                        ? 'bg-guild-800 border border-guild-700'
                        : currentTheme === 'cute'
                        ? 'bg-[#2a2438] border border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.2)]'
                    : currentTheme === 'mesi'
                    ? 'bg-[#0000FF] border-4 border-[#FFFF00]'
                    : 'bg-[#006699] border-white/20'
                    }`}
                  >
                <div className={`px-4 py-2 text-xs opacity-50 border-b mb-1 ${
                  currentTheme === 'light' ? 'border-slate-200' : 'border-white/10'
                } ${
                   currentTheme === 'light' ? 'text-slate-500' : 'text-white'
                }`}>
                  Signed in as<br/>
                  <span className="font-bold truncate block">{user?.email}</span>
                </div>

                    <button
                      onClick={() => {
                    setTab('account')
                    setUserMenuOpen(false)
                      }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-black/5 ${
                    currentTheme === 'light' ? 'text-gray-700' : 
                    currentTheme === 'mesi' ? 'text-[#FFFF00] hover:bg-[#FFFF00] hover:text-[#0000FF]' : 'text-white'
                      }`}
                    >
                  <i className="fa-solid fa-user-cog w-5 text-center mr-2"></i>
                  Account Settings
                    </button>

                    <button
                      onClick={() => {
                    handleSignOut()
                    setUserMenuOpen(false)
                      }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-black/5 ${
                    currentTheme === 'light' ? 'text-red-600' : 
                    currentTheme === 'mesi' ? 'text-[#FFFF00] hover:bg-[#FFFF00] hover:text-[#0000FF]' : 'text-red-400'
                      }`}
                    >
                  <i className="fa-solid fa-sign-out-alt w-5 text-center mr-2"></i>
                    Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
