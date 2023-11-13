import { type OutcomeHistory, type PlayerOutcome } from '@knucklebones/common'

export interface PlayerOutcomeWithWins extends PlayerOutcome {
  wins: number
}
export interface GameOutcome {
  playerOne: PlayerOutcomeWithWins
  playerTwo: PlayerOutcomeWithWins
}
export type DetailedHistory = GameOutcome[]

export function getHistory(outcomeHistory: OutcomeHistory) {
  return outcomeHistory.reduce<DetailedHistory>((acc, current) => {
    const { playerOne, playerTwo } = current
    const lastEntry = acc.at(-1) ?? {
      playerOne: {
        wins: 0
      },
      playerTwo: {
        wins: 0
      }
    }

    acc.push({
      playerOne: {
        ...playerOne,
        wins:
          lastEntry.playerOne.wins + (playerOne.score > playerTwo.score ? 1 : 0)
      },
      playerTwo: {
        ...playerTwo,
        wins:
          lastEntry.playerTwo.wins + (playerOne.score < playerTwo.score ? 1 : 0)
      }
      // winner
    })
    return acc
  }, [])
}
