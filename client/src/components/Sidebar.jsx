import { useTheme } from '../contexts/ThemeContext'

const Sidebar = ({ currentTab, setTab, isOpen, setIsOpen }) => {
  const {
    currentTheme,
    getNavClass,
    getTextClass,
  } = useTheme()

  const tabs = [
    { id: 'home', label: 'Home', icon: 'fa-home' },
    { id: 'gear', label: 'Gear Storage', icon: 'fa-box-open' },
    { id: 'mvp', label: 'MVP Tracker', icon: 'fa-skull' },
    { id: 'events', label: 'Events', icon: 'fa-calendar-alt' },
  ]

  const getSidebarClass = () => {
    if (currentTheme === 'light') return 'bg-white border-r border-slate-200'
    if (currentTheme === 'dark') return 'bg-guild-800 border-r border-guild-700'
    if (currentTheme === 'cute') return 'bg-[#2a2438] border-r border-pink-500/20'
    if (currentTheme === 'mesi') return 'bg-[#0000FF] border-r-4 border-[#FFFF00]'
    return 'bg-[#006699] border-r border-black'
  }

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col h-[calc(100vh-4rem)] md:h-auto mt-16 md:mt-0 overflow-y-auto ${getSidebarClass()}`}
      >
        <div className="p-4 space-y-2">
          <div className={`text-xs font-bold uppercase opacity-50 mb-2 ${getTextClass()}`}>
            Menu
          </div>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setTab(tab.id)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-3 transition-all duration-200 ${getNavClass(
                tab.id,
                currentTab
              )}`}
            >
              <i className={`fa-solid ${tab.icon} w-5 text-center`}></i>
              <span className="font-medium">
                {currentTheme === 'rms' ? `[ ${tab.label} ]` : tab.label}
              </span>
            </button>
          ))}
        </div>
      </aside>
    </>
  )
}

export default Sidebar
