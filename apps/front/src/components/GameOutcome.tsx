import * as React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './Button'
import { useMedia } from 'react-use'
import { PlayIcon } from '@heroicons/react/24/outline'
import { ToolbarModal } from './ToolbarModal'
import { GameContext } from '../hooks/useGame'

interface GetWinMessageArgs extends Pick<GameContext, 'outcome' | 'winner'> {}

function getWinMessage({ outcome, winner }: GetWinMessageArgs) {
  if (outcome === 'game-ended') {
    if (winner !== undefined) {
      return `${winner.inGameName} won with ${winner.score} points!`
    }
    return 'This is a tie! Nobody wins!'
  }
  return ''
}

interface OutcomeProps
  extends GetWinMessageArgs,
    Pick<
      GameContext,
      'rematchVote' | 'playerOne' | 'playerTwo' | 'playerSide'
    > {
  onRematch(): void
}

export function GameOutcome({
  outcome,
  winner,
  playerSide,
  playerOne,
  playerTwo,
  rematchVote,
  onRematch
}: OutcomeProps) {
  const isSpectator = playerSide === 'spectator'
  const hasVotedRematch = rematchVote === playerOne.id
  const isDesktop = useMedia('(min-width: 768px)')

  if (outcome === 'ongoing') {
    return <p className='hidden md:block'>VS</p>
  }

  const content = (
    <div className='grid justify-items-center gap-2 font-semibold'>
      <p>{getWinMessage({ outcome, winner })}</p>
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
          <p>Waiting for {playerTwo.inGameName}...</p>
        ) : (
          rematchVote !== undefined && ( // It means the other player has voted for rematch
            <p>{playerTwo.inGameName} wants to rematch!</p>
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
