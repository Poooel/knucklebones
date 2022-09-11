import { GameState } from './gameState'

export const whichPlayerWins = (
  playerOneScore: number,
  playerTwoScore: number
) => {
  if (playerOneScore > playerTwoScore) {
    return GameState.PlayerOneWin
  } else if (playerOneScore < playerTwoScore) {
    return GameState.PlayerTwoWin
  } else {
    return GameState.Tie
  }
}
