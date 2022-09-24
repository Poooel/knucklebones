import { Env } from '../types/env'
import { GameState } from '../../shared-types/gameState'
import { Play } from '../../shared-types/play'
import { Player } from '../../shared-types/player'

const emptyGameState: GameState = {
  logs: [],
  gameOutcome: 'not-started'
}

export function initialPlayerState(playerId: string): Player {
  return {
    id: playerId,
    columns: [[], [], []],
    score: 0,
    scorePerColumn: []
  }
}

export async function getGameState(roomId: string, env: Env) {
  return (
    (await env.GAME_STATE_STORE.get<GameState>(roomId, {
      type: 'json'
    })) ?? emptyGameState
  )
}

export function mutateGameState(play: Play, gameState: GameState): GameState {
  // poser le de
  // enlever en face
  // check pour la win/loose/tie
  // generer un nouveau de
  // game logs
  //
  // dans le auth, initialiser les joueurs
  return gameState
}
