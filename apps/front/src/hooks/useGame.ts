import * as React from 'react'
import { GameState, mutateGameState, Player } from '@knucklebones/common'
import { displayName, init, play, rematch } from '../utils/api'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { useParams } from 'react-router-dom'

interface Params {
  roomKey: string
}

function attributePlayers(
  playerId: string,
  gameState: GameState
): [Player | undefined, Player | undefined] {
  if (gameState.playerOne?.id === playerId) {
    return [gameState.playerOne, gameState.playerTwo]
  }
  return [gameState.playerTwo, gameState.playerOne]
}

function getWebSocketUrl(roomKey: string) {
  let hostname = import.meta.env.VITE_WORKER_URL

  if (hostname.startsWith('http://')) {
    hostname = hostname.replace('http', 'ws')
  } else if (hostname.startsWith('https://')) {
    hostname = hostname.replace('https', 'wss')
  }

  return `${hostname}/${roomKey}/websocket`
}

export function useGame() {
  const [gameState, setGameState] = React.useState<GameState | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const { roomKey } = useParams<keyof Params>() as Params
  const playerId = localStorage.getItem('clientId')!

  const { lastJsonMessage, readyState } = useWebSocket(getWebSocketUrl(roomKey))

  React.useEffect(() => {
    if (lastJsonMessage !== null) {
      // @ts-expect-error
      const gameState = lastJsonMessage as GameState
      setGameState(gameState)
      setIsLoading(false)
      setErrorMessage(null)
    }
  }, [lastJsonMessage])

  React.useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      const fetchGameState = async () => {
        const gameState = await init(roomKey, playerId)
        setGameState(gameState)
        setIsLoading(false)
        setErrorMessage(null)
      }

      fetchGameState().catch((error) => {
        setErrorMessage(error.message)
      })
    }
  }, [roomKey, playerId, readyState])

  const [playerOne, playerTwo] =
    gameState !== null && playerId !== undefined
      ? attributePlayers(playerId, gameState)
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

      const mutatedGameState = mutateGameState(body, playerId, gameState!)

      setGameState(mutatedGameState)

      await play(roomKey, playerId, body).catch((error) => {
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
    await rematch(roomKey, playerId).catch((error) => {
      setErrorMessage(error.message)
    })
  }

  async function updateDisplayName(newDisplayName: string) {
    await displayName(roomKey, playerId, newDisplayName).catch((error) => {
      setErrorMessage(error.message)
    })
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
    playerId
  }
}
