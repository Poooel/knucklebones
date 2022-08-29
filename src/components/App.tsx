import * as React from 'react'
import { Board } from './Board'

export function App() {
  return (
    <div className='flex h-screen flex-col items-center justify-between p-6'>
      <Board readonly />
      <Board />
    </div>
  )
}
