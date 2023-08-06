import * as React from 'react'
import { Link } from 'react-router-dom'
import { IGameState } from '@knucklebones/common'
import { Button } from './Button'
import { useMedia } from 'react-use'
import { PlayIcon } from '@heroicons/react/24/outline'
import { getName } from '../utils/name'
import { ToolbarModal } from './ToolbarModal'
import { PlayerSide } from '../utils/playerSide'

interface OutcomeProps extends IGameState {
  playerId: string
  onRematch(): void
  playerSide: PlayerSide
}

const getWinMessage = (
  playerSide: PlayerSide,
  { outcome, playerOne, playerTwo }: IGameState
) => {
  if (
    (outcome === 'player-one-win' && playerSide === 'player-one') ||
    (outcome === 'player-two-win' && playerSide === 'player-two')
  ) {
    return `You won with ${playerOne.score} points!`
  }
  if (outcome !== 'tie') {
    return `${getName(playerTwo)} won with ${playerTwo.score} points!`
  } else {
    return 'This is a tie! Nobody wins!'
  }
}

export function GameOutcome({
  playerId,
  onRematch,
  playerSide,
  ...gameState
}: OutcomeProps) {
  const { outcome } = gameState
  const isSpectator = playerSide === 'spectator'
  const hasVotedRematch = isSpectator || gameState.rematchVote === playerId
  const isDesktop = useMedia('(min-width: 768px)')

  if (outcome === 'ongoing') {
    return <p className='hidden md:block'>VS</p>
  }

  const playerTwoName = getName(gameState.playerTwo)

  const content = (
    <div className='grid justify-items-center gap-2 font-semibold'>
      <p>{getWinMessage(playerSide, gameState)}</p>
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
          <p>Waiting for {playerTwoName}...</p>
        ) : (
          gameState.rematchVote !== undefined && ( // It means the other player has voted for rematch
            <p>{playerTwoName} wants to rematch!</p>
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
