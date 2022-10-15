import * as React from 'react'
import { GameState, mutateGameState, Player } from '@knucklebones/common'
import { useRoom } from './useRoom'
import { displayName, init, play, rematch } from '../utils/api'
import useWebSocket from 'react-use-websocket'

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
  const [websocketUrl, setWebsocketUrl] = React.useState<string | null>(null)
  const { roomKey } = useRoom()
  const playerId = localStorage.getItem('clientId')!

  React.useEffect(() => {
    let hostname = import.meta.env.VITE_WORKER_URL

    if (hostname.startsWith('http://')) {
      hostname = hostname.replace('http', 'ws')
    } else if (hostname.startsWith('https://')) {
      hostname = hostname.replace('https', 'wss')
    }

    const url = `${hostname}/${roomKey}/websocket`

    setWebsocketUrl(url)
  }, [roomKey])

  const { lastMessage } = useWebSocket(websocketUrl)

  React.useEffect(() => {
    if (lastMessage !== null) {
      setGameState(lastMessage.data)
      setIsLoading(false)
      setErrorMessage(null)
    }
  }, [lastMessage])

  React.useEffect(() => {
    const fetchGameState = async () => {
      const gameState = await init(roomKey, playerId)
      setGameState(gameState)
      setIsLoading(false)
      setErrorMessage(null)
    }

    fetchGameState().catch((error) => {
      setErrorMessage(error.message)
    })
  }, [roomKey, playerId])

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
