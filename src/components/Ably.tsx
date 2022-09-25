import * as React from 'react'
import { useAbly } from '../hooks/useAbly'

export function Ably({ children }: React.PropsWithChildren) {
  const isConnected = useAbly()

  if (!isConnected) {
    return <p>Loading</p>
  }

  return <>{children}</>
}
