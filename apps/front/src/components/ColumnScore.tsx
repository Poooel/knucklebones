import * as React from 'react'
import {
  useClick,
  useFloating,
  useHover,
  useInteractions,
  useDismiss
} from '@floating-ui/react-dom-interactions'
import { countDiceInColumn } from '@knucklebones/common'
import { Dice } from './Dice'

interface CountedDiceProps {
  value: number
  count: number
}

function CountedDice({ value, count }: CountedDiceProps) {
  if (count === 1) {
    return <Dice value={value} count={count} variant='small' />
  }
  return (
    <p className='flex flex-row items-center gap-1'>
      <span>((</span>
      {Array.from({ length: count }).map((_, i) => (
        <>
          <Dice value={value} count={count} variant='small' key={i} />
          {i + 1 < count && <span>+</span>}
        </>
      ))}
      <span>) x {count})</span>
    </p>
  )
}

interface ColumnScoreProps {
  isPlayerOne: boolean
  dice: number[]
  score: number
}

export function ColumnScore({ dice, score, isPlayerOne }: ColumnScoreProps) {
  const [showTooltip, setShowTooltip] = React.useState(false)
  const { x, y, reference, floating, strategy, context } = useFloating({
    placement: isPlayerOne ? 'top' : 'bottom',
    open: showTooltip,
    onOpenChange(open) {
      if (score > 0) {
        setShowTooltip(open)
      }
    }
  })
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, { mouseOnly: true, delay: { open: 100 } }),
    useClick(context, { ignoreMouse: true }),
    useDismiss(context)
  ])

  const countedDice = countDiceInColumn(dice)

  return (
    <>
      <p ref={reference} className='text-center' {...getReferenceProps()}>
        {score}
      </p>
      {showTooltip && (
        <div
          ref={floating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0
          }}
          className='w-max rounded bg-slate-200 p-2 text-slate-900 shadow shadow-slate-300 dark:bg-slate-700 dark:text-slate-50 dark:shadow-slate-800'
          {...getFloatingProps()}
        >
          <div className='flex flex-row items-center gap-2'>
            {[...countedDice.entries()].map(([value, count], index) => (
              <React.Fragment key={index}>
                <CountedDice value={value} count={count} />
                {index + 1 < countedDice.size && <span>+</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
