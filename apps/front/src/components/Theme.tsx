import * as React from 'react'
import { clsx } from 'clsx'
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline'
import { IconButton } from './IconButton'

type Themes = 'dark' | 'light' | 'default'

interface ThemeIconButtonProps {
  theme: Themes
}

function ThemeIcon({ theme }: ThemeIconButtonProps) {
  if (theme === 'dark') {
    return <MoonIcon />
  }
  if (theme === 'light') {
    return <SunIcon />
  }
  return <ComputerDesktopIcon />
}

export function Theme({ children }: React.PropsWithChildren) {
  const [theme, setTheme] = React.useState<Themes>('default')
  const [isDarkMode, setIsDarkMode] = React.useState(false)

  function changeTheme() {
    let localTheme: Themes = 'dark'

    if (theme === 'dark') {
      localTheme = 'light'
    } else if (theme === 'light') {
      localTheme = 'default'
    }

    localStorage.theme = localTheme
    setTheme(localTheme)
  }

  function computeDarkMode(localTheme: Themes) {
    const hasDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
    if (localTheme === 'dark') {
      setIsDarkMode(true)
    } else if (localTheme === 'light') {
      setIsDarkMode(false)
    } else {
      setIsDarkMode(hasDarkMode)
    }
  }

  // Update the dark mode and the local storage when theme changes
  React.useEffect(() => {
    computeDarkMode(theme)
  }, [theme])

  // On initial mount, we read from the local storage to update the theme
  React.useEffect(() => {
    const savedTheme = localStorage.theme as Themes
    if (savedTheme !== null) {
      setTheme(savedTheme)
    } else {
      computeDarkMode('default')
    }
  }, [])

  // Detects theme changes and update the theme if using the default theme
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    function update(e: MediaQueryListEvent) {
      if (theme === 'default') {
        computeDarkMode(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', update)

    return () => {
      mediaQuery.removeEventListener('change', update)
    }
  }, [theme])

  return (
    <div className={clsx({ dark: isDarkMode })}>
      {children}
      <div className='absolute top-0 right-0 p-4'>
        <IconButton icon={<ThemeIcon theme={theme} />} onClick={changeTheme} />
      </div>
    </div>
  )
}
