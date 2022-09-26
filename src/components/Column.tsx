import * as React from 'react'
import { clsx } from 'clsx'

interface ColumnProps {
  onClick?: React.MouseEventHandler<HTMLDivElement>
  readonly?: boolean
}

export function Column({
  children,
  onClick,
  readonly = false
}: React.PropsWithChildren<ColumnProps>) {
  return (
    <div
      className={clsx('grid grid-rows-3 transition-colors duration-75', {
        'hover:bg-slate-100 dark:hover:bg-slate-600': !readonly
      })}
      role={onClick !== undefined && !readonly ? 'button' : undefined}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
