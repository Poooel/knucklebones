import * as React from 'react'

export function Loading() {
  return (
    <div className='flex flex-row items-center justify-center bg-slate-50 dark:bg-slate-900'>
      <p className='animate-pulse text-5xl text-slate-900 dark:text-slate-50'>
        Loading
      </p>
    </div>
  )
}
