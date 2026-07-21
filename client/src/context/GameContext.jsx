import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import socket from '../services/socketService'

const GameContext = createContext()

export function GameProvider({ children }) {
  const [roomCode, setRoomCode] = useState(null)
  const [isHost, setIsHost] = useState(false)
  const [gamePhase, setGamePhase] = useState('idle')
  const [totalQuestions, setTotalQuestions] = useState(10)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [players, setPlayers] = useState([])
  const [currentPlayer, setCurrentPlayer] = useState(null)
  const [currentAnswers, setCurrentAnswers] = useState({})
  const [playersAnswered, setPlayersAnswered] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [error, setError] = useState(null)

  // Références pour éviter les problèmes de closure
  const roomCodeRef = useRef(roomCode)
  const gamePhaseRef = useRef(gamePhase)
  
  useEffect(() => {
    roomCodeRef.current = roomCode
    gamePhaseRef.current = gamePhase
  }, [roomCode, gamePhase])

  // Déclaration de updateStateFromServer AVANT le useEffect
  const updateStateFromServer = useCallback((roomState) => {
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
  }, [])

  useEffect(() => {
    socket.connect()

    socket.on('connect', () => {
      console.log('✅ Connecté au serveur:', socket.id)
    })

    socket.on('disconnect', () => {
      console.log('❌ Déconnecté du serveur')
    })

    socket.on('room-created', (roomState) => {
      console.log('🏠 Room créée:', roomState)
      updateStateFromServer(roomState)
    })

    socket.on('joined-room', ({ player, roomState }) => {
      console.log('👤 A rejoint:', player)
      setCurrentPlayer(player)
      updateStateFromServer(roomState)
    })

    socket.on('room-update', (roomState) => {
      updateStateFromServer(roomState)
    })

    socket.on('game-started', (roomState) => {
      updateStateFromServer(roomState)
    })

    socket.on('players-answered-update', ({ playersAnswered: answered }) => {
      setPlayersAnswered(answered)
    })

    socket.on('answer-result', ({ player }) => {
      if (player) setCurrentPlayer(player)
    })

    socket.on('question-passed', () => {})

    socket.on('all-answered', (roomState) => {
      updateStateFromServer(roomState)
    })

    socket.on('timer-update', ({ timeLeft: time }) => {
      setTimeLeft(time)
    })

    socket.on('time-up', (roomState) => {
      updateStateFromServer(roomState)
    })

    socket.on('pause-toggled', (roomState) => {
      setIsPaused(roomState.isPaused)
    })

    socket.on('next-question-started', (roomState) => {
      updateStateFromServer(roomState)
    })

    socket.on('question-live', (roomState) => {
      updateStateFromServer(roomState)
    })

    socket.on('game-ended', ({ ranking }) => {
      setGamePhase('final')
      setPlayers(ranking || [])
    })

    socket.on('question-skipped', (roomState) => {
      updateStateFromServer(roomState)
    })

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
  }, [updateStateFromServer])

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

  const joinGame = useCallback((code, playerInfo) => {
    setRoomCode(code)
    setIsHost(false)
    setError(null)
    
    console.log('📤 Émission join-room:', code, playerInfo)
    
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

  const toggleReady = useCallback(() => {
    socket.emit('toggle-ready', { roomCode: roomCodeRef.current })
  }, [])

  const startGame = useCallback(() => {
    socket.emit('start-game', { roomCode: roomCodeRef.current })
  }, [])

  const submitAnswer = useCallback((answerIndex) => {
    socket.emit('submit-answer', { roomCode: roomCodeRef.current, answerIndex })
  }, [])

  const passQuestion = useCallback(() => {
    socket.emit('pass-question', { roomCode: roomCodeRef.current })
  }, [])

  const nextQuestion = useCallback(() => {
    socket.emit('next-question', { roomCode: roomCodeRef.current })
  }, [])

  const togglePause = useCallback(() => {
    socket.emit('toggle-pause', { roomCode: roomCodeRef.current })
  }, [])

  const skipQuestion = useCallback(() => {
    socket.emit('skip-question', { roomCode: roomCodeRef.current })
  }, [])

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

  const getRanking = useCallback(() => {
    return [...players].sort((a, b) => b.score - a.score)
  }, [players])

  const getCurrentQuestion = useCallback(() => {
    return currentQuestion
  }, [currentQuestion])

  const value = {
    roomCode,
    isHost,
    gamePhase,
    totalQuestions,
    currentQuestionIndex,
    players,
    currentPlayer,
    currentAnswers,
    playersAnswered,
    timeLeft,
    isPaused,
    error,
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