import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import socket from '../services/socketService'

const GameContext = createContext()

export function GameProvider({ children }) {
  // État de la partie
  const [roomCode, setRoomCode] = useState(null)
  const [isHost, setIsHost] = useState(false)
  const [gamePhase, setGamePhase] = useState('idle')
  const [totalQuestions, setTotalQuestions] = useState(10)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  // eslint-disable-next-line no-unused-vars
  const [questions, setQuestions] = useState([])
  const [players, setPlayers] = useState([])
  const [currentPlayer, setCurrentPlayer] = useState(null)
  const [currentAnswers, setCurrentAnswers] = useState({})
  const [playersAnswered, setPlayersAnswered] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [error, setError] = useState(null)

  // Connexion Socket.io
  useEffect(() => {
    socket.connect()

    socket.on('connect', () => {
      console.log('✅ Connecté au serveur:', socket.id)
    })

    socket.on('disconnect', () => {
      console.log('❌ Déconnecté du serveur')
    })

    // HÔTE : Room créée
    socket.on('room-created', (roomState) => {
      console.log('🏠 Room créée:', roomState)
      // eslint-disable-next-line react-hooks/immutability
      updateStateFromServer(roomState)
    })

    // JOUEUR : A rejoint la room
    socket.on('joined-room', ({ player, roomState }) => {
      console.log('👤 A rejoint:', player)
      setCurrentPlayer(player)
       
      updateStateFromServer(roomState)
    })

    // Mise à jour de la room
    socket.on('room-update', (roomState) => {
       
      updateStateFromServer(roomState)
    })

    // Partie démarrée
    socket.on('game-started', (roomState) => {
       
      updateStateFromServer(roomState)
    })

    // Mise à jour des joueurs ayant répondu
    // eslint-disable-next-line no-unused-vars
    socket.on('players-answered-update', ({ playersAnswered: answered, totalPlayers }) => {
      setPlayersAnswered(answered)
    })

    // Résultat de la réponse du joueur
    // eslint-disable-next-line no-unused-vars
    socket.on('answer-result', ({ isCorrect, player }) => {
      if (player) setCurrentPlayer(player)
    })

    // Question passée
    socket.on('question-passed', () => {
      // Rien de spécial
    })

    // Tout le monde a répondu
    socket.on('all-answered', (roomState) => {
      updateStateFromServer(roomState)
    })

    // Timer update
    socket.on('timer-update', ({ timeLeft: time }) => {
      setTimeLeft(time)
    })

    // Temps écoulé
    socket.on('time-up', (roomState) => {
      updateStateFromServer(roomState)
    })

    // Pause toggled
    socket.on('pause-toggled', (roomState) => {
      setIsPaused(roomState.isPaused)
    })

    // Question suivante
    socket.on('next-question-started', (roomState) => {
      updateStateFromServer(roomState)
    })

    // Question en direct
    socket.on('question-live', (roomState) => {
      updateStateFromServer(roomState)
    })

    // Partie terminée
    socket.on('game-ended', ({ ranking }) => {
      setGamePhase('final')
      setPlayers(ranking || [])
    })

    // Question passée par l'hôte
    socket.on('question-skipped', (roomState) => {
      updateStateFromServer(roomState)
    })

    // Erreurs
    socket.on('error', ({ message }) => {
      setError(message)
      console.error('Erreur serveur:', message)
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('room-created')
      socket.off('joined-room')
      socket.off('room-update')
      socket.off('game-started')
      socket.off('players-answered-update')
      socket.off('answer-result')
      socket.off('question-passed')
      socket.off('all-answered')
      socket.off('timer-update')
      socket.off('time-up')
      socket.off('pause-toggled')
      socket.off('next-question-started')
      socket.off('question-live')
      socket.off('game-ended')
      socket.off('question-skipped')
      socket.off('error')
      socket.disconnect()
    }
  }, [])

  // Mettre à jour l'état depuis le serveur
  const updateStateFromServer = (roomState) => {
    if (!roomState) return
    
    setGamePhase(roomState.gamePhase)
    setCurrentQuestionIndex(roomState.currentQuestionIndex)
    setTotalQuestions(roomState.totalQuestions)
    setPlayers(roomState.players || [])
    setPlayersAnswered(roomState.playersAnswered || 0)
    setTimeLeft(roomState.timeLeft || 0)
    setIsPaused(roomState.isPaused || false)
    
    if (roomState.currentQuestion) {
      setCurrentQuestion(roomState.currentQuestion)
    }
    
    if (roomState.currentAnswers) {
      setCurrentAnswers(roomState.currentAnswers)
    }
    
    if (roomState.ranking) {
      setPlayers(roomState.ranking)
    }
  }

  // Créer une partie (Hôte)
  const createGame = useCallback((questionCount) => {
    const code = Math.floor(1000 + Math.random() * 9000).toString()
    setRoomCode(code)
    setIsHost(true)
    setTotalQuestions(questionCount)
    setGamePhase('lobby')
    setError(null)
    
    socket.emit('create-room', { 
      roomCode: code, 
      totalQuestions: questionCount 
    })
    
    return code
  }, [])

  // Rejoindre une partie (Joueur)
  const joinGame = useCallback((code, playerInfo) => {
    setRoomCode(code)
    setIsHost(false)
    setError(null)
    
    socket.emit('join-room', {
      roomCode: code,
      player: {
        name: playerInfo.name,
        initial: playerInfo.initial,
        color: playerInfo.color,
      }
    })
    
    return true
  }, [])

  // Marquer un joueur comme prêt
  const toggleReady = useCallback(() => {
    socket.emit('toggle-ready', { roomCode })
  }, [roomCode])

  // Démarrer le jeu (Hôte)
  const startGame = useCallback(() => {
    socket.emit('start-game', { roomCode })
  }, [roomCode])

  // Soumettre une réponse (Joueur)
  const submitAnswer = useCallback((answerIndex) => {
    socket.emit('submit-answer', { roomCode, answerIndex })
  }, [roomCode])

  // Passer une question (Joueur)
  const passQuestion = useCallback(() => {
    socket.emit('pass-question', { roomCode })
  }, [roomCode])

  // Question suivante (Hôte)
  const nextQuestion = useCallback(() => {
    socket.emit('next-question', { roomCode })
  }, [roomCode])

  // Pause/Reprendre (Hôte)
  const togglePause = useCallback(() => {
    socket.emit('toggle-pause', { roomCode })
  }, [roomCode])

  // Passer une question (Hôte)
  const skipQuestion = useCallback(() => {
    socket.emit('skip-question', { roomCode })
  }, [roomCode])

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
    setCurrentQuestion(null)
    setError(null)
  }, [])

  // Obtenir le classement
  const getRanking = useCallback(() => {
    return [...players].sort((a, b) => b.score - a.score)
  }, [players])

  // Obtenir la question actuelle
  const getCurrentQuestion = useCallback(() => {
    return currentQuestion
  }, [currentQuestion])

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
    error,
    
    // Actions
    createGame,
    joinGame,
    toggleReady,
    startGame,
    submitAnswer,
    passQuestion,
    nextQuestion,
    togglePause,
    skipQuestion,
    resetGame,
    
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