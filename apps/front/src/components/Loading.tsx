import * as React from 'react'
import { QRCode } from './QRCode'

export function Loading() {
  return (
    <div className='flex flex-col items-center justify-center gap-8 bg-slate-50 dark:bg-slate-900'>
      <p className='animate-pulse text-5xl text-slate-900 dark:text-slate-50'>
        Waiting for game to start
      </p>
      <div className='text-slate-900 dark:text-slate-200'>
        <QRCode />
      </div>
    </div>
  )
}
