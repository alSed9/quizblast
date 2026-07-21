import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGame } from '../context/GameContext'

function PlayerWaitingNextPage() {
  const navigate = useNavigate()
  const { roomCode } = useParams()
  const { currentPlayer, getRanking, gamePhase } = useGame()
  const [countdown, setCountdown] = useState(5)

  const ranking = getRanking()
  const playerRank = ranking.findIndex(p => (p.id || p.socketId) === (currentPlayer?.id || currentPlayer?.socketId)) + 1

  const pointsToPodium = playerRank > 3 && ranking[2] 
    ? ranking[2].score - (currentPlayer?.score || 0)
    : 0

  const top3 = ranking.slice(0, 3)

  useEffect(() => {
    if (gamePhase === 'playing') {
      navigate(`/play/${roomCode}`)
      return
    }
    if (gamePhase === 'final') {
      navigate(`/play/${roomCode}/final`)
      return
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate, roomCode, gamePhase])

  if (!currentPlayer) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <p className="font-headline-md text-on-surface">Chargement...</p>
      </div>
    )
  }

  const podiumEmojis = ['🥇', '🥈', '🥉']
  const isCurrentPlayer = (player) => (player.id || player.socketId) === (currentPlayer.id || currentPlayer.socketId)

  return (
    <div className="bg-background text-on-background min-h-screen font-body-lg flex flex-col">
      
      <header className="w-full bg-surface shadow-sm border-b border-outline-variant px-gutter-mobile py-4 flex items-center justify-center shrink-0">
        <span className="font-headline-md text-headline-md text-on-surface">
          QuizBlast
        </span>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-gutter-mobile max-w-md mx-auto w-full py-6">
        
        <div className="flex flex-col items-center mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center font-display-md text-display-md shadow-sm mb-3 ${currentPlayer.color || 'bg-primary text-on-primary'}`}>
            {currentPlayer.initial || '?'}
          </div>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-1">
            {currentPlayer.name}
          </h2>
          <div className="bg-primary-container/20 rounded-xl px-6 py-2">
            <span className="font-display-md text-display-md text-primary">{currentPlayer.score || 0} pts</span>
          </div>
        </div>

        <div className="w-full bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="font-headline-md text-headline-md text-on-surface text-center mb-4">
            🏆 Classement provisoire
          </h3>

          <div className="space-y-3 mb-6">
            {top3.map((player, index) => (
              <div 
                key={player.id || player.socketId}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  index === 0 ? 'bg-tertiary-container/10' :
                  index === 1 ? 'bg-primary-container/10' :
                  'bg-secondary-container/10'
                }`}
              >
                <span className="font-display-md text-display-md w-10 text-center">
                  {podiumEmojis[index]}
                </span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-label-lg text-label-lg ${player.color || 'bg-primary text-on-primary'}`}>
                  {player.initial || '?'}
                </div>
                <span className="font-body-lg text-body-lg text-on-surface flex-1">
                  {player.name}
                  {isCurrentPlayer(player) && ' (Toi)'}
                </span>
                <span className="font-headline-md text-headline-md text-on-surface">
                  {player.score || 0} pts
                </span>
              </div>
            ))}
          </div>

          {playerRank > 3 && (
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <span className="font-headline-md text-headline-md text-primary w-8 text-center">
                  {playerRank}
                </span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-label-lg text-label-lg ${currentPlayer.color || 'bg-primary text-on-primary'}`}>
                  {currentPlayer.initial || '?'}
                </div>
                <span className="font-body-lg text-body-lg text-on-surface flex-1">
                  Toi
                </span>
                <span className="font-headline-md text-headline-md text-primary">
                  {currentPlayer.score || 0} pts
                </span>
              </div>
              {pointsToPodium > 0 && (
                <p className="font-body-md text-body-md text-on-surface-variant text-center mt-2">
                  À {pointsToPodium} pts du podium 🚀
                </p>
              )}
            </div>
          )}

          {playerRank <= 3 && playerRank > 0 && (
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center">
              <p className="font-headline-md text-headline-md text-primary">
                Tu es sur le podium ! 🎉
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Garde ta position !
              </p>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-3">
            Prochaine question dans...
          </p>
          <div className="bg-surface border border-outline-variant rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-sm">
            <span className="font-display-md text-display-md text-primary">
              {countdown}
            </span>
          </div>
          <div className="w-full h-2 bg-surface-container-high rounded-full mt-4 overflow-hidden max-w-xs mx-auto">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-1000"
              style={{ width: `${(countdown / 5) * 100}%` }}
            ></div>
          </div>
        </div>

      </main>

    </div>
  )
}

export default PlayerWaitingNextPage