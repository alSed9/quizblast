import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import socket from '../services/socketService'

const GameContext = createContext()

export function GameProvider({ children }) {
  const [roomCode, setRoomCode] = useState(null)
  const [isHost, setIsHost] = useState(false)
  const [gamePhase, setGamePhase] = useState('idle')
  const [totalQuestions, setTotalQuestions] = useState(10)
  const [players, setPlayers] = useState([])
  const [currentPlayer, setCurrentPlayer] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [ranking, setRanking] = useState([])
  const [error, setError] = useState(null)
  const [hasFinished, setHasFinished] = useState(false)
  const [lastResult, setLastResult] = useState(null)
  const [waiting, setWaiting] = useState(false)
  const [allFinished, setAllFinished] = useState(false)

  useEffect(() => {
    socket.connect()

    socket.on('connect', () => {
      console.log('✅ Connecté au serveur:', socket.id)
    })

    socket.on('disconnect', () => {
      console.log('❌ Déconnecté du serveur')
    })

    // HÔTE : Room créée
    socket.on('room-created', (state) => {
      console.log('🏠 Room créée')
      setGamePhase('lobby')
      setPlayers(state.players || [])
    })

    // JOUEUR : A rejoint la room
    socket.on('joined-room', ({ player, roomState }) => {
      console.log('👤 A rejoint:', player.name)
      setCurrentPlayer(player)
      setPlayers(roomState.players || [])
      setGamePhase('waiting')
    })

    // Mise à jour de la room (pour l'hôte)
    socket.on('room-update', (state) => {
      setPlayers(state.players || [])
      // Vérifier si tous les joueurs ont fini
      if (state.players && state.players.length > 0) {
        const allDone = state.players.every(p => p.finished)
        if (allDone) {
          setAllFinished(true)
        }
      }
    })

    // Partie démarrée
    socket.on('game-started', (state) => {
      console.log('🚀 Partie démarrée')
      setGamePhase('playing')
      setPlayers(state.players || [])
      setHasFinished(false)
      setAllFinished(false)
      setWaiting(false)
    })

    // Reçoit une question personnelle
    // eslint-disable-next-line no-unused-vars
    socket.on('your-question', ({ question, index, total, currentLevel, isNewLevel }) => {
      console.log('📝 Question reçue:', index + 1, currentLevel)
      setCurrentQuestion(question)
      setCurrentQuestionIndex(index)
      setTotalQuestions(total)
      setHasFinished(false)
      setWaiting(false)
      setLastResult(null)
    })

    // Résultat de la réponse du joueur
    socket.on('answer-result', ({ isCorrect, passed, timeout, correctAnswer, correctAnswerText, player }) => {
      console.log('📊 Résultat:', isCorrect ? 'Correct' : passed ? 'Passé' : timeout ? 'Timeout' : 'Incorrect')
      if (player) setCurrentPlayer(player)
      setLastResult({ 
        isCorrect, 
        passed, 
        timeout, 
        correctAnswer, 
        correctAnswerText 
      })
    })

    // Joueur a fini toutes ses questions - attend les autres
    socket.on('you-finished', ({ player, ranking: rank, waiting: isWaiting }) => {
      console.log('🏁 Tu as fini tes questions')
      if (player) setCurrentPlayer(player)
      setRanking(rank || [])
      setHasFinished(true)
      setWaiting(isWaiting || false)
      setGamePhase('waiting-final')
    })

    // Tous les joueurs ont fini
    socket.on('game-ended', ({ ranking: rank }) => {
      console.log('🎉 Partie terminée pour tout le monde')
      setRanking(rank || [])
      setGamePhase('final')
      setAllFinished(true)
      setWaiting(false)
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
      socket.off('your-question')
      socket.off('answer-result')
      socket.off('you-finished')
      socket.off('game-ended')
      socket.off('error')
      socket.disconnect()
    }
  }, [])

  // Créer une partie (Hôte)
  const createGame = useCallback((questionCount) => {
    const code = Math.floor(1000 + Math.random() * 9000).toString()
    setRoomCode(code)
    setIsHost(true)
    setTotalQuestions(questionCount)
    setGamePhase('lobby')
    setError(null)
    setPlayers([])
    
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

  // Marquer comme prêt
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

  // Signaler un timeout (Joueur)
  const timeoutQuestion = useCallback(() => {
    socket.emit('timeout-question', { roomCode })
  }, [roomCode])

  // Réinitialiser la partie
  const resetGame = useCallback(() => {
    setRoomCode(null)
    setIsHost(false)
    setGamePhase('idle')
    setPlayers([])
    setCurrentPlayer(null)
    setCurrentQuestion(null)
    setCurrentQuestionIndex(0)
    setTotalQuestions(10)
    setRanking([])
    setError(null)
    setHasFinished(false)
    setLastResult(null)
    setWaiting(false)
    setAllFinished(false)
  }, [])

  const value = {
    // État
    roomCode,
    isHost,
    gamePhase,
    totalQuestions,
    players,
    currentPlayer,
    currentQuestion,
    currentQuestionIndex,
    ranking,
    error,
    hasFinished,
    lastResult,
    waiting,
    allFinished,
    
    // Actions
    createGame,
    joinGame,
    toggleReady,
    startGame,
    submitAnswer,
    passQuestion,
    timeoutQuestion,
    resetGame,
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