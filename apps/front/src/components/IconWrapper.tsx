import * as React from 'react'

// We could support sizes
export function IconWrapper({ children }: React.PropsWithChildren) {
  return <div className='aspect-square h-6'>{children}</div>
}
