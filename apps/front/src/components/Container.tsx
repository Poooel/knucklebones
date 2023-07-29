import * as React from 'react'

export function Container({ children }: React.PropsWithChildren) {
  return (
    <div className='bg-slate-50 text-slate-900 transition-all dark:bg-slate-900 dark:text-slate-200'>
      <div className='h-svh grid grid-cols-1'>{children}</div>
    </div>
  )
}
