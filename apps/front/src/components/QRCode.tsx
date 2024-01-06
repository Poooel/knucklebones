import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { QRCodeSVG } from 'qrcode.react'
import { useClipboard } from 'use-clipboard-copy'
import { QrCodeIcon, LinkIcon } from '@heroicons/react/24/outline'
import { Modal } from './Modal'
import { Button } from './Button'
import { ShortcutModal } from './ShortcutModal'

interface QRCodeBaseProps {
  title: React.ReactNode
}

function QRCodeBase({ title }: QRCodeBaseProps) {
  const { copy, copied } = useClipboard({ copiedTimeout: 750 })
  const { t } = useTranslation()

  return (
    <>
      {title}
      <div className='flex flex-col items-center justify-center gap-6'>
        <div className='rounded-lg border-2 border-slate-200 bg-slate-50 p-2 dark:border-0'>
          <QRCodeSVG value={window.location.href} />
        </div>
        <Button
          className='flex flex-row items-center gap-2 text-lg'
          leftIcon={copied ? undefined : <LinkIcon />}
          onClick={() => {
            copy(window.location.href)
          }}
        >
          {t(copied ? 'menu.share.copied' : 'menu.share.copy')}
        </Button>
      </div>
    </>
  )
}

export function QRCode() {
  const { t } = useTranslation()
  return (
    <QRCodeBase
      title={
        <h3 className='text-center text-xl font-medium'>
          {t('menu.share.title')}
        </h3>
      }
    />
  )
}

export function QRCodeModal() {
  const { t } = useTranslation()
  return (
    <ShortcutModal icon={<QrCodeIcon />} label={t('menu.share.label')}>
      <QRCodeBase title={<Modal.Title>{t('menu.share.title')}</Modal.Title>} />
    </ShortcutModal>
  )
}
