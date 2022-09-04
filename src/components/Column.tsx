import * as React from 'react'
import { clsx } from 'clsx'
import { Children } from '../types/Children'

export interface ColumnProps extends Children {
  onClick?: React.MouseEventHandler<HTMLDivElement>
  readonly?: boolean
}

export function Column({ children, onClick, readonly = false }: ColumnProps) {
  return (
    <div
      className={clsx('grid grid-rows-3', {
        'hover:bg-gray-100': !readonly
      })}
      role={onClick !== undefined ? 'button' : undefined}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
