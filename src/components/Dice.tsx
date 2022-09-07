import * as React from 'react'
import { clsx } from 'clsx'

interface DiceProps {
  value: number
  count?: number
}

interface DotProps {
  className?: string
}

export function DicePlaceholder() {
  return <div className='aspect-square h-14 md:h-16'></div>
}

function DiceContainer({ children }: React.PropsWithChildren) {
  return (
    <div className='grid h-full w-full grid-cols-3 grid-rows-3 place-items-center p-1 md:p-2'>
      {children}
    </div>
  )
}

function Dot({ className }: DotProps) {
  return (
    <div
      className={clsx(
        'aspect-square h-2 rounded-full bg-slate-900 md:h-3',
        className
      )}
    ></div>
  )
}

function DiceOne() {
  return (
    <DiceContainer>
      <Dot className='col-start-2 row-start-2' />
    </DiceContainer>
  )
}

function DiceTwo() {
  return (
    <DiceContainer>
      <Dot />
      <Dot className='col-start-3 row-start-3' />
    </DiceContainer>
  )
}

function DiceThree() {
  return (
    <DiceContainer>
      <Dot />
      <Dot className='col-start-2 row-start-2' />
      <Dot className='col-start-3 row-start-3' />
    </DiceContainer>
  )
}

function DiceFour() {
  return (
    <DiceContainer>
      <Dot />
      <Dot className='col-start-3 row-start-1' />
      <Dot className='col-start-1 row-start-3' />
      <Dot className='col-start-3 row-start-3' />
    </DiceContainer>
  )
}

function DiceFive() {
  return (
    <DiceContainer>
      <Dot />
      <Dot className='col-start-3 row-start-1' />
      <Dot className='col-start-2 row-start-2' />
      <Dot className='col-start-1 row-start-3' />
      <Dot className='col-start-3 row-start-3' />
    </DiceContainer>
  )
}

function DiceSix() {
  return (
    <DiceContainer>
      <Dot className='col-start-1 row-start-1' />
      <Dot className='col-start-1 row-start-2' />
      <Dot className='col-start-1 row-start-3' />
      <Dot className='col-start-3 row-start-1' />
      <Dot className='col-start-3 row-start-2' />
      <Dot className='col-start-3 row-start-3' />
    </DiceContainer>
  )
}

const DiceMap: { [key: number]: () => JSX.Element } = {
  1: DiceOne,
  2: DiceTwo,
  3: DiceThree,
  4: DiceFour,
  5: DiceFive,
  6: DiceSix
}

export function Dice({ value, count = 1 }: DiceProps) {
  const DiceValue = DiceMap[value]
  return (
    <div
      className={clsx(
        'flex aspect-square h-14 select-none flex-row items-center justify-center rounded shadow-md md:h-16',
        {
          'border border-slate-300 bg-white shadow-slate-200': count === 1,
          'border border-yellow-300 bg-yellow-200 shadow-yellow-200':
            count === 2,
          'border border-blue-300 bg-blue-200 shadow-blue-200': count === 3
        }
      )}
    >
      <DiceValue />
    </div>
  )
}
