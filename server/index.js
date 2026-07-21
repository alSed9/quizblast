const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const gameManager = require('./gameManager')

const app = express()
const server = http.createServer(app)

app.use(cors({ origin: '*', methods: ['GET', 'POST'] }))

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  pingTimeout: 60000,
  pingInterval: 25000,
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok', rooms: gameManager.rooms.size })
})

io.on('connection', (socket) => {
  console.log(`✅ Connecté: ${socket.id}`)

  socket.on('create-room', ({ roomCode, totalQuestions }) => {
    const room = gameManager.createRoom(roomCode, totalQuestions)
    room.hostSocketId = socket.id
    socket.join(roomCode)
    socket.emit('room-created', gameManager.getRoomState(roomCode))
  })

  socket.on('join-room', ({ roomCode, player }) => {
    const room = gameManager.getRoom(roomCode)
    if (!room) { socket.emit('error', { message: 'Partie introuvable' }); return }
    if (room.gamePhase !== 'lobby') { socket.emit('error', { message: 'Partie déjà commencée' }); return }
    
    const newPlayer = gameManager.addPlayer(roomCode, { ...player, socketId: socket.id })
    if (!newPlayer) { socket.emit('error', { message: 'Pseudo déjà pris ou complet' }); return }
    
    socket.join(roomCode)
    socket.emit('joined-room', { player: newPlayer, roomState: gameManager.getRoomState(roomCode) })
    io.to(roomCode).emit('room-update', gameManager.getRoomState(roomCode))
  })

  socket.on('toggle-ready', ({ roomCode }) => {
    gameManager.toggleReady(roomCode, socket.id)
    io.to(roomCode).emit('room-update', gameManager.getRoomState(roomCode))
  })

  socket.on('start-game', ({ roomCode }) => {
    const room = gameManager.startGame(roomCode)
    if (!room) { socket.emit('error', { message: 'Minimum 2 joueurs' }); return }
    
    io.to(roomCode).emit('game-started', gameManager.getRoomState(roomCode))
    
    // Envoyer première question à chaque joueur
    room.players.forEach(player => {
      const qData = gameManager.getQuestionForPlayer(roomCode, player.socketId)
      if (qData) {
        io.to(player.socketId).emit('your-question', qData)
      }
    })
  })

  socket.on('submit-answer', ({ roomCode, answerIndex }) => {
    const result = gameManager.submitAnswer(roomCode, socket.id, answerIndex)
    if (!result) return
    
    // Envoyer le résultat avec la bonne réponse
    socket.emit('answer-result', {
      isCorrect: result.isCorrect,
      correctAnswer: result.correctAnswer,
      correctAnswerText: result.correctAnswerText,
      player: result.player,
    })
    
    if (result.isFinished) {
      // Le joueur a fini, il attend les autres
      socket.emit('you-finished', {
        player: result.player,
        ranking: gameManager.getRanking(roomCode),
        waiting: true,
      })
    } else {
      // Envoyer la question suivante après un délai
      setTimeout(() => {
        const qData = gameManager.getQuestionForPlayer(roomCode, socket.id)
        if (qData) {
          socket.emit('your-question', qData)
        }
      }, 2500)
    }
    
    if (result.allFinished) {
      io.to(roomCode).emit('game-ended', {
        ranking: gameManager.getRanking(roomCode),
      })
    }
    
    io.to(roomCode).emit('room-update', gameManager.getRoomState(roomCode))
  })

  socket.on('pass-question', ({ roomCode }) => {
    const result = gameManager.passQuestion(roomCode, socket.id)
    if (!result) return
    
    socket.emit('answer-result', {
      isCorrect: false,
      passed: true,
      correctAnswer: result.correctAnswer,
      correctAnswerText: result.correctAnswerText,
      player: result.player,
    })
    
    if (result.isFinished) {
      socket.emit('you-finished', {
        player: result.player,
        ranking: gameManager.getRanking(roomCode),
        waiting: true,
      })
    } else {
      setTimeout(() => {
        const qData = gameManager.getQuestionForPlayer(roomCode, socket.id)
        if (qData) {
          socket.emit('your-question', qData)
        }
      }, 2000)
    }
    
    if (result.allFinished) {
      io.to(roomCode).emit('game-ended', {
        ranking: gameManager.getRanking(roomCode),
      })
    }
    
    io.to(roomCode).emit('room-update', gameManager.getRoomState(roomCode))
  })

  // Timeout : le joueur n'a pas répondu à temps
  socket.on('timeout-question', ({ roomCode }) => {
    // Même comportement que passer
    const result = gameManager.passQuestion(roomCode, socket.id)
    if (!result) return
    
    socket.emit('answer-result', {
      isCorrect: false,
      timeout: true,
      correctAnswer: result.correctAnswer,
      correctAnswerText: result.correctAnswerText,
      player: result.player,
    })
    
    if (result.isFinished) {
      socket.emit('you-finished', {
        player: result.player,
        ranking: gameManager.getRanking(roomCode),
        waiting: true,
      })
    } else {
      setTimeout(() => {
        const qData = gameManager.getQuestionForPlayer(roomCode, socket.id)
        if (qData) {
          socket.emit('your-question', qData)
        }
      }, 2500)
    }
    
    if (result.allFinished) {
      io.to(roomCode).emit('game-ended', {
        ranking: gameManager.getRanking(roomCode),
      })
    }
    
    io.to(roomCode).emit('room-update', gameManager.getRoomState(roomCode))
  })

  socket.on('disconnect', () => {
    for (const [code, room] of gameManager.rooms) {
      const player = room.players.find(p => p.socketId === socket.id)
      if (player) {
        gameManager.removePlayer(code, socket.id)
        io.to(code).emit('room-update', gameManager.getRoomState(code))
        if (room.players.length === 0) gameManager.deleteRoom(code)
        break
      }
    }
  })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => console.log(`🚀 Serveur sur port ${PORT}`))