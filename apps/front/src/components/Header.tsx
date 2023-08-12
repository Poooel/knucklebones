import * as React from 'react'
import { useDrag } from '@use-gesture/react'
import { Transition } from '@headlessui/react'
import { useIsOnMobile } from '../hooks/detectDevice'
import KnucklebonesLogo from '../svgs/logo.svg'
import { IconButton } from './IconButton'
import { Link } from 'react-router-dom'

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
    ({ swipe: [, yAxis] }) => {
      if (yAxis === -1) {
        setShowToolbar(false)
      }
      if (yAxis === 1) {
        setShowToolbar(true)
      }
    },
    { target: window, axis: 'y', swipe: { duration: 1000 } }
  )

  // Automatically closes it on mobile after 1,5 second
  React.useEffect(() => {
    if (isOnMobile) {
      const timeout = setTimeout(() => {
        setShowToolbar(false)
      }, 1500)
      return () => clearTimeout(timeout)
    }
  }, [isOnMobile])

  return (
    <Transition
      show={showToolbar}
      className='fixed top-0 left-0 w-full transition-transform duration-300 ease-in-out'
      enterFrom='-translate-y-12'
      enterTo='translate-y-0'
      leaveFrom='translate-y-0'
      leaveTo='-translate-y-12'
    >
      <div className='grid grid-cols-3 border-b border-slate-300 bg-slate-50 p-2 dark:border-slate-600 dark:bg-slate-900'>
        <div className='flex flex-row items-center gap-4 self-center justify-self-start'>
          {leftStack}
        </div>
        <IconButton
          as={Link}
          className='place-self-center'
          to='/'
          icon={
            <img
              src={KnucklebonesLogo}
              alt='Knucklebones Logo'
              className='aspect-square h-6'
            />
          }
        />
        <div className='flex flex-row items-center gap-4 self-center justify-self-end'>
          {rightStack}
        </div>
      </div>
    </Transition>
  )
}
