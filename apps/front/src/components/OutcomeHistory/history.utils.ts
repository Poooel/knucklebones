import {
  Outcome,
  OutcomeHistory,
  OutcomeHistoryEntry
} from '@knucklebones/common'

export interface PlayerOutcome {
  wins: number
  score: number
}
export interface GameOutcome {
  playerOne: PlayerOutcome
  playerTwo: PlayerOutcome
  outcome: Outcome
}
export type DetailedHistory = GameOutcome[]

function getOutcome({
  playerOneScore,
  playerTwoScore
}: OutcomeHistoryEntry): Outcome {
  if (playerOneScore > playerTwoScore) {
    return 'player-one-win'
  }
  if (playerOneScore < playerTwoScore) {
    return 'player-two-win'
  }
  return 'tie'
}

export function getHistory(outcomeHistory: OutcomeHistory) {
  return outcomeHistory.reduce<DetailedHistory>((acc, current) => {
    const { playerOneScore, playerTwoScore } = current
    const outcome = getOutcome(current)

    const { playerOne, playerTwo } = acc.at(-1) ?? {
      playerOne: {
        wins: 0,
        score: 0
      },
      playerTwo: {
        wins: 0,
        score: 0
      }
    }

    acc.push({
      playerOne: {
        wins: playerOne.wins + (outcome === 'player-one-win' ? 1 : 0),
        score: playerOneScore
      },
      playerTwo: {
        wins: playerTwo.wins + (outcome === 'player-two-win' ? 1 : 0),
        score: playerTwoScore
      },
      outcome
    })
    return acc
  }, [])
}
