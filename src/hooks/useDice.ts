import * as React from 'react'
import { useRoom } from './useRoom'
import { isItDice, isItInitialDice } from '../utils/messages'
import { Player } from '../utils/players'

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
      } else if (isItInitialDice(message)) {
        if (isItPlayerOne(message.clientId)) {
          if (message.data.target === Player.PlayerOne) {
            setPlayerOneDice(message.data.initialDice)
          } else if (message.data.target === Player.PlayerTwo) {
            setPlayerTwoDice(message.data.initialDice)
          }
        } else {
          if (message.data.target === Player.PlayerOne) {
            setPlayerTwoDice(message.data.initialDice)
          } else if (message.data.target === Player.PlayerTwo) {
            setPlayerOneDice(message.data.initialDice)
          }
        }
      }
    }
  })

  const sendDice = (dice: number) => {
    channel.publish('dice', { dice })
  }

  const sendInitialDice = (dice: number, target: Player) => {
    channel.publish('dice', { initialDice: dice, target })
  }

  return { playerOneDice, playerTwoDice, sendDice, sendInitialDice }
}
