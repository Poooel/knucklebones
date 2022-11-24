import * as React from 'react'
import clsx from 'clsx'

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: JSX.Element
}

export function IconButton({ icon, ...props }: IconButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        'text-slate-900 transition-all hover:text-slate-900/80 dark:text-slate-200 dark:hover:text-slate-50/80',
        props.className
      )}
    >
      <div className='aspect-square h-6'>{icon}</div>
    </button>
  )
}
