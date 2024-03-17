import i18next from 'i18next'
import { type GameOutcome } from '@knucklebones/common'
import { getPlayerFromId } from '../../utils/player'
import { type InGameContext } from '../GameContext'

interface GetLeadMessageArgs
  extends Pick<InGameContext, 'playerOne' | 'playerTwo' | 'boType'> {
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
  if (
    boType !== 'indefinite' &&
    Number(boType) === playerOne.wins + playerTwo.wins
  ) {
    return i18next.t('menu.history.win', { player: leadingPlayer.inGameName })
  }

  // L'enfer
  return i18next.t(
    leadingPlayer.inGameName === 'You'
      ? 'menu.history.you-lead'
      : 'menu.history.opponent-lead',
    { player: leadingPlayer.inGameName }
  )
}
