import { Env } from '../types/env'
import { GameOutcome } from '../types/gameOutcome'
import { GameState } from '../types/gameState'
import { Play } from '../types/play'

const initialPlayerState = {
  id: '',
  dice: -1,
  columns: [[], [], []],
  score: 0,
  scorePerColumn: []
}

const emptyGameState = {
  playerOne: initialPlayerState,
  playerTwo: initialPlayerState,
  logs: [],
  gameOutcome: GameOutcome.Ongoing
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
  gameState.playerOne.columns[play.column].push(play.value)
  return gameState
}
