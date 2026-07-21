import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { useTimer } from '../hooks/useTimer'

function PlayerGamePage() {
  const navigate = useNavigate()
  const { roomCode } = useParams()
  
  const { 
    currentPlayer, 
    currentQuestionIndex, 
    totalQuestions,
    getCurrentQuestion,
    submitAnswer,
    passQuestion,
    isPaused,
  } = useGame()

  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [showPassConfirm, setShowPassConfirm] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [resultType, setResultType] = useState(null) // 'correct' | 'wrong' | 'passed'
  
  const question = getCurrentQuestion()

  const handleTimeUp = () => {
    if (!hasAnswered) {
      setHasAnswered(true)
      setResultType('timeout')
      setTimeout(() => {
        navigate(`/play/${roomCode}/result`)
      }, 1000)
    }
  }

  const { timeLeft, isCritical, isTimeUp } = useTimer(
    question?.time || 15,
    isPaused,
    handleTimeUp
  )

  useEffect(() => {
    if (isTimeUp && !hasAnswered) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasAnswered(true)
      setResultType('timeout')
      setTimeout(() => {
        navigate(`/play/${roomCode}/result`, { 
          state: { resultType: 'timeout' }
        })
      }, 1000)
    }
  }, [isTimeUp, hasAnswered, navigate, roomCode])

  if (!currentPlayer || !question) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <p className="font-headline-md text-on-surface">Chargement...</p>
      </div>
    )
  }

  const handleAnswer = (index) => {
    if (hasAnswered) return
    setSelectedAnswer(index)
    setHasAnswered(true)
    
    const isCorrect = submitAnswer(index)
    setResultType(isCorrect ? 'correct' : 'wrong')
    
    setTimeout(() => {
      navigate(`/play/${roomCode}/result`, { 
        state: { 
          resultType: isCorrect ? 'correct' : 'wrong',
          selectedAnswer: index,
          correctAnswer: question.correctIndex,
        }
      })
    }, 800)
  }

  const handlePass = () => {
    setShowPassConfirm(true)
  }

  const confirmPass = () => {
    setHasAnswered(true)
    setResultType('passed')
    setShowPassConfirm(false)
    passQuestion()
    
    setTimeout(() => {
      navigate(`/play/${roomCode}/result`, { 
        state: { resultType: 'passed' }
      })
    }, 500)
  }

  const cancelPass = () => {
    setShowPassConfirm(false)
  }

  const answers = question.answers
  const answerLabels = ['A', 'B', 'C', 'D']

  const difficultyColors = {
    'Facile': 'bg-secondary-container text-on-secondary-container',
    'Moyen': 'bg-primary-container text-on-primary-container',
    'Difficile': 'bg-tertiary-container text-on-tertiary',
    'Expert': 'bg-error-container text-on-error-container',
  }

  return (
    <div className="bg-background text-on-background min-h-screen font-body-lg flex flex-col">
      
      {/* Header compact pour mobile */}
      <header className="w-full bg-surface shadow-sm border-b border-outline-variant px-gutter-mobile py-3 flex items-center justify-between shrink-0 z-50">
        <div className="bg-surface border border-outline-variant px-4 py-1 rounded-full">
          <span className="font-label-lg text-label-lg text-on-surface">
            Question {currentQuestionIndex + 1}/{totalQuestions}
          </span>
        </div>
        
        <div className={`px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider ${difficultyColors[question.difficulty] || ''}`}>
          {question.difficulty}
        </div>
        
        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-label-lg text-label-lg ${currentPlayer.color}`}>
          {currentPlayer.initial}
        </div>
      </header>

      <main className="flex-grow flex flex-col justify-between px-gutter-mobile max-w-lg mx-auto w-full py-6">
        
        <div className="flex flex-col items-center mb-8">
          
          <div className={`
            bg-surface border-2 rounded-full px-8 py-4 flex items-center gap-3 shadow-sm mb-6
            transition-all duration-300
            ${isCritical 
              ? 'border-error shadow-error/20' 
              : isTimeUp 
                ? 'border-error bg-error-container' 
                : 'border-outline-variant'
            }
          `}>
            <span className={`
              material-symbols-outlined text-3xl
              ${isCritical ? 'text-error animate-pulse' : isTimeUp ? 'text-error' : 'text-primary'}
            `}>
              timer
            </span>
            <span className={`
              font-display-md text-display-md font-extrabold
              ${isCritical ? 'text-error animate-pulse' : isTimeUp ? 'text-error' : 'text-primary'}
            `}>
              {timeLeft}s
            </span>
          </div>

          {isTimeUp && !hasAnswered && (
            <div className="bg-error-container text-on-error-container px-6 py-3 rounded-xl font-headline-md text-headline-md text-center animate-pulse mb-4">
              ⏰ Temps écoulé !
            </div>
          )}

          <div className="bg-surface-container-low rounded-xl px-6 py-3">
            <span className="font-body-md text-body-md text-on-surface-variant">Score : </span>
            <span className="font-headline-md text-headline-md text-on-surface">{currentPlayer.score} pts</span>
          </div>

        </div>

        {/* Question en petit (rappel) */}
        <div className="bg-surface-container-low rounded-xl p-4 mb-4 text-center">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Regarde la question sur l'écran principal 📺
          </p>
        </div>

        {/* Boutons de réponse */}
        <div className="flex flex-col gap-4 mb-6">
          
          {answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={hasAnswered}
              className={`
                w-full px-6 py-6 rounded-xl font-headline-lg text-headline-lg
                flex items-center gap-4
                transition-all active:scale-95 duration-100
                ${hasAnswered && selectedAnswer === index
                  ? 'bg-primary text-on-primary shadow-sm'
                  : hasAnswered
                    ? 'bg-surface-container-high text-on-surface-variant opacity-50 cursor-not-allowed'
                    : 'bg-surface border border-outline-variant text-on-surface hover:bg-surface-container-low shadow-sm'
                }
              `}
            >
              <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center font-display-md text-display-md shrink-0
                ${hasAnswered && selectedAnswer === index
                  ? 'bg-on-primary/20 text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant'
                }
              `}>
                {answerLabels[index]}
              </div>
              <span className="flex-1 text-left">
                {answer}
              </span>
              {hasAnswered && selectedAnswer === index && (
                <span className="material-symbols-outlined text-2xl">check</span>
              )}
            </button>
          ))}

        </div>

        {/* Bouton Passer */}
        <div className="flex flex-col items-center gap-4">
          
          {!hasAnswered && (
            <button
              onClick={handlePass}
              className="w-full px-6 py-4 rounded-xl font-headline-md text-headline-md
                border-2 border-outline-variant text-on-surface-variant
                hover:bg-surface-container-low transition-all active:scale-95 duration-100
                flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">skip_next</span>
              Je passe
            </button>
          )}

          {hasAnswered && (
            <div className="text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant animate-spin">
                progress_activity
              </span>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                Résultat...
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 text-on-surface-variant">
            <div className="w-2 h-2 rounded-full bg-secondary"></div>
            <span className="font-label-sm text-label-sm">Connecté</span>
          </div>

        </div>

      </main>

      {/* Modale confirmation Passer */}
      {showPassConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl p-8 max-w-sm w-full shadow-lg text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">
              help
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-3">
              Passer la question ?
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8">
              Tu ne gagneras pas de points sur cette question (0 point)
            </p>
            <div className="flex gap-4">
              <button
                onClick={cancelPass}
                className="flex-1 bg-primary text-on-primary px-4 py-3 rounded-xl font-label-lg text-label-lg hover:bg-primary-fixed-variant transition-colors"
              >
                Non, répondre
              </button>
              <button
                onClick={confirmPass}
                className="flex-1 bg-surface border border-outline-variant text-on-surface px-4 py-3 rounded-xl font-label-lg text-label-lg hover:bg-surface-container-low transition-colors"
              >
                Oui, passer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default PlayerGamePage