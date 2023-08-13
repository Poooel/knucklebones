import * as React from 'react'
import { Modal } from './Modal'
import { Button } from './Button'

interface ShortcutProps {
  icon?: React.ReactNode
  label?: React.ReactNode
}

interface ShortcutActionProps {
  onClick(): void
}

interface ToolbarModalProps extends ShortcutProps {
  isInitiallyOpen?: boolean
  renderTrigger?(args: ShortcutActionProps): React.ReactNode
}

export function ShortcutModal({
  icon,
  label,
  children,
  renderTrigger = ({ onClick }) => (
    <Button variant='ghost' leftIcon={icon} onClick={onClick}>
      {label}
    </Button>
  ),
  isInitiallyOpen = false
}: React.PropsWithChildren<ToolbarModalProps>) {
  const [isModalOpen, setIsModalOpen] = React.useState(isInitiallyOpen)

  function openModal() {
    setIsModalOpen(true)
  }

  return (
    <div className='flex items-center'>
      {renderTrigger({ onClick: openModal })}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {children}
      </Modal>
    </div>
  )
}
