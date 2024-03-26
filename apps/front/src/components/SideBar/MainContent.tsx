import clsx from 'clsx'
import * as React from 'react'

interface MainContentProps {
  className?: string
}

export const MainContent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<MainContentProps>
>(({ children, className }, ref) => {
  return (
    <div ref={ref} className={clsx('grid h-svh grid-cols-1', className)}>
      {children}
    </div>
  )
})
MainContent.displayName = 'MainContent'
