import { GameState } from '../../../shared/types/gameState'
import { Env } from '../../types/env'
import { jsonResponse } from '../../utils/jsonResponse'
import { getClientId, getRoomId } from '../../utils/params'
import {
  addLog,
  getGameState,
  initialPlayerState,
  saveAndPropagateState
} from '../../utils/gameState'
import { getRandomDice, getRandomValue } from '../../utils/random'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, request, params } = context

  const clientId = getClientId(request)
  const roomId = getRoomId(params)

  if (clientId === null) {
    throw new Error('No client ID provided')
  }

  const gameState = await initializePlayers(env, roomId, clientId)
  await saveAndPropagateState(env, roomId, gameState)

  return jsonResponse(gameState, { status: 200 })
}

async function initializePlayers(
  env: Env,
  roomId: string,
  clientId: string
): Promise<GameState> {
  const gameState = await getGameState(roomId, env)

  if (gameState.gameOutcome !== 'not-started') {
    return gameState
  }

  if (gameState.playerOne === undefined) {
    gameState.playerOne = initialPlayerState(clientId)
    addLog(gameState, `${clientId} has connected to the game`)
  } else if (
    gameState.playerTwo === undefined &&
    clientId !== gameState.playerOne.id
  ) {
    gameState.playerTwo = initialPlayerState(clientId)
    addLog(gameState, `${clientId} has connected to the game`)

    // Starts game after second player joined
    const isPlayerOneStarting = getRandomValue() > 0.5
    if (isPlayerOneStarting) {
      gameState.nextPlayer = gameState.playerOne.id
      gameState.playerOne.dice = getRandomDice()
    } else {
      gameState.nextPlayer = gameState.playerTwo.id
      gameState.playerTwo.dice = getRandomDice()
    }
    gameState.gameOutcome = 'ongoing'
    addLog(gameState, `${gameState.nextPlayer} is going to play first`)
  }

  return gameState
}
