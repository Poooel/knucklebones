import * as React from 'react'
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

function setDarkMode(darkMode: boolean) {
  if (darkMode) {
    document.body.classList.add('dark')
  } else {
    document.body.classList.remove('dark')
  }
}

export function Theme() {
  const [theme, setTheme] = React.useState<Themes>('default')

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
      setDarkMode(true)
    } else if (localTheme === 'light') {
      setDarkMode(false)
    } else {
      setDarkMode(hasDarkMode)
    }
  }

  // Update the dark mode and the local storage when theme changes
  React.useEffect(() => {
    computeDarkMode(theme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme])

  // On initial mount, we read from the local storage to update the theme
  React.useEffect(() => {
    const savedTheme = localStorage.theme as Themes
    if (savedTheme !== null) {
      setTheme(savedTheme)
    } else {
      computeDarkMode('default')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme])

  return <IconButton icon={<ThemeIcon theme={theme} />} onClick={changeTheme} />
}
