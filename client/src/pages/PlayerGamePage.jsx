import { useState, useEffect, useRef, useCallback } from 'react'
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

  const [hasAnswered, setHasAnswered] = useState(false)
  const [showPassConfirm, setShowPassConfirm] = useState(false)
  const [showLevelScreen, setShowLevelScreen] = useState(false)
  const [levelInfo, setLevelInfo] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [displayResult, setDisplayResult] = useState(null)
  
  const timerRef = useRef(null)
  const questionRef = useRef(currentQuestionIndex)
  const hasAnsweredRef = useRef(false)
  const levelShownRef = useRef(false)

  const question = currentQuestion

  const handleTimeout = useCallback(() => {
    if (hasAnsweredRef.current) return
    setHasAnswered(true)
    hasAnsweredRef.current = true
    timeoutQuestion()
  }, [timeoutQuestion])

  // Détecter un changement de question
  useEffect(() => {
    if (currentQuestionIndex !== questionRef.current) {
      questionRef.current = currentQuestionIndex
      hasAnsweredRef.current = false
      setHasAnswered(false)
      setDisplayResult(null)
      setShowPassConfirm(false)
      setShowLevelScreen(false)
      levelShownRef.current = false
    }
  }, [currentQuestionIndex])

  // Afficher l'écran de niveau
  useEffect(() => {
    if (!question || currentQuestionIndex === undefined) return
    if (levelShownRef.current) return
    
    const isNewLevel = currentQuestionIndex === 0 || 
                       currentQuestionIndex === 5 || 
                       currentQuestionIndex === 10 || 
                       currentQuestionIndex === 15 || 
                       currentQuestionIndex === 20
    
    if (isNewLevel) {
      levelShownRef.current = true
      const level = currentQuestionIndex < 5 ? 'Facile' : 
                    currentQuestionIndex < 10 ? 'Moyen' : 
                    currentQuestionIndex < 15 ? 'Difficile' : 'Expert'
      
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLevelInfo({ level, index: currentQuestionIndex })
       
      setShowLevelScreen(true)
      
      const timer = setTimeout(() => {
        setShowLevelScreen(false)
        setLevelInfo(null)
      }, 2500)
      
      return () => clearTimeout(timer)
    }
  }, [currentQuestionIndex, question])

  // Afficher le résultat
  useEffect(() => {
    if (!lastResult || !hasAnsweredRef.current) return
    
    const questionText = question?.answers?.[lastResult.correctAnswer] || ''
    
    let resultData
    
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

    setDisplayResult(resultData)
    
    const timer = setTimeout(() => {
      setDisplayResult(null)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [lastResult, question])

  // Timer - décompte
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
          if (!hasAnsweredRef.current) {
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

  // Rediriger quand tout le monde a fini
  useEffect(() => {
    if (allFinished || gamePhase === 'final') {
      navigate(`/play/${roomCode}/final`)
    }
  }, [allFinished, gamePhase, navigate, roomCode])

  // Rediriger vers l'attente
  useEffect(() => {
    if (hasFinished && waiting && !allFinished && gamePhase !== 'final') {
      navigate(`/play/${roomCode}/waiting-final`)
    }
  }, [hasFinished, waiting, allFinished, gamePhase, navigate, roomCode])

  const handleAnswer = (index) => {
    if (hasAnsweredRef.current || !question) return
    setHasAnswered(true)
    hasAnsweredRef.current = true
    submitAnswer(index)
  }

  const handlePass = () => {
    setShowPassConfirm(true)
  }
  
  const confirmPass = () => {
    setHasAnswered(true)
    hasAnsweredRef.current = true
    setShowPassConfirm(false)
    passQuestion()
  }

  const cancelPass = () => {
    setShowPassConfirm(false)
  }

  if (!currentPlayer || !question) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-6xl text-primary animate-bounce mb-4">sports_esports</span>
        <p className="font-headline-md text-on-surface">En attente de la question...</p>
      </div>
    )
  }

  if (showLevelScreen && levelInfo) {
    const levelEmojis = { 'Facile': '🌱', 'Moyen': '🏙️', 'Difficile': '🏔️', 'Expert': '🌌' }
    const levelColors = { 'Facile': 'text-secondary', 'Moyen': 'text-primary', 'Difficile': 'text-tertiary', 'Expert': 'text-error' }
    const levelBg = { 'Facile': 'bg-secondary-container/20', 'Moyen': 'bg-primary-container/20', 'Difficile': 'bg-tertiary-container/20', 'Expert': 'bg-error-container/20' }
    
    return (
      <div className="bg-background min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className={`w-32 h-32 rounded-full ${levelBg[levelInfo.level]} flex items-center justify-center mx-auto mb-6`}>
            <span className="text-7xl">{levelEmojis[levelInfo.level]}</span>
          </div>
          <h1 className={`font-display-lg text-display-lg ${levelColors[levelInfo.level]} mb-2`}>
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

  return (
    <div className="bg-background text-on-background min-h-screen font-body-lg flex flex-col">
      
      <header className="w-full bg-surface shadow-sm border-b border-outline-variant px-4 py-3 flex items-center justify-between shrink-0">
        <span className="font-label-lg text-on-surface">Q{currentQuestionIndex + 1}/{totalQuestions}</span>
        <span className="font-label-sm uppercase px-3 py-1 rounded-full bg-primary-container text-on-primary-container">
          {question.difficulty}
        </span>
        <div className="flex items-center gap-2">
          <span className={`material-symbols-outlined text-xl ${isCritical ? 'text-error animate-pulse' : 'text-primary'}`}>timer</span>
          <span className={`font-headline-md ${isCritical ? 'text-error' : 'text-primary'}`}>{timeLeft}s</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col px-4 max-w-lg mx-auto w-full py-4">
        
        <div className="bg-surface border border-outline-variant rounded-2xl p-5 mb-4 shadow-sm">
          <h2 className="font-headline-md text-headline-md text-on-surface text-center">
            {question.question}
          </h2>
        </div>

        <div className="text-center mb-3">
          <span className="font-body-md text-on-surface-variant">Score : </span>
          <span className="font-headline-md text-on-surface">{currentPlayer.score || 0} pts</span>
        </div>

        {displayResult && (
          <div className={`rounded-xl p-4 mb-3 text-center border-2 ${displayResult.type === 'correct' ? 'bg-secondary-container/20 border-secondary' : 'bg-error-container/20 border-error'}`}>
            <p className="font-headline-md text-on-surface mb-2">{displayResult.message}</p>
            {displayResult.correctAnswerText && (
              <p className="font-body-md text-on-surface-variant">
                Réponse : <strong className="text-secondary">{displayResult.correctAnswerText}</strong>
              </p>
            )}
          </div>
        )}

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
            <button onClick={handlePass} className="w-full px-4 py-3 rounded-xl font-label-lg text-label-lg border-2 border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-all active:scale-95 flex items-center justify-center gap-2 mt-1">
              <span className="material-symbols-outlined">skip_next</span>
              Je passe (0 point)
            </button>
          </div>
        )}

        {hasAnswered && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant animate-spin">progress_activity</span>
            <p className="font-body-md text-on-surface-variant">Question suivante...</p>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 py-3 text-on-surface-variant mt-auto">
          <div className="w-2 h-2 rounded-full bg-secondary"></div>
          <span className="font-label-sm">Connecté</span>
        </div>

      </main>

      {showPassConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl p-8 max-w-sm w-full shadow-lg text-center">
            <h3 className="font-headline-md text-on-surface mb-3">Passer la question ?</h3>
            <p className="font-body-md text-on-surface-variant mb-6">0 point</p>
            <div className="flex gap-4">
              <button onClick={cancelPass} className="flex-1 bg-primary text-on-primary px-4 py-3 rounded-xl font-label-lg">Non</button>
              <button onClick={confirmPass} className="flex-1 bg-surface border border-outline-variant text-on-surface px-4 py-3 rounded-xl font-label-lg">Oui</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default PlayerGamePage