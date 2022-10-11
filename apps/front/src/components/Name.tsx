import * as React from 'react'
import {
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { IconButton } from './IconButton'

interface NameProps {
  id?: string
  name?: string
  isPlayerOne: boolean
  updateDisplayName?(displayName: string): void
  isEditable: boolean
}

export function Name({
  id,
  name,
  isPlayerOne,
  updateDisplayName,
  isEditable
}: NameProps) {
  const [isBeingEdited, setIsBeingEdited] = React.useState(false)
  const [displayName, setDisplayName] = React.useState(name ?? id)

  React.useEffect(() => {
    setDisplayName(name ?? id)
  }, [name, id])

  function handleOnKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      sendNewDisplayName()
    } else if (e.key === 'Escape') {
      cancelUpdate()
    }
  }

  function sendNewDisplayName() {
    setIsBeingEdited(false)

    if (displayName !== '') {
      localStorage.displayName = displayName
    } else {
      localStorage.removeItem('displayName')
    }

    if (displayName !== name) {
      updateDisplayName!(displayName ?? id!)
    }
  }

  function cancelUpdate() {
    setIsBeingEdited(false)
    setDisplayName(name)
  }

  if (name === undefined && id === undefined) {
    return (
      <p className='animate-pulse text-slate-900 dark:text-slate-200'>
        Waiting for another player to join...
      </p>
    )
  }

  if (isBeingEdited) {
    return (
      <div className='flex items-center gap-2'>
        <input
          type='text'
          value={displayName}
          className='rounded-lg bg-slate-200 p-2 dark:bg-slate-700'
          onChange={(e) => setDisplayName(e.target.value.substring(0, 32))}
          onKeyDown={handleOnKeyDown}
          autoFocus
          onFocus={(e) => e.target.select()}
        />
        <IconButton icon={<CheckIcon />} onClick={sendNewDisplayName} />
        <IconButton icon={<XMarkIcon />} onClick={cancelUpdate} />
      </div>
    )
  } else {
    return (
      <div className='flex flex-wrap items-center justify-center gap-2'>
        <p className='break-all text-center'>
          {displayName}
          {isPlayerOne && isEditable && ' (you)'}
        </p>
        {isEditable && (
          <IconButton
            icon={<PencilSquareIcon />}
            onClick={() => setIsBeingEdited(true)}
          />
        )}
      </div>
    )
  }
}
