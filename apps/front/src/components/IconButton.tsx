import * as React from 'react'
import clsx from 'clsx'

interface IconButtonProps {
  icon: JSX.Element
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export function IconButton({ icon, className, onClick }: IconButtonProps) {
  return (
    <button
      className={clsx(
        'text-slate-900 transition-colors duration-100 hover:text-slate-900/80 dark:text-slate-200 dark:hover:text-slate-50/80',
        className
      )}
      onClick={onClick}
    >
      <div className='aspect-square h-6'>{icon}</div>
    </button>
  )
}
