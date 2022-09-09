import * as React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { App } from './App'
import { v4 as uuidv4 } from 'uuid'

function Room() {
  return <Navigate to={`/room/${uuidv4()}`} />
}

export function Router() {
  return (
    <Routes>
      <Route path='/' element={<Room />} />
      <Route path='/room/:roomKey' element={<App />} />
    </Routes>
  )
}
