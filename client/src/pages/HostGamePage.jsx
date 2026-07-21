import { useNavigate, useParams } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { useTimer } from '../hooks/useTimer'

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
  } = useGame()

  const question = getCurrentQuestion()
  
  const handleTimeUp = () => {
    navigate(`/host/${roomCode}/result`)
  }

  const { timeLeft, isCritical } = useTimer(
    question?.time || 15,
    isPaused,
    handleTimeUp
  )

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

  const difficultyColors = {
    'Facile': 'bg-secondary-container text-on-secondary-container',
    'Moyen': 'bg-primary-container text-on-primary-container',
    'Difficile': 'bg-tertiary-container text-on-tertiary',
    'Expert': 'bg-error-container text-on-error-container',
  }

  const answeredAvatars = players.slice(0, Math.min(playersAnswered, 8))

  return (
    <div className="bg-background text-on-background min-h-screen font-body-lg flex flex-col">
      
      <header className="w-full h-16 bg-surface shadow-sm border-b border-outline-variant flex justify-between items-center px-gutter-desktop max-w-max-width-host mx-auto shrink-0 z-50">
        <div className="flex items-center gap-4">
          <span className="font-display-md text-display-md font-extrabold text-primary">QuizBlast</span>
        </div>
        <nav className="hidden md:flex gap-6 items-end h-full">
          <div className="h-full flex items-end">
            <span className="text-primary font-bold border-b-2 border-primary pb-1 px-4 cursor-pointer">Live Session</span>
          </div>
        </nav>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors active:scale-95">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant bg-primary-container flex items-center justify-center">
            <span className="font-label-lg text-label-lg text-primary">H</span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-gutter-desktop relative z-10 max-w-max-width-host mx-auto w-full">
        
        <div className="w-full max-w-4xl flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-surface border border-outline-variant px-6 py-2 rounded-full shadow-sm">
              <span className="font-headline-md text-headline-md text-on-surface">
                Question {currentQuestionIndex + 1}/{totalQuestions}
              </span>
            </div>
            <div className={`px-4 py-1 rounded-full font-label-lg text-label-lg uppercase tracking-wider shadow-sm ${difficultyColors[question.difficulty] || ''}`}>
              {question.difficulty}
            </div>
          </div>

          <div className={`
            bg-surface border-2 px-6 py-3 rounded-full flex items-center gap-3 shadow-sm
            ${isCritical ? 'border-error' : 'border-outline-variant'}
            ${isPaused ? 'opacity-50' : ''}
          `}>
            <span className={`material-symbols-outlined text-3xl ${isCritical ? 'text-error animate-pulse' : 'text-primary'}`}>
              {isPaused ? 'pause_circle' : 'timer'}
            </span>
            <span className={`font-display-md text-display-md font-extrabold ${isCritical ? 'text-error animate-pulse' : 'text-primary'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        <div className="w-full max-w-4xl bg-surface border border-outline-variant rounded-2xl p-12 text-center mb-8 shadow-sm">
          <h1 className="font-display-lg text-display-lg text-on-surface">
            {question.question}
          </h1>
        </div>

        <div className="w-full max-w-4xl grid grid-cols-2 gap-6 mb-12">
          {question.answers.map((answer, index) => {
            const letters = ['A', 'B', 'C', 'D']
            const colors = [
              'bg-tertiary-container text-on-tertiary',
              'bg-primary text-on-primary',
              'bg-secondary text-on-secondary',
              'bg-on-surface-variant text-surface',
            ]
            const hoverColors = [
              'group-hover:text-tertiary',
              'group-hover:text-primary',
              'group-hover:text-secondary',
              'group-hover:text-on-surface-variant',
            ]
            
            return (
              <button key={index} className="bg-surface border border-outline-variant rounded-xl p-8 flex items-center gap-6 shadow-sm hover:bg-surface-container-low transition-all group">
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center font-display-md text-display-md ${colors[index]}`}>
                  {letters[index]}
                </div>
                <span className={`font-headline-lg text-headline-lg text-on-surface ${hoverColors[index]} transition-colors`}>
                  {answer}
                </span>
              </button>
            )
          })}
        </div>

        <div className="w-full max-w-4xl bg-surface border border-outline-variant rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4 w-1/2">
            <div className="w-full h-4 bg-surface-container-high rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${players.length > 0 ? (playersAnswered / players.length) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="font-headline-md text-headline-md text-on-surface whitespace-nowrap">
              {playersAnswered}/{players.length} ont répondu
            </span>
          </div>

          <div className="flex -space-x-3">
            {answeredAvatars.map((player) => (
              <div key={player.id || player.socketId} className={`w-10 h-10 rounded-full border-2 border-surface flex items-center justify-center font-label-sm text-label-sm relative ${player.color || 'bg-primary text-on-primary'}`}>
                {player.initial || player.name?.charAt(0) || '?'}
                <div className="absolute inset-0 bg-secondary/80 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-secondary text-sm">check</span>
                </div>
              </div>
            ))}
            {playersAnswered > 8 && (
              <div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-container-high flex items-center justify-center text-on-surface-variant font-label-sm text-label-sm">
                +{playersAnswered - 8}
              </div>
            )}
          </div>
        </div>

      </main>

      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant p-gutter-desktop z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-max-width-host mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button className="bg-surface border border-outline-variant text-on-surface-variant px-6 py-3 rounded-lg font-label-lg text-label-lg flex items-center gap-2 hover:bg-surface-container-low transition-colors shadow-sm">
              <span className="material-symbols-outlined">music_note</span>
              BGM
            </button>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={togglePause}
              className="bg-surface border border-outline-variant text-on-surface px-8 py-4 rounded-xl font-headline-md text-headline-md flex items-center gap-2 shadow-sm hover:bg-surface-container-low transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">
                {isPaused ? 'play_arrow' : 'pause'}
              </span>
              {isPaused ? 'Reprendre' : 'Pause'}
            </button>
            <button 
              onClick={handleSkip}
              className="bg-primary text-on-primary px-8 py-4 rounded-xl font-headline-md text-headline-md flex items-center gap-2 shadow-sm hover:bg-primary-fixed-variant transition-all active:scale-95"
            >
              Passer
              <span className="material-symbols-outlined">skip_next</span>
            </button>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default HostGamePage