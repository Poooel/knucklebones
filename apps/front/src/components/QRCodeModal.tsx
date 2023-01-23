import * as React from 'react'
import { QrCodeIcon } from '@heroicons/react/24/outline'
import { Toolbar } from './Toolbar'
import { IconButton } from './IconButton'
import { QRCode } from './QRCode'
import { Modal } from './Modal'

interface QRCodeModalProps {
  dismissModal?: boolean
}

export function QRCodeModal({ dismissModal }: QRCodeModalProps) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (dismissModal !== undefined && dismissModal) {
      setOpen(false)
    }
  }, [dismissModal])

  return (
    <>
      <Toolbar>
        <IconButton icon={<QrCodeIcon />} onClick={() => setOpen(true)} />
      </Toolbar>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <QRCode />
      </Modal>
    </>
  )
}
