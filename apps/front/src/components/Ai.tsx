import * as React from 'react'
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline'
import { IconButton } from './IconButton'
import { Toolbar } from './Toolbar'
import { init } from '../utils/api'

interface AiProps {
  roomKey: string
}

const aiPlayerId = 'beep-boop'
const aiPlayerType = 'ai'

export function Ai({ roomKey }: AiProps) {
  return (
    <Toolbar>
      <IconButton
        icon={<WrenchScrewdriverIcon />}
        onClick={() => {
          void init(roomKey, aiPlayerId, aiPlayerType, false)
        }}
      />
    </Toolbar>
  )
}
