import * as React from 'react'
import { useLocation } from 'react-router-dom'
import {
  GameState,
  type IGameState,
  isEmptyOrBlank
} from '@knucklebones/common'
import {
  deleteDisplayName,
  displayName,
  init,
  play,
  rematch
} from '../utils/api'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { useRoomKey } from './useRoomKey'
import {
  type PlayerSide,
  augmentPlayer,
  getPlayerFromId,
  getPlayerSide
} from '../utils/player'

export type GameContext = NonNullable<ReturnType<typeof useGame>>

function preparePlayers(
  playerSide: PlayerSide,
  { playerOne, playerTwo }: IGameState
) {
  if (playerSide === 'player-two') {
    return [augmentPlayer(playerTwo, true), augmentPlayer(playerOne, false)]
  }
  return [
    augmentPlayer(playerOne, playerSide !== 'spectator'),
    augmentPlayer(playerTwo, false)
  ]
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
  const [gameState, setGameState] = React.useState<IGameState | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const roomKey = useRoomKey()
  const { state } = useLocation()
  const { lastJsonMessage, readyState } = useWebSocket(getWebSocketUrl(roomKey))

  const isGameStateReady = gameState !== null

  const playerId = localStorage.getItem('playerId')!
  const playerSide = isGameStateReady
    ? getPlayerSide(playerId, gameState)
    : 'spectator'
  const [playerOne, playerTwo] = isGameStateReady
    ? preparePlayers(playerSide, gameState)
    : []

  const winner =
    gameState?.winnerId !== undefined
      ? getPlayerFromId(gameState.winnerId, { playerOne, playerTwo })
      : undefined

  React.useEffect(() => {
    if (lastJsonMessage !== null) {
      // Can use Zod to parse the message safely
      const gameState = lastJsonMessage as IGameState
      setGameState(gameState)
      setIsLoading(false)
      setErrorMessage(null)
    }
  }, [lastJsonMessage])

  React.useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      init(roomKey, playerId, 'human')
        .then(async () => {
          if (state?.playerType === 'ai') {
            await init(roomKey, 'beep-boop', 'ai', state?.difficulty)
          }
        })
        .catch((error) => {
          setErrorMessage(error.message)
        })
    }
  }, [roomKey, playerId, readyState, state])

  async function sendPlay(column: number) {
    const dice = playerOne?.dice
    if (dice !== undefined && !isLoading) {
      setIsLoading(true)

      const body = {
        column,
        dice,
        author: playerId
      }

      const previousGameState = gameState

      const realGameState = GameState.fromJson(gameState!)
      realGameState.applyPlay(body)
      const mutatedGameState = realGameState.toJson()

      setGameState(mutatedGameState)

      await play(roomKey, body).catch((error) => {
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
    if (isEmptyOrBlank(newDisplayName)) {
      await deleteDisplayName(roomKey, playerId).catch((error) => {
        setErrorMessage(error.message)
      })
    } else {
      await displayName(roomKey, playerId, newDisplayName).catch((error) => {
        setErrorMessage(error.message)
      })
    }
  }

  // Easy way to do a type guard
  if (!isGameStateReady) {
    return null
  }

  return {
    ...gameState,
    isLoading,
    playerOne,
    playerTwo,
    playerId,
    playerSide,
    winner,
    errorMessage,
    sendPlay,
    clearErrorMessage,
    sendRematch,
    updateDisplayName
  }
}
