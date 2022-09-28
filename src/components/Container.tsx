import * as React from 'react'

export function Container({ children }: React.PropsWithChildren) {
  return (
    <div className='h-full bg-slate-50 dark:bg-slate-900'>
      <div className='grid h-screen grid-cols-1 place-content-center'>
        {children}
      </div>
    </div>
  )
}