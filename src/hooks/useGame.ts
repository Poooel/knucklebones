import * as React from 'react'
import { useChannel } from '@ably-labs/react-hooks'
import { GameState } from '../../shared-types/gameState'
import { Player } from '../../shared-types/player'
import { isItGameStateMessage } from '../utils/messages'
import { sendPlay as internalSendPlay } from '../utils/sendPlay'
import { useRoom } from './useRoom'

function attributePlayers(
  playerId: string,
  gameState: GameState
): [Player | undefined, Player | undefined] {
  if (gameState.playerOne?.id === playerId) {
    return [gameState.playerOne, gameState.playerTwo]
  }
  return [gameState.playerTwo, gameState.playerOne]
}

export function useGame() {
  const [gameState, setGameState] = React.useState<GameState | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const { roomKey, roomId } = useRoom()

  const [, client] = useChannel(`[?rewind=1]${roomId}`, (message) => {
    if (isItGameStateMessage(message)) {
      setGameState(message.data)
      setIsLoading(false)
    }
  })

  const [playerOne, playerTwo] =
    gameState !== null && client.auth.clientId !== undefined
      ? attributePlayers(client.auth.clientId, gameState)
      : []

  async function sendPlay(column: number) {
    const dice = playerOne?.dice
    if (dice !== undefined && !isLoading) {
      setIsLoading(true)
      await internalSendPlay(roomKey, {
        column,
        value: dice,
        playerId: client.auth.clientId
      }).finally(() => {
        setIsLoading(false)
      })
    }
  }

  return { gameState, isLoading, playerOne, playerTwo, sendPlay }
}
