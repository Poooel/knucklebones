import * as React from 'react'

interface NameProps {
  name: string | null
  isOpponent: boolean
}

export function Name({ name, isOpponent }: NameProps) {
  if (name === null) {
    return <p>{isOpponent ? 'Opponent' : 'You'}</p>
  }
  return (
    <p>
      {name} ({isOpponent ? 'opponent' : 'you'})
    </p>
  )
}
