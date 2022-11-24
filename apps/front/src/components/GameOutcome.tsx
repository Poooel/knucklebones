import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IGameState, IPlayer, Player } from '@knucklebones/common'
import { Button } from './Button'

interface OutcomeProps extends IGameState {
  playerId: string
  onRematch(): void
  isSpectator: boolean
}

function getWinnerName(playerId: string, player: IPlayer) {
  return playerId === player.id ? 'You' : Player.fromJson(player).getName()
}

const getWinMessage = (
  playerId: string,
  { outcome, playerOne, playerTwo }: IGameState
) => {
  if (outcome === 'player-one-win') {
    const winnerName = getWinnerName(playerId, playerOne)
    return `${winnerName} won with ${playerOne.score} points!`
  }
  if (outcome === 'player-two-win') {
    const winnerName = getWinnerName(playerId, playerTwo)
    return `${winnerName} won with ${playerTwo.score} points!`
  }
  if (outcome === 'tie') {
    return 'This is a tie! Nobody wins!'
  }
}

export function GameOutcome({
  playerId,
  onRematch,
  isSpectator,
  ...gameState
}: OutcomeProps) {
  const { outcome } = gameState
  const navigate = useNavigate()
  const hasVotedRematch = isSpectator || gameState.rematchVote === playerId

  if (outcome === 'ongoing') {
    return <p>VS</p>
  }

  const playerTwoId =
    playerId === gameState.playerOne?.id
      ? Player.fromJson(gameState.playerTwo).getName()
      : Player.fromJson(gameState.playerOne).getName()

  return (
    <div className='grid justify-items-center gap-2 font-semibold'>
      <p>{getWinMessage(playerId, gameState)}</p>
      {!isSpectator && (
        <div className='flex gap-4'>
          <Button onClick={() => navigate('/')}>Replay</Button>
          <Button onClick={onRematch} disabled={hasVotedRematch}>
            Rematch
          </Button>
        </div>
      )}

      {!isSpectator &&
        (hasVotedRematch ? (
          <p>Waiting for {playerTwoId}...</p>
        ) : (
          gameState.rematchVote !== undefined && ( // It means the other player has voted for rematch
            <p>{playerTwoId} wants to rematch!</p>
          )
        ))}
    </div>
  )
}
