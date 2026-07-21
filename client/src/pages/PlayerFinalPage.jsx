import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGame } from '../context/GameContext'

function PlayerFinalPage() {
  const navigate = useNavigate()
  // eslint-disable-next-line no-unused-vars
  const { roomCode } = useParams()
  const { currentPlayer, getRanking } = useGame()
  const [waitingHost, setWaitingHost] = useState(true)

  const ranking = getRanking()
  const playerRank = ranking.findIndex(p => p.id === currentPlayer?.id) + 1
  const totalPlayers = ranking.length

  const podium = ranking.slice(0, 3)

  useEffect(() => {
    const timer = setTimeout(() => {
      setWaitingHost(false)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  const handleReplay = () => {
    navigate('/')
  }

  const handleQuit = () => {
    navigate('/')
  }

  if (!currentPlayer) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <p className="font-headline-md text-on-surface">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="bg-background text-on-background min-h-screen font-body-lg flex flex-col">
      
      <header className="w-full bg-surface shadow-sm border-b border-outline-variant px-gutter-mobile py-4 flex items-center justify-center shrink-0">
        <span className="font-headline-md text-headline-md text-on-surface">
          QuizBlast
        </span>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-gutter-mobile max-w-md mx-auto w-full py-6">
        
        {/* Résultat personnel */}
        <div className="w-full bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm mb-6 text-center">
          
          <div className={`w-24 h-24 rounded-full flex items-center justify-center font-display-lg text-display-lg shadow-sm mx-auto mb-4 ${currentPlayer.color}`}>
            {currentPlayer.initial}
          </div>

          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">
            {currentPlayer.name}
          </h2>

          <div className="bg-primary-container/20 rounded-xl px-6 py-3 mb-4 inline-block">
            <p className="font-body-lg text-body-lg text-on-primary-container">
              Tu as terminé <span className="font-display-md text-display-md text-primary">{playerRank}ème</span> sur {totalPlayers}
            </p>
          </div>

          <div className="bg-surface-container-low rounded-xl p-4 mb-4">
            <p className="font-body-md text-body-md text-on-surface-variant mb-1">Score final</p>
            <p className="font-display-lg text-display-lg text-primary">{currentPlayer.score} pts</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface-container-low rounded-xl p-3">
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Bonnes réponses</p>
              <p className="font-headline-md text-headline-md text-secondary">{currentPlayer.correct}/{currentPlayer.total}</p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-3">
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Passées</p>
              <p className="font-headline-md text-headline-md text-on-surface-variant">{currentPlayer.passed}</p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-3">
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Précision</p>
              <p className="font-headline-md text-headline-md text-tertiary">
                {currentPlayer.total > 0 ? Math.round((currentPlayer.correct / currentPlayer.total) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Podium */}
        <div className="w-full bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="font-headline-md text-headline-md text-on-surface text-center mb-4">
            🏆 Podium
          </h3>
          <div className="space-y-3">
            {podium.map((p, index) => (
              <div 
                key={p.id}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  index === 0 ? 'bg-tertiary-container/10' :
                  index === 1 ? 'bg-primary-container/10' :
                  'bg-secondary-container/10'
                }`}
              >
                <span className="font-display-md text-display-md w-10 text-center">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-label-lg text-label-lg ${p.color}`}>
                  {p.initial}
                </div>
                <span className="font-body-lg text-body-lg text-on-surface flex-1">
                  {p.name}
                  {p.id === currentPlayer.id && ' (Toi)'}
                </span>
                <span className="font-headline-md text-headline-md text-on-surface">{p.score} pts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        {waitingHost ? (
          <div className="text-center">
            <div className="flex justify-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              En attente de la décision de l'hôte...
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-3">
            <button
              onClick={handleReplay}
              className="w-full bg-primary text-on-primary px-6 py-4 rounded-xl font-headline-md text-headline-md flex items-center justify-center gap-2 shadow-sm hover:bg-primary-fixed-variant transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">replay</span>
              Rejouer
            </button>
            <button
              onClick={handleQuit}
              className="w-full bg-surface border border-outline-variant text-on-surface-variant px-6 py-4 rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-surface-container-low transition-all"
            >
              <span className="material-symbols-outlined">logout</span>
              Quitter
            </button>
          </div>
        )}

      </main>

    </div>
  )
}

export default PlayerFinalPage