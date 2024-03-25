import clsx from 'clsx'
import * as React from 'react'

interface SideBarLayoutProps {
  className?: string
}

export const SideBarLayout = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<SideBarLayoutProps>
>(({ children, className }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx('lg:grid-cols-3-central grid grid-cols-1', className)}
    >
      {children}
    </div>
  )
})
SideBarLayout.displayName = 'SideBarLayout'
