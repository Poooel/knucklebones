import * as React from 'react'
import { Toolbar, ToolbarProps } from './Toolbar'
import { IconButton } from './IconButton'
import { Modal } from './Modal'

interface ToolbarModalProps extends ToolbarProps {
  icon?: React.ReactNode
  isInitiallyOpen?: boolean
  renderTrigger?(args: { onClick(): void }): React.ReactNode
}

export function ToolbarModal({
  icon,
  children,
  renderTrigger = ({ onClick }) => <IconButton icon={icon} onClick={onClick} />,
  isInitiallyOpen = false,
  ...toolbatProps
}: React.PropsWithChildren<ToolbarModalProps>) {
  const [isModalOpen, setIsModalOpen] = React.useState(isInitiallyOpen)

  function openModal() {
    setIsModalOpen(true)
  }

  return (
    <>
      <Toolbar {...toolbatProps}>
        {renderTrigger({ onClick: openModal })}
      </Toolbar>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {children}
      </Modal>
    </>
  )
}
