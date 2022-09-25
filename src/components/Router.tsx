import * as React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { App } from './App'

function Room() {
  return <Navigate to={`/room/${uuidv4()}`} />
}

export function Router() {
  return (
    <Routes>
      <Route path='/' element={<Room />} />
      <Route path='/room' element={<Room />} />
      <Route path='/room/:roomKey' element={<App />} />
    </Routes>
  )
}
