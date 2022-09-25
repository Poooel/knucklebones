import * as React from 'react'

interface NameProps {
  name?: string
  isPlayerOne: boolean
}

export function Name({ name, isPlayerOne }: NameProps) {
  // Will have to be accommodated for spectators
  if (name === undefined) {
    return <p>{isPlayerOne ? 'You' : 'Opponent'}</p>
  }
  return (
    <p>
      {name} ({isPlayerOne ? 'you' : 'opponent'})
    </p>
  )
}
