import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGame } from '../context/GameContext'

function PlayerWaitingFinalPage() {
  const navigate = useNavigate()
  const { roomCode } = useParams()
  const { currentPlayer, ranking, allFinished, gamePhase } = useGame()

  useEffect(() => {
    if (allFinished || gamePhase === 'final') {
      navigate(`/play/${roomCode}/final`)
    }
  }, [allFinished, gamePhase, navigate, roomCode])

  if (!currentPlayer) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <p className="font-headline-md text-on-surface">Chargement...</p>
      </div>
    )
  }

  const playerRank = ranking.findIndex(p => (p.id || p.socketId) === (currentPlayer.id || currentPlayer.socketId)) + 1

  return (
    <div className="bg-background min-h-screen font-body-lg flex flex-col items-center justify-center px-4">
      
      <div className="w-full max-w-md bg-surface border border-outline-variant rounded-2xl p-8 shadow-sm text-center">
        
        {/* Icône */}
        <div className="w-24 h-24 rounded-full bg-primary-container/30 flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-6xl text-primary">hourglass_top</span>
        </div>

        <h1 className="font-display-md text-display-md text-on-surface mb-3">
          Tu as terminé ! 🎉
        </h1>
        
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-4">
          En attente des autres joueurs...
        </p>

        {/* Score actuel */}
        <div className="bg-primary-container/20 rounded-xl p-4 mb-6">
          <p className="font-body-md text-on-surface-variant mb-1">Ton score</p>
          <p className="font-display-lg text-display-lg text-primary">{currentPlayer.score || 0} pts</p>
          <p className="font-body-md text-on-surface-variant mt-1">
            {currentPlayer.correct || 0}/{currentPlayer.total || 0} bonnes réponses
          </p>
        </div>

        {/* Classement provisoire */}
        {ranking.length > 0 && (
          <div className="bg-surface-container-low rounded-xl p-4 mb-4">
            <p className="font-label-lg text-on-surface-variant mb-3">Classement provisoire</p>
            <div className="space-y-2">
              {ranking.slice(0, 5).map((p, i) => (
                <div key={p.id || p.socketId} className="flex items-center gap-2 text-sm">
                  <span className="w-6 text-center font-bold">{i + 1}</span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${p.color || 'bg-primary text-on-primary'}`}>
                    {p.initial || '?'}
                  </div>
                  <span className="flex-1 text-left">{p.name}</span>
                  <span className="font-bold">{p.score || 0} pts</span>
                </div>
              ))}
            </div>
            {playerRank > 0 && (
              <p className="font-body-sm text-primary mt-3">
                Tu es actuellement {playerRank}ème
              </p>
            )}
          </div>
        )}

        {/* Animation d'attente */}
        <div className="flex justify-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>

      </div>

    </div>
  )
}

export default PlayerWaitingFinalPage