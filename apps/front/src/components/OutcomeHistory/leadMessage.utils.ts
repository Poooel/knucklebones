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
      return "The first round isn't finished yet!"
    }
    return 'This is a tie!'
  }

  const { id } = playerOne.wins > playerTwo.wins ? playerOne : playerTwo
  const leadingPlayer = getPlayerFromId(id, players)

  // `boType` est considéré comme un `string`, je sais pas trop pourquoi
  if (
    boType !== 'indefinite' &&
    Number(boType) === playerOne.wins + playerTwo.wins
  ) {
    return `${leadingPlayer.inGameName} won!`
  }

  // L'enfer
  const verb = leadingPlayer.inGameName === 'You' ? 'are' : 'is'

  return `${leadingPlayer.inGameName} ${verb} taking the lead!`
}
