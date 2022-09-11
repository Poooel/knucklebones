import * as React from 'react'
import { useRoom } from './useRoom'
import { isItDice } from '../utils/dice'

export function useDice(roomId: string, initialState: number) {
  const [playerOneDice, setPlayerOneDice] = React.useState<number>(initialState)
  const [playerTwoDice, setPlayerTwoDice] = React.useState<number>(initialState)

  const [channel, , { isItMe }] = useRoom(
    `${roomId}:dice`,
    { rewind: 1 },
    (message) => {
      if (isItDice(message)) {
        if (isItMe(message.clientId)) {
          setPlayerTwoDice(message.data.dice)
        } else {
          setPlayerOneDice(message.data.dice)
        }
      }
    }
  )

  const sendDice = (dice: number) => {
    channel.publish('dice', { dice })
  }

  return { playerOneDice, playerTwoDice, sendDice }
}
