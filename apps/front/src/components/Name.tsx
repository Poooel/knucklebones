import * as React from 'react'
import {
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { IconButton } from './IconButton'
import { isEmptyOrBlank } from '@knucklebones/common'

interface NameProps {
  playerId?: string
  displayName?: string
  isPlayerOne: boolean
  updateDisplayName?(displayName: string): void
  isEditable: boolean
}

function getName(playerId?: string, displayName?: string) {
  if (playerId === undefined) {
    return undefined
  } else if (displayName === undefined || isEmptyOrBlank(displayName)) {
    return playerId
  } else {
    return displayName
  }
}

export function Name({
  playerId,
  displayName,
  isPlayerOne,
  updateDisplayName,
  isEditable
}: NameProps) {
  const [isBeingEdited, setIsBeingEdited] = React.useState(false)
  const [name, setName] = React.useState(getName(playerId, displayName))

  React.useEffect(() => {
    setName(getName(playerId, displayName))
  }, [playerId, displayName])

  function handleOnKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      onDisplayNameSubmit()
    } else if (e.key === 'Escape') {
      onDisplayNameCancel()
    }
  }

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Avoid players using ridiculously long names
    setName(e.target.value.substring(0, 32))
  }

  function handleOnFocus(e: React.FocusEvent<HTMLInputElement, Element>) {
    // Select all input when focused
    e.target.select()
  }

  function onDisplayNameSubmit() {
    setIsBeingEdited(false)

    if (isEmptyOrBlank(name!)) {
      // If the name is empty, we want to remove the display name from local storage
      localStorage.removeItem('displayName')

      if (getName(playerId, displayName) === playerId) {
        // If the name displayed was equal to playerId, and the name is now empty
        // default back to playerId as we don't want an empty name
        setName(playerId)
      } else {
        // If the name displayed was not the playerId (so it was the displayName)
        // and the name is now empty, send an empty displayName to the backend
        // as the player is trying to remove their displayName
        updateDisplayName!('')
      }
    } else {
      if (getName(playerId, displayName) === playerId) {
        if (name !== playerId) {
          // If the name displayed was the playerId, and the new name
          // is different from the playerId the player is trying to set a
          // displayName, so set it in local storage and send it to the backend
          localStorage.setItem('displayName', name!)
          updateDisplayName!(name!)
        }
      } else {
        if (name !== displayName) {
          // Same case as above, but the player is trying to update their displayName
          localStorage.setItem('displayName', name!)
          updateDisplayName!(name!)
        }
      }
    }
  }

  function onDisplayNameCancel() {
    setIsBeingEdited(false)
    setName(getName(playerId, displayName))
  }

  function onEditClick() {
    setIsBeingEdited(true)
  }

  // Only ever true when the player is not connected
  if (name === undefined) {
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
          value={name}
          className='rounded-lg bg-slate-200 p-2 dark:bg-slate-700'
          onChange={handleOnChange}
          onKeyDown={handleOnKeyDown}
          autoFocus
          onFocus={handleOnFocus}
        />
        <IconButton icon={<CheckIcon />} onClick={onDisplayNameSubmit} />
        <IconButton icon={<XMarkIcon />} onClick={onDisplayNameCancel} />
      </div>
    )
  } else {
    return (
      <div className='flex flex-wrap items-center justify-center gap-2'>
        <p className='break-all text-center'>
          {name}
          {isPlayerOne && isEditable && ' (you)'}
        </p>
        {isEditable && (
          <IconButton icon={<PencilSquareIcon />} onClick={onEditClick} />
        )}
      </div>
    )
  }
}
