import { io } from 'socket.io-client'

// Remplace par TON URL Render
const SOCKET_URL = 'https://quizblast-8kcq.onrender.com'

const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
})

export default socket