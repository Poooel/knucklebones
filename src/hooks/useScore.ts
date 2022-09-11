import * as React from 'react'
import { ColumnDice, getScore } from '../utils/score'

interface UseScoreProps {
  playerOneColumns: ColumnDice[]
  playerTwoColumns: ColumnDice[]
}

export function useScore({
  playerOneColumns,
  playerTwoColumns
}: UseScoreProps) {
  const [playerOneScore, setPlayerOneScore] = React.useState(0)
  const [playerTwoScore, setPlayerTwoScore] = React.useState(0)

  React.useEffect(() => {
    const { totalScore } = getScore(playerOneColumns)
    setPlayerOneScore(totalScore)
  }, [playerOneColumns])

  React.useEffect(() => {
    const { totalScore } = getScore(playerTwoColumns)
    setPlayerTwoScore(totalScore)
  }, [playerTwoColumns])

  return {
    playerOneScore,
    playerTwoScore
  }
}
