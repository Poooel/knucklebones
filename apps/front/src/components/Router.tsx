import * as React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Game } from './Game'
import { HomePage } from './HomePage'

export function Router() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/room/:roomKey' element={<Game />} />
      {/* Handle 404 */}
    </Routes>
  )
}
