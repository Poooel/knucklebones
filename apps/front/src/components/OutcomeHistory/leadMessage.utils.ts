import { GameContext } from '../../hooks/useGame'
import { GameOutcome } from './history.utils'

interface GetLeadMessageArgs
  extends Pick<GameContext, 'playerOne' | 'playerTwo' | 'playerSide'> {
  gameOutcome: GameOutcome
}
export function getLeadMessage({
  gameOutcome,
  playerOne,
  playerTwo,
  playerSide
}: GetLeadMessageArgs) {
  const { playerOne: playerOneOutcome, playerTwo: playerTwoOutcome } =
    gameOutcome

  if (playerOneOutcome.wins === playerTwoOutcome.wins) {
    return 'This is a tie!'
  }

  const leadingPlayer =
    playerSide === 'spectator' ||
    (playerOneOutcome.wins > playerTwoOutcome.wins &&
      playerSide === 'player-one') ||
    (playerOneOutcome.wins < playerTwoOutcome.wins &&
      playerSide === 'player-two')
      ? playerOne
      : playerTwo

  // L'enfer
  const verb = leadingPlayer.inGameName === 'You' ? 'are' : 'is'

  return `${leadingPlayer.inGameName} ${verb} taking the lead!`
}
