import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import Header from '../components/common/Header'

function PlayerWaitingPage() {
  const navigate = useNavigate()
  const { roomCode } = useParams()
  const { currentPlayer, players, gamePhase, toggleReady } = useGame()
  const [isReady, setIsReady] = useState(false)
  const [showQuitModal, setShowQuitModal] = useState(false)

  // Redirige quand le jeu démarre
  useEffect(() => {
    if (gamePhase === 'playing') {
      navigate(`/play/${roomCode}`)
    }
  }, [gamePhase, navigate, roomCode])

  const handleToggleReady = () => {
    setIsReady(!isReady)
    if (currentPlayer) {
      toggleReady(currentPlayer.id)
    }
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
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center px-gutter-mobile md:px-gutter-desktop max-w-max-width-host mx-auto w-full">
        
        <div className="flex flex-col items-center mb-12">
          <div className={`
            w-28 h-28 rounded-full flex items-center justify-center
            font-display-lg text-display-lg shadow-sm mb-4
            ${currentPlayer.color}
          `}>
            {currentPlayer.initial}
          </div>
          <h1 className="font-display-md text-display-md text-on-surface mb-2">
            {currentPlayer.name}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Tu es connecté !
          </p>
        </div>

        <div className="w-full max-w-md bg-surface border border-outline-variant rounded-2xl p-8 md:p-10 shadow-sm text-center">
          
          <div className="mb-6">
            <span className="material-symbols-outlined text-6xl text-primary animate-bounce">
              hourglass_top
            </span>
          </div>

          <h2 className="font-headline-md text-headline-md text-on-surface mb-3">
            En attente du lancement...
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            L'hôte va bientôt lancer la partie
          </p>

          <div className="bg-surface-container-low rounded-xl p-4 mb-8">
            <div className="flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-secondary">group</span>
              <span className="font-headline-md text-headline-md text-on-surface">
                {players.length}/20 joueurs connectés
              </span>
            </div>
          </div>

          {/* Liste des joueurs en attente */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {players.map((player) => (
              <div 
                key={player.id}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-label-lg text-label-lg relative ${player.color}`}
                title={player.name}
              >
                {player.initial}
                {player.ready && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-secondary rounded-full flex items-center justify-center border-2 border-surface">
                    <span className="material-symbols-outlined text-on-secondary text-xs">check</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mb-8">
            <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>

          <button
            onClick={handleToggleReady}
            className={`
              w-full px-8 py-4 rounded-xl font-headline-md text-headline-md
              flex items-center justify-center gap-3
              transition-all active:scale-95 duration-100 mb-4
              ${isReady
                ? 'bg-secondary-container text-on-secondary-container shadow-sm'
                : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
              }
            `}
          >
            <span className="material-symbols-outlined">
              {isReady ? 'check_circle' : 'radio_button_unchecked'}
            </span>
            {isReady ? 'Prêt ✅' : 'Je suis prêt ?'}
          </button>

          <button
            onClick={() => setShowQuitModal(true)}
            className="text-on-surface-variant font-body-md text-body-md hover:text-error transition-colors"
          >
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
              Es-tu sûr de vouloir quitter la partie ?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowQuitModal(false)}
                className="flex-1 bg-surface border border-outline-variant text-on-surface px-4 py-3 rounded-xl font-label-lg text-label-lg hover:bg-surface-container-low transition-colors"
              >
                Non, rester
              </button>
              <button
                onClick={handleQuit}
                className="flex-1 bg-error text-on-error px-4 py-3 rounded-xl font-label-lg text-label-lg hover:opacity-90 transition-opacity"
              >
                Oui, quitter
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant p-4 md:p-gutter-desktop mt-auto">
        <div className="max-w-max-width-host mx-auto text-center">
          <p className="font-body-md text-body-md text-on-surface-variant">
            QuizBlast — Le quiz qui enflamme vos soirées 🎉
          </p>
        </div>
      </footer>
    </div>
  )
}

export default PlayerWaitingPage