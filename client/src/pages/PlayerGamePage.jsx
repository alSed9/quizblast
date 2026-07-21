import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGame } from '../context/GameContext'

function PlayerGamePage() {
  const navigate = useNavigate()
  const { roomCode } = useParams()
  
  const { 
    currentPlayer, 
    currentQuestion, 
    currentQuestionIndex, 
    totalQuestions,
    submitAnswer,
    passQuestion,
    timeoutQuestion,
    gamePhase,
    hasFinished,
    lastResult,
    waiting,
    allFinished,
  } = useGame()

  // eslint-disable-next-line no-unused-vars
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [showPassConfirm, setShowPassConfirm] = useState(false)
  const [showLevelScreen, setShowLevelScreen] = useState(false)
  const [levelInfo, setLevelInfo] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [displayResult, setDisplayResult] = useState(null)
  
  const timerRef = useRef(null)
  const questionRef = useRef(currentQuestionIndex)

  const question = currentQuestion

  // Détecter un changement de question
  useEffect(() => {
    if (currentQuestionIndex !== questionRef.current) {
      questionRef.current = currentQuestionIndex
      setSelectedAnswer(null)
      setHasAnswered(false)
      setDisplayResult(null)
      setShowPassConfirm(false)
      setShowLevelScreen(false)
    }
  }, [currentQuestionIndex])

  // Afficher l'écran de niveau si nouveau niveau
  useEffect(() => {
    if (!question) return
    
    const isNewLevel = currentQuestionIndex === 0 || 
                       currentQuestionIndex === 5 || 
                       currentQuestionIndex === 10 || 
                       currentQuestionIndex === 15 || 
                       currentQuestionIndex === 20
    
    if (isNewLevel) {
      const level = currentQuestionIndex < 5 ? 'Facile' : 
                    currentQuestionIndex < 10 ? 'Moyen' : 
                    currentQuestionIndex < 15 ? 'Difficile' : 'Expert'
      
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLevelInfo({ level, index: currentQuestionIndex })
      setShowLevelScreen(true)
      setTimeLeft(0)
      
      const timer = setTimeout(() => {
        setShowLevelScreen(false)
        setLevelInfo(null)
      }, 2500)
      
      return () => clearTimeout(timer)
    }
  }, [currentQuestionIndex, question])

  // Afficher le résultat quand lastResult change
  useEffect(() => {
    if (lastResult && hasAnswered) {
      const questionText = question?.answers?.[lastResult.correctAnswer] || ''
      
      // eslint-disable-next-line no-useless-assignment
      let resultData = {
        message: '',
        type: '',
        correctAnswerText: '',
      }

      if (lastResult.isCorrect) {
        resultData = {
          message: '✅ BONNE RÉPONSE ! +10 pts',
          type: 'correct',
          correctAnswerText: '',
        }
      } else if (lastResult.passed) {
        resultData = {
          message: '⏭️ QUESTION PASSÉE',
          type: 'passed',
          correctAnswerText: questionText,
        }
      } else if (lastResult.timeout) {
        resultData = {
          message: '⏰ TEMPS ÉCOULÉ !',
          type: 'timeout',
          correctAnswerText: questionText,
        }
      } else {
        resultData = {
          message: '❌ MAUVAISE RÉPONSE',
          type: 'wrong',
          correctAnswerText: questionText,
        }
      }

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayResult(resultData)
      
      // Effacer le résultat après 2 secondes
      const timer = setTimeout(() => {
        setDisplayResult(null)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [lastResult, hasAnswered, question])

  // Timer local
  useEffect(() => {
    if (!question || hasAnswered || showLevelScreen) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(question.time || 15)
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          timerRef.current = null
          if (!hasAnswered) {
            // eslint-disable-next-line react-hooks/immutability
            handleTimeout()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [question, hasAnswered, showLevelScreen, handleTimeout])

  // Rediriger quand le joueur a fini et que tout le monde a fini
  useEffect(() => {
    if (allFinished || gamePhase === 'final') {
      navigate(`/play/${roomCode}/final`)
    }
  }, [allFinished, gamePhase, navigate, roomCode])

  // Rediriger vers la page d'attente si le joueur a fini mais les autres non
  useEffect(() => {
    if (hasFinished && waiting && !allFinished && gamePhase !== 'final') {
      navigate(`/play/${roomCode}/waiting-final`)
    }
  }, [hasFinished, waiting, allFinished, gamePhase, navigate, roomCode])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleTimeout = () => {
    if (hasAnswered) return
    setHasAnswered(true)
    timeoutQuestion()
  }

  const handleAnswer = (index) => {
    if (hasAnswered || !question) return
    setSelectedAnswer(index)
    setHasAnswered(true)
    submitAnswer(index)
  }

  const handlePass = () => {
    setShowPassConfirm(true)
  }
  
  const confirmPass = () => {
    setHasAnswered(true)
    setShowPassConfirm(false)
    passQuestion()
  }

  const cancelPass = () => {
    setShowPassConfirm(false)
  }

  // Écran de chargement
  if (!currentPlayer || !question) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-6xl text-primary animate-bounce mb-4">sports_esports</span>
        <p className="font-headline-md text-on-surface">En attente de la question...</p>
      </div>
    )
  }

  // Écran de niveau
  if (showLevelScreen && levelInfo) {
    const levelEmojis = { 'Facile': '🌱', 'Moyen': '🏙️', 'Difficile': '🏔️', 'Expert': '🌌' }
    const levelColors = { 'Facile': 'text-secondary', 'Moyen': 'text-primary', 'Difficile': 'text-tertiary', 'Expert': 'text-error' }
    const levelBg = { 'Facile': 'bg-secondary-container/20', 'Moyen': 'bg-primary-container/20', 'Difficile': 'bg-tertiary-container/20', 'Expert': 'bg-error-container/20' }
    
    return (
      <div className="bg-background min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className={`w-32 h-32 rounded-full ${levelBg[levelInfo.level] || 'bg-primary-container/20'} flex items-center justify-center mx-auto mb-6`}>
            <span className="text-7xl">{levelEmojis[levelInfo.level] || '🎯'}</span>
          </div>
          <h1 className={`font-display-lg text-display-lg ${levelColors[levelInfo.level] || 'text-primary'} mb-2`}>
            Niveau {levelInfo.level}
          </h1>
          <p className="font-body-lg text-on-surface-variant mb-8">
            Questions {levelInfo.index + 1} à {Math.min(levelInfo.index + 5, totalQuestions)}
          </p>
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  const answers = question.answers || []
  const answerLabels = ['A', 'B', 'C', 'D']
  const isCritical = timeLeft <= 5 && timeLeft > 0
  const isTimeUp = timeLeft <= 0

  const difficultyColors = {
    'Facile': 'bg-secondary-container text-on-secondary-container',
    'Moyen': 'bg-primary-container text-on-primary-container',
    'Difficile': 'bg-tertiary-container text-on-tertiary',
    'Expert': 'bg-error-container text-on-error-container',
  }

  return (
    <div className="bg-background text-on-background min-h-screen font-body-lg flex flex-col">
      
      {/* Header */}
      <header className="w-full bg-surface shadow-sm border-b border-outline-variant px-4 py-3 flex items-center justify-between shrink-0 z-50">
        <div className="bg-surface border border-outline-variant px-3 py-1 rounded-full">
          <span className="font-label-lg text-label-lg text-on-surface">
            Q{currentQuestionIndex + 1}/{totalQuestions}
          </span>
        </div>
        
        <div className={`px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider ${difficultyColors[question.difficulty] || 'bg-primary-container text-on-primary-container'}`}>
          {question.difficulty}
        </div>
        
        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-label-lg text-label-lg ${currentPlayer.color || 'bg-primary text-on-primary'}`}>
          {currentPlayer.initial || '?'}
        </div>
      </header>

      <main className="flex-grow flex flex-col px-4 max-w-lg mx-auto w-full py-4">
        
        {/* Timer */}
        <div className="flex justify-center mb-4">
          <div className={`
            bg-surface border-2 rounded-full px-6 py-3 flex items-center gap-3 shadow-sm
            transition-all duration-300
            ${isCritical ? 'border-error' : isTimeUp ? 'border-error bg-error-container' : 'border-outline-variant'}
          `}>
            <span className={`material-symbols-outlined text-2xl ${isCritical ? 'text-error animate-pulse' : isTimeUp ? 'text-error' : 'text-primary'}`}>
              timer
            </span>
            <span className={`font-headline-md text-headline-md font-extrabold ${isCritical ? 'text-error animate-pulse' : isTimeUp ? 'text-error' : 'text-primary'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* Temps écoulé */}
        {isTimeUp && !hasAnswered && (
          <div className="bg-error-container text-on-error-container px-4 py-2 rounded-xl font-headline-md text-headline-md text-center animate-pulse mb-4">
            ⏰ Temps écoulé !
          </div>
        )}

        {/* Question */}
        <div className="bg-surface border border-outline-variant rounded-2xl p-5 mb-4 shadow-sm">
          <h2 className="font-headline-md text-headline-md text-on-surface text-center">
            {question.question}
          </h2>
        </div>

        {/* Score */}
        <div className="text-center mb-3">
          <span className="font-body-md text-on-surface-variant">Score : </span>
          <span className="font-headline-md text-on-surface">{currentPlayer.score || 0} pts</span>
          <span className="font-body-sm text-on-surface-variant ml-3">
            {currentPlayer.correct || 0}/{currentPlayer.total || 0} bonnes
          </span>
        </div>

        {/* Résultat affiché */}
        {displayResult && (
          <div className={`
            rounded-xl p-4 mb-3 text-center border-2
            ${displayResult.type === 'correct' 
              ? 'bg-secondary-container/20 border-secondary' 
              : displayResult.type === 'passed' 
                ? 'bg-surface-container-low border-outline-variant'
                : 'bg-error-container/20 border-error'
            }
          `}>
            <p className="font-headline-md text-on-surface mb-2">{displayResult.message}</p>
            {displayResult.correctAnswerText && (
              <p className="font-body-md text-on-surface-variant">
                La bonne réponse était : <strong className="text-secondary">{displayResult.correctAnswerText}</strong>
              </p>
            )}
          </div>
        )}

        {/* Boutons de réponse */}
        {!hasAnswered && !displayResult && (
          <div className="flex flex-col gap-3 flex-1">
            {answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full px-4 py-4 rounded-xl font-headline-md text-headline-md flex items-center gap-3 bg-surface border border-outline-variant text-on-surface hover:bg-surface-container-low transition-all active:scale-95 shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center font-bold text-on-surface-variant shrink-0">
                  {answerLabels[index]}
                </div>
                <span className="flex-1 text-left text-base">{answer}</span>
              </button>
            ))}
            
            <button
              onClick={handlePass}
              className="w-full px-4 py-3 rounded-xl font-label-lg text-label-lg border-2 border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-all active:scale-95 flex items-center justify-center gap-2 mt-1"
            >
              <span className="material-symbols-outlined">skip_next</span>
              Je passe (0 point)
            </button>
          </div>
        )}

        {/* En attente de la prochaine question */}
        {(hasAnswered || displayResult) && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant animate-spin">
              progress_activity
            </span>
            <p className="font-body-md text-on-surface-variant">
              Question suivante...
            </p>
          </div>
        )}

        {/* Indicateur connexion */}
        <div className="flex items-center justify-center gap-2 py-3 text-on-surface-variant">
          <div className="w-2 h-2 rounded-full bg-secondary"></div>
          <span className="font-label-sm text-label-sm">Connecté</span>
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