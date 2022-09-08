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
      className={clsx('grid grid-rows-3', {
        'hover:bg-gray-100': !readonly
      })}
      role={onClick !== undefined && !readonly ? 'button' : undefined}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
