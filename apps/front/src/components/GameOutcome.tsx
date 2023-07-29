import * as React from 'react'
import { Link } from 'react-router-dom'
import { IGameState, IPlayer } from '@knucklebones/common'
import { Button } from './Button'
import { useMedia } from 'react-use'
import { PlayIcon } from '@heroicons/react/24/outline'
import { getName } from '../utils/name'
import { ToolbarModal } from './ToolbarModal'

interface OutcomeProps extends IGameState {
  playerId: string
  onRematch(): void
  isSpectator: boolean
}

function getWinnerName(playerId: string, player: IPlayer) {
  return playerId === player.id ? 'You' : getName(player)
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
  const hasVotedRematch = isSpectator || gameState.rematchVote === playerId
  const isDesktop = useMedia('(min-width: 768px)')

  if (outcome === 'ongoing') {
    return <p className='hidden md:block'>VS</p>
  }

  const playerTwoId =
    playerId === gameState.playerOne?.id
      ? getName(gameState.playerTwo)
      : getName(gameState.playerOne)

  const content = (
    <div className='grid justify-items-center gap-2 font-semibold'>
      <p>{getWinMessage(playerId, gameState)}</p>
      {!isSpectator && (
        <div className='flex gap-4'>
          <Button as={Link} to='/'>
            Replay
          </Button>
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

  if (isDesktop) {
    return content
  } else {
    return (
      // Prevents from rendering an empty div in the flex parent, which adds more gap
      <div className='hidden'>
        <ToolbarModal icon={<PlayIcon />} isInitiallyOpen>
          {content}
        </ToolbarModal>
      </div>
    )
  }
}
