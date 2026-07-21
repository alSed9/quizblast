import { io } from 'socket.io-client'

// En production, même URL que le backend
// En dev, localhost:3001
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'

const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
})

export default socket