import { useTheme } from '../contexts/ThemeContext'

const Home = ({ setTab }: any) => {
  const { currentTheme, getCardClass, getTextClass, getSubTextClass } =
    useTheme()

  const getBannerClass = () => {
    if (currentTheme === 'rms')
      return 'bg-[#EFEFEF] border border-black mb-4 rounded-none shadow-none py-10'
    return 'rounded-xl shadow-xl mb-12 group'
  }

  const getBannerOverlay = () => {
    if (currentTheme === 'light') return 'bg-white/80'
    if (currentTheme === 'dark') return 'bg-black/60'
    if (currentTheme === 'cute') return 'bg-[#2e1065]/70'
    if (currentTheme === 'mesi') return 'bg-[#0000FF]/50'
    return 'bg-[#410be1]/30'
  }

  const getBannerIconClass = () => {
    if (currentTheme === 'cute') return 'text-pink-400'
    if (currentTheme === 'mesi') return 'text-[#FFFF00]'
    if (currentTheme === 'rms') return 'text-white text-6xl'
    return 'text-guild-accent'
  }

  const getBannerTitleClass = () => {
    if (currentTheme === 'light') return 'text-slate-900'
    return 'text-white'
  }

  const getBannerSubtitleClass = () => {
    if (currentTheme === 'light') return 'text-slate-500'
    if (currentTheme === 'dark') return 'text-slate-400'
    if (currentTheme === 'cute') return 'text-pink-200/80'
    if (currentTheme === 'mesi')
      return 'text-white font-bold bg-[#0000FF] inline-block px-2'
    return ''
  }

  const getPrimaryButtonClass = () => {
    if (currentTheme === 'light')
      return 'bg-guild-accent hover:bg-cyan-400 text-white font-bold py-3 px-8 rounded-full shadow-lg'
    if (currentTheme === 'dark')
      return 'bg-guild-accent hover:bg-cyan-400 text-guild-900 font-bold py-3 px-8 rounded-full shadow-lg'
    if (currentTheme === 'cute')
      return 'bg-pink-500 hover:bg-pink-400 text-white font-bold py-3 px-8 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all hover:shadow-[0_0_25px_rgba(236,72,153,0.7)]'
    if (currentTheme === 'mesi')
      return 'bg-[#FFFF00] text-[#0000FF] border-4 border-[#FF00FF] font-black py-3 px-8 hover:bg-[#00FF00] hover:border-[#FF0000]'
    return 'btn-primary px-4 py-1'
  }

  const getSecondaryButtonClass = () => {
    if (currentTheme === 'light')
      return 'bg-slate-800 hover:bg-slate-700 text-white border-slate-600 font-bold py-3 px-8 rounded-full shadow-lg border'
    if (currentTheme === 'dark')
      return 'bg-guild-700 hover:bg-guild-600 text-white border-guild-600 font-bold py-3 px-8 rounded-full shadow-lg border'
    if (currentTheme === 'cute')
      return 'bg-[#2a2438] hover:bg-[#362d4a] text-pink-100 border-pink-500/50 font-bold py-3 px-8 rounded-full shadow-lg border'
    if (currentTheme === 'mesi')
      return 'bg-[#0000FF] text-white border-4 border-[#FFFF00] font-black py-3 px-8 hover:bg-[#FF00FF] hover:text-[#FFFF00]'
    return 'btn-primary px-4 py-1'
  }

  return (
    <>
      <div
        className={`text-center py-24 relative overflow-hidden ${getBannerClass()}`}
      >
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/banner.png"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            alt="Guild Banner"
            onError={(e) => (e.target.style.display = 'none')}
          />
          <div className={`absolute inset-0 transition-colors duration-300 ${getBannerOverlay()}`}></div>
        </div>

        <div
          className={`relative z-10 ${currentTheme === 'rms' ? 'banner-text-container' : ''}`}
        >
          <div className={`text-6xl mb-6 animate-bounce ${getBannerIconClass()}`}>
            <i className="fa-solid fa-fish"></i>
          </div>
          <h1 className={`text-5xl font-bold mb-4 ${getBannerTitleClass()}`}>
            Welcome to Big Fish
          </h1>
          <p
            className={`text-xl max-w-2xl mx-auto mb-10 ${getBannerSubtitleClass()}`}
          >
            The premier hub for managing guild shenanigans, tracking gear,
            organizing events, and hunting MVPs.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setTab('events')}
              className={`transition-transform transform hover:scale-105 ${getPrimaryButtonClass()}`}
            >
              Join Event
            </button>
            <button
              onClick={() => setTab('gear')}
              className={`transition-transform transform hover:scale-105 ${getSecondaryButtonClass()}`}
            >
              Track Gear
            </button>
          </div>
        </div>
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 ${
          currentTheme === 'rms' ? 'gap-2' : ''
        }`}
      >
        <div
          className={`cursor-pointer card ${getCardClass()}`}
          onClick={() => setTab('mvp')}
        >
          {currentTheme === 'rms' && (
            <div className="card-header">Active MVPs</div>
          )}
          <div className={`p-6 ${currentTheme === 'rms' ? 'p-2 content-row' : ''}`}>
            {currentTheme !== 'rms' && (
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-semibold ${getTextClass()}`}>
                  Active MVPs
                </h3>
                <i className="fa-solid fa-skull text-red-400"></i>
              </div>
            )}
            <div className="flex items-center justify-between">
              <p className={`text-3xl font-bold ${getTextClass()}`}>3</p>
              {currentTheme === 'rms' && (
                <i className="fa-solid fa-skull text-red-600"></i>
              )}
            </div>
            <p className={`text-sm mt-2 ${getSubTextClass()}`}>
              Bosses currently spawned
            </p>
          </div>
        </div>

        <div
          className={`cursor-pointer card ${getCardClass()}`}
          onClick={() => setTab('events')}
        >
          {currentTheme === 'rms' && <div className="card-header">Next Event</div>}
          <div className={`p-6 ${currentTheme === 'rms' ? 'p-2 content-row' : ''}`}>
            {currentTheme !== 'rms' && (
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-semibold ${getTextClass()}`}>
                  Next Event
                </h3>
                <i className="fa-solid fa-calendar-days text-yellow-400"></i>
              </div>
            )}
            <div className="flex items-center justify-between">
              <p className={`text-xl font-bold ${getTextClass()}`}>
                Guild War (WoE)
              </p>
              {currentTheme === 'rms' && (
                <i className="fa-solid fa-calendar-days text-blue-600"></i>
              )}
            </div>
            <p className={`text-sm mt-2 ${getSubTextClass()}`}>
              Starts in 2h 15m
            </p>
          </div>
        </div>

        <div
          className={`cursor-pointer card ${getCardClass()}`}
          onClick={() => setTab('gear')}
        >
          {currentTheme === 'rms' && (
            <div className="card-header">Guild Bank</div>
          )}
          <div className={`p-6 ${currentTheme === 'rms' ? 'p-2 content-row' : ''}`}>
            {currentTheme !== 'rms' && (
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-semibold ${getTextClass()}`}>
                  Guild Bank
                </h3>
                <i className="fa-solid fa-coins text-yellow-500"></i>
              </div>
            )}
            <div className="flex items-center justify-between">
              <p className={`text-3xl font-bold ${getTextClass()}`}>12.5M</p>
              {currentTheme === 'rms' && (
                <i className="fa-solid fa-coins text-yellow-600"></i>
              )}
            </div>
            <p className={`text-sm mt-2 ${getSubTextClass()}`}>
              Zeny Accumulated
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home

