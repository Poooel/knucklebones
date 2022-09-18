import * as React from 'react'
import { clsx } from 'clsx'
import { Transition } from '@headlessui/react'

interface DiceProps {
  value: number
  count?: number
}

interface DotProps {
  className?: string
}

const className = 'aspect-square h-12 md:h-16'

export function DicePlaceholder() {
  return <div className={className}></div>
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

export function SimpleDice({ value, count = 1 }: DiceProps) {
  const DiceValue = DiceMap[value]
  return (
    <div
      className={clsx(
        className,
        'flex select-none flex-row items-center justify-center rounded shadow-md',
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

export function Dice({ value, count = 1 }: Partial<DiceProps>) {
  // Temporarily store the dice value to keep the dice shown during the
  // transition after it has been unset. While the animation is done, the cached
  // value is reset. When the value is set, it will update the cached value.
  const [cachedValue, setCachedValue] = React.useState<number | undefined>(
    value
  )

  React.useEffect(() => {
    if (value !== undefined) {
      setCachedValue(value)
    }
  }, [value])

  return (
    <>
      <Transition
        show={Boolean(value)}
        className='transition duration-100 ease-in-out'
        enterFrom='opacity-0 scale-75'
        enterTo='opacity-100 scale-100'
        leaveFrom='opacity-100 scale-100'
        leaveTo='opacity-0 scale-75'
        afterLeave={() => {
          setCachedValue(undefined)
        }}
      >
        {cachedValue !== undefined && (
          <SimpleDice value={cachedValue} count={count} />
        )}
      </Transition>
      {/*
        Cannot show `DicePlaceholder` within `Transition` when `shown` is
        false, since the `Transition` block isn't rendered.
      */}
      {cachedValue === undefined && <DicePlaceholder />}
    </>
  )
}
