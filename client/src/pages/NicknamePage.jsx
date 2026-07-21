import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import Header from '../components/common/Header'

const avatarColors = [
  'bg-primary text-on-primary',
  'bg-secondary text-on-secondary',
  'bg-tertiary text-on-tertiary',
  'bg-tertiary-container text-on-tertiary',
  'bg-secondary-container text-on-secondary-container',
  'bg-primary-container text-on-primary-container',
  'bg-error text-on-error',
  'bg-surface-variant text-on-surface-variant',
]

function NicknamePage() {
  const navigate = useNavigate()
  const { roomCode } = useParams()
  const { joinGame, error: gameError } = useGame()
  const [pseudo, setPseudo] = useState('')
  const [error, setError] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  
  const [avatarColor] = useState(() => 
    avatarColors[Math.floor(Math.random() * avatarColors.length)]
  )

  const handleJoin = () => {
    const trimmedPseudo = pseudo.trim()
    
    if (trimmedPseudo.length < 3) {
      setError('Le pseudo doit contenir au moins 3 caractères')
      return
    }
    if (trimmedPseudo.length > 15) {
      setError('Le pseudo doit contenir au maximum 15 caractères')
      return
    }

    setIsJoining(true)
    setError('')
    
    const playerInfo = {
      name: trimmedPseudo,
      initial: trimmedPseudo.charAt(0).toUpperCase(),
      color: avatarColor,
    }
    
    joinGame(roomCode, playerInfo)
    
    // Navigation après un court délai pour laisser le socket se connecter
    setTimeout(() => {
      setIsJoining(false)
      navigate(`/join/${roomCode}/waiting`)
    }, 800)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleJoin()
    }
  }

  const getInitial = () => {
    const trimmed = pseudo.trim()
    return trimmed ? trimmed.charAt(0).toUpperCase() : '?'
  }

  const displayError = error || gameError

  return (
    <div className="bg-background text-on-background min-h-screen font-body-lg flex flex-col">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center px-gutter-mobile md:px-gutter-desktop max-w-max-width-host mx-auto w-full">
        
        <div className="text-center mb-12">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(`/join`)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-95 duration-100"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-display-md text-display-md text-on-surface">
              Choisis ton pseudo
            </h1>
          </div>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Partie #{roomCode}
          </p>
        </div>

        <div className="w-full max-w-md bg-surface border border-outline-variant rounded-2xl p-8 md:p-10 shadow-sm">
          
          <div className="flex flex-col items-center mb-8">
            <div className={`
              w-24 h-24 rounded-full flex items-center justify-center
              font-display-lg text-display-lg shadow-sm mb-4
              ${avatarColor}
            `}>
              {getInitial()}
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Voici ton avatar pour cette partie
            </p>
          </div>

          <div className="mb-6">
            <label 
              htmlFor="pseudo" 
              className="block font-label-lg text-label-lg text-on-surface mb-2"
            >
              Ton pseudo
            </label>
            <input
              id="pseudo"
              type="text"
              value={pseudo}
              onChange={(e) => {
                setPseudo(e.target.value)
                setError('')
              }}
              onKeyDown={handleKeyDown}
              placeholder="Entre ton pseudo..."
              maxLength={15}
              disabled={isJoining}
              className={`
                w-full px-4 py-4 rounded-xl font-body-lg text-body-lg
                border-2 outline-none transition-all bg-surface
                ${displayError 
                  ? 'border-error focus:border-error' 
                  : 'border-outline-variant focus:border-primary text-on-surface'
                }
                ${isJoining ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              autoFocus
            />
            
            <div className="flex justify-between items-center mt-2">
              <p className={`font-body-md text-body-md ${displayError ? 'text-error' : 'text-on-surface-variant'}`}>
                {displayError || '3 à 15 caractères'}
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {pseudo.trim().length}/15
              </p>
            </div>
          </div>

          <button
            onClick={handleJoin}
            disabled={pseudo.trim().length < 3 || pseudo.trim().length > 15 || isJoining}
            className={`
              w-full px-8 py-5 rounded-xl font-headline-md text-headline-md
              flex items-center justify-center gap-3
              transition-all active:scale-95 duration-100
              ${pseudo.trim().length >= 3 && pseudo.trim().length <= 15 && !isJoining
                ? 'bg-primary text-on-primary shadow-sm hover:bg-primary-fixed-variant'
                : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
              }
            `}
          >
            {isJoining ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                Connexion...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">celebration</span>
                Rejoindre la partie
              </>
            )}
          </button>

        </div>

        <button
          onClick={() => navigate(`/join`)}
          className="mt-6 text-on-surface-variant font-body-md text-body-md hover:text-on-surface transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Retour
        </button>

      </main>

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

export default NicknamePage