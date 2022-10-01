import * as React from 'react'
import { useAbly } from '../hooks/useAbly'
import { Loading } from './Loading'

export function Ably({ children }: React.PropsWithChildren) {
  const isConnected = useAbly()

  if (!isConnected) {
    return <Loading />
  }

  return <>{children}</>
}
