import * as React from 'react'
import { Link } from 'react-router-dom'
import { useDrag } from '@use-gesture/react'
import { Transition } from '@headlessui/react'
import { useIsOnMobile } from '../hooks/detectDevice'
import KnucklebonesLogo from '../svgs/logo.svg'
import { Text } from './Text'

interface HeaderProps {
  leftStack: React.ReactNode
  rightStack: React.ReactNode
}

export function Header({ leftStack, rightStack }: HeaderProps) {
  // Always displayed by default
  const [showToolbar, setShowToolbar] = React.useState(true)
  const isOnMobile = useIsOnMobile()

  // Makes it appear/disappear on mobile after scrolling down/up
  useDrag(
    ({ swipe: [, yAxis], tap, distance }) => {
      console.log(JSON.stringify({ yAxis, tap, distance }))
      if (yAxis === -1 || tap) {
        setShowToolbar(false)
      }
      if (yAxis === 1) {
        setShowToolbar(true)
      }
    },
    {
      enabled: isOnMobile,
      target: window,
      axis: 'y',
      swipe: { duration: 1000 },
      filterTaps: true
    }
  )

  // Automatically closes it on mobile after 1,5 second
  React.useEffect(() => {
    if (isOnMobile) {
      const timeout = setTimeout(() => {
        setShowToolbar(false)
      }, 1500)
      return () => clearTimeout(timeout)
    } else {
      setShowToolbar(true)
    }
  }, [isOnMobile])

  return (
    <Transition
      show={showToolbar}
      className='fixed top-0 left-0 w-full transition-transform duration-300 ease-in-out md:static'
      enterFrom='-translate-y-16'
      enterTo='translate-y-0'
      leaveFrom='translate-y-0'
      leaveTo='-translate-y-16'
    >
      <div className='grid grid-cols-3 border-b border-slate-300 bg-slate-50 p-2 transition-colors duration-150 ease-in-out dark:border-slate-600 dark:bg-slate-900'>
        <div className='flex flex-row items-center gap-4 self-center justify-self-start'>
          {leftStack}
        </div>
        <Link
          to='/'
          className='flex flex-row items-center gap-2 place-self-center'
        >
          <img
            src={KnucklebonesLogo}
            alt='Knucklebones Logo'
            className='aspect-square h-6'
          />
          <Text
            as='h1'
            className='font-mona hidden text-2xl font-bold tracking-tight md:block'
          >
            Knucklebones
          </Text>
        </Link>
        <div className='flex flex-row items-center gap-4 self-center justify-self-end'>
          {rightStack}
        </div>
      </div>
    </Transition>
  )
}
