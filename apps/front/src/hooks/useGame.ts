import * as React from 'react'
import { useChannel } from '@ably-labs/react-hooks'
import { GameState, mutateGameState, Player } from '@knucklebones/common'
import { isItGameStateMessage } from '../utils/messages'
import { useRoom } from './useRoom'
import { displayName, init, play, rematch } from '../utils/api'

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
    void init(roomKey, client.auth.clientId)
  }, [roomKey, client.auth.clientId])

  const [playerOne, playerTwo] =
    gameState !== null && client.auth.clientId !== undefined
      ? attributePlayers(client.auth.clientId, gameState)
      : []

  async function sendPlay(column: number) {
    const dice = playerOne?.dice
    if (dice !== undefined && !isLoading) {
      setIsLoading(true)

      const body = {
        column,
        value: dice
      }

      const previousGameState = gameState

      const mutatedGameState = mutateGameState(
        body,
        client.auth.clientId,
        gameState!
      )

      setGameState(mutatedGameState)

      await play(roomKey, client.auth.clientId, body).catch((error) => {
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

  async function updateDisplayName(newDisplayName: string) {
    await displayName(roomKey, client.auth.clientId, newDisplayName)
  }

  return {
    gameState,
    isLoading,
    playerOne,
    playerTwo,
    sendPlay,
    errorMessage,
    clearErrorMessage,
    sendRematch,
    updateDisplayName,
    clientId: client.auth.clientId
  }
}
