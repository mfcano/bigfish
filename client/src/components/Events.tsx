import { useTheme } from '../contexts/ThemeContext'

const Events = () => {
  const {
    currentTheme,
    getCardClass,
    getTextClass,
    getSubTextClass,
    getRoleBadgeClass,
  } = useTheme()

  const events = [
    {
      id: 1,
      title: 'War of Emperium',
      description:
        'Weekly castle siege. All hands on deck! We are defending Valkyrie 1.',
      month: 'NOV',
      day: '23',
      time: '20:00 GMT',
      roles: [
        { name: 'Tanks', needed: 5, filled: 5 },
        { name: 'DPS', needed: 15, filled: 12 },
        { name: 'Support', needed: 8, filled: 4 },
      ],
    },
    {
      id: 2,
      title: 'Endless Tower Run',
      description: 'Climbing to floor 100. Priority on geared DPS.',
      month: 'NOV',
      day: '25',
      time: '18:00 GMT',
      roles: [
        { name: 'Tanks', needed: 2, filled: 1 },
        { name: 'DPS', needed: 6, filled: 6 },
        { name: 'Support', needed: 3, filled: 2 },
      ],
    },
  ]

  const polls = [
    {
      id: 1,
      question: 'Next Guild Dungeon Target?',
      votes: 42,
      options: [
        { id: 'a', label: 'Payon', percent: 60 },
        { id: 'b', label: 'Geffen', percent: 25 },
        { id: 'c', label: 'Prontera', percent: 15 },
      ],
    },
    {
      id: 2,
      question: 'Loot Distribution Method',
      votes: 38,
      options: [
        { id: 'a', label: 'DKP System', percent: 45 },
        { id: 'b', label: 'Roll Dice', percent: 55 },
      ],
    },
  ]

  const getTitleClass = () => {
    if (currentTheme === 'light')
      return 'text-slate-900 border-yellow-500'
    if (currentTheme === 'dark') return 'text-white border-yellow-500'
    if (currentTheme === 'cute')
      return 'text-pink-100 border-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.5)]'
    if (currentTheme === 'mesi')
      return 'text-[#FFFF00] border-[#00FF00] bg-[#0000FF] inline-block pr-4'
    return 'text-[#006699] border-none pl-0 text-sm'
  }

  const getDateBoxClass = () => {
    if (currentTheme === 'light')
      return 'bg-slate-50 border-slate-200'
    if (currentTheme === 'dark') return 'bg-guild-900 border-guild-700'
    if (currentTheme === 'cute') return 'bg-[#1e1b2e] border-pink-500/30'
    if (currentTheme === 'mesi')
      return 'bg-[#0000FF] border-4 border-[#FF0000]'
    return ''
  }

  const getDateMonthClass = () => {
    if (currentTheme === 'light') return 'text-red-500'
    if (currentTheme === 'dark') return 'text-red-400'
    if (currentTheme === 'cute') return 'text-pink-400'
    if (currentTheme === 'mesi') return 'text-[#FFFF00]'
    return ''
  }

  const getSignUpButtonClass = () => {
    if (currentTheme === 'light')
      return 'bg-guild-accent hover:bg-cyan-400 text-white'
    if (currentTheme === 'dark')
      return 'bg-guild-accent hover:bg-cyan-400 text-guild-900'
    if (currentTheme === 'cute')
      return 'bg-pink-500 hover:bg-pink-400 text-white shadow-[0_0_10px_rgba(236,72,153,0.4)]'
    if (currentTheme === 'mesi')
      return 'bg-[#00FF00] text-[#0000FF] border-4 border-[#FFFF00] hover:bg-[#FFFF00] hover:text-[#FF0000]'
    return ''
  }

  const getDetailsButtonClass = () => {
    if (currentTheme === 'light')
      return 'bg-slate-200 hover:bg-slate-300 text-slate-900'
    if (currentTheme === 'dark')
      return 'bg-guild-700 hover:bg-guild-600 text-white'
    if (currentTheme === 'cute')
      return 'bg-pink-900/30 hover:bg-pink-800/50 text-pink-100 border border-pink-500/20'
    if (currentTheme === 'mesi')
      return 'bg-[#FF00FF] text-[#FFFF00] border-4 border-[#00FF00] hover:bg-[#0000FF] hover:text-white'
    return ''
  }

  const getRoleTitleClass = () => {
    if (currentTheme === 'light' || currentTheme === 'dark')
      return 'text-guild-accent'
    if (currentTheme === 'cute') return 'text-pink-300'
    if (currentTheme === 'mesi')
      return 'text-[#FFFF00] bg-[#FF00FF] inline-block px-1'
    return ''
  }

  const getPollCardClass = () => {
    if (currentTheme === 'light')
      return 'bg-slate-50 border-slate-200'
    if (currentTheme === 'dark') return 'bg-guild-900 border-guild-700'
    if (currentTheme === 'cute') return 'bg-[#1e1b2e] border-pink-500/30'
    if (currentTheme === 'mesi')
      return 'bg-[#0000FF] border-4 border-[#FF00FF]'
    return ''
  }

  const getProgressBarClass = () => {
    if (currentTheme === 'light')
      return 'bg-slate-200 hover:bg-slate-300'
    if (currentTheme === 'dark') return 'bg-guild-800 hover:bg-guild-700'
    if (currentTheme === 'cute') return 'bg-pink-900/20 hover:bg-pink-900/40'
    if (currentTheme === 'mesi')
      return 'bg-[#FF0000] rounded-none border border-white'
    return ''
  }

  const getProgressFillClass = () => {
    if (currentTheme === 'light' || currentTheme === 'dark')
      return 'bg-guild-secondary'
    if (currentTheme === 'cute') return 'bg-pink-500'
    if (currentTheme === 'mesi') return 'bg-[#FFFF00] rounded-none'
    return ''
  }

  const getPollIconClass = () => {
    if (currentTheme === 'light' || currentTheme === 'dark')
      return 'text-guild-secondary'
    if (currentTheme === 'cute') return 'text-pink-400'
    if (currentTheme === 'mesi') return 'text-[#00FF00]'
    return ''
  }

  const handleVote = (pollId: number, optionId: string) => {
    alert('Vote cast! (This is a frontend demo)')
  }

  return (
    <>
      <h2 className={`text-3xl font-bold mb-6 border-l-4 pl-4 ${getTitleClass()}`}>
        Events & Voting
      </h2>

      <div
        className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${
          currentTheme === 'rms' ? 'block gap-0' : ''
        }`}
      >
        <div className={`lg:col-span-2 space-y-6 ${currentTheme === 'rms' ? 'space-y-0' : ''}`}>
          {currentTheme !== 'rms' && (
            <h3 className={`text-xl font-semibold ${getTextClass()}`}>
              Upcoming Events
            </h3>
          )}

          {currentTheme === 'rms' && (
            <div className="card">
              <div className="card-header">Upcoming Events</div>
              {events.map((event) => (
                <div key={event.id} className="content-row">
                  <div className="flex justify-between">
                    <div className="font-bold text-[#006699]">{event.title}</div>
                    <div className="text-xs">
                      {event.month} {event.day} @ {event.time}
                    </div>
                  </div>
                  <div className="my-1">{event.description}</div>
                  <div className="text-[10px] mb-1">
                    <b>Roles:</b>{' '}
                    {event.roles.map((role, idx) => (
                      <span key={idx}>
                        {role.name} ({role.filled}/{role.needed}){' '}
                      </span>
                    ))}
                  </div>
                  <div className="text-right">
                    <button className="btn-primary px-2 text-[9px]">
                      [ Sign Up ]
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentTheme !== 'rms' &&
            events.map((event) => (
              <div
                key={event.id}
                className={`rounded-xl p-6 border shadow-lg flex flex-col sm:flex-row gap-6 card ${getCardClass()}`}
              >
                <div
                  className={`rounded-lg p-4 flex flex-col items-center justify-center min-w-[100px] border text-center ${getDateBoxClass()}`}
                >
                  <span className={`font-bold text-lg ${getDateMonthClass()}`}>
                    {event.month}
                  </span>
                  <span className={`text-4xl font-bold my-1 ${getTextClass()}`}>
                    {event.day}
                  </span>
                  <span className={`text-sm ${getSubTextClass()}`}>
                    {event.time}
                  </span>
                </div>
                <div className="flex-grow">
                  <h4 className={`text-2xl font-bold mb-2 ${getTextClass()}`}>
                    {event.title}
                  </h4>
                  <p className={`mb-4 ${getSubTextClass()}`}>
                    {event.description}
                  </p>

                  <div className="mb-4">
                    <p className={`text-sm font-semibold mb-2 ${getRoleTitleClass()}`}>
                      Required Roles:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {event.roles.map((role, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1 rounded-full text-xs border flex items-center gap-2 ${getRoleBadgeClass(
                            role.filled,
                            role.needed
                          )}`}
                        >
                          <span>{role.name}</span>
                          <span className="font-bold">
                            {role.filled}/{role.needed}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      className={`font-bold py-2 px-6 rounded-lg transition-colors ${getSignUpButtonClass()}`}
                    >
                      Sign Up
                    </button>
                    <button
                      className={`font-medium py-2 px-4 rounded-lg transition-colors ${getDetailsButtonClass()}`}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {currentTheme !== 'rms' && (
          <div className={`rounded-xl p-6 border shadow-lg h-fit card ${getCardClass()}`}>
            <h3
              className={`text-xl font-semibold mb-4 flex items-center gap-2 ${getTextClass()}`}
            >
              <i className={`fa-solid fa-check-to-slot ${getPollIconClass()}`}></i>{' '}
              Active Polls
            </h3>
            <div className="space-y-6">
              {polls.map((poll) => (
                <div
                  key={poll.id}
                  className={`p-4 rounded-lg border ${getPollCardClass()}`}
                >
                  <h4 className={`font-bold mb-3 ${getTextClass()}`}>
                    {poll.question}
                  </h4>
                  <div className="space-y-3">
                    {poll.options.map((option) => (
                      <div key={option.id} className="relative">
                        <div
                          className={`flex justify-between text-xs mb-1 ${getSubTextClass()}`}
                        >
                          <span>{option.label}</span>
                          <span>{option.percent}%</span>
                        </div>
                        <div
                          className={`w-full rounded-full h-2.5 cursor-pointer transition-colors ${getProgressBarClass()}`}
                          onClick={() => handleVote(poll.id, option.id)}
                        >
                          <div
                            className={`h-2.5 rounded-full transition-all duration-500 ${getProgressFillClass()}`}
                            style={{ width: `${option.percent}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p
                    className={`text-xs mt-3 text-right ${getSubTextClass()}`}
                  >
                    {poll.votes} votes total
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTheme === 'rms' && (
          <div className="card">
            <div className="card-header">Active Polls</div>
            {polls.map((poll) => (
              <div key={poll.id} className="content-row">
                <b>{poll.question}</b>
                <ul className="list-disc list-inside ml-2">
                  {poll.options.map((option) => (
                    <li key={option.id}>
                      {option.label} - {option.percent}%
                    </li>
                  ))}
                </ul>
                <div className="text-right text-[9px] mt-1">
                  <a href="#" className="text-[#006699] underline">
                    [ Vote Now ]
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Events

