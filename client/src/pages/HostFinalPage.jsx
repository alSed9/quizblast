import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGame } from '../context/GameContext'

function HostFinalPage() {
  const navigate = useNavigate()
  // eslint-disable-next-line no-unused-vars
  const { roomCode } = useParams()
  // eslint-disable-next-line no-unused-vars
  const { players, getRanking, resetGame } = useGame()
  const [showQuitModal, setShowQuitModal] = useState(false)

  const ranking = getRanking()
  const maxScore = ranking[0]?.score || 1

  const handleNewGame = () => {
    resetGame()
    navigate('/create')
  }

  const handleChangePlayers = () => {
    resetGame()
    navigate('/create')
  }

  const handleQuit = () => {
    resetGame()
    navigate('/')
  }

  if (ranking.length === 0) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <p className="font-headline-md text-on-surface">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="bg-background text-on-background min-h-screen font-body-lg flex flex-col">
      
      <header className="w-full h-16 bg-surface shadow-sm border-b border-outline-variant flex items-center justify-center px-gutter-desktop max-w-max-width-host mx-auto shrink-0">
        <span className="font-display-md text-display-md font-extrabold text-primary">QuizBlast</span>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-gutter-desktop max-w-max-width-host mx-auto w-full py-8">
        
        <div className="text-center mb-8">
          <span className="material-symbols-outlined text-7xl text-tertiary mb-4 block">emoji_events</span>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-2">
            🏆 CLASSEMENT FINAL
          </h1>
          <p className="font-headline-md text-headline-md text-on-surface-variant">
            Quiz terminé !
          </p>
        </div>

        {/* Podium Top 3 */}
        <div className="w-full max-w-4xl flex justify-center items-end gap-6 md:gap-10 mb-12">
          
          {/* 2ème place */}
          {ranking[1] && (
            <div className="flex flex-col items-center gap-3">
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center font-display-lg text-display-lg shadow-lg border-4 border-surface ${ranking[1].color}`}>
                {ranking[1].initial}
              </div>
              <span className="font-display-md text-display-md">🥈</span>
              <div className="bg-surface border border-outline-variant rounded-xl px-6 py-3 text-center shadow-sm">
                <p className="font-headline-md text-headline-md text-on-surface">{ranking[1].name}</p>
                <p className="font-display-md text-display-md text-primary">{ranking[1].score} pts</p>
                <p className="font-body-md text-body-md text-on-surface-variant">{ranking[1].correct}/{ranking[1].total}</p>
              </div>
            </div>
          )}

          {/* 1ère place */}
          {ranking[0] && (
            <div className="flex flex-col items-center gap-3 -mt-8">
              <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center font-display-lg text-display-lg shadow-xl border-4 border-tertiary ${ranking[0].color} ring-4 ring-tertiary/20`}>
                {ranking[0].initial}
              </div>
              <span className="font-display-lg text-display-lg">🥇</span>
              <div className="bg-tertiary-container/10 border-2 border-tertiary rounded-xl px-8 py-4 text-center shadow-lg">
                <p className="font-headline-lg text-headline-lg text-on-surface">{ranking[0].name}</p>
                <p className="font-display-md text-display-md text-tertiary">{ranking[0].score} pts</p>
                <p className="font-body-lg text-body-lg text-on-surface-variant">{ranking[0].correct}/{ranking[0].total}</p>
              </div>
            </div>
          )}

          {/* 3ème place */}
          {ranking[2] && (
            <div className="flex flex-col items-center gap-3">
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center font-display-lg text-display-lg shadow-lg border-4 border-surface ${ranking[2].color}`}>
                {ranking[2].initial}
              </div>
              <span className="font-display-md text-display-md">🥉</span>
              <div className="bg-surface border border-outline-variant rounded-xl px-6 py-3 text-center shadow-sm">
                <p className="font-headline-md text-headline-md text-on-surface">{ranking[2].name}</p>
                <p className="font-display-md text-display-md text-primary">{ranking[2].score} pts</p>
                <p className="font-body-md text-body-md text-on-surface-variant">{ranking[2].correct}/{ranking[2].total}</p>
              </div>
            </div>
          )}

        </div>

        {/* Classement complet */}
        <div className="w-full max-w-3xl bg-surface border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm mb-8">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-6 text-center">
            Classement complet
          </h3>
          
          <div className="space-y-3">
            {ranking.map((player, index) => (
              <div 
                key={player.id}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                  index === 0 ? 'bg-tertiary-container/10 border border-tertiary/30' :
                  index === 1 ? 'bg-primary-container/10' :
                  index === 2 ? 'bg-secondary-container/10' :
                  'bg-surface-container-low'
                }`}
              >
                <span className="font-headline-md text-headline-md text-on-surface-variant w-10 text-center">
                  {index + 1}
                </span>

                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-label-lg text-label-lg ${player.color}`}>
                  {player.initial}
                </div>

                <span className="font-body-lg text-body-lg text-on-surface flex-1">
                  {player.name}
                </span>

                <span className="font-headline-md text-headline-md text-on-surface">
                  {player.score} pts
                </span>

                <div className="hidden md:block w-32 h-3 bg-surface-container-high rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(player.score / maxScore) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="w-full max-w-3xl flex flex-col md:flex-row gap-4">
          <button
            onClick={handleNewGame}
            className="flex-1 bg-primary text-on-primary px-8 py-5 rounded-xl font-headline-md text-headline-md flex items-center justify-center gap-3 shadow-sm hover:bg-primary-fixed-variant transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">replay</span>
            Nouvelle partie
          </button>
          <button
            onClick={handleChangePlayers}
            className="flex-1 bg-surface border border-outline-variant text-on-surface px-8 py-5 rounded-xl font-headline-md text-headline-md flex items-center justify-center gap-3 shadow-sm hover:bg-surface-container-low transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">group</span>
            Changer les joueurs
          </button>
          <button
            onClick={() => setShowQuitModal(true)}
            className="flex-1 bg-surface border border-outline-variant text-on-surface-variant px-8 py-5 rounded-xl font-headline-md text-headline-md flex items-center justify-center gap-3 hover:bg-error-container hover:text-on-error-container transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">logout</span>
            Quitter
          </button>
        </div>

      </main>

      {showQuitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl p-8 max-w-sm w-full shadow-lg">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
              Quitter la partie ?
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8">
              Le classement sera perdu. Voulez-vous vraiment quitter ?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowQuitModal(false)}
                className="flex-1 bg-surface border border-outline-variant text-on-surface px-4 py-3 rounded-xl font-label-lg text-label-lg hover:bg-surface-container-low transition-colors"
              >
                Rester
              </button>
              <button
                onClick={handleQuit}
                className="flex-1 bg-error text-on-error px-4 py-3 rounded-xl font-label-lg text-label-lg hover:opacity-90 transition-opacity"
              >
                Quitter
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant p-4">
        <div className="max-w-max-width-host mx-auto text-center">
          <p className="font-body-md text-body-md text-on-surface-variant">
            QuizBlast — Le quiz qui enflamme vos soirées 🎉
          </p>
        </div>
      </footer>

    </div>
  )
}

export default HostFinalPage