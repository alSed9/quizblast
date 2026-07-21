import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CreateGamePage from './pages/CreateGamePage'
import JoinGamePage from './pages/JoinGamePage'
import NicknamePage from './pages/NicknamePage'
import PlayerWaitingPage from './pages/PlayerWaitingPage'
import PlayerGamePage from './pages/PlayerGamePage'
import PlayerWaitingFinalPage from './pages/PlayerWaitingFinalPage'
import PlayerFinalPage from './pages/PlayerFinalPage'
import HostLobbyPage from './pages/HostLobbyPage'
import HostGamePage from './pages/HostGamePage'
import HostFinalPage from './pages/HostFinalPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateGamePage />} />
        <Route path="/join" element={<JoinGamePage />} />
        <Route path="/join/:roomCode/nickname" element={<NicknamePage />} />
        <Route path="/join/:roomCode/waiting" element={<PlayerWaitingPage />} />
        <Route path="/play/:roomCode" element={<PlayerGamePage />} />
        <Route path="/play/:roomCode/waiting-final" element={<PlayerWaitingFinalPage />} />
        <Route path="/play/:roomCode/final" element={<PlayerFinalPage />} />
        <Route path="/host/:roomCode" element={<HostLobbyPage />} />
        <Route path="/host/:roomCode/game" element={<HostGamePage />} />
        <Route path="/host/:roomCode/final" element={<HostFinalPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App