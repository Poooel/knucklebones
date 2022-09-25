import * as React from 'react'
import { useAbly } from '../hooks/useAbly'

export function Ably({ children }: React.PropsWithChildren) {
  const isConnected = useAbly()

  if (!isConnected) {
    console.log('ably loading')
    return <p>Loading</p>
  }

  return <>{children}</>
}
