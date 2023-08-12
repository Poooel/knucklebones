import * as React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useClipboard } from 'use-clipboard-copy'
import { QrCodeIcon, LinkIcon } from '@heroicons/react/24/outline'
import { Modal } from './Modal'
import { Button } from './Button'
import { ShortcutModal } from './ShortcutModal'

const TITLE = 'Scan the QR Code to share the room with other players'

interface QRCodeBaseProps {
  title: React.ReactNode
}

function QRCodeBase({ title }: QRCodeBaseProps) {
  const { copy, copied } = useClipboard({ copiedTimeout: 750 })

  return (
    <>
      {title}
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
    </>
  )
}

export function QRCode() {
  return (
    <QRCodeBase
      title={<h3 className='text-center text-xl font-medium'>{TITLE}</h3>}
    />
  )
}

export function QRCodeModal() {
  return (
    <ShortcutModal icon={<QrCodeIcon />}>
      <QRCodeBase title={<Modal.Title>{TITLE}</Modal.Title>} />
    </ShortcutModal>
  )
}
