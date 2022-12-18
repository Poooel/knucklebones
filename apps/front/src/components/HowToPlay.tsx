import * as React from 'react'
import clsx from 'clsx'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { Toolbar } from './Toolbar'
import { IconButton } from './IconButton'
import { Modal } from './Modal'
import { Board } from './Board'
import { Dice } from './Dice'

const SCORE_EXAMPLE_COLUMNS = [[1], [2, 2], [3, 3, 3]]
const PLAYER_ONE_REMOVE_EXAMPLE_COLUMNS = [[], [], [6]]
const PLAYER_TWO_REMOVE_EXAMPLE_COLUMNS = [[], [], [6, 6]]

function ExplanationText({ children }: React.PropsWithChildren) {
  return (
    <p className='text-center text-lg font-medium leading-tight'>{children}</p>
  )
}

interface SeparatorProps {
  className?: string
}
function Separator({ className }: SeparatorProps) {
  return (
    <hr
      className={clsx(
        'mx-8 border-slate-900/25 dark:border-slate-50/25',
        className
      )}
    />
  )
}

function ScoreExample() {
  return (
    <div className='flex flex-col items-center justify-center gap-8 xl:flex-row'>
      <div className='flex-shrink-0'>
        <Board
          canPlay={false}
          columns={SCORE_EXAMPLE_COLUMNS}
          isPlayerOne={false}
        />
      </div>
      <div className='grid grid-cols-1 place-items-center gap-2'>
        <ExplanationText>
          You score even more points when stacking the same dice in a column
        </ExplanationText>
        <div className='flex flex-row items-center gap-1'>
          <Dice value={1} count={1} variant='small' /> <span> ➝ x 1 = 1</span>
        </div>
        <div className='flex flex-row items-center gap-1'>
          <Dice value={2} count={2} variant='small' />{' '}
          <Dice value={2} count={2} variant='small' /> <span> ➝ x 2 = 8</span>
        </div>
        <div className='flex flex-row items-center gap-1'>
          <Dice value={3} count={3} variant='small' />{' '}
          <Dice value={3} count={3} variant='small' />{' '}
          <Dice value={3} count={3} variant='small' /> <span> ➝ x 3 = 27</span>
        </div>
      </div>
    </div>
  )
}

function RemovalExample() {
  return (
    <div className='flex flex-col items-center justify-center gap-8 xl:flex-row'>
      <div className='grid flex-shrink-0 grid-cols-1 gap-4'>
        <Board
          canPlay={false}
          columns={PLAYER_TWO_REMOVE_EXAMPLE_COLUMNS}
          isPlayerOne={false}
          diceClassName='opacity-75 animate-pulse'
        />
        <Board
          canPlay={false}
          columns={PLAYER_ONE_REMOVE_EXAMPLE_COLUMNS}
          isPlayerOne={true}
        />
      </div>
      <ExplanationText>
        You remove all opponent's dice with the same value when placing a dice
        in the matching column
      </ExplanationText>
    </div>
  )
}

function HowToPlay() {
  return (
    <div className='grid grid-cols-1 gap-8'>
      <div className='grid grid-cols-1 gap-2'>
        <ExplanationText>
          Each turn, you get a random dice to place in a column.
        </ExplanationText>
        <ExplanationText>
          The goal is to score more points than your opponent when the game
          ends, which happens when one of the boards is full.
        </ExplanationText>
      </div>
      <Separator />
      <div className='flex flex-col justify-center gap-4 lg:flex-row'>
        <div className='flex flex-1 flex-row justify-center'>
          <ScoreExample />
        </div>
        <Separator className='h-full border-r' />
        <div className='flex flex-1 flex-row justify-center'>
          <RemovalExample />
        </div>
      </div>
    </div>
  )
}

export function HowToPlayPage() {
  return (
    <div className='container mx-auto py-8 px-4 md:px-0'>
      <HowToPlay />
    </div>
  )
}

export function HowToPlayModal() {
  const [isOpen, setOpen] = React.useState(false)

  return (
    <>
      <Toolbar>
        <IconButton
          icon={<QuestionMarkCircleIcon />}
          onClick={() => setOpen(true)}
        />
      </Toolbar>
      <Modal isOpen={isOpen} onClose={() => setOpen(false)}>
        <div className='max-w-7xl'>
          <HowToPlay />
        </div>
      </Modal>
    </>
  )
}