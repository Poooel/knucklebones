import * as React from 'react'
import { Link } from 'react-router-dom'
import { useDrag } from '@use-gesture/react'
import { Transition } from '@headlessui/react'
import { useIsOnMobile } from '../hooks/detectDevice'
import KnucklebonesLogo from '../svgs/logo.svg'
import { Text } from './Text'

export function ActionGroup({ children }: React.PropsWithChildren) {
  return <div className='flex flex-col gap-4'>{children}</div>
}

interface HeaderProps {
  actions: React.ReactNode
  gameRef: React.RefObject<HTMLDivElement>
}

// https://ui.shadcn.com/docs/components/sheet ?
export function Navigation({ actions, gameRef }: HeaderProps) {
  // Always displayed by default
  const [showToolbar, setShowToolbar] = React.useState(true)
  const isOnMobile = useIsOnMobile()

  // Makes it appear/disappear on mobile after scrolling left/right
  useDrag(
    ({ swipe: [xAxis], tap }) => {
      if (xAxis === -1 || tap) {
        setShowToolbar(false)
      }
      if (xAxis === 1) {
        setShowToolbar(true)
      }
    },
    {
      enabled: isOnMobile,
      target: gameRef,
      axis: 'x',
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
      className='fixed top-0 left-0 z-10 transition-transform duration-300 ease-in-out md:static md:z-0'
      enterFrom='-translate-x-80'
      enterTo='translate-x-0'
      leaveFrom='translate-x-0'
      leaveTo='-translate-x-80'
    >
      <div className='flex h-screen max-w-xs flex-col gap-12 border-r border-slate-300 bg-slate-50 p-2 pt-4 pl-4 shadow-lg transition-colors duration-150 ease-in-out dark:border-slate-600 dark:bg-slate-900'>
        <Link to='/' className='flex flex-row items-center gap-2'>
          <img
            src={KnucklebonesLogo}
            alt='Knucklebones Logo'
            className='aspect-square h-6'
          />
          <Text as='h1' className='font-mona text-2xl font-bold tracking-tight'>
            Knucklebones
          </Text>
        </Link>
        {actions}
      </div>
    </Transition>
  )
}
