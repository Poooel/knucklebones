import * as React from 'react'
import { Player } from '../utils/players'

interface NameProps {
  name: string | null
  playerBoard: Player
}

export function Name({ name, playerBoard }: NameProps) {
  // Will have to be accommodated for spectators
  if (name === null) {
    return <p>{playerBoard === Player.PlayerOne ? 'You' : 'Opponent'}</p>
  }
  return (
    <p>
      {name} ({playerBoard === Player.PlayerOne ? 'you' : 'opponent'})
    </p>
  )
}
