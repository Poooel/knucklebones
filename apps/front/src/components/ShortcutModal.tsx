import * as React from 'react'
import { IconButton } from './IconButton'
import { Modal } from './Modal'

interface ToolbarModalProps {
  icon?: React.ReactNode
  isInitiallyOpen?: boolean
  renderTrigger?(args: { onClick(): void }): React.ReactNode
}

export function ShortcutModal({
  icon,
  children,
  renderTrigger = ({ onClick }) => <IconButton icon={icon} onClick={onClick} />,
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
