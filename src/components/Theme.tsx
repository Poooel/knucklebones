import * as React from 'react'
import { clsx } from 'clsx'

export function Theme({ children }: React.PropsWithChildren) {
  const [theme, setTheme] = React.useState('light')

  React.useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }, [])

  const setAndSaveTheme = () => {
    let localTheme
    if (theme === 'dark') {
      localTheme = 'light'
    } else {
      localTheme = 'dark'
    }
    localStorage.theme = localTheme
    setTheme(localTheme)
  }

  return (
    <div className={clsx({ dark: theme === 'dark' })}>
      <label
        htmlFor='default-toggle'
        className='absolute top-0 right-0 m-2 inline-flex cursor-pointer items-center'
      >
        <input
          type='checkbox'
          value=''
          id='default-toggle'
          className='peer sr-only'
          onChange={setAndSaveTheme}
          checked={theme === 'dark'}
        />
        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
        <span className='ml-3 text-sm font-medium text-gray-900 dark:text-gray-300'>
          Enable dark mode
        </span>
      </label>
      {children}
    </div>
  )
}
