import * as React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Game } from './Game'
import { HomePage } from './HomePage'
import { HowToPlayPage } from './HowToPlay'

export function Router() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/room/:roomKey' element={<Game />} />
      <Route path='/how-to-play' element={<HowToPlayPage />} />
      {/* Handle 404 */}
    </Routes>
  )
}
