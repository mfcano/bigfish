import { useTheme } from '../contexts/ThemeContext'
import { useMvps } from '../hooks/useMvps'

const MvpTracker = () => {
  const {
    currentTheme,
    getCardClass,
    getTextClass,
    getSubTextClass,
    getStatusColor,
  } = useTheme()
  const { mvps, loading, reportKill } = useMvps()

  const getTitleClass = () => {
    if (currentTheme === 'light')
      return 'text-slate-900 border-red-500'
    if (currentTheme === 'dark') return 'text-white border-red-500'
    if (currentTheme === 'cute')
      return 'text-pink-100 border-pink-600 drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]'
    if (currentTheme === 'mesi')
      return 'text-[#FFFF00] border-[#FF0000] bg-[#0000FF] inline-block pr-4'
    return 'text-[#006699] border-none pl-0 text-sm'
  }

  const getAlertButtonClass = () => {
    if (currentTheme === 'light' || currentTheme === 'dark')
      return 'bg-red-600 hover:bg-red-700'
    if (currentTheme === 'mesi')
      return 'bg-[#FF0000] text-[#FFFF00] border-2 border-white font-bold animate-pulse'
    return 'btn-primary px-2 py-0.5'
  }

  const getMvpCardClass = () => {
    if (currentTheme === 'light')
      return 'bg-white border-slate-200 hover:border-red-500'
    if (currentTheme === 'dark')
      return 'bg-black border-slate-800 hover:border-red-500'
    if (currentTheme === 'cute')
      return 'bg-[#2a2438] border-pink-500/20 hover:border-pink-400 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]'
    if (currentTheme === 'mesi')
      return 'bg-[#0000FF] border-4 border-[#FFFF00] rounded-none shadow-none'
    return ''
  }

  const getReportButtonClass = () => {
    if (currentTheme === 'light')
      return 'bg-slate-100 hover:bg-red-500 hover:text-white text-slate-700'
    if (currentTheme === 'dark')
      return 'bg-slate-700 hover:bg-red-600 text-slate-200'
    if (currentTheme === 'cute')
      return 'bg-pink-900/30 hover:bg-pink-500 hover:text-white text-pink-200 border border-pink-500/20'
    if (currentTheme === 'mesi')
      return 'bg-[#FF00FF] text-[#FFFF00] border-4 border-[#00FF00] font-black hover:bg-[#FFFF00] hover:text-[#FF0000] hover:border-[#000000]'
    return ''
  }

  const getMvpNameClass = () => {
    return 'text-xl font-bold transition-colors hover:underline text-white group-hover:text-red-400'
  }

  const getRespawnTimeClass = () => {
    if (currentTheme === 'light' || currentTheme === 'dark')
      return 'text-guild-accent'
    if (currentTheme === 'cute') return 'text-pink-400'
    if (currentTheme === 'mesi')
      return 'text-[#FFFF00] bg-[#FF00FF] px-1 inline-block'
    return ''
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className={getTextClass()}>Loading MVPs...</p>
      </div>
    )
  }

  return (
    <>
      <div
        className={`flex justify-between items-center mb-6 ${
          currentTheme === 'rms' ? 'mb-2' : ''
        }`}
      >
        <h2 className={`text-3xl font-bold border-l-4 pl-4 ${getTitleClass()}`}>
          MVP Tracker
        </h2>
        <div className="flex space-x-2">
          <button
            className={`text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-colors ${getAlertButtonClass()}`}
          >
            <i className="fa-solid fa-bell mr-2"></i> Set Alerts
          </button>
        </div>
      </div>

      {currentTheme === 'rms' && (
        <div className="col-span-3 mb-2">
          <div className="card">
            <div className="card-header">MVP Status List</div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th>MVP Name</th>
                    <th>Map</th>
                    <th>Status</th>
                    <th>Respawn</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mvps.map((mvp) => (
                    <tr key={mvp._id}>
                      <td className="font-bold">
                        <a
                          href={`https://ratemyserver.net/index.php?page=mob_db&mob_id=${mvp.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#006699] underline hover:text-[#003366]"
                        >
                          {mvp.name}
                        </a>
                      </td>
                      <td>{mvp.map}</td>
                      <td className="text-center">
                        <span
                          className={`font-bold uppercase ${
                            mvp.status === 'alive'
                              ? 'text-[green]'
                              : 'text-[red]'
                          }`}
                        >
                          {mvp.status}
                        </span>
                      </td>
                      <td className="text-center font-bold">
                        {mvp.respawnTime}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn-primary px-1"
                          onClick={() => reportKill(mvp)}
                        >
                          [ Report ]
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {currentTheme !== 'rms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mvps.map((mvp) => (
            <div
              key={mvp._id}
              className={`rounded-xl overflow-hidden shadow-lg border group transition-all duration-300 relative p-4 min-h-[360px] flex flex-col ${getMvpCardClass()}`}
            >
              {currentTheme === 'cute' && (
                <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-black to-transparent pointer-events-none z-5"></div>
              )}

              <img
                src={`https://db.irowiki.org/image/monster/${mvp.id}.png`}
                alt={mvp.name}
                className="pixelated absolute z-10"
                style={{
                  imageRendering: 'pixelated',
                  maxHeight: '68px',
                  left: '70%',
                  top: '45%',
                  transform: 'translate(-50%, -50%) scale(2.5)',
                }}
                onError={(e) => (e.target.style.display = 'none')}
              />

              {currentTheme !== 'cute' && (
                <div
                  className={`absolute inset-x-0 pointer-events-none z-20 ${
                    currentTheme === 'light'
                      ? 'top-0 h-32 bg-gradient-to-b from-slate-300 to-transparent'
                      : 'bottom-0 h-[28rem] bg-gradient-to-t from-slate-900 to-transparent'
                  }`}
                ></div>
              )}

              {currentTheme === 'cute' && (
                <div className="absolute bottom-0 inset-x-0 h-[28rem] bg-gradient-to-t from-[#2a2438] to-transparent pointer-events-none z-20"></div>
              )}

              <div className="absolute top-2 right-2 z-30">
                <span
                  className={`px-2 py-1 rounded text-xs font-bold uppercase ${getStatusColor(
                    mvp.status
                  )}`}
                >
                  {mvp.status}
                </span>
              </div>

              <div className="flex-grow"></div>

              <div className="z-30 relative">
                <div className="mb-2">
                  <a
                    href={`https://ratemyserver.net/index.php?page=mob_db&mob_id=${mvp.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={getMvpNameClass()}
                  >
                    {mvp.name}
                  </a>
                </div>

                <div className="mb-3">
                  <p className={`text-xs uppercase ${getSubTextClass()}`}>
                    Map & Location
                  </p>
                  <p className={`text-sm font-medium ${getTextClass()}`}>
                    {mvp.map}
                  </p>
                  <p className={`text-xs ${getSubTextClass()}`}>{mvp.coords}</p>
                </div>

                <div className="mb-3">
                  <p className={`text-xs uppercase ${getSubTextClass()}`}>
                    Respawn Window
                  </p>
                  <p
                    className={`text-sm font-bold ${getRespawnTimeClass()}`}
                  >
                    {mvp.respawnTime}
                  </p>
                  <p className={`text-xs ${getSubTextClass()}`}>
                    Variance info unavailable
                  </p>
                </div>

                <button
                  className={`w-full py-2 rounded transition-colors text-sm font-medium ${getReportButtonClass()}`}
                  onClick={() => reportKill(mvp)}
                >
                  Report Kill
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default MvpTracker

