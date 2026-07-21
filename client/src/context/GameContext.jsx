import { createContext, useContext, useState, useCallback } from 'react'

const GameContext = createContext()

// Questions simulées pour le développement
const MOCK_QUESTIONS = [
  {
    id: 1,
    difficulty: 'Facile',
    question: 'Quelle est la capitale de la France ?',
    answers: ['Londres', 'Paris', 'Berlin', 'Madrid'],
    correctIndex: 1,
    time: 15,
  },
  {
    id: 2,
    difficulty: 'Facile',
    question: 'Combien de continents y a-t-il sur Terre ?',
    answers: ['5', '6', '7', '8'],
    correctIndex: 2,
    time: 15,
  },
  {
    id: 3,
    difficulty: 'Moyen',
    question: 'Quelle est la capitale du Brésil ?',
    answers: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'],
    correctIndex: 2,
    time: 20,
  },
  {
    id: 4,
    difficulty: 'Moyen',
    question: 'En quelle année a eu lieu la Révolution française ?',
    answers: ['1789', '1799', '1769', '1804'],
    correctIndex: 0,
    time: 20,
  },
  {
    id: 5,
    difficulty: 'Difficile',
    question: 'Quel est le plus grand désert du monde ?',
    answers: ['Sahara', 'Gobi', 'Antarctique', 'Kalahari'],
    correctIndex: 2,
    time: 25,
  },
  {
    id: 6,
    difficulty: 'Difficile',
    question: 'Qui a peint le plafond de la Chapelle Sixtine ?',
    answers: ['Léonard de Vinci', 'Raphaël', 'Michel-Ange', 'Donatello'],
    correctIndex: 2,
    time: 25,
  },
  {
    id: 7,
    difficulty: 'Expert',
    question: 'Quel élément chimique a pour symbole "W" ?',
    answers: ['Wolfram', 'Tungstène', 'Les deux', 'Aucun'],
    correctIndex: 2,
    time: 30,
  },
  {
    id: 8,
    difficulty: 'Expert',
    question: 'Quelle est la constante de Planck ?',
    answers: ['6,626 × 10⁻³⁴ J·s', '3,00 × 10⁸ m/s', '9,81 m/s²', '1,602 × 10⁻¹⁹ C'],
    correctIndex: 0,
    time: 30,
  },
]

export function GameProvider({ children }) {
  // État de la partie
  const [roomCode, setRoomCode] = useState(null)
  const [isHost, setIsHost] = useState(false)
  const [gamePhase, setGamePhase] = useState('idle') // idle | lobby | playing | result | waiting | final
  
  // Configuration
  const [totalQuestions, setTotalQuestions] = useState(10)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questions, setQuestions] = useState([])
  
  // Joueurs
  const [players, setPlayers] = useState([])
  const [currentPlayer, setCurrentPlayer] = useState(null)
  
  // Réponses en cours
  const [currentAnswers, setCurrentAnswers] = useState({})
  const [playersAnswered, setPlayersAnswered] = useState(0)
  
  // Timer
  const [timeLeft, setTimeLeft] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Créer une partie (Hôte)
  const createGame = useCallback((questionCount) => {
    const code = Math.floor(1000 + Math.random() * 9000).toString()
    setRoomCode(code)
    setIsHost(true)
    setTotalQuestions(questionCount)
    setGamePhase('lobby')
    
    // Sélectionne les questions
    const selectedQuestions = MOCK_QUESTIONS.slice(0, questionCount)
    setQuestions(selectedQuestions)
    
    return code
  }, [])

  // Rejoindre une partie (Joueur)
  const joinGame = useCallback((code, playerInfo) => {
    setRoomCode(code)
    setIsHost(false)
    setCurrentPlayer(playerInfo)
    setGamePhase('waiting')
    
    // Dans la vraie app, on enverrait ça au serveur
    const newPlayer = {
      id: Date.now(),
      ...playerInfo,
      score: 0,
      correct: 0,
      total: 0,
      passed: 0,
      ready: false,
    }
    setPlayers(prev => [...prev, newPlayer])
    setCurrentPlayer(newPlayer)
    
    return newPlayer
  }, [])

  // Ajouter un joueur (côté hôte, simulé)
  const addPlayer = useCallback((player) => {
    setPlayers(prev => [...prev, player])
  }, [])

  // Marquer un joueur comme prêt
  const toggleReady = useCallback((playerId) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, ready: !p.ready } : p
    ))
  }, [])

  // Démarrer le jeu
  const startGame = useCallback(() => {
    setCurrentQuestionIndex(0)
    setGamePhase('playing')
    setCurrentAnswers({})
    setPlayersAnswered(0)
    
    const firstQuestion = questions[0]
    if (firstQuestion) {
      setTimeLeft(firstQuestion.time)
    }
  }, [questions])

  // Soumettre une réponse
  const submitAnswer = useCallback((playerId, answerIndex) => {
    const question = questions[currentQuestionIndex]
    if (!question) return
    
    const isCorrect = answerIndex === question.correctIndex
    const timeTaken = question.time - timeLeft
    
    setCurrentAnswers(prev => ({
      ...prev,
      [playerId]: {
        answerIndex,
        isCorrect,
        timeTaken,
        answered: true,
      }
    }))
    
    setPlayersAnswered(prev => prev + 1)
    
    // Met à jour le score du joueur
    if (isCorrect) {
      setPlayers(prev => prev.map(p => 
        p.id === playerId 
          ? { ...p, score: p.score + 10, correct: p.correct + 1, total: p.total + 1 }
          : p
      ))
    } else {
      setPlayers(prev => prev.map(p => 
        p.id === playerId 
          ? { ...p, total: p.total + 1 }
          : p
      ))
    }
    
    return isCorrect
  }, [questions, currentQuestionIndex, timeLeft])

  // Passer une question (joueur)
  const passQuestion = useCallback((playerId) => {
    setCurrentAnswers(prev => ({
      ...prev,
      [playerId]: {
        answerIndex: -1,
        isCorrect: false,
        timeTaken: 0,
        answered: true,
        passed: true,
      }
    }))
    
    setPlayersAnswered(prev => prev + 1)
    
    setPlayers(prev => prev.map(p => 
      p.id === playerId 
        ? { ...p, passed: p.passed + 1, total: p.total + 1 }
        : p
    ))
  }, [])

  // Question suivante
  const nextQuestion = useCallback(() => {
    const nextIndex = currentQuestionIndex + 1
    
    if (nextIndex >= questions.length) {
      // Fin du jeu
      setGamePhase('final')
      return
    }
    
    setCurrentQuestionIndex(nextIndex)
    setGamePhase('waiting')
    setCurrentAnswers({})
    setPlayersAnswered(0)
    
    // Après un délai, passe à la question
    setTimeout(() => {
      setGamePhase('playing')
      setTimeLeft(questions[nextIndex].time)
    }, 3000)
  }, [currentQuestionIndex, questions])

  // Pause/Reprendre
  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev)
  }, [])

  // Passer une question (hôte)
  const skipQuestion = useCallback(() => {
    nextQuestion()
  }, [nextQuestion])

  // Réinitialiser la partie
  const resetGame = useCallback(() => {
    setRoomCode(null)
    setIsHost(false)
    setGamePhase('idle')
    setPlayers([])
    setCurrentPlayer(null)
    setCurrentQuestionIndex(0)
    setCurrentAnswers({})
    setPlayersAnswered(0)
    setTimeLeft(0)
    setIsPaused(false)
  }, [])

  // Obtenir le classement
  const getRanking = useCallback(() => {
    return [...players].sort((a, b) => b.score - a.score)
  }, [players])

  // Obtenir la question actuelle
  const getCurrentQuestion = useCallback(() => {
    return questions[currentQuestionIndex] || null
  }, [questions, currentQuestionIndex])

  const value = {
    // État
    roomCode,
    isHost,
    gamePhase,
    totalQuestions,
    currentQuestionIndex,
    questions,
    players,
    currentPlayer,
    currentAnswers,
    playersAnswered,
    timeLeft,
    isPaused,
    
    // Actions
    createGame,
    joinGame,
    addPlayer,
    toggleReady,
    startGame,
    submitAnswer,
    passQuestion,
    nextQuestion,
    togglePause,
    skipQuestion,
    resetGame,
    setTimeLeft,
    
    // Utilitaires
    getRanking,
    getCurrentQuestion,
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame doit être utilisé à l\'intérieur d\'un GameProvider')
  }
  return context
}

export default GameContext