import * as React from 'react'
import { LinkIcon } from '@heroicons/react/24/outline'
import { QRCodeSVG } from 'qrcode.react'
import { useClipboard } from 'use-clipboard-copy'

interface QRCodeProps {
  value: string
}

export function QRCode({ value }: QRCodeProps) {
  const { copy, copied } = useClipboard({ copiedTimeout: 750 })

  return (
    <div className='flex flex-col gap-4 p-4'>
      <h3 className='text-center text-lg font-medium leading-6'>
        Scan the QR Code to share the room with other players:
      </h3>
      <div className='flex flex-col items-center justify-center gap-6'>
        <div className='rounded-lg border-2 border-slate-200 bg-slate-50 p-2 dark:border-0'>
          <QRCodeSVG value={value} />
        </div>
        <button
          className='flex flex-row items-center gap-2 rounded-md border-2 border-slate-200 bg-transparent py-2 px-4 transition-colors duration-100 enabled:hover:bg-black/10 disabled:opacity-50 dark:border-slate-700 enabled:dark:hover:bg-white/10'
          onClick={() => copy(value)}
        >
          {copied ? (
            <span>Copied!</span>
          ) : (
            <>
              <span>Copy link</span>
              <LinkIcon className='aspect-square h-5' />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
