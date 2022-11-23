import * as React from 'react'
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline'
import { IconButton } from './IconButton'
import { Toolbar } from './Toolbar'
import { init } from '../utils/api'
import { useRoomKey } from '../hooks/useRoomKey'

export function Ai() {
  const roomKey = useRoomKey()

  return (
    <Toolbar>
      <IconButton
        icon={<WrenchScrewdriverIcon />}
        onClick={() => {
          void init(roomKey, 'beep-boop', 'ai')
        }}
      />
    </Toolbar>
  )
}
