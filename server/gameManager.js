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
      gamePhase: 'lobby',
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
      currentQuestionIndex: 0,
      finished: false,
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
    room.players.forEach(p => {
      p.currentQuestionIndex = 0
      p.score = 0
      p.correct = 0
      p.total = 0
      p.passed = 0
      p.finished = false
    })
    
    return room
  }

  getQuestionForPlayer(roomCode, socketId) {
    const room = this.getRoom(roomCode)
    if (!room) return null
    
    const player = room.players.find(p => p.socketId === socketId)
    if (!player || player.finished) return null
    
    const index = player.currentQuestionIndex
    if (index >= room.questions.length) {
      player.finished = true
      return null
    }
    
    // Déterminer le niveau actuel
    let currentLevel = 'Facile'
    if (index < 5) currentLevel = 'Facile'
    else if (index < 10) currentLevel = 'Moyen'
    else if (index < 15) currentLevel = 'Difficile'
    else currentLevel = 'Expert'
    
    // Déterminer si on commence un nouveau niveau
    const isNewLevel = index === 0 || index === 5 || index === 10 || index === 15 || index === 20
    
    return {
      question: room.questions[index],
      index: index,
      total: room.totalQuestions,
      currentLevel,
      isNewLevel,
    }
  }

  submitAnswer(roomCode, socketId, answerIndex) {
    const room = this.getRoom(roomCode)
    if (!room) return null
    
    const player = room.players.find(p => p.socketId === socketId)
    if (!player || player.finished) return null
    
    const question = room.questions[player.currentQuestionIndex]
    if (!question) return null
    
    const isCorrect = answerIndex === question.correctIndex
    
    if (isCorrect) {
      player.score += 10
      player.correct += 1
    }
    player.total += 1
    player.currentQuestionIndex += 1
    
    if (player.currentQuestionIndex >= room.totalQuestions) {
      player.finished = true
    }
    
    // Vérifier si tous ont fini
    const allFinished = room.players.every(p => p.finished)
    if (allFinished) {
      room.gamePhase = 'final'
    }
    
    return {
      isCorrect,
      player,
      correctAnswer: question.correctIndex,
      correctAnswerText: question.answers[question.correctIndex],
      isFinished: player.finished,
      allFinished,
    }
  }

  passQuestion(roomCode, socketId) {
    const room = this.getRoom(roomCode)
    if (!room) return null
    
    const player = room.players.find(p => p.socketId === socketId)
    if (!player || player.finished) return null
    
    const question = room.questions[player.currentQuestionIndex]
    
    player.passed += 1
    player.total += 1
    player.currentQuestionIndex += 1
    
    if (player.currentQuestionIndex >= room.totalQuestions) {
      player.finished = true
    }
    
    const allFinished = room.players.every(p => p.finished)
    if (allFinished) {
      room.gamePhase = 'final'
    }
    
    return {
      player,
      correctAnswer: question ? question.correctIndex : 0,
      correctAnswerText: question ? question.answers[question.correctIndex] : '',
      isFinished: player.finished,
      allFinished,
    }
  }

  getRanking(roomCode) {
    const room = this.getRoom(roomCode)
    if (!room) return []
    return [...room.players].sort((a, b) => b.score - a.score)
  }

  getRoomState(roomCode) {
    const room = this.getRoom(roomCode)
    if (!room) return null
    
    return {
      roomCode: room.code,
      gamePhase: room.gamePhase,
      totalQuestions: room.totalQuestions,
      players: room.players.map(p => ({
        id: p.id,
        socketId: p.socketId,
        name: p.name,
        initial: p.initial,
        color: p.color,
        score: p.score,
        correct: p.correct,
        total: p.total,
        passed: p.passed,
        ready: p.ready,
        finished: p.finished,
        currentQuestionIndex: p.currentQuestionIndex,
      })),
      ranking: this.getRanking(roomCode),
    }
  }
}

const manager = new GameManager()
setInterval(() => {
  const now = Date.now()
  for (const [code, room] of manager.rooms) {
    if (now - room.createdAt > 3 * 60 * 60 * 1000) {
      manager.deleteRoom(code)
    }
  }
}, 30 * 60 * 1000)

module.exports = manager