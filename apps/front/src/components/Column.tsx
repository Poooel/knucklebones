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
      className={clsx(
        'grid grid-rows-3 bg-slate-200 transition-colors duration-75 first:rounded-l-lg last:rounded-r-lg dark:bg-slate-700',
        {
          'hover:bg-slate-300 dark:hover:bg-slate-800': !readonly
        }
      )}
      role={onClick !== undefined && !readonly ? 'button' : undefined}
      onClick={onClick}
    >
      {children}
    </div>
  )
}