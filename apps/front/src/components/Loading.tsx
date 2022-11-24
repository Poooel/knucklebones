import * as React from 'react'
import { QRCode } from './QRCode'

export function Loading() {
  return (
    <div className='flex flex-col items-center justify-center gap-8'>
      <p className='animate-pulse text-5xl font-semibold'>
        Waiting for game to start...
      </p>
      <QRCode />
    </div>
  )
}
