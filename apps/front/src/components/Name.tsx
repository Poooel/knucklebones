import * as React from 'react'
import {
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface NameProps {
  id?: string
  name?: string
  isPlayerOne: boolean
  isEditable: boolean
  updateDisplayName?(displayName: string): void
}

export function Name({
  id,
  name,
  isPlayerOne,
  isEditable,
  updateDisplayName
}: NameProps) {
  const [isBeingEdited, setIsBeingEdited] = React.useState(false)
  const [displayName, setDisplayName] = React.useState(name ?? id)
  const [previousDisplayName, setPreviousDisplayName] = React.useState(
    name ?? id
  )

  React.useEffect(() => {
    setDisplayName(name ?? id)
    setPreviousDisplayName(name ?? id)
  }, [name, id])

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDisplayName(e.target.value)
  }

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

    if (displayName !== previousDisplayName) {
      updateDisplayName!(displayName ?? id!)
    }
  }

  function cancelUpdate() {
    setIsBeingEdited(false)
    setDisplayName(previousDisplayName)
  }

  if (name === undefined && id === undefined) {
    return (
      <p className='animate-pulse text-slate-900 dark:text-slate-200'>
        Waiting for an other player to join...
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
          onChange={handleOnChange}
          onKeyDown={handleOnKeyDown}
          autoFocus
          onFocus={(e) => e.target.select()}
        />
        <button
          className='rounded-full text-slate-900 hover:text-slate-900/80 dark:text-slate-200 dark:hover:text-slate-50/80'
          onClick={sendNewDisplayName}
        >
          <CheckIcon className='aspect-square h-6' />
        </button>
        <button
          className='rounded-full text-slate-900 hover:text-slate-900/80 dark:text-slate-200 dark:hover:text-slate-50/80'
          onClick={cancelUpdate}
        >
          <XMarkIcon className='aspect-square h-6' />
        </button>
      </div>
    )
  } else {
    return (
      <div className='flex items-center gap-2'>
        <p>
          {displayName}
          {isPlayerOne ? ' (you)' : ''}
        </p>
        {isEditable && (
          <button
            className='rounded-full text-slate-900 hover:text-slate-900/80 dark:text-slate-200 dark:hover:text-slate-50/80'
            onClick={() => {
              setIsBeingEdited(true)
              setPreviousDisplayName(displayName)
            }}
          >
            <PencilSquareIcon className='aspect-square h-6' />
          </button>
        )}
      </div>
    )
  }
}
