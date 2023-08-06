import { IGameState } from '@knucklebones/common'

export type PlayerSide = 'player-one' | 'player-two' | 'spectator'

export function getPlayerSide(
  playerId: string,
  { playerOne, playerTwo }: Pick<IGameState, 'playerOne' | 'playerTwo'>
): PlayerSide {
  if (playerId === playerOne.id) {
    return 'player-one'
  } else if (playerId === playerTwo.id) {
    return 'player-two'
  } else {
    return 'spectator'
  }
}
