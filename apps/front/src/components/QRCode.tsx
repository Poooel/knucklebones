import * as React from 'react'
import { LinkIcon } from '@heroicons/react/24/outline'
import { QRCodeSVG } from 'qrcode.react'
import { useClipboard } from 'use-clipboard-copy'
import { Button } from './Button'

export function QRCode() {
  const { copy, copied } = useClipboard({ copiedTimeout: 750 })

  return (
    <div className='flex flex-col gap-4'>
      <h3 className='text-center text-xl font-medium'>
        Scan the QR Code to share the room with other players
      </h3>
      <div className='flex flex-col items-center justify-center gap-6'>
        <div className='rounded-lg border-2 border-slate-200 bg-slate-50 p-2 dark:border-0'>
          <QRCodeSVG value={window.location.href} />
        </div>
        <Button
          className='flex flex-row items-center gap-2 text-lg'
          onClick={() => copy(window.location.href)}
        >
          {copied ? (
            <span>Copied!</span>
          ) : (
            <>
              <span>Copy link</span>
              <LinkIcon className='aspect-square h-5' />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
