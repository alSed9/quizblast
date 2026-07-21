const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const gameManager = require('./gameManager')

const app = express()
const server = http.createServer(app)

// Configuration CORS pour Render
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}))

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  pingTimeout: 60000,
  pingInterval: 25000,
})

// Route de santé pour Render
app.get('/health', (req, res) => {
  res.json({ status: 'ok', rooms: gameManager.rooms.size })
})

// Liste des rooms actives
app.get('/api/rooms', (req, res) => {
  const rooms = []
  for (const [code, room] of gameManager.rooms) {
    rooms.push({
      code,
      playersCount: room.players.length,
      gamePhase: room.gamePhase,
    })
  }
  res.json(rooms)
})

// Socket.io
io.on('connection', (socket) => {
  console.log(`✅ Joueur connecté: ${socket.id}`)

  // HÔTE : Créer une room
  socket.on('create-room', ({ roomCode, totalQuestions }) => {
    const room = gameManager.createRoom(roomCode, totalQuestions)
    room.hostSocketId = socket.id
    socket.join(roomCode)
    console.log(`🏠 Room créée: ${roomCode} (${totalQuestions} questions)`)
    socket.emit('room-created', gameManager.getRoomState(roomCode))
  })

  // JOUEUR : Rejoindre une room
  socket.on('join-room', ({ roomCode, player }) => {
    const room = gameManager.getRoom(roomCode)
    
    if (!room) {
      socket.emit('error', { message: 'Partie introuvable' })
      return
    }
    
    if (room.gamePhase !== 'lobby') {
      socket.emit('error', { message: 'La partie a déjà commencé' })
      return
    }
    
    const newPlayer = gameManager.addPlayer(roomCode, { ...player, socketId: socket.id })
    
    if (!newPlayer) {
      socket.emit('error', { message: 'Impossible de rejoindre (pseudo déjà pris ou complet)' })
      return
    }
    
    socket.join(roomCode)
    console.log(`👤 ${player.name} a rejoint la room ${roomCode}`)
    
    // Informer le joueur
    socket.emit('joined-room', { 
      player: newPlayer, 
      roomState: gameManager.getRoomState(roomCode) 
    })
    
    // Informer l'hôte
    io.to(roomCode).emit('room-update', gameManager.getRoomState(roomCode))
  })

  // JOUEUR : Toggle prêt
  socket.on('toggle-ready', ({ roomCode }) => {
    gameManager.toggleReady(roomCode, socket.id)
    io.to(roomCode).emit('room-update', gameManager.getRoomState(roomCode))
  })

  // HÔTE : Démarrer le jeu
  socket.on('start-game', ({ roomCode }) => {
    const room = gameManager.startGame(roomCode)
    if (!room) {
      socket.emit('error', { message: 'Impossible de démarrer (min. 2 joueurs)' })
      return
    }
    console.log(`🚀 Partie démarrée: ${roomCode}`)
    
    // Envoie la room state avec la question (sans la réponse correcte pour les joueurs)
    const fullState = gameManager.getRoomState(roomCode)
    
    // Pour l'hôte : état complet
    io.to(roomCode).emit('game-started', fullState)
    
    // Démarre le timer
    startQuestionTimer(roomCode)
  })

  // JOUEUR : Répondre
  socket.on('submit-answer', ({ roomCode, answerIndex }) => {
    const result = gameManager.submitAnswer(roomCode, socket.id, answerIndex)
    
    if (result) {
      // Informe le joueur de son résultat
      socket.emit('answer-result', { 
        isCorrect: result.isCorrect,
        player: gameManager.getRoom(roomCode)?.players.find(p => p.socketId === socket.id)
      })
      
      // Met à jour tout le monde sur le nombre de réponses
      const roomState = gameManager.getRoomState(roomCode)
      io.to(roomCode).emit('players-answered-update', {
        playersAnswered: roomState.playersAnswered,
        totalPlayers: roomState.totalPlayers,
      })
      
      // Si tout le monde a répondu, on passe au résultat
      if (result.playersAnswered >= roomState.totalPlayers) {
        clearRoomTimer(roomCode)
        io.to(roomCode).emit('all-answered', gameManager.getRoomState(roomCode))
      }
    }
  })

  // JOUEUR : Passer
  socket.on('pass-question', ({ roomCode }) => {
    const result = gameManager.passQuestion(roomCode, socket.id)
    
    if (result) {
      socket.emit('question-passed')
      
      const roomState = gameManager.getRoomState(roomCode)
      io.to(roomCode).emit('players-answered-update', {
        playersAnswered: roomState.playersAnswered,
        totalPlayers: roomState.totalPlayers,
      })
      
      if (result.playersAnswered >= roomState.totalPlayers) {
        clearRoomTimer(roomCode)
        io.to(roomCode).emit('all-answered', gameManager.getRoomState(roomCode))
      }
    }
  })

  // HÔTE : Pause/Reprendre
  socket.on('toggle-pause', ({ roomCode }) => {
    gameManager.togglePause(roomCode)
    io.to(roomCode).emit('pause-toggled', gameManager.getRoomState(roomCode))
  })

  // HÔTE : Passer la question
  socket.on('skip-question', ({ roomCode }) => {
    clearRoomTimer(roomCode)
    const result = gameManager.nextQuestion(roomCode)
    if (result.gamePhase === 'final') {
      io.to(roomCode).emit('game-ended', result)
    } else {
      io.to(roomCode).emit('question-skipped', gameManager.getRoomState(roomCode))
    }
  })

  // HÔTE : Question suivante (après résultat)
  socket.on('next-question', ({ roomCode }) => {
    clearRoomTimer(roomCode)
    const result = gameManager.nextQuestion(roomCode)
    
    if (result.gamePhase === 'final') {
      io.to(roomCode).emit('game-ended', result)
    } else {
      const state = gameManager.getRoomState(roomCode)
      io.to(roomCode).emit('next-question-started', state)
      
      // Relance le timer
      setTimeout(() => {
        const room = gameManager.getRoom(roomCode)
        if (room && room.gamePhase === 'waiting') {
          room.gamePhase = 'playing'
          io.to(roomCode).emit('question-live', gameManager.getRoomState(roomCode))
          startQuestionTimer(roomCode)
        }
      }, 3000)
    }
  })

  // Déconnexion
  socket.on('disconnect', () => {
    console.log(`❌ Joueur déconnecté: ${socket.id}`)
    
    // Cherche dans quelle room est ce joueur
    for (const [code, room] of gameManager.rooms) {
      const player = room.players.find(p => p.socketId === socket.id)
      if (player) {
        gameManager.removePlayer(code, socket.id)
        io.to(code).emit('room-update', gameManager.getRoomState(code))
        
        // Si plus de joueurs, supprime la room
        if (room.players.length === 0) {
          gameManager.deleteRoom(code)
          console.log(`🗑️ Room supprimée: ${code}`)
        }
        break
      }
    }
  })
})

// Gestion des timers par room
const roomTimers = new Map()

function startQuestionTimer(roomCode) {
  clearRoomTimer(roomCode)
  
  const room = gameManager.getRoom(roomCode)
  if (!room || room.isPaused) return
  
  const question = gameManager.getCurrentQuestion(roomCode)
  if (!question) return
  
  room.timeLeft = question.time
  
  const timer = setInterval(() => {
    const currentRoom = gameManager.getRoom(roomCode)
    if (!currentRoom || currentRoom.isPaused) return
    
    currentRoom.timeLeft--
    
    // Envoie le temps restant toutes les secondes
    io.to(roomCode).emit('timer-update', { timeLeft: currentRoom.timeLeft })
    
    if (currentRoom.timeLeft <= 0) {
      clearRoomTimer(roomCode)
      io.to(roomCode).emit('time-up', gameManager.getRoomState(roomCode))
    }
  }, 1000)
  
  roomTimers.set(roomCode, timer)
}

function clearRoomTimer(roomCode) {
  const timer = roomTimers.get(roomCode)
  if (timer) {
    clearInterval(timer)
    roomTimers.delete(roomCode)
  }
}

// Démarrage du serveur
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`🚀 Serveur QuizBlast démarré sur le port ${PORT}`)
})