const questions = require('./questions')

class GameManager {
  constructor() {
    this.rooms = new Map()
  }

  createRoom(roomCode, totalQuestions) {
    const selectedQuestions = questions.slice(0, totalQuestions)
    const room = {
      code: roomCode,
      hostSocketId: null,
      players: [],
      questions: selectedQuestions,
      totalQuestions,
      currentQuestionIndex: 0,
      gamePhase: 'lobby', // lobby | playing | result | waiting | final
      currentAnswers: {},
      timeLeft: 0,
      isPaused: false,
      createdAt: Date.now(),
    }
    this.rooms.set(roomCode, room)
    return room
  }

  getRoom(roomCode) {
    return this.rooms.get(roomCode)
  }

  deleteRoom(roomCode) {
    this.rooms.delete(roomCode)
  }

  addPlayer(roomCode, player) {
    const room = this.getRoom(roomCode)
    if (!room) return null
    if (room.players.length >= 20) return null
    
    const existingPlayer = room.players.find(p => p.name === player.name)
    if (existingPlayer) return null
    
    const newPlayer = {
      id: player.socketId,
      socketId: player.socketId,
      name: player.name,
      initial: player.initial,
      color: player.color,
      score: 0,
      correct: 0,
      total: 0,
      passed: 0,
      ready: false,
    }
    room.players.push(newPlayer)
    return newPlayer
  }

  removePlayer(roomCode, socketId) {
    const room = this.getRoom(roomCode)
    if (!room) return
    room.players = room.players.filter(p => p.socketId !== socketId)
  }

  toggleReady(roomCode, socketId) {
    const room = this.getRoom(roomCode)
    if (!room) return
    const player = room.players.find(p => p.socketId === socketId)
    if (player) player.ready = !player.ready
  }

  startGame(roomCode) {
    const room = this.getRoom(roomCode)
    if (!room) return null
    if (room.players.length < 2) return null
    
    room.gamePhase = 'playing'
    room.currentQuestionIndex = 0
    room.currentAnswers = {}
    room.timeLeft = room.questions[0].time
    room.isPaused = false
    
    return room
  }

  getCurrentQuestion(roomCode) {
    const room = this.getRoom(roomCode)
    if (!room) return null
    return room.questions[room.currentQuestionIndex] || null
  }

  submitAnswer(roomCode, socketId, answerIndex) {
    const room = this.getRoom(roomCode)
    if (!room) return null
    
    const question = this.getCurrentQuestion(roomCode)
    if (!question) return null
    
    if (room.currentAnswers[socketId]) return null // déjà répondu
    
    const isCorrect = answerIndex === question.correctIndex
    const timeTaken = question.time - room.timeLeft
    
    room.currentAnswers[socketId] = {
      answerIndex,
      isCorrect,
      timeTaken,
      answered: true,
    }
    
    if (isCorrect) {
      const player = room.players.find(p => p.socketId === socketId)
      if (player) {
        player.score += 10
        player.correct += 1
        player.total += 1
      }
    } else {
      const player = room.players.find(p => p.socketId === socketId)
      if (player) {
        player.total += 1
      }
    }
    
    return { isCorrect, playersAnswered: Object.keys(room.currentAnswers).length }
  }

  passQuestion(roomCode, socketId) {
    const room = this.getRoom(roomCode)
    if (!room) return null
    
    if (room.currentAnswers[socketId]) return null
    
    room.currentAnswers[socketId] = {
      answerIndex: -1,
      isCorrect: false,
      timeTaken: 0,
      answered: true,
      passed: true,
    }
    
    const player = room.players.find(p => p.socketId === socketId)
    if (player) {
      player.passed += 1
      player.total += 1
    }
    
    return { playersAnswered: Object.keys(room.currentAnswers).length }
  }

  nextQuestion(roomCode) {
    const room = this.getRoom(roomCode)
    if (!room) return null
    
    const nextIndex = room.currentQuestionIndex + 1
    
    if (nextIndex >= room.questions.length) {
      room.gamePhase = 'final'
      return { gamePhase: 'final', ranking: this.getRanking(roomCode) }
    }
    
    room.currentQuestionIndex = nextIndex
    room.currentAnswers = {}
    room.timeLeft = room.questions[nextIndex].time
    room.gamePhase = 'waiting'
    
    return room
  }

  togglePause(roomCode) {
    const room = this.getRoom(roomCode)
    if (!room) return
    room.isPaused = !room.isPaused
  }

  getRanking(roomCode) {
    const room = this.getRoom(roomCode)
    if (!room) return []
    return [...room.players].sort((a, b) => b.score - a.score)
  }

  getRoomState(roomCode) {
    const room = this.getRoom(roomCode)
    if (!room) return null
    
    const question = this.getCurrentQuestion(roomCode)
    
    return {
      roomCode: room.code,
      gamePhase: room.gamePhase,
      currentQuestionIndex: room.currentQuestionIndex,
      totalQuestions: room.totalQuestions,
      players: room.players,
      playersAnswered: Object.keys(room.currentAnswers).length,
      totalPlayers: room.players.length,
      timeLeft: room.timeLeft,
      isPaused: room.isPaused,
      currentQuestion: question ? {
        id: question.id,
        difficulty: question.difficulty,
        question: question.question,
        answers: question.answers,
        time: question.time,
      } : null,
      ranking: this.getRanking(roomCode),
      currentAnswers: room.currentAnswers,
    }
  }
}

// Nettoyage des rooms inactives toutes les 30 minutes
const manager = new GameManager()
setInterval(() => {
  const now = Date.now()
  for (const [code, room] of manager.rooms) {
    if (now - room.createdAt > 2 * 60 * 60 * 1000) { // 2 heures
      manager.deleteRoom(code)
    }
  }
}, 30 * 60 * 1000)

module.exports = manager