import * as React from 'react'
import { Toolbar } from './Toolbar'
import { IconButton } from './IconButton'
import { Modal } from './Modal'

interface ToolbarModalProps {
  icon: React.ReactNode
  isInitiallyOpen?: boolean
}

export function ToolbarModal({
  icon,
  children,
  isInitiallyOpen = false
}: React.PropsWithChildren<ToolbarModalProps>) {
  const [isModalOpen, setIsModalOpen] = React.useState(isInitiallyOpen)
  return (
    <>
      <Toolbar>
        <IconButton icon={icon} onClick={() => setIsModalOpen(true)} />
      </Toolbar>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {children}
      </Modal>
    </>
  )
}
