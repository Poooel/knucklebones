import * as React from 'react'
import { clsx } from 'clsx'

export function Theme({ children }: React.PropsWithChildren) {
  const [theme, setTheme] = React.useState('light')

  React.useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }, [])

  const setAndSaveTheme = () => {
    let localTheme;
    if (theme === 'dark') {
      localTheme = 'light'
    } else {
      localTheme = 'dark'
    }
    localStorage.theme = localTheme
    setTheme(localTheme)
  }

  return (
    <div className={clsx({'dark': theme === 'dark' })}>
      <label htmlFor='default-toggle' className='inline-flex items-center cursor-pointer absolute top-0 right-0 m-2'>
        <input type='checkbox' value='' id='default-toggle' className='sr-only peer' onChange={setAndSaveTheme} checked={theme === 'dark'}/>
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        <span className='ml-3 text-sm font-medium text-gray-900 dark:text-gray-300'> Enable dark mode</span>
      </label>
      {children}
    </div>
  )
}
