import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'

function HostFinalPage() {
  const navigate = useNavigate()
  const { ranking, resetGame } = useGame()

  const maxScore = ranking[0]?.score || 1

  const handleNewGame = () => {
    resetGame()
    navigate('/create')
  }

  const handleQuit = () => {
    resetGame()
    navigate('/')
  }

  if (!ranking || ranking.length === 0) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <p className="font-headline-md text-on-surface">Chargement du classement...</p>
      </div>
    )
  }

  return (
    <div className="bg-background text-on-background min-h-screen font-body-lg flex flex-col">
      
      <header className="w-full h-16 bg-surface shadow-sm border-b border-outline-variant flex items-center justify-center px-4 shrink-0">
        <span className="font-display-md text-display-md font-extrabold text-primary">QuizBlast</span>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-gutter-desktop max-w-max-width-host mx-auto w-full py-8">
        
        <div className="text-center mb-8">
          <span className="material-symbols-outlined text-7xl text-tertiary mb-4 block">emoji_events</span>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-2">🏆 CLASSEMENT FINAL</h1>
          <p className="font-headline-md text-on-surface-variant">Quiz terminé !</p>
        </div>

        {/* Podium Top 3 */}
        <div className="w-full max-w-4xl flex justify-center items-end gap-4 md:gap-10 mb-12">
          {ranking[1] && (
            <div className="flex flex-col items-center gap-3">
              <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center font-display-lg shadow-lg border-4 border-surface ${ranking[1].color || 'bg-primary text-on-primary'}`}>
                {ranking[1].initial || '?'}
              </div>
              <span className="font-display-md">🥈</span>
              <div className="bg-surface border border-outline-variant rounded-xl px-4 py-3 text-center shadow-sm">
                <p className="font-headline-md text-on-surface">{ranking[1].name}</p>
                <p className="font-display-md text-primary">{ranking[1].score || 0} pts</p>
              </div>
            </div>
          )}

          {ranking[0] && (
            <div className="flex flex-col items-center gap-3 -mt-8">
              <div className={`w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center font-display-lg shadow-xl border-4 border-tertiary ${ranking[0].color || 'bg-primary text-on-primary'} ring-4 ring-tertiary/20`}>
                {ranking[0].initial || '?'}
              </div>
              <span className="font-display-lg">🥇</span>
              <div className="bg-tertiary-container/10 border-2 border-tertiary rounded-xl px-6 py-4 text-center shadow-lg">
                <p className="font-headline-lg text-on-surface">{ranking[0].name}</p>
                <p className="font-display-md text-tertiary">{ranking[0].score || 0} pts</p>
              </div>
            </div>
          )}

          {ranking[2] && (
            <div className="flex flex-col items-center gap-3">
              <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center font-display-lg shadow-lg border-4 border-surface ${ranking[2].color || 'bg-primary text-on-primary'}`}>
                {ranking[2].initial || '?'}
              </div>
              <span className="font-display-md">🥉</span>
              <div className="bg-surface border border-outline-variant rounded-xl px-4 py-3 text-center shadow-sm">
                <p className="font-headline-md text-on-surface">{ranking[2].name}</p>
                <p className="font-display-md text-primary">{ranking[2].score || 0} pts</p>
              </div>
            </div>
          )}
        </div>

        {/* Classement complet */}
        <div className="w-full max-w-2xl bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm mb-8">
          <h3 className="font-headline-md text-on-surface mb-4 text-center">Classement complet</h3>
          <div className="space-y-2">
            {ranking.map((player, index) => (
              <div key={player.id || player.socketId} className={`flex items-center gap-3 p-3 rounded-xl ${index < 3 ? 'bg-surface-container-low' : ''}`}>
                <span className="font-headline-md text-on-surface-variant w-8 text-center">{index + 1}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-label-sm ${player.color || 'bg-primary text-on-primary'}`}>
                  {player.initial || '?'}
                </div>
                <span className="font-body-md text-on-surface flex-1">{player.name}</span>
                <span className="font-headline-md text-on-surface">{player.score || 0} pts</span>
                <div className="hidden md:block w-24 h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${((player.score || 0) / maxScore) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={handleNewGame} className="bg-primary text-on-primary px-6 py-4 rounded-xl font-headline-md flex items-center gap-2 shadow-sm hover:bg-primary-fixed-variant transition-all active:scale-95">
            <span className="material-symbols-outlined">replay</span> Nouvelle partie
          </button>
          <button onClick={handleQuit} className="bg-surface border border-outline-variant text-on-surface px-6 py-4 rounded-xl font-headline-md flex items-center gap-2 shadow-sm hover:bg-surface-container-low transition-all active:scale-95">
            <span className="material-symbols-outlined">logout</span> Quitter
          </button>
        </div>

      </main>

      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant p-4 mt-auto">
        <div className="max-w-max-width-host mx-auto text-center">
          <p className="font-body-md text-on-surface-variant">QuizBlast — Le quiz qui enflamme vos soirées 🎉</p>
        </div>
      </footer>

    </div>
  )
}

export default HostFinalPage