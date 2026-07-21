// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGame } from '../context/GameContext'

function HostGamePage() {
  const navigate = useNavigate()
  const { roomCode } = useParams()
  const { players, gamePhase, allFinished } = useGame()

  // Rediriger quand tout le monde a fini
  useEffect(() => {
    if (allFinished || gamePhase === 'final') {
      navigate(`/host/${roomCode}/final`)
    }
  }, [allFinished, gamePhase, navigate, roomCode])

  const finishedCount = players.filter(p => p.finished).length
  const totalPlayers = players.length

  // Trier par score
  const sortedPlayers = [...players].sort((a, b) => (b.score || 0) - (a.score || 0))

  return (
    <div className="bg-background text-on-background min-h-screen font-body-lg flex flex-col">
      
      <header className="w-full h-16 bg-surface shadow-sm border-b border-outline-variant flex items-center justify-between px-4 md:px-gutter-desktop max-w-max-width-host mx-auto shrink-0">
        <span className="font-display-md text-display-md font-extrabold text-primary">QuizBlast</span>
        <span className="font-body-md text-on-surface-variant">{finishedCount}/{totalPlayers} ont fini</span>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-gutter-desktop max-w-max-width-host mx-auto w-full">
        
        <div className="w-full max-w-3xl bg-surface border border-outline-variant rounded-2xl p-6 md:p-10 shadow-sm">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6 text-center">
            📊 Progression des joueurs
          </h2>

          {/* Barre de progression globale */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="font-body-md text-on-surface-variant">Progression</span>
              <span className="font-body-md text-on-surface-variant">{finishedCount}/{totalPlayers} joueurs ont fini</span>
            </div>
            <div className="w-full h-4 bg-surface-container-high rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${totalPlayers > 0 ? (finishedCount / totalPlayers) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          {/* Liste des joueurs */}
          <div className="space-y-3">
            {sortedPlayers.map((player, index) => (
              <div 
                key={player.id || player.socketId}
                className={`flex items-center gap-4 p-4 rounded-xl ${
                  player.finished ? 'bg-secondary-container/20' : 'bg-surface-container-low'
                }`}
              >
                <span className="font-headline-md text-on-surface-variant w-8 text-center">{index + 1}</span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-label-lg ${player.color || 'bg-primary text-on-primary'}`}>
                  {player.initial || '?'}
                </div>
                <span className="font-body-lg text-on-surface flex-1">{player.name}</span>
                <span className="font-headline-md text-on-surface">{player.score || 0} pts</span>
                <span className={`font-label-sm ${player.finished ? 'text-secondary' : 'text-on-surface-variant'}`}>
                  {player.finished ? '✅ Fini' : `⏳ Q${(player.currentQuestionIndex || 0) + 1}`}
                </span>
              </div>
            ))}
          </div>

          {allFinished && (
            <div className="text-center mt-8">
              <p className="font-headline-md text-primary mb-4">🎉 Tous les joueurs ont fini !</p>
              <button
                onClick={() => navigate(`/host/${roomCode}/final`)}
                className="bg-primary text-on-primary px-8 py-4 rounded-xl font-headline-md text-headline-md shadow-sm hover:bg-primary-fixed-variant transition-all active:scale-95"
              >
                Voir le classement final
              </button>
            </div>
          )}
        </div>

      </main>

      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant p-4">
        <div className="max-w-max-width-host mx-auto text-center">
          <p className="font-body-md text-on-surface-variant">QuizBlast — Le quiz qui enflamme vos soirées 🎉</p>
        </div>
      </footer>

    </div>
  )
}

export default HostGamePage