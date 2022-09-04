import * as React from 'react'
import { Children } from '../types/Children'

export function Cell({ children }: Children) {
  return (
    <div className='flex flex-row items-center justify-center border p-4'>
      {children}
    </div>
  )
}
