import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import Header from '../components/common/Header'

function CreateGamePage() {
  const navigate = useNavigate()
  const { createGame } = useGame()
  const [questionCount, setQuestionCount] = useState(10)
  const [isCreating, setIsCreating] = useState(false)

  const questionOptions = [10, 15, 20, 25]

  const getDifficultyBreakdown = (count) => {
    const breakdown = []
    if (count >= 5) breakdown.push('5 questions faciles (15s)')
    if (count >= 10) breakdown.push('5 questions moyennes (20s)')
    if (count >= 15) breakdown.push('5 questions difficiles (25s)')
    if (count >= 20) breakdown.push('5 questions expert (30s)')
    if (count >= 25) breakdown.push('5 questions bonus (30s)')
    return breakdown
  }

  const handleCreateGame = () => {
    setIsCreating(true)
    
    // Simule un délai de création
    setTimeout(() => {
      const roomCode = createGame(questionCount)
      setIsCreating(false)
      navigate(`/host/${roomCode}`)
    }, 500)
  }

  return (
    <div className="bg-background text-on-background min-h-screen font-body-lg flex flex-col">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center px-gutter-mobile md:px-gutter-desktop max-w-max-width-host mx-auto w-full">
        
        <div className="text-center mb-12">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-95 duration-100"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-display-md text-display-md text-on-surface">
              Créer une partie
            </h1>
          </div>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Configurez votre quiz et lancez-le sur la TV
          </p>
        </div>

        <div className="w-full max-w-2xl bg-surface border border-outline-variant rounded-2xl p-8 md:p-12 shadow-sm">
          
          <div className="mb-10">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-6">
              Combien de questions ?
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {questionOptions.map((count) => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  disabled={isCreating}
                  className={`
                    px-6 py-4 rounded-xl font-headline-md text-headline-md text-center
                    transition-all active:scale-95 duration-100
                    ${questionCount === count
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface border border-outline-variant text-on-surface hover:bg-surface-container-low'
                    }
                    ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {count}
                  <span className="block font-body-md text-body-md mt-1 opacity-80">
                    questions
                  </span>
                </button>
              ))}
            </div>
            
            <p className="font-body-md text-body-md text-on-surface-variant mt-4">
              Les questions seront de difficulté progressive
            </p>
          </div>

          <div className="h-px bg-outline-variant my-8"></div>

          <div className="mb-10">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">
              Récapitulatif
            </h2>
            
            <div className="bg-surface-container-low rounded-xl p-6">
              <p className="font-body-md text-body-md text-on-surface mb-4">
                Votre quiz contiendra :
              </p>
              <ul className="space-y-2">
                {getDifficultyBreakdown(questionCount).map((item, index) => (
                  <li key={index} className="flex items-center gap-3 font-body-md text-body-md text-on-surface">
                    <span className="material-symbols-outlined text-secondary text-xl">check_circle</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-surface-container-low rounded-xl p-4 mt-4">
              <p className="font-body-md text-body-md text-on-surface-variant">
                ⏱️ Temps total estimé : {questionCount * 20 / 60} minutes
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                📱 Jusqu'à 20 joueurs • 10 points par bonne réponse
              </p>
            </div>
          </div>

          <button
            onClick={handleCreateGame}
            disabled={isCreating}
            className={`
              w-full px-8 py-5 rounded-xl font-headline-md text-headline-md
              flex items-center justify-center gap-3
              transition-all active:scale-95 duration-100
              ${!isCreating
                ? 'bg-primary text-on-primary shadow-sm hover:bg-primary-fixed-variant'
                : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
              }
            `}
          >
            {isCreating ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                Création...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">rocket_launch</span>
                Créer la partie
              </>
            )}
          </button>

        </div>

        <button
          onClick={() => navigate('/')}
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

export default CreateGamePage