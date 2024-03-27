import { Routes, Route } from 'react-router-dom'
import { Game } from './Game'
import { GameProvider } from './GameContext'
import { HomePage } from './HomePage'
import { HowToPlayPage } from './HowToPlay'

export function Router() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route
        path='/room/:roomKey'
        element={
          <GameProvider>
            <Game />
          </GameProvider>
        }
      />
      <Route path='/how-to-play' element={<HowToPlayPage />} />
      {/* Handle 404 */}
    </Routes>
  )
}
