import { useNavigate, useParams } from 'react-router-dom'
import { useGame } from '../context/GameContext'

function HostGamePage() {
  const navigate = useNavigate()
  const { roomCode } = useParams()
  const { 
    currentQuestionIndex, 
    totalQuestions, 
    playersAnswered, 
    players,
    getCurrentQuestion,
    skipQuestion,
    isPaused,
    togglePause,
    timeLeft,
  } = useGame()

  const question = getCurrentQuestion()
  
  const handleSkip = () => {
    skipQuestion()
    navigate(`/host/${roomCode}/result`)
  }

  if (!question) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <p className="font-headline-md text-on-surface">Chargement...</p>
      </div>
    )
  }

  const isCritical = timeLeft <= 5 && timeLeft > 0

  return (
    <div className="bg-background text-on-background min-h-screen font-body-lg flex flex-col">
      
      <header className="w-full h-16 bg-surface shadow-sm border-b border-outline-variant flex justify-between items-center px-4 md:px-gutter-desktop max-w-max-width-host mx-auto shrink-0">
        <span className="font-display-md text-display-md font-extrabold text-primary">QuizBlast</span>
        <div className="flex items-center gap-3">
          <span className="font-body-md text-on-surface-variant">{playersAnswered}/{players.length} réponses</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-gutter-desktop max-w-max-width-host mx-auto w-full">
        
        <div className="w-full max-w-4xl flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-surface border border-outline-variant px-4 py-2 rounded-full shadow-sm">
              <span className="font-headline-md text-headline-md text-on-surface">
                Question {currentQuestionIndex + 1}/{totalQuestions}
              </span>
            </div>
          </div>

          <div className={`
            bg-surface border-2 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm
            ${isCritical ? 'border-error' : 'border-outline-variant'}
          `}>
            <span className={`material-symbols-outlined text-2xl ${isCritical ? 'text-error animate-pulse' : 'text-primary'}`}>
              {isPaused ? 'pause_circle' : 'timer'}
            </span>
            <span className={`font-headline-md text-headline-md font-extrabold ${isCritical ? 'text-error animate-pulse' : 'text-primary'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        <div className="w-full max-w-4xl bg-surface border border-outline-variant rounded-2xl p-8 text-center mb-6 shadow-sm">
          <h1 className="font-display-md text-display-md md:font-display-lg md:text-display-lg text-on-surface">
            {question.question}
          </h1>
        </div>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {question.answers.map((answer, index) => {
            const letters = ['A', 'B', 'C', 'D']
            return (
              <div key={index} className="bg-surface border border-outline-variant rounded-xl p-6 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-display-md text-display-md">
                  {letters[index]}
                </div>
                <span className="font-headline-md text-headline-md text-on-surface">
                  {answer}
                </span>
              </div>
            )
          })}
        </div>

        <div className="w-full max-w-4xl bg-surface border border-outline-variant rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-full h-4 bg-surface-container-high rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${players.length > 0 ? (playersAnswered / players.length) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="font-headline-md text-headline-md text-on-surface whitespace-nowrap">
              {playersAnswered}/{players.length}
            </span>
          </div>
        </div>

      </main>

      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant p-4 z-20">
        <div className="max-w-max-width-host mx-auto flex justify-center gap-4">
          <button 
            onClick={togglePause}
            className="bg-surface border border-outline-variant text-on-surface px-6 py-3 rounded-xl font-label-lg text-label-lg flex items-center gap-2 shadow-sm hover:bg-surface-container-low transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">
              {isPaused ? 'play_arrow' : 'pause'}
            </span>
            {isPaused ? 'Reprendre' : 'Pause'}
          </button>
          <button 
            onClick={handleSkip}
            className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-lg text-label-lg flex items-center gap-2 shadow-sm hover:bg-primary-fixed-variant transition-all active:scale-95"
          >
            Passer
            <span className="material-symbols-outlined">skip_next</span>
          </button>
        </div>
      </footer>

    </div>
  )
}

export default HostGamePage