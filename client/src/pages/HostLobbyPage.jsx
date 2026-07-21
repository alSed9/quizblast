import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGame } from '../context/GameContext'

function HostLobbyPage() {
  const navigate = useNavigate()
  const { roomCode } = useParams()
  const { players, startGame, addPlayer } = useGame()
  const [showCancelModal, setShowCancelModal] = useState(false)

  // Simulation : ajoute des joueurs factices pour la démo
  useEffect(() => {
    const mockPlayers = [
      { id: 101, name: 'Alice', initial: 'A', color: 'bg-primary text-on-primary', score: 0, correct: 0, total: 0, passed: 0, ready: true },
      { id: 102, name: 'Bob', initial: 'B', color: 'bg-tertiary text-on-tertiary', score: 0, correct: 0, total: 0, passed: 0, ready: true },
      { id: 103, name: 'Charlie', initial: 'C', color: 'bg-secondary text-on-secondary', score: 0, correct: 0, total: 0, passed: 0, ready: false },
      { id: 104, name: 'Diana', initial: 'D', color: 'bg-tertiary-container text-on-tertiary', score: 0, correct: 0, total: 0, passed: 0, ready: true },
      { id: 105, name: 'Eve', initial: 'E', color: 'bg-primary-container text-on-primary-container', score: 0, correct: 0, total: 0, passed: 0, ready: true },
    ]

    // Vérifie si les joueurs sont déjà ajoutés
    if (players.length === 0) {
      mockPlayers.forEach((player, index) => {
        setTimeout(() => {
          addPlayer(player)
        }, (index + 1) * 600)
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const playerCount = players.length
  const canStart = playerCount >= 2

  const handleStartGame = () => {
    if (canStart) {
      startGame()
      navigate(`/host/${roomCode}/game`)
    }
  }

  const handleCancel = () => {
    navigate('/')
  }

  return (
    <div className="bg-background text-on-background min-h-screen font-body-lg flex flex-col">
      
      <header className="w-full bg-surface shadow-sm border-b border-outline-variant px-gutter-desktop py-4 flex items-center justify-between shrink-0 max-w-max-width-host mx-auto">
        <span className="font-display-md text-display-md font-extrabold text-primary">
          QuizBlast
        </span>
        <button 
          onClick={() => setShowCancelModal(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-95 duration-100"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-gutter-mobile md:px-gutter-desktop max-w-max-width-host mx-auto w-full py-8">
        
        {/* Code PIN et QR Code */}
        <div className="w-full max-w-3xl bg-surface border border-outline-variant rounded-2xl p-8 md:p-10 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            
            <div className="text-center md:text-left">
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-3">
                Code de la partie
              </p>
              <div className="bg-primary-container/20 border-2 border-primary rounded-2xl px-8 py-4 inline-block">
                <span className="font-display-lg text-display-lg text-primary tracking-widest">
                  {roomCode}
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-3">
                Scannez le QR code ou entrez ce code sur le site
              </p>
            </div>

            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 flex flex-col items-center">
              <div className="w-40 h-40 bg-on-surface/10 rounded-xl flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant">
                  qr_code_2
                </span>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                QR Code
              </p>
            </div>

          </div>

          <button className="w-full mt-6 bg-surface border border-outline-variant text-on-surface px-6 py-3 rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined">content_copy</span>
            Copier le lien d'invitation
          </button>
        </div>

        {/* Liste des joueurs */}
        <div className="w-full max-w-3xl bg-surface border border-outline-variant rounded-2xl p-8 md:p-10 shadow-sm mb-8">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6 text-center">
            Joueurs connectés : {playerCount}/20
          </h2>

          {players.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4 block">
                group_off
              </span>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                En attente de joueurs...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {players.map((player) => (
                <div 
                  key={player.id}
                  className="bg-surface-container-low border border-outline-variant rounded-xl p-4 flex flex-col items-center gap-3 transition-all hover:shadow-sm"
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center font-display-md text-display-md shadow-sm relative ${player.color}`}>
                    {player.initial}
                    {player.ready && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center border-2 border-surface">
                        <span className="material-symbols-outlined text-on-secondary text-sm">check</span>
                      </div>
                    )}
                  </div>
                  <span className="font-body-md text-body-md text-on-surface text-center truncate w-full">
                    {player.name}
                  </span>
                  <span className={`font-label-sm text-label-sm ${player.ready ? 'text-secondary' : 'text-on-surface-variant'}`}>
                    {player.ready ? 'Prêt ✅' : 'En attente ⏳'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="w-full max-w-3xl flex flex-col items-center gap-4">
          
          <button
            onClick={handleStartGame}
            disabled={!canStart}
            className={`
              w-full px-8 py-6 rounded-xl font-headline-lg text-headline-lg
              flex items-center justify-center gap-3
              transition-all active:scale-95 duration-100
              ${canStart
                ? 'bg-primary text-on-primary shadow-sm hover:bg-primary-fixed-variant animate-pulse'
                : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
              }
            `}
          >
            <span className="material-symbols-outlined text-3xl">play_arrow</span>
            LANCER LA PARTIE
          </button>

          {!canStart && (
            <p className="font-body-md text-body-md text-on-surface-variant">
              Minimum 2 joueurs pour lancer
            </p>
          )}

          <button
            onClick={() => setShowCancelModal(true)}
            className="text-on-surface-variant font-body-md text-body-md hover:text-error transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">close</span>
            Annuler
          </button>

        </div>

      </main>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl p-8 max-w-sm w-full shadow-lg">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
              Annuler la partie ?
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8">
              Tous les joueurs seront déconnectés.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-surface border border-outline-variant text-on-surface px-4 py-3 rounded-xl font-label-lg text-label-lg hover:bg-surface-container-low transition-colors"
              >
                Continuer
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-error text-on-error px-4 py-3 rounded-xl font-label-lg text-label-lg hover:opacity-90 transition-opacity"
              >
                Annuler
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

export default HostLobbyPage