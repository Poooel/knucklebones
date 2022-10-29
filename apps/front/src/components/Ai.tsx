import * as React from 'react'
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline'
import { IconButton } from './IconButton'
import { Toolbar } from './Toolbar'
import { init } from '../utils/api'
import { useParams } from 'react-router-dom'

interface Params {
  roomKey: string
}

export function Ai() {
  const { roomKey } = useParams<keyof Params>() as Params

  return (
    <Toolbar>
      <IconButton
        icon={<WrenchScrewdriverIcon />}
        onClick={() => {
          void init(roomKey, 'beep-boop', 'ai', false)
        }}
      />
    </Toolbar>
  )
}
