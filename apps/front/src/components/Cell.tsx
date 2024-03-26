import type * as React from 'react'

export function Cell({ children }: React.PropsWithChildren) {
  return (
    <div className='flex flex-row items-center justify-center p-2 md:p-4'>
      {children}
    </div>
  )
}
