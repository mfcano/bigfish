import { useTheme } from '../contexts/ThemeContext'

const GearStorage = () => {
  const {
    currentTheme,
    getCardClass,
    getTextClass,
    getSubTextClass,
    getBadgeClass,
  } = useTheme()

  const gearLoans = [
    { id: 1, name: '+10 Pike [4]', borrower: 'xX_Slayer_Xx', date: '2025-05-12', paid: true },
    { id: 2, name: 'Ghostring Card', borrower: 'HealerPls', date: '2025-05-14', paid: false },
    { id: 3, name: 'Mjollnir', borrower: 'GuildLeader', date: '2025-05-10', paid: true },
    { id: 4, name: 'Valkyrie Shield', borrower: 'TankBoii', date: '2025-05-15', paid: false },
  ]

  const getTitleClass = () => {
    if (currentTheme === 'light')
      return 'text-slate-900 border-guild-accent'
    if (currentTheme === 'dark') return 'text-white border-guild-accent'
    if (currentTheme === 'cute')
      return 'text-pink-100 border-pink-500 drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]'
    if (currentTheme === 'mesi')
      return 'text-[#FFFF00] border-[#FF00FF] bg-[#0000FF] inline-block pr-4'
    return 'text-[#006699] border-none pl-0 text-sm'
  }

  const getTableHeaderClass = () => {
    if (currentTheme === 'light')
      return 'bg-slate-100 text-slate-500'
    if (currentTheme === 'dark') return 'bg-guild-900 text-slate-400'
    if (currentTheme === 'cute')
      return 'bg-pink-900/20 text-pink-300 border-b border-pink-500/30'
    if (currentTheme === 'mesi')
      return 'bg-[#0000FF] text-[#FFFF00] border-4 border-[#FF00FF]'
    return 'bg-[#006699] text-white font-bold'
  }

  const getTableRowClass = () => {
    if (currentTheme === 'light') return 'hover:bg-slate-50'
    if (currentTheme === 'dark') return 'hover:bg-guild-700'
    if (currentTheme === 'cute') return 'hover:bg-pink-500/10'
    if (currentTheme === 'mesi') return 'hover:bg-[#FFFF00] hover:text-[#0000FF]'
    return ''
  }

  const getReturnButtonClass = () => {
    if (currentTheme === 'light' || currentTheme === 'dark')
      return 'text-guild-accent hover:text-sky-600'
    if (currentTheme === 'cute') return 'text-pink-400 hover:text-pink-300'
    if (currentTheme === 'mesi')
      return 'text-[#FFFF00] bg-[#FF0000] px-2 border-2 border-white hover:bg-[#00FF00] hover:text-[#0000FF]'
    return 'text-[#006699] font-bold underline text-[9px]'
  }

  const getBorrowerClass = () => {
    if (currentTheme === 'dark') return 'text-slate-300'
    if (currentTheme === 'cute') return 'text-pink-200'
    if (currentTheme === 'mesi') return 'text-white font-bold'
    return 'text-slate-700'
  }

  const getInfoCardClass = () => {
    if (currentTheme === 'light')
      return 'bg-slate-50 border-slate-200'
    if (currentTheme === 'dark') return 'bg-guild-900 border-guild-700'
    if (currentTheme === 'cute') return 'bg-[#1e1b2e] border-pink-500/30'
    if (currentTheme === 'mesi') return 'bg-[#0000FF] border-4 border-[#00FF00]'
    return 'content-row border-none rounded-none p-2'
  }

  const getInfoTitleClass = () => {
    if (currentTheme === 'light' || currentTheme === 'dark')
      return 'text-guild-accent'
    if (currentTheme === 'cute') return 'text-pink-400'
    if (currentTheme === 'mesi')
      return 'text-[#FFFF00] bg-[#FF0000] px-1 inline-block'
    return 'text-[#000000]'
  }

  return (
    <>
      <h2
        className={`text-3xl font-bold mb-6 border-l-4 pl-4 ${getTitleClass()}`}
      >
        Gear Storage Tracker
      </h2>

      <div
        className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${
          currentTheme === 'rms' ? 'block gap-0' : ''
        }`}
      >
        <div className={`lg:col-span-2 rounded-xl shadow-lg overflow-hidden border card ${getCardClass()}`}>
          {currentTheme === 'rms' && (
            <div className="card-header">
              <div className="flex justify-between items-center w-full">
                <span>Active Loans</span>
                <button className="btn-primary px-2 py-0.5 text-[9px] border outset">
                  New Loan
                </button>
              </div>
            </div>
          )}
          {currentTheme !== 'rms' && (
            <div
              className={`p-4 border-b flex justify-between items-center ${
                currentTheme === 'light'
                  ? 'border-slate-200'
                  : currentTheme === 'dark'
                  ? 'border-guild-700'
                  : currentTheme === 'cute'
                  ? 'border-pink-500/20'
                  : 'border-[#FFFF00] border-b-4'
              }`}
            >
              <h3 className={`text-lg font-semibold ${getTextClass()}`}>
                Active Loans
              </h3>
              <button
                className={`text-sm px-3 py-1 rounded transition-colors ${
                  currentTheme === 'light'
                    ? 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                    : currentTheme === 'dark'
                    ? 'bg-guild-700 hover:bg-guild-600 text-white'
                    : currentTheme === 'cute'
                    ? 'bg-pink-900/30 hover:bg-pink-800/50 text-pink-100 border border-pink-500/20'
                    : 'bg-[#FF0000] text-[#FFFF00] border-2 border-white hover:bg-[#00FF00] hover:text-[#0000FF] font-bold'
                }`}
              >
                <i className="fa-solid fa-plus mr-1"></i> Loan Item
              </button>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className={`uppercase ${getTableHeaderClass()}`}>
                <tr>
                  <th className="px-6 py-3">Item</th>
                  <th className="px-6 py-3">Borrower</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Fee Status</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  currentTheme === 'light'
                    ? 'divide-slate-200'
                    : currentTheme === 'dark'
                    ? 'divide-guild-700'
                    : currentTheme === 'cute'
                    ? 'divide-pink-500/20'
                    : currentTheme === 'mesi'
                    ? 'divide-[#FFFF00] border-4 border-[#FFFF00]'
                    : 'divide-none'
                }`}
              >
                {gearLoans.map((item) => (
                  <tr
                    key={item.id}
                    className={`transition-colors ${getTableRowClass()}`}
                  >
                    <td className={`px-6 py-4 font-medium ${getTextClass()}`}>
                      {item.name}
                    </td>
                    <td className={`px-6 py-4 ${getBorrowerClass()}`}>
                      {item.borrower}
                    </td>
                    <td className={`px-6 py-4 ${getSubTextClass()}`}>
                      {item.date}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${getBadgeClass(
                          item.paid
                        )}`}
                      >
                        {item.paid ? 'PAID' : 'PENDING'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className={`transition-colors ${getReturnButtonClass()}`}
                        title="Return Item"
                      >
                        {currentTheme !== 'rms' && (
                          <i className="fa-solid fa-rotate-left"></i>
                        )}
                        {currentTheme === 'rms' && <span>[ Return ]</span>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-lg border h-fit card ${getCardClass()}`}>
          {currentTheme === 'rms' && (
            <div className="card-header">Fee Structure</div>
          )}
          {currentTheme !== 'rms' && (
            <h3 className={`text-lg font-semibold mb-4 ${getTextClass()}`}>
              Fee Structure
            </h3>
          )}
          <div className={`space-y-4 ${currentTheme === 'rms' ? 'space-y-0' : ''}`}>
            <div className={`p-4 rounded-lg border ${getInfoCardClass()}`}>
              <h4 className={`font-bold mb-2 ${getInfoTitleClass()}`}>
                Active Borrower
              </h4>
              <p className={`text-sm ${getSubTextClass()}`}>
                Must pay fee (AD/EDP mats, PC etc) upon borrowing high-tier
                items.
              </p>
            </div>
            <div className={`p-4 rounded-lg border ${getInfoCardClass()}`}>
              <h4
                className={`font-bold mb-2 ${
                  currentTheme === 'light' || currentTheme === 'dark'
                    ? 'text-guild-secondary'
                    : currentTheme === 'cute'
                    ? 'text-purple-400'
                    : currentTheme === 'mesi'
                    ? 'text-[#FFFF00] bg-[#FF0000] px-1 inline-block'
                    : 'text-[#000000]'
                }`}
              >
                Active Contributor
              </h4>
              <p className={`text-sm ${getSubTextClass()}`}>
                Eligible to receive payout fees from the guild bank based on
                contribution points.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default GearStorage

