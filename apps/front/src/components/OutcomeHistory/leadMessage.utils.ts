import { GameContext } from '../../hooks/useGame'
import { getPlayerFromId } from '../../utils/player'
import { GameOutcome } from './history.utils'

interface GetLeadMessageArgs
  extends Pick<GameContext, 'playerOne' | 'playerTwo'> {
  gameOutcome: GameOutcome
}
export function getLeadMessage({
  gameOutcome,
  ...players
}: GetLeadMessageArgs) {
  const { playerOne: playerOneOutcome, playerTwo: playerTwoOutcome } =
    gameOutcome

  if (playerOneOutcome.wins === playerTwoOutcome.wins) {
    return 'This is a tie!'
  }

  const { id } =
    playerOneOutcome.wins > playerTwoOutcome.wins
      ? playerOneOutcome
      : playerTwoOutcome
  const leadingPlayer = getPlayerFromId(id, players)

  // L'enfer
  const verb = leadingPlayer.inGameName === 'You' ? 'are' : 'is'

  return `${leadingPlayer.inGameName} ${verb} taking the lead!`
}
