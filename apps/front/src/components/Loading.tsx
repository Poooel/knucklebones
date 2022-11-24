import * as React from 'react'
import { QRCode } from './QRCode'

export function Loading() {
  return (
    <div className='flex flex-col items-center justify-center gap-8'>
      <h2 className='animate-pulse text-center text-3xl font-semibold md:text-5xl'>
        Waiting for game to start...
      </h2>
      <QRCode />
    </div>
  )
}
