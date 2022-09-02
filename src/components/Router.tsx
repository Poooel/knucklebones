import * as React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { App } from './App'
import { v4 as uuidv4 } from 'uuid'

export function Router() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to={`/room/${uuidv4()}`} />} />
      <Route path='/room/:roomKey' element={<App />} />
    </Routes>
  )
}
