import { t } from 'i18next'
import { type IGameState, type IPlayer } from '@knucklebones/common'
import { getName } from './name'

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

// Ça gère pas le fait que le playerId puisse être celui d'un spectateur
// C'est fait exprès
export function getPlayerFromId(
  playerId: string,
  {
    playerOne,
    playerTwo
  }: { playerOne: AugmentedPlayer; playerTwo: AugmentedPlayer }
) {
  return playerId === playerOne.id ? playerOne : playerTwo
}

export interface AugmentedPlayer extends IPlayer {
  inGameName: string
  isPlayerOne: boolean
}

export function augmentPlayer(
  player: IPlayer,
  isPlayerOne: boolean
): AugmentedPlayer {
  return {
    ...player,
    isPlayerOne,
    inGameName: isPlayerOne ? t('game.you') : getName(player)
  }
}
