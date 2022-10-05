import * as React from 'react'
import { useChannel } from '@ably-labs/react-hooks'
import { GameState, mutateGameState, Player } from '@knucklebones/common'

import { initializeGame } from '../utils/initializeGame'
import { isItGameStateMessage } from '../utils/messages'
import { sendPlay as internalSendPlay } from '../utils/sendPlay'
import { useRoom } from './useRoom'
import { rematch } from '../utils/rematch'

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
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const { roomKey, roomId } = useRoom()

  const [, client] = useChannel(`[?rewind=1]${roomId}`, (message) => {
    if (isItGameStateMessage(message)) {
      setGameState(message.data)
      setIsLoading(false)
      setErrorMessage(null)
    }
  })

  React.useEffect(() => {
    void initializeGame(roomKey, client.auth.clientId)
  }, [roomKey, client.auth.clientId])

  const [playerOne, playerTwo] =
    gameState !== null && client.auth.clientId !== undefined
      ? attributePlayers(client.auth.clientId, gameState)
      : []

  async function sendPlay(column: number) {
    const dice = playerOne?.dice
    if (dice !== undefined && !isLoading) {
      setIsLoading(true)

      const play = {
        column,
        value: dice,
        playerId: client.auth.clientId
      }

      const previousGameState = gameState

      const mutatedGameState = mutateGameState(play, gameState!)

      setGameState(mutatedGameState)

      await internalSendPlay(roomKey, play).catch((error) => {
        setErrorMessage(error.message)
        setGameState(previousGameState)
        setIsLoading(false)
      })
    }
  }

  function clearErrorMessage() {
    setErrorMessage(null)
  }

  async function sendRematch() {
    await rematch(roomKey, client.auth.clientId)
  }

  return {
    gameState,
    isLoading,
    playerOne,
    playerTwo,
    sendPlay,
    errorMessage,
    clearErrorMessage,
    sendRematch
  }
}
