import * as React from 'react'

export function Cell({ children }: React.PropsWithChildren) {
  return (
    <div className='flex flex-row items-center justify-center p-4'>
      {children}
    </div>
  )
}
