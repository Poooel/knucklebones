import * as React from 'react'
import { useRoom } from './useRoom'
import { isItDice } from '../utils/dice'

export function useDice(initialState: number) {
  const [playerOneDice, setPlayerOneDice] = React.useState<number>(initialState)
  const [playerTwoDice, setPlayerTwoDice] = React.useState<number>(initialState)

  const [channel, , { isItPlayerOne }] = useRoom({
    rewind: 1,
    subRoomId: 'dice',
    onMessageReceived(message) {
      if (isItDice(message)) {
        if (isItPlayerOne(message.clientId)) {
          setPlayerTwoDice(message.data.dice)
        } else {
          setPlayerOneDice(message.data.dice)
        }
      }
    }
  })

  const sendDice = (dice: number) => {
    channel.publish('dice', { dice })
  }

  return { playerOneDice, playerTwoDice, sendDice }
}
