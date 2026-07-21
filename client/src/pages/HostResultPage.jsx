import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGame } from '../context/GameContext'

function HostResultPage() {
  const navigate = useNavigate()
  const { roomCode } = useParams()
  const { 
    currentQuestionIndex, 
    totalQuestions,
    players, 
    currentAnswers,
    getCurrentQuestion,
    nextQuestion,
  } = useGame()
  
  const [countdown, setCountdown] = useState(5)

  const question = getCurrentQuestion()
  const isLastQuestion = currentQuestionIndex + 1 >= totalQuestions

  // Statistiques
  // eslint-disable-next-line no-unused-vars
  const totalPlayers = players.length
  const correctCount = Object.values(currentAnswers).filter(a => a.isCorrect).length
  const wrongCount = Object.values(currentAnswers).filter(a => a.answered && !a.isCorrect && !a.passed).length
  const passedCount = Object.values(currentAnswers).filter(a => a.passed).length

  // Top 3 rapidité
  const fastestPlayers = Object.entries(currentAnswers)
    // eslint-disable-next-line no-unused-vars
    .filter(([_, answer]) => answer.isCorrect)
    // eslint-disable-next-line no-unused-vars
    .sort(([_, a], [__, b]) => a.timeTaken - b.timeTaken)
    .slice(0, 3)
    .map(([playerId, answer]) => {
      const player = players.find(p => p.id === parseInt(playerId))
      return {
        ...player,
        time: `${answer.timeTaken.toFixed(1)}s`
      }
    })

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          if (isLastQuestion) {
            navigate(`/host/${roomCode}/final`)
          } else {
            nextQuestion()
            navigate(`/host/${roomCode}/game`)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate, roomCode, isLastQuestion, nextQuestion])

  if (!question) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <p className="font-headline-md text-on-surface">Chargement...</p>
      </div>
    )
  }

  const correctAnswerText = `${['A', 'B', 'C', 'D'][question.correctIndex]}) ${question.answers[question.correctIndex]}`

  return (
    <div className="bg-background text-on-background min-h-screen font-body-lg flex flex-col">
      
      <header className="w-full h-16 bg-surface shadow-sm border-b border-outline-variant flex items-center px-gutter-desktop max-w-max-width-host mx-auto shrink-0">
        <span className="font-display-md text-display-md font-extrabold text-primary">QuizBlast</span>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-gutter-desktop max-w-max-width-host mx-auto w-full">
        
        <div className="text-center mb-8">
          <h1 className="font-display-md text-display-md text-on-surface mb-2">
            Résultat Question {currentQuestionIndex + 1}
          </h1>
        </div>

        {/* Réponse correcte */}
        <div className="w-full max-w-4xl bg-secondary-container/30 border-2 border-secondary rounded-2xl p-8 mb-8 text-center">
          <span className="material-symbols-outlined text-6xl text-secondary mb-4 block">check_circle</span>
          <p className="font-body-lg text-body-lg text-on-secondary-container mb-2">La bonne réponse était :</p>
          <h2 className="font-display-lg text-display-lg text-secondary">{correctAnswerText}</h2>
        </div>

        {/* Statistiques */}
        <div className="w-full max-w-4xl grid grid-cols-3 gap-6 mb-8">
          <div className="bg-surface border border-outline-variant rounded-xl p-6 text-center shadow-sm">
            <span className="material-symbols-outlined text-4xl text-secondary mb-3 block">check_circle</span>
            <p className="font-display-md text-display-md text-secondary mb-1">{correctCount}</p>
            <p className="font-body-md text-body-md text-on-surface-variant">bonnes réponses</p>
          </div>
          <div className="bg-surface border border-outline-variant rounded-xl p-6 text-center shadow-sm">
            <span className="material-symbols-outlined text-4xl text-error mb-3 block">cancel</span>
            <p className="font-display-md text-display-md text-error mb-1">{wrongCount}</p>
            <p className="font-body-md text-body-md text-on-surface-variant">mauvaises réponses</p>
          </div>
          <div className="bg-surface border border-outline-variant rounded-xl p-6 text-center shadow-sm">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3 block">skip_next</span>
            <p className="font-display-md text-display-md text-on-surface-variant mb-1">{passedCount}</p>
            <p className="font-body-md text-body-md text-on-surface-variant">ont passé</p>
          </div>
        </div>

        {/* Top 3 rapidité */}
        {fastestPlayers.length > 0 && (
          <div className="w-full max-w-4xl bg-surface border border-outline-variant rounded-2xl p-8 shadow-sm mb-8">
            <h3 className="font-headline-md text-headline-md text-on-surface text-center mb-6">
              ⚡ Les plus rapides
            </h3>
            <div className="flex justify-center items-end gap-6">
              {fastestPlayers.map((player, index) => (
                <div key={player?.id || index} className="flex flex-col items-center gap-3">
                  <span className="font-display-md text-display-md">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </span>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center font-headline-md text-headline-md shadow-sm ${player?.color || 'bg-primary text-on-primary'}`}>
                    {player?.initial || '?'}
                  </div>
                  <span className="font-body-md text-body-md text-on-surface">{player?.name || '?'}</span>
                  <span className="font-label-lg text-label-lg text-primary">{player?.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compte à rebours */}
        <div className="text-center">
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-3">
            {isLastQuestion ? 'Classement final dans...' : 'Prochaine question dans...'}
          </p>
          <div className="bg-surface border border-outline-variant rounded-full w-20 h-20 flex items-center justify-center mx-auto shadow-sm">
            <span className="font-display-lg text-display-lg text-primary">{countdown}</span>
          </div>
          <div className="w-full max-w-md h-2 bg-surface-container-high rounded-full mt-4 overflow-hidden mx-auto">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-1000"
              style={{ width: `${(countdown / 5) * 100}%` }}
            ></div>
          </div>
        </div>

      </main>

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

export default HostResultPage