import i18next from 'i18next'
import { type GameOutcome } from '@knucklebones/common'
import { type GameContext } from '../../hooks/useGame'
import { getPlayerFromId } from '../../utils/player'

interface GetLeadMessageArgs
  extends Pick<GameContext, 'playerOne' | 'playerTwo' | 'boType'> {
  gameOutcome: GameOutcome
}
export function getLeadMessage({
  boType,
  gameOutcome,
  ...players
}: GetLeadMessageArgs) {
  const { playerOne, playerTwo } = gameOutcome

  if (playerOne.wins === playerTwo.wins) {
    if (playerOne.wins === 0) {
      return i18next.t('menu.history.empty-round')
    }
    return i18next.t('menu.history.tie')
  }

  const { id } = playerOne.wins > playerTwo.wins ? playerOne : playerTwo
  const leadingPlayer = getPlayerFromId(id, players)

  // `boType` est considéré comme un `string`, je sais pas trop pourquoi
  const gameScope =
    boType !== 'indefinite' &&
    Number(boType) === playerOne.wins + playerTwo.wins
      ? 'win'
      : 'lead'
  const playerWin = leadingPlayer.isPlayerOne ? 'you' : 'opponent'

  return i18next.t(`menu.history.${playerWin}-${gameScope}` as const, {
    player: leadingPlayer.inGameName
  })
}
