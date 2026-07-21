import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useGame } from '../context/GameContext'

function PlayerResultPage() {
  const navigate = useNavigate()
  const { roomCode } = useParams()
  const location = useLocation()
  const { currentPlayer, getCurrentQuestion, gamePhase, currentAnswers } = useGame()
  const [countdown, setCountdown] = useState(3)

  const question = getCurrentQuestion()
  
  // Déterminer le type de résultat depuis le serveur
  const myAnswer = currentPlayer ? currentAnswers[currentPlayer.socketId || currentPlayer.id] : null
  const resultType = location.state?.resultType || (myAnswer?.passed ? 'passed' : myAnswer?.isCorrect ? 'correct' : myAnswer?.answered ? 'wrong' : 'timeout')

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          if (gamePhase === 'final') {
            navigate(`/play/${roomCode}/final`)
          } else {
            navigate(`/play/${roomCode}/waiting`)
          }
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

  const getResultContent = () => {
    const correctAnswerText = question 
      ? `${['A', 'B', 'C', 'D'][question.correctIndex]}) ${question.answers[question.correctIndex]}`
      : ''

    switch (resultType) {
      case 'correct':
        return {
          icon: 'check_circle',
          iconColor: 'text-secondary',
          title: 'BONNE RÉPONSE !',
          titleColor: 'text-secondary',
          showAnswer: false,
          points: '+10 points',
          bonus: '⚡ Continue comme ça !'
        }
      case 'wrong':
        return {
          icon: 'cancel',
          iconColor: 'text-error',
          title: 'MAUVAISE RÉPONSE',
          titleColor: 'text-error',
          showAnswer: true,
          correctAnswer: correctAnswerText,
          points: '+0 point'
        }
      case 'passed':
        return {
          icon: 'skip_next',
          iconColor: 'text-on-surface-variant',
          title: 'QUESTION PASSÉE',
          titleColor: 'text-on-surface-variant',
          showAnswer: true,
          correctAnswer: correctAnswerText,
          points: '+0 point'
        }
      case 'timeout':
        return {
          icon: 'timer_off',
          iconColor: 'text-error',
          title: 'TEMPS ÉCOULÉ',
          titleColor: 'text-error',
          showAnswer: true,
          correctAnswer: correctAnswerText,
          points: '+0 point'
        }
      default:
        return {
          icon: 'help',
          iconColor: 'text-on-surface-variant',
          title: 'RÉSULTAT',
          titleColor: 'text-on-surface-variant',
          showAnswer: true,
          correctAnswer: correctAnswerText,
          points: '+0 point'
        }
    }
  }

  const result = getResultContent()

  return (
    <div className="bg-background text-on-background min-h-screen font-body-lg flex flex-col items-center justify-center px-gutter-mobile">
      
      <div className="w-full max-w-md bg-surface border border-outline-variant rounded-2xl p-8 md:p-10 shadow-sm text-center">
        
        <span className={`material-symbols-outlined text-7xl ${result.iconColor || 'text-on-surface-variant'} mb-4 block`}>
          {result.icon}
        </span>

        <h1 className={`font-display-md text-display-md ${result.titleColor || 'text-on-surface'} mb-4`}>
          {result.title}
        </h1>

        {result.showAnswer && result.correctAnswer && (
          <div className="bg-surface-container-low rounded-xl p-4 mb-4">
            <p className="font-body-md text-body-md text-on-surface-variant mb-1">
              La bonne réponse était :
            </p>
            <p className="font-headline-md text-headline-md text-secondary">
              {result.correctAnswer}
            </p>
          </div>
        )}

        {result.bonus && (
          <div className="bg-secondary-container/30 rounded-xl p-4 mb-4">
            <p className="font-body-lg text-body-lg text-on-secondary-container">
              {result.bonus}
            </p>
          </div>
        )}

        <div className="bg-primary-container/20 rounded-xl p-4 mb-4">
          <p className="font-headline-lg text-headline-lg text-primary">
            {result.points}
          </p>
        </div>

        <div className="bg-surface-container-low rounded-xl p-4 mb-8">
          <p className="font-body-md text-body-md text-on-surface-variant mb-1">
            Score total
          </p>
          <p className="font-display-md text-display-md text-on-surface">
            {currentPlayer.score || 0} pts
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            {currentPlayer.correct || 0}/{currentPlayer.total || 0} bonnes réponses
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <span className="material-symbols-outlined text-on-surface-variant animate-spin">
            progress_activity
          </span>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {gamePhase === 'final' ? 'Classement final...' : `Prochaine question dans ${countdown} secondes...`}
          </p>
        </div>

        <div className="w-full h-2 bg-surface-container-high rounded-full mt-4 overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-1000"
            style={{ width: `${(countdown / 3) * 100}%` }}
          ></div>
        </div>

      </div>

    </div>
  )
}

export default PlayerResultPage