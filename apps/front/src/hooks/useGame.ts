import * as React from 'react'
import { useLocation } from 'react-router-dom'
import {
  GameState,
  IGameState,
  IPlayer,
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
import { PlayerSide, getPlayerSide } from '../utils/playerSide'

function attributePlayers(
  playerSide: PlayerSide,
  gameState: IGameState | null
): [IPlayer?, IPlayer?] {
  if (gameState === null) {
    return []
  } else if (playerSide === 'player-one') {
    return [gameState.playerOne, gameState.playerTwo]
  } else {
    return [gameState.playerTwo, gameState.playerOne]
  }
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

  const playerId = localStorage.getItem('playerId')!
  const playerSide =
    gameState !== null ? getPlayerSide(playerId, gameState) : 'spectator'
  const [playerOne, playerTwo] = attributePlayers(playerSide, gameState)

  React.useEffect(() => {
    if (lastJsonMessage !== null) {
      // @ts-expect-error
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
            return await init(roomKey, 'beep-boop', 'ai', state?.difficulty)
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
    playerId,
    roomKey,
    playerSide
  }
}
